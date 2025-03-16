import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import path from 'path'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const prisma = new PrismaClient()

async function hashPassword(password) {
	const saltRounds = 10
	const hashedPassword = await bcrypt.hash(password, saltRounds)
	return hashedPassword
}

export const createUser = async (req, res) => {
	try {
		const { email, nickname, password, bio, image } = req.body
		const hashedPassword = await hashPassword(password)

		const newUser = await prisma.user.create({
			data: {
				email,
				nickname,
				password: hashedPassword,
				role: 'USER',
				profile: {
					create: {
						image: 'basePhoto.jpg',
						postsNum: 0,
						like: 0,
					},
				},
			},
		})

		res.status(201).json(newUser)
	} catch (error) {
		if (
			error.code === 'P2002' &&
			error.meta &&
			error.meta.target.includes('email')
		) {
			res.status(409).json({ error: 'Email уже существует' })
		} else {
			console.error(error)
			res.status(500).json({ error: error.message })
		}
	}
}

export const loginUser = async (req, res) => {
	try {
		const { email, password } = req.body

		const user = await prisma.user.findUnique({
			where: { email },
		})

		console.log(user)

		if (!user) {
			return res.status(401).json({ error: 'Неправильный email' })
		}

		const isPasswordValid = await bcrypt.compare(password, user.password)
		if (!isPasswordValid) {
			return res.status(401).json({ error: 'Неправильный пароль' })
		}

		const secretKey = process.env.SECRET_KEY

		const token = jwt.sign({ id: user.id, role: user.role }, secretKey, {
			expiresIn: '1h',
		})
		jwt.verify(token, secretKey, (err, decoded) => {
			if (err) {
				console.log('Token is not valid')
			} else {
				console.log('Decoded token:', decoded)
			}
		})

		res.status(200).json({ message: 'Вход успешен', token })
	} catch (error) {
		console.error(error)
		res.status(500).json({ error: error.message })
	}
}

export const getUsers = async (req, res) => {
	try {
		const users = await prisma.user.findMany({
			include: { profile: true },
		})

		res.status(200).json(users)
	} catch (error) {
		console.error(error)
		res.status(500).json({ error: error.message })
	}
}

export const getUser = async (req, res) => {
	try {
		const { id } = req.params
		const user = await prisma.user.findUnique({
			where: { id: parseInt(id) },
			include: {
				profile: true, // Загрузка связанных данных профиля
			},
		})

		if (!user) {
			return res.status(404).json({ error: 'User not found' })
		}

		res.status(200).json({ user })
	} catch (error) {
		console.error(error)
		res.status(500).json({ error: error.message })
	}
}

export const updateUser = async (req, res) => {
	try {
		const { id } = req.params
		const { email, password, currentPassword, nickname, bio } = req.body

		const user = await prisma.user.findUnique({
			where: { id: parseInt(id) },
			include: { profile: true },
		})
		if (!user) {
			return res.status(404).json({ error: 'User not found' })
		}

		const isPasswordValid = await bcrypt.compare(currentPassword, user.password)
		if (!isPasswordValid) {
			return res.status(401).json({ error: 'Неправильный нынешний пароль' })
		}

		let fileName = null
		if (req.files && req.files.image) {
			if (user.profile.image !== 'basePhoto.jpg') {
				const oldFilePath = path.resolve(
					__dirname + '../../../static/' + user.profile.image
				)

				fs.unlink(oldFilePath, err => {
					if (err) {
						console.error('Ошибка при удалении старого файла:', err.message)
					} else {
						console.log('Старый файл успешно удалён')
					}
				})
			}

			const image = req.files.image
			fileName = uuidv4() + '.jpg'
			image.mv(path.resolve(__dirname + '../../../static/' + fileName))
		}

		let hashedPassword = null
		if (password) {
			hashedPassword = await hashPassword(password)
		}

		const updateData = {}
		if (email) updateData.email = email
		if (hashedPassword) updateData.password = hashedPassword
		if (nickname) updateData.nickname = nickname
		if (bio) updateData.profile = { update: { bio: bio } }
		if (fileName) updateData.profile = { update: { image: fileName } }

		const updatedUser = await prisma.user.update({
			where: { id: parseInt(id) },
			data: updateData,
		})

		res.status(200).json(updatedUser)
	} catch (error) {
		console.error(error)
		res.status(500).json({ error: error.message })
	}
}

export const deleteUser = async (req, res) => {
	try {
		const { id } = req.params

		const deleteUser = await prisma.$transaction(async prisma => {
			await prisma.profile.deleteMany({
				where: { userId: parseInt(id) },
			})

			await prisma.post.deleteMany({
				where: { authorId: parseInt(id) },
			})

			const dUser = await prisma.user.delete({
				where: { id: parseInt(id) },
			})

			return dUser
		})

		res.status(200).json(deleteUser)
	} catch (error) {
		console.error(error)
		res.status(500).json({ error: error.message })
	}
}

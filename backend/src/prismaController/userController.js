import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import { v4 as uuidv4 } from 'uuid'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import path from 'path'

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

		const secretKey = crypto.randomBytes(32).toString('hex')

		const token = jwt.sign({ userId: user.id, role: user.role }, secretKey, {
			expiresIn: '1h',
		})
		jwt.verify(token, secretKey, (err, decoded) => {
			if (err) {
				console.log('Token is not valid')
			} else {
				console.log('Decoded token:', decoded)
			}
		})

		res.status(200).json({ message: 'Вход успешен', user })
	} catch (error) {
		res.status(500).json({ error: error.message })
	}
}

export const getUsers = async (req, res) => {
	try {
		const users = await prisma.user.findMany({
			include: { posts: true, profile: true },
		})

		res.status(200).json(users)
	} catch (error) {
		res.status(500).json({ error: error.message })
	}
}

export const updateUser = async (req, res) => {
	try {
		const { id } = req.params
		const { email, nickname, password, bio } = req.body

		let fileName = null
		if (req.files && req.files.image) {
			const image = req.files.image
			fileName = uuidv4() + '.jpg'
			image.mv(path.resolve(__dirname + '../../../static/' + fileName))
		}

		const updatedUser = await prisma.user.update({
			where: { id: parseInt(id) },
			data: {
				email,
				nickname,
				password,
				profile: { update: { bio, image: fileName } },
			},
		})

		res.status(200).json(updatedUser)
	} catch (error) {
		res.status(500).json({ error: error.message })
	}
}

export const deleteUser = async (req, res) => {
	try {
		const { id } = req.params
		const deletedUser = await prisma.user.delete({
			where: { id: parseInt(id) },
		})

		res.status(200).json(deletedUser)
	} catch (error) {
		res.status(500).json({ error: error.message })
	}
}

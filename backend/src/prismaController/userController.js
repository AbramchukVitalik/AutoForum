import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

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
				profile: { create: { bio, image } },
			},
		})

		res.status(201).json(newUser)
	} catch (error) {
		res.status(500).json({ error: error.message })
	}
}

export const loginUser = async (req, res) => {
	try {
		const { email, password } = req.body

		const user = await prisma.user.findUnique({
			where: { email },
		})

		if (!user) {
			return res.status(401).json({ error: 'Invalid email or password' })
		}

		const isPasswordValid = await bcrypt.compare(password, user.password)
		if (!isPasswordValid) {
			return res.status(401).json({ error: 'Invalid email or password' })
		}

		// Здесь вы можете создать токен для авторизации пользователя, например JWT, и отправить его пользователю.

		res.status(200).json({ message: 'Login successful', user })
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
		const { email, nickname, password, bio, image } = req.body

		const updatedUser = await prisma.user.update({
			where: { id: parseInt(id) },
			data: {
				email,
				nickname,
				password,
				profile: { update: { bio, image } },
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

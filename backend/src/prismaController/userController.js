import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export const createUser = async (req, res) => {
	try {
		const { email, nickname, password, role } = req.body
		const newUser = await prisma.user.create({
			data: { email, nickname, password, role },
		})
		res.status(201).json(newUser)
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
		const { email, nickname, role } = req.body
		const updatedUser = await prisma.user.update({
			where: { id: parseInt(id) },
			data: { email, nickname, role },
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

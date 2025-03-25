import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const createForum = async (req, res) => {
	try {
		const { title, description } = req.body

		const newForum = await prisma.forums.create({
			data: {
				title,
				description,
				numberOfTopics: 0,
				numberOfMessages: 0,
			},
		})

		res.status(201).json(newForum)
	} catch (error) {
		console.error(error)
		res.status(500).json({ error: error.message })
	}
}

export const getForums = async (req, res) => {
	try {
		const forums = await prisma.forums.findMany({
			include: { topics: true },
		})

		res.status(200).json(forums)
	} catch (error) {
		console.error(error)
		res.status(500).json({ error: error.message })
	}
}

export const updateForum = async (req, res) => {
	try {
		const { id } = req.params
		const { title, description, numberOfTopics, numberOfMessages } = req.body

		const updateForum = await prisma.forums.update({
			where: { id: parseInt(id) },
			data: {
				title,
				description,
				numberOfTopics,
				numberOfMessages,
			},
		})

		res.status(200).json(updateForum)
	} catch {
		console.error(error)
		res.status(500).json({ error: error.message })
	}
}

export const deleteForum = async (req, res) => {
	try {
		const { id } = req.params

		const deleteForum = await prisma.$transaction(async prisma => {
			await prisma.messages.deleteMany({
				where: { topicsId: parseInt(id) },
			})

			await prisma.topics.deleteMany({
				where: { forumId: parseInt(id) },
			})

			const dForum = await prisma.forums.delete({
				where: { id: parseInt(id) },
			})

			return dForum
		})

		res.status(200).json(deleteForum)
	} catch {
		console.error(error)
		res.status(500).json({ error: error.message })
	}
}

export const createTopic = async (req, res) => {
	try {
		const { id } = req.params
		const { title, author, authorId, question } = req.body

		const newTopic = await prisma.topics.create({
			data: {
				title,
				author,
				authorId,
				question,
				numberOfMessages: 0,
				numberOfViews: 0,
				forumId: parseInt(id),
			},
		})

		await prisma.forums.update({
			where: { id: parseInt(id) },
			data: {
				numberOfTopics: { increment: 1 },
			},
		})

		res.status(201).json(newTopic)
	} catch (error) {
		console.error(error)
		res.status(500).json({ error: error.message })
	}
}

export const getTopics = async (req, res) => {
	const { id } = req.params

	try {
		const topics = await prisma.topics.findMany({
			where: {
				forumId: parseInt(id),
			},
			include: { messages: true },
		})

		res.status(200).json(topics)
	} catch (error) {
		console.error(error)
		res.status(500).json({ error: error.message })
	}
}
export const getTopic = async (req, res) => {
	const { id } = req.params

	try {
		const topic = await prisma.topics.findMany({
			where: {
				id: parseInt(id),
			},
			include: { messages: true },
		})

		res.status(200).json(topic)
	} catch (error) {
		console.error(error)
		res.status(500).json({ error: error.message })
	}
}

export const updateTopic = async (req, res) => {
	try {
		const { id } = req.params
		const { title, author, numberOfMessages, numberOfViews } = req.body

		const updateTopic = await prisma.topics.update({
			where: { id: parseInt(id) },
			data: {
				title,
				author,
				numberOfMessages,
				numberOfViews,
			},
		})

		res.status(200).json(updateTopic)
	} catch {
		console.error(error)
		res.status(500).json({ error: error.message })
	}
}

export const deleteTopic = async (req, res) => {
	try {
		const { id } = req.params

		const relatedTopic = await prisma.topics.findUnique({
			where: { id: parseInt(id) },
			include: { messages: true },
		})

		await prisma.forums.update({
			where: { id: parseInt(relatedTopic.forumId) },
			data: {
				numberOfTopics: {
					decrement: 1,
				},
			},
		})

		const deleteTopic = await prisma.$transaction(async prisma => {
			await prisma.messages.deleteMany({
				where: { topicsId: parseInt(id) },
			})

			const dTopic = await prisma.topics.delete({
				where: { id: parseInt(id) },
			})

			return dTopic
		})

		res.status(200).json(deleteTopic)
	} catch {
		console.error(error)
		res.status(500).json({ error: error.message })
	}
}

export const findTopics = async (req, res) => {
	const { find } = req.body

	console.log(req.body)
	console.log(find)

	try {
		const topics = await prisma.topics.findMany({
			where: {
				title: {
					contains: find,
				},
			},
			include: { messages: true },
		})

		res.status(200).json(topics)
	} catch (error) {
		console.error(error)
		res.status(500).json({ error: error.message })
	}
}

export const createMessage = async (req, res) => {
	try {
		const { id } = req.params
		const { content, published, authorId } = req.body

		const newMessage = await prisma.messages.create({
			data: {
				content,
				like: 0,
				published,
				authorId,
				topicsId: parseInt(id),
			},
		})

		const topic = await prisma.topics.findUnique({
			where: { id: parseInt(id) },
			select: { forumId: true },
		})

		await prisma.topics.update({
			where: { id: parseInt(id) },
			data: {
				numberOfMessages: { increment: 1 },
			},
		})

		await prisma.forums.update({
			where: { id: topic.forumId },
			data: {
				numberOfMessages: { increment: 1 },
			},
		})

		res.status(201).json(newMessage)
	} catch (error) {
		console.error(error)
		res.status(500).json({ error: error.message })
	}
}

export const getMessages = async (req, res) => {
	const { id } = req.params

	try {
		const messages = await prisma.messages.findMany({
			where: {
				topicsId: parseInt(id),
			},
		})

		res.status(200).json(messages)
	} catch (error) {
		console.error(error)
		res.status(500).json({ error: error.message })
	}
}

export const updateMessage = async (req, res) => {
	try {
		const { id } = req.params
		const { content, like, published } = req.body

		const updateMessage = await prisma.messages.update({
			where: { id: parseInt(id) },
			data: {
				content,
				like,
				published,
			},
		})

		res.status(200).json(updateMessage)
	} catch {
		console.error(error)
		res.status(500).json({ error: error.message })
	}
}

export const deleteMessage = async (req, res) => {
	try {
		const { id } = req.params

		const message = await prisma.messages.findUnique({
			where: { id: parseInt(id) },
			select: { topicsId: true },
		})

		const deleteMessage = await prisma.messages.delete({
			where: { id: parseInt(id) },
		})

		const topic = await prisma.topics.findUnique({
			where: { id: message.topicsId },
			select: { forumId: true },
		})

		await prisma.topics.update({
			where: { id: message.topicsId },
			data: {
				numberOfMessages: { decrement: 1 },
			},
		})

		await prisma.forums.update({
			where: { id: topic.forumId },
			data: {
				numberOfMessages: { decrement: 1 },
			},
		})

		res.status(200).json(deleteMessage)
	} catch {
		console.error(error)
		res.status(500).json({ error: error.message })
	}
}

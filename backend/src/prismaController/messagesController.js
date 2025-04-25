import r from 'rethinkdb'

let connection
async function connectDB() {
	if (!connection) {
		connection = await r.connect({
			host: 'localhost',
			port: 28015,
			db: 'my_database',
		})
	}
	return connection
}

export const getMessagesByTopic = async (req, res) => {
	try {
		const conn = await connectDB()
		const cursor = await r
			.table('messages')
			.filter({ topicId: req.params.topicId })
			.run(conn)
		const messages = await cursor.toArray()

		res.json({ messages })
	} catch (error) {
		console.error('Ошибка получения сообщений:', error)
		res.status(500).json({ error: 'Ошибка получения сообщений.' })
	}
}

export const addMessage = async (req, res) => {
	const { idTopics } = req.params
	const { message, userId } = req.body
	if (!message || !userId || !idTopics) {
		return res.status(400).json({ error: 'Все поля обязательны.' })
	}
	try {
		const conn = await connectDB()
		const result = await r
			.table('messages')
			.insert({
				content: message,
				userId,
				topicId: idTopics,
				likes: 0,
				createdAt: new Date(),
			})
			.run(conn)
		res.status(201).json({ result, message: 'Сообщение успешно создано!' })
	} catch (error) {
		console.error('Ошибка добавления сообщения:', error)
		res.status(500).json({ error: 'Ошибка добавления сообщения.' })
	}
}

export const updateLikes = async (req, res) => {
	const { messageId } = req.params
	const { like } = req.body

	if (!messageId) {
		return res.status(400).json({ error: 'Message ID is required.' })
	}

	try {
		const conn = await connectDB()
		let result = null
		if (like === 1) {
			result = await r
				.table('messages')
				.get(messageId)
				.update({
					likes: r.row('likes').default(0).add(1),
				})
				.run(conn)
		} else if (like === 0) {
			result = await r
				.table('messages')
				.get(messageId)
				.update({
					likes: r.branch(
						r.row('likes').default(0).gt(0),
						r.row('likes').sub(1),
						0
					),
				})
				.run(conn)
		}

		res.status(200).json({ result, message: 'Количество лайков обновлено!' })
	} catch (error) {
		console.error('Ошибка обновления лайков:', error)
		res.status(500).json({ error: 'Ошибка обновления лайков.' })
	}
}

export const streamMessages = async (req, res) => {
	const { topicId } = req.query
	if (!topicId) {
		res.status(400).json({ error: 'topicId обязателен' })
		return
	}
	res.set({
		'Content-Type': 'text/event-stream',
		'Cache-Control': 'no-cache',
		Connection: 'keep-alive',
	})
	res.flushHeaders()

	try {
		const conn = await connectDB()
		const cursor = await r
			.table('messages')
			.filter({ topicId })
			.changes()
			.run(conn)

		cursor.each((err, row) => {
			if (err) {
				console.error('Ошибка в streamMessages:', err)
				res.write(
					`event: error\ndata: ${JSON.stringify({ error: err.message })}\n\n`
				)
			} else {
				res.write(`data: ${JSON.stringify(row)}\n\n`)
			}
		})
	} catch (error) {
		console.error('Ошибка подключения:', error)
		res.write(
			`event: error\ndata: ${JSON.stringify({ error: error.message })}\n\n`
		)
		res.end()
	}

	req.on('close', () => {
		console.log(`SSE-соединение закрыто для topicId: ${topicId}`)
		res.end()
	})
}

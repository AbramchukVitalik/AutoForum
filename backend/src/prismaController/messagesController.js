import r from 'rethinkdb'
import { Server } from 'socket.io'

let connection

const connectDB = async () => {
	if (!connection) {
		connection = await r.connect({ host: 'localhost', port: 28015 })
	}
	return connection
}

export const getMessagesByTopic = async (req, res) => {
	const { topicId } = req.params // topicId передается в маршруте
	try {
		const conn = await connectDB()
		const cursor = await r
			.db('my_database')
			.table('messages')
			.filter({ topicId }) // Фильтрация по идентификатору темы
			.run(conn)
		const messages = await cursor.toArray()
		res.json({ messages })
	} catch (error) {
		console.error('Ошибка получения сообщений для темы:', error)
		res.status(500).json({ error: 'Ошибка получения сообщений для темы' })
	}
}

export const addMessage = async (req, res) => {
	try {
		const { idTopics } = req.params
		const { message, userId } = req.body

		console.log('\n' + idTopics + '\n' + message + '\n' + userId + '\n')

		if (!message || !userId || !idTopics) {
			return res.status(400).json({ error: 'Все поля обязательны.' })
		}

		const conn = await connectDB()
		const result = await r
			.db('my_database')
			.table('messages')
			.insert({
				content: message,
				userId,
				topicId: idTopics,
				createdAt: new Date(),
			})
			.run(conn)

		res.status(201).json({ result, message: 'Сообщение успешно создано!' })
	} catch (error) {
		console.error('Ошибка добавления сообщения:', error)
		res.status(500).json({ error: 'Ошибка добавления сообщения.' })
	} // Закрывающая скобка была добавлена
}

export const subscribeToTopicChanges = async (io, topicId) => {
	try {
		const conn = await connectDB()
		const cursor = await r
			.db('my_database')
			.table('messages')
			.filter({ topicId }) // Фильтрация по теме
			.changes()
			.run(conn)

		cursor.each((err, change) => {
			if (err) throw err
			io.emit(`message_update_${topicId}`, change.new_val) // Уникальный канал для темы
		})
	} catch (error) {
		console.error('Ошибка подписки на изменения для темы:', error)
	}
}

export const initializeSocket = server => {
	const io = new Server(server)
	io.on('connection', socket => {
		console.log('Клиент подключен')
	})

	subscribeToChanges(io)
}

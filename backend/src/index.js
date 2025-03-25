import express from 'express'
import userRouter from './router/userRouter.js'
import forumsRouter from './router/forumsRouter.js'
import messagesRouter from './router/messagesRouter.js'
import cors from 'cors'
import fileUpload from 'express-fileupload'
import path from 'path'
import { fileURLToPath } from 'url'
import pkg from 'rethinkdb'

const app = express()
const port = 5000

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const { connect, db } = pkg

connect({ host: 'localhost', port: 28015 })
	.then(conn => {
		app.get('/api', async (req, res) => {
			try {
				const cursor = await db('my_database').table('messages').run(conn)
				const result = await cursor.toArray()
				res.json(result)
			} catch (error) {
				console.error('Ошибка выполнения запроса к RethinkDB:', error)
				res.status(500).send('Ошибка сервера')
			}
		})
	})
	.catch(err => {
		console.error('Ошибка подключения к RethinkDB:', err)
	})

app.use(cors())
app.use(express.json())
app.use(express.static(path.resolve(__dirname, '..', 'static')))
app.use(fileUpload())
app.use('/api', userRouter)
app.use('/api', forumsRouter)
app.use('/api', messagesRouter)

app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`)
})

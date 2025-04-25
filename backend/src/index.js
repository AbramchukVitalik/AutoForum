import express from 'express'
import userRouter from './router/userRouter.js'
import forumsRouter from './router/forumsRouter.js'
import messagesRouter from './router/messagesRouter.js'
import cors from 'cors'
import fileUpload from 'express-fileupload'
import path from 'path'
import { fileURLToPath } from 'url'

const app = express()
const port = 5000

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

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

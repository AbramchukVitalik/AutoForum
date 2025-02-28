import express from 'express'
import userRouter from './router/userRouter.js'
import cors from 'cors'

const app = express()
const port = 5000

app.use(cors())
app.use(express.json())
app.use('/api', userRouter)

app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`)
})

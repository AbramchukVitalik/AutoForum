import { Router } from 'express'
import {
	getMessagesByTopic,
	addMessage,
	subscribeToTopicChanges,
} from '../prismaController/messagesController.js'

const router = new Router()

router.post('/createMessage/:id', addMessage)
router.get('/getMessages/:id', getMessagesByTopic)
router.put('/updateMessage/:id', subscribeToTopicChanges)

export default router

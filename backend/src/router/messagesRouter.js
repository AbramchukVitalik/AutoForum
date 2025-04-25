import express from 'express'
import {
	getMessagesByTopic,
	addMessage,
	streamMessages,
	updateLikes,
} from '../prismaController/messagesController.js'

const router = express.Router()

router.get('/messages/:topicId', getMessagesByTopic)
router.post('/messages/:idTopics', addMessage)
router.put('/messages/:messageId', updateLikes)
router.get('/stream/messages', streamMessages)

export default router

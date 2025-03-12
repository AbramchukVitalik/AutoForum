import { Router } from 'express'
import {
	createForum,
	getForums,
	updateForum,
	deleteForum,
	createTopic,
	getTopics,
	updateTopic,
	deleteTopic,
	createMessage,
	getMessages,
	updateMessage,
	deleteMessage,
} from '../prismaController/forumController.js'

const router = new Router()

router.post('/create_forum', createForum)
router.get('/get_forums', getForums)
router.put('/update_forum/:id', updateForum)
router.delete('/delete_forum/:id', deleteForum)

router.post('/create_topic/:id', createTopic)
router.get('/get_topics/:id', getTopics)
router.put('/update_topic/:id', updateTopic)
router.delete('/delete_topic/:id', deleteTopic)

router.post('/create_message/:id', createMessage)
router.get('/get_messages/:id', getMessages)
router.put('/update_message/:id', updateMessage)
router.delete('/delete_message/:id', deleteMessage)

export default router

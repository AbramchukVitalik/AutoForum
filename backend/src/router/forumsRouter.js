import { Router } from 'express'
import {
	createForum,
	getForums,
	updateForum,
	deleteForum,
	createTopic,
	getTopics,
	getTopic,
	updateTopic,
	deleteTopic,
	createMessage,
	getMessages,
	updateMessage,
	deleteMessage,
} from '../prismaController/forumController.js'

const router = new Router()

router.post('/createForum', createForum)
router.get('/getForums', getForums)
router.put('/updateForum/:id', updateForum)
router.delete('/deleteForum/:id', deleteForum)

router.post('/createTopic/:id', createTopic)
router.get('/getTopics/:id', getTopics)
router.get('/getTopic/:id', getTopic)
router.put('/updateTopic/:id', updateTopic)
router.delete('/deleteTopic/:id', deleteTopic)

// router.post('/createMessage/:id', createMessage)
// router.get('/getMessages/:id', getMessages)
// router.put('/updateMessage/:id', updateMessage)
// router.delete('/deleteMessage/:id', deleteMessage)

export default router

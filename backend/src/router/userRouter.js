import { Router } from 'express'
import {
	createUser,
	getUsers,
	updateUser,
	deleteUser,
} from '../prismaController/userController.js'

const router = new Router()

router.post('/register', createUser)
router.get('/register', getUsers)
router.put('/register/:id', updateUser)
router.delete('/register/:id', deleteUser)

export default router

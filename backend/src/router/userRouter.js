import { Router } from 'express'
import {
	createUser,
	loginUser,
	getUsers,
	updateUser,
	deleteUser,
} from '../prismaController/userController.js'

const router = new Router()

router.post('/register', createUser)
router.post('/login', loginUser)
router.get('/getUsers', getUsers)
router.put('/updateUser/:id', updateUser)
router.delete('/deleteUser/:id', deleteUser)

export default router

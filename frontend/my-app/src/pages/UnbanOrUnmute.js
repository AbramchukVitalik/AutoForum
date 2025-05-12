import React, { useState, useEffect } from 'react'
import { Card, Stack, Button, Form, Container, Row, Col } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { jwtDecode } from 'jwt-decode'
import '../css/Card.css'

const BanOrMute = () => {
	const token = localStorage.getItem('token')
	const urlParams = new URLSearchParams(window.location.search)

	const navigate = useNavigate()

	const [user, setUser] = useState({})
	const [banedUser, setBanedUser] = useState({})

	const what = urlParams.get('what')
	const id = urlParams.get('id')

	useEffect(() => {
		const getUserData = async () => {
			if (token) {
				try {
					const decodedToken = jwtDecode(token)
					const idUser = decodedToken.id

					const userData = await fetchUser(idUser, true)
					setUser(userData)
					const banedUserData = await fetchUser(id, false)
					setBanedUser(banedUserData)
				} catch (error) {
					console.error('Invalid token:', error)
				}
			}
		}

		getUserData()
	}, [])

	const fetchUser = async (id, checkRole = false) => {
		try {
			const response = await axios.get(
				`http://localhost:5000/api/getUser/${id}`
			)

			if (
				checkRole &&
				response.data.user.role !== 'SUPER_ADMIN' &&
				response.data.user.role !== 'ADMIN'
			) {
				navigate('/')
			}

			return response.data.user
		} catch (error) {
			console.error('Error fetching user:', error)
		}
	}

	const banOrMute = async () => {
		try {
			await axios.post(`http://localhost:5000/api/unbanUser/${id}/${what}`, {})

			navigate(-1)
		} catch (error) {
			console.error('Error banOrMute:', error)
		}
	}

	return (
		<Container className='d-flex justify-content-center align-items-center vh-100'>
			<Row className='w-100'>
				<Col xs={12} sm={10} md={8} lg={6} className='mx-auto'>
					<Card className='shadow'>
						<Card.Body className='m-5'>
							<Stack gap={3} className='text-center'>
								{what === 'ban' ? (
									<Form.Label className='mb-0'>
										Вы действительно хотите разбанить {banedUser.nickname}?
									</Form.Label>
								) : (
									<Form.Label className='mb-0'>
										Вы действительно хотите размутить {banedUser.nickname}?
									</Form.Label>
								)}

								<Stack
									direction='horizontal'
									gap={3}
									className='justify-content-center'
								>
									<Button variant='secondary' onClick={banOrMute}>
										{what === 'ban' ? 'Разбанить' : 'Размутить'}
									</Button>
									<Button
										variant='outline-secondary'
										onClick={() => navigate(-1)}
									>
										Отмена
									</Button>
								</Stack>
							</Stack>
						</Card.Body>
					</Card>
				</Col>
			</Row>
		</Container>
	)
}

export default BanOrMute

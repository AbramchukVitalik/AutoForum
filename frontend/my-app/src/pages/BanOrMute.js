import React, { useState, useEffect } from 'react'
import { Card, Stack, Button, Form, Container, Row, Col } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { jwtDecode } from 'jwt-decode'

const BanOrMute = () => {
	const token = localStorage.getItem('token')
	const urlParams = new URLSearchParams(window.location.search)
	const navigate = useNavigate()

	const [values, setValues] = useState({ cause: '', selectedPeriod: 1 })
	const numbers = Array.from({ length: 30 }, (_, index) => index + 1)
	const [message, setMessage] = useState(null)

	const what = urlParams.get('what')
	const id = urlParams.get('id')

	const handleChanges = e => {
		setValues({ ...values, [e.target.name]: e.target.value })
	}

	useEffect(() => {
		if (token) {
			try {
				const decodedToken = jwtDecode(token)
				const idUser = decodedToken.id
				fetchUser(idUser)
			} catch (error) {
				console.error('Invalid token:', error)
			}
		}
	}, [token])

	const fetchUser = async id => {
		try {
			const response = await axios.get(
				`http://localhost:5000/api/getUser/${id}`
			)
			if (
				response.data.user.role !== 'SUPER_ADMIN' &&
				response.data.user.role !== 'ADMIN'
			) {
				navigate('/')
			}
		} catch (error) {
			console.error('Error fetching user:', error)
		}
	}

	const banOrMute = async () => {
		try {
			if (!values.cause || values.cause.trim() === '') {
				setMessage('Поле причины пустое. пожалуйста введите причину')
				return
			} else {
				setMessage(null)
			}

			await axios.post(`http://localhost:5000/api/banUser/${id}/${what}`, {
				cause: values.cause,
				selectedPeriod: values.selectedPeriod,
			})

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
							<Stack gap={3}>
								<Form.Group
									controlId='periodSelect'
									className='d-flex align-items-center'
								>
									<Form.Label className='me-2 mb-0'>
										Выберите период времени:
									</Form.Label>
									<Form.Select
										name='selectedPeriod'
										onChange={handleChanges}
										value={values.selectedPeriod}
										className='w-auto'
									>
										{numbers.map(number => (
											<option key={number} value={number}>
												{number}
											</option>
										))}
									</Form.Select>
									<Form.Label className='ms-2 mb-0'>дней</Form.Label>
								</Form.Group>

								<Form.Group controlId='formCause'>
									<Form.Label className='mb-0'>Причина:</Form.Label>
									<Form.Control
										name='cause'
										type='text'
										placeholder='Введите причину'
										value={values.cause}
										onChange={handleChanges}
									/>
								</Form.Group>

								<Stack direction='horizontal' gap={3}>
									<Button variant='secondary' onClick={banOrMute}>
										{what === 'ban' ? 'Забанить' : 'Замутить'}
									</Button>
									<Button
										variant='outline-secondary'
										onClick={() => navigate(-1)}
									>
										Отмена
									</Button>
								</Stack>

								{message && <p className='text-danger mb-0'>{message}</p>}
							</Stack>
						</Card.Body>
					</Card>
				</Col>
			</Row>
		</Container>
	)
}

export default BanOrMute

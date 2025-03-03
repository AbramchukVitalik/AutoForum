import React, { useState } from 'react'
import { Button, Form, Card, Stack } from 'react-bootstrap'
import axios from 'axios'
import '../css/Login.css'
import { useNavigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'

const Login = () => {
	const [values, setValues] = useState({
		email: '',
		password: '',
	})
	const [message, setMessage] = useState(null)

	const navigate = useNavigate()

	const handleChanges = e => {
		setValues({ ...values, [e.target.name]: e.target.value })
	}

	const handleSubmit = async e => {
		e.preventDefault()
		axios
			.post('http://localhost:5000/api/login', values)
			.then(response => {
				const token = response.data.token // Получение токена из ответа сервера
				console.log('Received token:', token) // Логирование токена

				if (isValidToken(token)) {
					localStorage.setItem('token', token) // Сохранение токена в localStorage

					// Проверка сохранения токена в localStorage
					const storedToken = localStorage.getItem('token')

					if (storedToken) {
						const decoded = jwtDecode(storedToken)
						console.log('Decoded token:', decoded)
					}

					navigate('/')
				} else {
					console.error('Invalid token format')
				}
			})
			.catch(error => {
				setMessage(
					error.response
						? error.response.data.error
						: 'Ошибка при отправке данных'
				)
			})
	}

	function isValidToken(token) {
		return /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.[A-Za-z0-9-_.+/=]*$/.test(token)
	}

	return (
		<div className='outer'>
			<Card
				className='login-card'
				style={{
					backgroundColor: 'rgba(255, 255, 255, 0.9)', // Прозрачность 70%
					boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
				}}
			>
				<Card.Body>
					<Stack gap={3} className='col-md-10 mx-auto'>
						<h2 className='text-center'>Вход</h2>
						<Form onSubmit={handleSubmit}>
							<Form.Group controlId='formEmail'>
								<Form.Label>Email адрес</Form.Label>
								<Form.Control
									name='email'
									type='email'
									placeholder='Введите Email'
									value={values.email}
									onChange={handleChanges}
								/>
							</Form.Group>
							<Form.Group controlId='formPassword'>
								<Form.Label>Пароль</Form.Label>
								<Form.Control
									name='password'
									type='password'
									placeholder='Введите пароль'
									value={values.password}
									onChange={handleChanges}
								/>
							</Form.Group>
							<Button className='w-100 mt-3' variant='secondary' type='submit'>
								Войти
							</Button>
						</Form>
						{message && (
							<p className='text-center mt-3' style={{ color: 'red' }}>
								{message}
							</p>
						)}
					</Stack>
				</Card.Body>
			</Card>
		</div>
	)
}

export default Login

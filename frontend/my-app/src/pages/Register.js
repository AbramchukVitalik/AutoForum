import React, { useState } from 'react'
import { Button, Form, Card, Stack } from 'react-bootstrap'
import axios from 'axios'
import '../css/Login.css'
import { useNavigate } from 'react-router-dom'

const Register = () => {
	const [values, setValues] = useState({
		email: '',
		password: '',
		nickname: '',
	})
	const [message, setMessage] = useState(null)

	const navigate = useNavigate()

	const handleChanges = e => {
		setValues({ ...values, [e.target.name]: e.target.value })
	}

	const handleSubmit = async e => {
		e.preventDefault()
		axios
			.post('http://localhost:5000/api/register', values)
			.then(response => {
				navigate('/login')
			})
			.catch(error => {
				setMessage(
					error.response
						? error.response.data.error
						: 'Ошибка при отправке данных'
				)
			})
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
						<h2 className='text-center'>Регистрация</h2>
						<Form onSubmit={handleSubmit}>
							<Form.Group controlId='formEmail'>
								<Form.Label>Никнейм</Form.Label>
								<Form.Control
									name='nickname'
									type='text'
									placeholder='Введите никнейм'
									value={values.nickname}
									onChange={handleChanges}
								/>
							</Form.Group>
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
								Зарегистрироваться
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

export default Register

import React, { useState } from 'react'
import { Button, Form, Card, Stack } from 'react-bootstrap'
import axios from 'axios'
import '../css/Login.css'

const Login = () => {
	const [values, setValues] = useState({
		email: '',
		password: '',
	})
	const [message, setMessage] = useState(null)

	const handleChanges = e => {
		setValues({ ...values, [e.target.name]: e.target.value })
	}

	const handleSubmit = async e => {
		e.preventDefault()
		axios
			.post('http://localhost:5000/api/login', values)
			.then(response => {
				setMessage('Вы вошли')
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
		<div class='outer'>
			<Card style={{ width: '90vh', height: '35vh' }}>
				<Card.Body>
					<Stack gap={2} className='col-md-10 mx-auto'>
						<Form>
							<Form.Label>Email адрес</Form.Label>
							<Form.Control
								name='email'
								type='email'
								placeholder='Введите Email'
								value={values.email}
								onChange={handleChanges}
							/>
						</Form>
						<Form>
							<Form.Label>Пароль</Form.Label>
							<Form.Control
								name='password'
								type='password'
								placeholder='Введите пароль'
								value={values.password}
								onChange={handleChanges}
							/>
						</Form>
						<Button variant='primary' type='submit' onClick={handleSubmit}>
							Отправить
						</Button>
						{message && <p>{message}</p>} {/* Выводим сообщение от сервера */}
					</Stack>
				</Card.Body>
			</Card>
		</div>
	)
}

export default Login

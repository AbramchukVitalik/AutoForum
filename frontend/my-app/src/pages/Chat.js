import React, { useState, useEffect } from 'react'
import '../css/HomeCard.css'
import { io } from 'socket.io-client'
import { jwtDecode } from 'jwt-decode'
import axios from 'axios'
import { Button, Form, Card } from 'react-bootstrap'
import Table from 'react-bootstrap/Table'

const Chat = () => {
	const token = localStorage.getItem('token')
	const urlParams = new URLSearchParams(window.location.search)
	const idTopics = urlParams.get('id')
	const [user, setUser] = useState({})
	const [topic, setTopic] = useState({})
	const [values, setValues] = useState({})
	const [messages, setMessages] = useState([])

	useEffect(() => {
		if (token) {
			try {
				const decodedToken = jwtDecode(token)
				const id = decodedToken.id

				fetchUser(id)
				fetchTopic(idTopics)

				const socket = io('http://localhost:5000') // Адрес твоего сервера

				// Подписка на обновления
				socket.on(`message_update_${idTopics}`, newMessage => {
					setMessages(prev => [...prev, newMessage])
				})

				return () => {
					socket.disconnect() // Отключаем сокет при размонтировании
				}
			} catch (error) {
				console.error('Invalid token:', error)
			}
		}
	}, [token, idTopics])

	const handleChanges = e => {
		setValues({ ...values, [e.target.name]: e.target.value })
	}

	// Загрузка данных пользователя
	const fetchUser = async id => {
		try {
			const response = await axios.get(
				`http://localhost:5000/api/getUser/${id}`
			)
			setUser(response.data.user)
		} catch (error) {
			console.error('Error fetching user:', error)
		}
	}
	const fetchTopic = async id => {
		try {
			const response = await axios.get(
				`http://localhost:5000/api/getTopic/${id}`
			)
			setTopic(response.data)
		} catch (error) {
			console.error('Error fetching topic:', error)
		}
	}

	const sendMessage = async e => {
		setValues({ ...values, userId: user.id }) // Добавляем необходимые данные

		console.log('Отправляемые данные:', values) // Логируем отправляемый объект

		try {
			await axios.post(
				`http://localhost:5000/api/createMessage/${idTopics}`,
				values
			)
			setValues({}) // Сбрасываем поле ввода
		} catch (error) {
			console.log('Ошибка отправки сообщения:', error)
		}
	}

	// Рендеринг сообщений в таблице
	const renderMessages = (message, index) => (
		<tr key={index}>
			<td>{message.content}</td>
		</tr>
	)

	return (
		<div className='outer-card'>
			<Card className='home-card'>
				<Card.Body>
					<div
						style={{ margin: '30px', maxHeight: '650px', overflowY: 'auto' }}
					>
						<Table striped bordered hover>
							<tbody>
								{messages && messages.length > 0 ? (
									messages.map(renderMessages)
								) : (
									<tr>
										<td>{topic[0]?.question}</td>
										<td>Нет сообщений</td>
									</tr>
								)}
							</tbody>
						</Table>
					</div>
					<Form.Group controlId='formMessage'>
						<Form.Label>Сообщение</Form.Label>
						<Form.Control
							name='message'
							type='text'
							placeholder='Введите сообщение'
							value={values.message || ''}
							onChange={handleChanges}
						/>
					</Form.Group>
					<Button
						className='submit-button'
						variant='secondary'
						type='submit'
						onClick={sendMessage}
					>
						Отправить
					</Button>
				</Card.Body>
			</Card>
		</div>
	)
}

export default Chat

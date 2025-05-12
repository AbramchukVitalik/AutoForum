import React, { useState, useEffect, useRef } from 'react'
import '../css/HomeCard.css'
import { jwtDecode } from 'jwt-decode'
import axios from 'axios'
import { Button, Form, Card, Image, Stack } from 'react-bootstrap'
import Table from 'react-bootstrap/Table'

const Chat = () => {
	const token = localStorage.getItem('token')
	const urlParams = new URLSearchParams(window.location.search)
	const idTopics = urlParams.get('id')

	const [user, setUser] = useState({ profile: {} })
	const [author, setAuthor] = useState({ profile: {} })
	const [topic, setTopic] = useState({})
	const [values, setValues] = useState({})
	const [messages, setMessages] = useState([])
	const [usersData, setUsersData] = useState({})
	const [role, setRole] = useState({})

	const hasRun = useRef(false)

	useEffect(() => {
		if (!hasRun.current) {
			addView(idTopics)
			fetchTopic(idTopics)
			fetchMessages(idTopics)
			loadUser()
			hasRun.current = true
		}
	}, [])

	useEffect(() => {
		try {
			const eventSource = new EventSource(
				`http://localhost:5000/api/stream/messages?topicId=${idTopics}`
			)

			eventSource.onmessage = event => {
				const eventData = JSON.parse(event.data)
				const newMessage = eventData.new_val || eventData

				setMessages(prevMessages => {
					const existingIndex = prevMessages.findIndex(
						m => m.id === newMessage.id
					)
					if (existingIndex !== -1) {
						const updatedMessages = [...prevMessages]
						updatedMessages[existingIndex] = {
							...updatedMessages[existingIndex],
							...newMessage,
						}
						return updatedMessages
					} else {
						return [...prevMessages, newMessage]
					}
				})
			}

			eventSource.onerror = err => {
				console.error('SSE error:', err)
				eventSource.close()
			}

			return () => {
				eventSource.close()
			}
		} catch (error) {
			console.error('Invalid token:', error)
		}
	}, [])

	useEffect(() => {
		if (messages.length > 0) {
			const uniqueUserIds = Array.from(new Set(messages.map(msg => msg.userId)))
			uniqueUserIds.forEach(userId => {
				if (!usersData[userId]) {
					fetchUser(userId).then(user => {
						if (user) {
							setUsersData(prev => ({ ...prev, [userId]: user }))
						}
					})
				}
			})
		}
	}, [messages])

	const handleChanges = e => {
		setValues({ ...values, [e.target.name]: e.target.value })
	}

	const loadUser = async () => {
		if (token) {
			try {
				const decodedToken = jwtDecode(token)
				const userData = await fetchUser(decodedToken.id)
				setRole(decodedToken.role)
				setUser(userData)
			} catch (error) {
				console.error('Invalid token:', error)
			}
		} else {
			setRole('GUEST')
		}
	}

	const fetchUser = async id => {
		try {
			const response = await axios.get(
				`http://localhost:5000/api/getUser/${id}`
			)
			return response.data.user
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
			const authorData = await fetchUser(response.data.authorId)
			setAuthor(authorData)
		} catch (error) {
			console.error('Error fetching topic:', error)
		}
	}

	const fetchMessages = async id => {
		try {
			const response = await axios.get(
				`http://localhost:5000/api/messages/${id}`
			)
			const sortedMessages = response.data.messages.sort(
				(a, b) => new Date(a.createdAt) - new Date(b.createdAt)
			)
			setMessages(sortedMessages)
		} catch (error) {
			console.error('Error fetching messages:', error)
		}
	}

	const addView = async id => {
		try {
			await axios.put(`http://localhost:5000/api/updateTopic/${id}`, {
				numberOfViews: 1,
			})
		} catch (error) {
			console.error('Error addView:', error)
		}
	}

	const sendMessage = async e => {
		e.preventDefault()
		const newMessageData = {
			...values,
			userId: user.id,
		}
		console.log('Отправляемые данные:', newMessageData)
		try {
			await axios.put(`http://localhost:5000/api/updateUser/${user.id}`, {
				postsNum: 1,
			})
			await axios.put(`http://localhost:5000/api/updateTopic/${idTopics}`, {
				numberOfMessages: 1,
			})
			await axios.post(
				`http://localhost:5000/api/messages/${idTopics}`,
				newMessageData
			)
			setValues({})
		} catch (error) {
			console.error('Ошибка отправки сообщения:', error)
		}
	}

	const handleToggleLike = async message => {
		try {
			if (role !== 'GUEST') {
				const alreadyLiked = user.profile?.likedMessages?.some(
					like => like.idMessage === message.id
				)

				if (!alreadyLiked) {
					await axios.put(`http://localhost:5000/api/messages/${message.id}`, {
						like: 1,
					})
					await axios.put(`http://localhost:5000/api/updateUser/${user.id}`, {
						like: 1,
						messageId: message.id,
					})

					setUser(prevUser => ({
						...prevUser,
						profile: {
							...prevUser.profile,
							likedMessages: [
								...(prevUser.profile.likedMessages || []),
								{ idMessage: message.id, profileId: user.profile.id },
							],
						},
					}))
				} else {
					await axios.put(`http://localhost:5000/api/messages/${message.id}`, {
						like: 0,
					})
					await axios.put(`http://localhost:5000/api/updateUser/${user.id}`, {
						like: 0,
						messageId: message.id,
					})

					setUser(prevUser => ({
						...prevUser,
						profile: {
							...prevUser.profile,
							likedMessages: prevUser.profile.likedMessages.filter(
								like => like.idMessage !== message.id
							),
						},
					}))
				}
			}
		} catch (error) {
			console.error('Ошибка обновления лайков:', error)
		}
	}

	const renderMessages = (message, index) => {
		const msgUser = usersData[message.userId]

		if (!msgUser || !msgUser.profile) {
			return (
				<tbody key={index}>
					<tr>
						<td colSpan='2' className='text-center'>
							Загрузка пользователя...
						</td>
					</tr>
				</tbody>
			)
		}

		const alreadyLiked = user.profile?.likedMessages?.some(
			like => like.idMessage === message.id
		)

		return (
			<tbody key={index}>
				<tr>
					<td style={{ width: '220px' }} rowSpan='2'>
						<div className='d-flex flex-column justify-content-center align-items-center'>
							{msgUser ? (
								<>
									<Image
										src={`http://localhost:5000/${msgUser.profile?.image}`}
										roundedCircle
										className='profile-image'
										style={{ width: '100px', height: 'auto' }}
										alt='User avatar'
									/>
									<a
										href={`/profile?id=${msgUser.id}`}
										className='text-decoration-none'
									>
										<h5>{msgUser.nickname}</h5>
									</a>
									<h6 style={{ whiteSpace: 'nowrap' }}>
										Количество лайков: {msgUser.profile?.like || 0}
									</h6>
									<h6 style={{ whiteSpace: 'nowrap' }}>
										Сообщения: {msgUser.profile?.postsNum || 0}
									</h6>
								</>
							) : (
								<span>Загрузка...</span>
							)}
						</div>
					</td>
					<td className='text-start align-top'>{message.content}</td>
				</tr>

				<tr style={{ height: '30px' }}>
					<td
						className='text-end align-top'
						style={{ fontSize: '0.8rem', color: '#656' }}
					>
						<small>
							<b>{new Date(message.createdAt).toLocaleString()}</b>
						</small>
						<Button
							variant={alreadyLiked ? 'primary' : 'outline-primary'}
							size='sm'
							className='ms-2'
							onClick={() => handleToggleLike(message)}
						>
							{message.likes === 0 ? <>👍</> : <>👍 {message.likes}</>}
						</Button>
					</td>
				</tr>
				<tr style={{ height: '30px' }}>
					<td colSpan='2'></td>
				</tr>
			</tbody>
		)
	}

	return (
		<div className='outer-card'>
			<Card className='home-card'>
				<Card.Body>
					<div
						style={{ margin: '30px', maxHeight: '520px', overflowY: 'auto' }}
					>
						<h5>Вопрос:</h5>
						<Table striped bordered hover>
							<thead>
								<tr>
									<th style={{ width: '220px' }} rowSpan='2'>
										<div className='d-flex flex-column justify-content-center align-items-center'>
											<Image
												src={`http://localhost:5000/${author.profile?.image}`}
												roundedCircle
												className='profile-image'
												style={{ width: '150px', height: 'auto' }}
											/>
											<a
												href={`/profile?id=${author.id}`}
												className='text-decoration-none'
											>
												<h5>{author.nickname}</h5>
											</a>
											<h6>Количество лайков: {author.profile.like}</h6>
											<h6>Сообщения: {author.profile.postsNum}</h6>
										</div>
									</th>
									<th className='text-start align-top'>
										{topic.question || 'Тема не найдена'}
									</th>
								</tr>
								<tr style={{ height: '30px' }}>
									<td
										className='text-end align-top'
										style={{ fontSize: '0.8rem', color: '#666' }}
									>
										<small>
											<b>{new Date(topic.createAt).toLocaleString()}</b>
										</small>
									</td>
								</tr>
							</thead>
						</Table>

						<h5>Ответы:</h5>
						<Table striped bordered hover>
							{messages && messages.length > 0 ? (
								messages.map(renderMessages)
							) : (
								<tr>
									<td>Нет сообщений</td>
								</tr>
							)}
						</Table>
					</div>

					<div
						className='position-absolute bottom-0 start-0 p-4'
						style={{ background: '#fff', width: '100%' }}
					>
						{role === 'USER' || role === 'ADMIN' || role === 'SUPER_ADMIN' ? (
							<>
								<Form.Label>Введите сообщение:</Form.Label>
								<Stack direction='horizontal' gap={2}>
									<div className='flex-grow-1'>
										<Form onSubmit={sendMessage}>
											<div className='d-flex'>
												<Form.Control
													name='message'
													type='text'
													placeholder='Введите сообщение'
													value={values.message || ''}
													onChange={handleChanges}
													className='flex-grow-1'
												/>
												<Button
													className='submit-button ms-2'
													variant='secondary'
													type='submit'
												>
													Отправить
												</Button>
											</div>
										</Form>
									</div>
								</Stack>
							</>
						) : (
							<h5>Зарегистрируйтесь или войдите чтобы писать сообщения</h5>
						)}
					</div>
				</Card.Body>
			</Card>
		</div>
	)
}

export default Chat

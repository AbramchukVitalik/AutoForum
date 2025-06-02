import React, { useState, useEffect } from 'react'
import {
	Card,
	Stack,
	Image,
	Container,
	Row,
	Col,
	Button,
} from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import axios from 'axios'
import '../css/Card.css'

const Profile = () => {
	const token = localStorage.getItem('token')
	const urlParams = new URLSearchParams(window.location.search)

	const navigate = useNavigate()

	const [user, setUser] = useState({ profile: { image: '' } })
	const [myUser, setMyUser] = useState({})
	const [myUserId, setMyUserId] = useState({})

	const id = urlParams.get('id')

	useEffect(() => {
		const getUserData = async () => {
			if (token) {
				try {
					const decodedToken = jwtDecode(token)
					const idUser = decodedToken.id
					setMyUserId(idUser)

					const userData = await fetchUser(id)
					setUser(userData)
					const myUserData = await fetchUser(idUser)
					setMyUser(myUserData)
				} catch (error) {
					console.error('Invalid token:', error)
				}
			}
		}

		getUserData()
	}, [id, token])

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

	return (
		<Container className='d-flex justify-content-center align-items-center vh-100 px-3'>
			<Row className='w-100 justify-content-center'>
				<Col xs={12} md={10} lg={8}>
					<Card className='card'>
						<Card.Body>
							<Stack gap={3} className='text-center'>
								<h1>{user.nickname}</h1>
								<Image
									src={`http://localhost:5000/${user.profile.image}`}
									roundedCircle
									fluid
									className='mx-auto profile-image'
									style={{ maxWidth: '150px' }} // Ограничение размера изображения
									alt='Profile image'
								/>
								{user.profile.bio ? (
									<h5>БИО: {user.profile.bio}</h5>
								) : (
									<h5>БИО не указано</h5>
								)}
								<h5>
									Создан: {new Date(user.profile.createdAt).toLocaleString()}
								</h5>
								<h5>Количество лайков: {user.profile.like}</h5>
								<h5>Количество сообщений: {user.profile.postsNum}</h5>
								{(myUser.role === 'SUPER_ADMIN' || myUser.role === 'ADMIN') &&
									Number(id) !== Number(myUserId) && (
										<Stack
											gap={2}
											direction='horizontal'
											className='justify-content-center flex-wrap'
										>
											{user.isBaned ? (
												<Button
													className='submit-button'
													variant='outline-success'
													type='button'
													onClick={() =>
														navigate(`/unban_or_unmute?what=ban&id=${id}`)
													}
												>
													Разбанить
												</Button>
											) : (
												<Button
													className='submit-button'
													variant='outline-danger'
													type='button'
													onClick={() =>
														navigate(`/ban_or_mute?what=ban&id=${id}`)
													}
												>
													Забанить
												</Button>
											)}
											{user.isMuted ? (
												<Button
													className='submit-button'
													variant='outline-success'
													type='button'
													onClick={() =>
														navigate(`/unban_or_unmute?what=mute&id=${id}`)
													}
												>
													Размутить
												</Button>
											) : (
												<Button
													className='submit-button'
													variant='outline-warning'
													type='button'
													onClick={() =>
														navigate(`/ban_or_mute?what=mute&id=${id}`)
													}
												>
													Замутить
												</Button>
											)}
										</Stack>
									)}
							</Stack>
						</Card.Body>
					</Card>
				</Col>
			</Row>
		</Container>
	)
}

export default Profile

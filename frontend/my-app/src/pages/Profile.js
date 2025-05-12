import React, { useState, useEffect } from 'react'
import { Card, Stack, Image, Button } from 'react-bootstrap'
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
		<div className='outer-card'>
			<Card className='card-center'>
				<Card.Body>
					<Stack gap={3} className='card-content'>
						<h1>{user.nickname}</h1>
						<Image
							src={`http://localhost:5000/${user.profile.image}`}
							roundedCircle
							className='profile-image'
						/>

						{user.profile.bio ? (
							<h5>БИО: {user.profile.bio}</h5>
						) : (
							<h5>БИО не указано</h5>
						)}

						<h5>Создан: {new Date(user.profile.createdAt).toLocaleString()}</h5>

						<h5>Количество лайков: {user.profile.like}</h5>
						<h5>Количество сообщений: {user.profile.postsNum}</h5>

						{(myUser.role === 'SUPER_ADMIN' || myUser.role === 'ADMIN') &&
							Number(id) !== Number(myUserId) && (
								<Stack
									gap={2}
									direction='horizontal'
									className='justify-content-center'
								>
									{user.isBaned ? (
										<Button
											className='submit-button'
											variant='outline-success'
											type='ban'
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
											type='ban'
											onClick={() => navigate(`/ban_or_mute?what=ban&id=${id}`)}
										>
											Забанить
										</Button>
									)}

									{user.isMuted ? (
										<Button
											className='submit-button'
											variant='outline-success'
											type='mute'
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
											type='mute'
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
		</div>
	)
}

export default Profile

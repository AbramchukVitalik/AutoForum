import React, { useState, useEffect } from 'react'
import { Card, Stack, Image } from 'react-bootstrap'
import axios from 'axios'
import { jwtDecode } from 'jwt-decode'

const Profile = () => {
	const token = localStorage.getItem('token')
	const urlParams = new URLSearchParams(window.location.search)

	const [user, setUser] = useState({ profile: { image: '' } })
	const [userId, setUserId] = useState({})
	const id = urlParams.get('id')

	useEffect(() => {
		if (token) {
			try {
				const decodedToken = jwtDecode(token)
				const idUser = decodedToken.id
				setUserId(idUser)

				fetchUser(id)
			} catch (error) {
				console.error('Invalid token:', error)
			}
		}
	}, [id, token])

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

	return (
		<div
			className='outer-card'
			style={{
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				height: '100vh',
			}}
		>
			<Card
				className='card-center'
				style={{
					boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					width: '60%',
					height: '80%',
				}}
			>
				<Card.Body>
					<Stack
						gap={3}
						style={{
							alignItems: 'center',
							textAlign: 'center',
							marginTop: '50px',
						}}
					>
						<h1>{user.nickname}</h1>
						<Image
							src={`http://localhost:5000/${user.profile.image}`}
							roundedCircle
							style={{
								cursor: 'pointer',
								width: '250px',
								height: '250px',
								display: 'flex',
							}}
						/>

						{id !== userId &&
							(user.profile.bio ? (
								<h5>БИО: {user.profile.bio}</h5>
							) : (
								<h5>БИО не указано</h5>
							))}

						<h5>Создан: {new Date(user.profile.createdAt).toLocaleString()}</h5>

						<h5>Количество лайков: {user.profile.like}</h5>
						<h5>Количество сообщений: {user.profile.postsNum}</h5>
					</Stack>
				</Card.Body>
			</Card>
		</div>
	)
}

export default Profile

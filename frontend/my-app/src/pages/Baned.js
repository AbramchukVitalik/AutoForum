import React, { useState, useEffect } from 'react'
import { Card, Form, Container, Row, Col } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { jwtDecode } from 'jwt-decode'
import '../css/Card.css'

const Baned = () => {
	const token = localStorage.getItem('token')
	const [user, setUser] = useState({})

	const navigate = useNavigate()

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
	}, [])

	const fetchUser = async id => {
		try {
			const response = await axios.get(
				`http://localhost:5000/api/getUser/${id}`
			)

			setUser(response.data.user)

			console.log(response.data.user)

			if (new Date(response.data.user.baned) < new Date()) {
				unBan(response.data.user.id)
			}
		} catch (error) {
			console.error('Error fetching user:', error)
		}
	}

	const unBan = async id => {
		try {
			await axios.post(`http://localhost:5000/api/unbanUser/${id}/ban`, {})

			navigate('/')
		} catch (error) {
			console.error('Error banOrMute:', error)
		}
	}

	return (
		<Container className='d-flex justify-content-center align-items-center vh-100'>
			<Row className='w-100'>
				<Col xs={12} sm={10} md={8} lg={6} className='mx-auto'>
					<Card className='shadow'>
						<Card.Body className='m-5 text-center'>
							<Form.Label className='mb-0'>
								<h5>
									Вы забанены до "
									{new Date(user.baned).toLocaleString('ru-RU', {
										day: 'numeric',
										month: 'long',
										year: 'numeric',
										hour: '2-digit',
										minute: '2-digit',
										second: '2-digit',
									})}
									" по причине "{user.cause}"
								</h5>
							</Form.Label>
						</Card.Body>
					</Card>
				</Col>
			</Row>
		</Container>
	)
}

export default Baned

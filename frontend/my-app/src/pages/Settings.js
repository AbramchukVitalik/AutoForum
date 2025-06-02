import React, { useState, useEffect } from 'react'
import {
	Button,
	Card,
	Stack,
	Form,
	Image,
	Container,
	Row,
	Col,
} from 'react-bootstrap'
import { jwtDecode } from 'jwt-decode'
import axios from 'axios'
import '../css/Card.css'

const Settings = () => {
	const token = localStorage.getItem('token')
	const [message, setMessage] = useState(null)
	const [user, setUser] = useState({ profile: { image: '' } })
	const [values, setValues] = useState({})
	const [selectedFile, setSelectedFile] = useState(null)

	const handleChanges = e => {
		setValues({ ...values, [e.target.name]: e.target.value })
	}

	const handleFileChange = e => {
		setSelectedFile(e.target.files[0])
	}

	const handleSubmit = async e => {
		e.preventDefault()
		const formData = new FormData()

		for (const key in values) {
			formData.append(key, values[key])
		}

		if (selectedFile) {
			formData.append('image', selectedFile)
		}

		axios
			.put(`http://localhost:5000/api/updateUser/${user.id}`, formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			})
			.then(response => {
				setMessage('Данные успешно изменены, перезагрузите страницу')
			})
			.catch(error => {
				setMessage(
					error.response
						? error.response.data.error
						: 'Ошибка при отправке данных'
				)
			})
	}

	useEffect(() => {
		if (token) {
			try {
				const decodedToken = jwtDecode(token)
				const id = decodedToken.id

				fetchUser(id)
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
			setUser(response.data.user)
		} catch (error) {
			console.error('Error fetching user:', error)
		}
	}

	return (
		<Container className='d-flex justify-content-center align-items-center responsive-container px-3'>
			<Row className='w-100'>
				<Col xs={12} sm={10} md={8} lg={6} className='mx-auto'>
					<Card className='card' style={{ marginTop: '20%' }}>
						<Card.Body className='p-5'>
							<Stack gap={3} className='card-content'>
								<h1 className='text-center'>Изменение данных аккаунта</h1>
								<Image
									src={`http://localhost:5000/${user.profile.image}`}
									roundedCircle
									fluid
									className='profile-image mx-auto'
									style={{ maxWidth: '150px' }}
									alt='Profile'
								/>
								<input
									type='file'
									onChange={handleFileChange}
									className='mx-auto'
								/>
								<Stack
									direction='horizontal'
									gap={3}
									className='d-flex flex-column flex-sm-row form-group flex-wrap'
									style={{ marginTop: '10px', marginBottom: '10px' }}
								>
									<Form.Group controlId='formEmail' className='flex-fill'>
										<Form.Label>Email адрес</Form.Label>
										<Form.Control
											name='email'
											type='email'
											placeholder='Введите Email'
											value={values.email}
											onChange={handleChanges}
										/>
									</Form.Group>
									<Form.Group controlId='formPassword' className='flex-fill'>
										<Form.Label>Пароль</Form.Label>
										<Form.Control
											name='password'
											type='password'
											placeholder='Введите пароль'
											value={values.password}
											onChange={handleChanges}
										/>
									</Form.Group>
									<Form.Group controlId='formNickname' className='flex-fill'>
										<Form.Label>Никнейм</Form.Label>
										<Form.Control
											name='nickname'
											type='text'
											placeholder='Введите никнейм'
											value={values.nickname}
											onChange={handleChanges}
										/>
									</Form.Group>
									<Form.Group controlId='formBIO' className='flex-fill'>
										<Form.Label>БИО</Form.Label>
										<Form.Control
											name='bio'
											type='text'
											placeholder='Введите БИО'
											value={values.bio}
											onChange={handleChanges}
										/>
									</Form.Group>
								</Stack>
								<Form.Group controlId='formCurrentPassword'>
									<Form.Label>Введите нынешний пароль для изменения</Form.Label>
									<Form.Control
										name='currentPassword'
										type='password'
										placeholder='Введите пароль'
										value={values.currentPassword}
										onChange={handleChanges}
									/>
								</Form.Group>
								<Button
									className='submit-button'
									variant='secondary'
									type='submit'
									onClick={e => handleSubmit(e)}
								>
									Изменить
								</Button>
								{message && <p className='message'>{message}</p>}
							</Stack>
						</Card.Body>
					</Card>
				</Col>
			</Row>
		</Container>
	)
}

export default Settings

import React, { useState, useEffect } from 'react'
import { Button, Card, Stack, Form, Image } from 'react-bootstrap'
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
		<div className='outer-card'>
			<Card className='card-center'>
				<Card.Body>
					<Stack gap={3} className='card-content'>
						<h1>Изменение данных аккаунта</h1>
						<Image
							src={`http://localhost:5000/${user.profile.image}`}
							roundedCircle
							className='profile-image'
						/>
						<input type='file' onChange={handleFileChange} />

						<Stack
							direction='horizontal'
							gap={3}
							className='form-group'
							style={{ marginTop: '10px', marginBottom: '10px' }}
						>
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
							<Form.Group controlId='formNickname'>
								<Form.Label>Никнейм</Form.Label>
								<Form.Control
									name='nickname'
									type='text'
									placeholder='Введите никнейм'
									value={values.nickname}
									onChange={handleChanges}
								/>
							</Form.Group>
							<Form.Group controlId='formBIO'>
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
		</div>
	)
}

export default Settings

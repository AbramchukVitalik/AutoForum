import React, { useState, useEffect } from 'react'
import { Button, Card, Stack, Form } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import axios from 'axios'
import '../css/Card.css'

const AddTopic = () => {
	const token = localStorage.getItem('token')
	const [values, setValues] = useState({})
	const [user, setUser] = useState({})
	const [forums, setForums] = useState([])
	const [forumId, setForumId] = useState({})

	const navigate = useNavigate()

	const handleChanges = e => {
		setValues({ ...values, [e.target.name]: e.target.value })
	}
	const handleForumChange = e => {
		setForumId(e.target.value)
	}

	const handleSubmit = async => {
		console.log(values)
		console.log(user.id)
		console.log(user.nickname)

		axios
			.post(`http://localhost:5000/api/createTopic/${forumId}`, {
				...values,
				authorId: user.id,
				author: user.nickname,
			})
			.then(response => {
				navigate(`/chat?id=${response.data.id}`)
			})
			.catch(error => {
				console.log(error)
			})
	}

	useEffect(() => {
		if (token) {
			try {
				const decodedToken = jwtDecode(token)
				const id = decodedToken.id

				fetchUser(id)
				fetchForums()
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
			console.log(response.data.user)
		} catch (error) {
			console.error('Error fetching user:', error)
		}
	}
	const fetchForums = async id => {
		try {
			const response = await axios.get(`http://localhost:5000/api/getForums`)

			setForums(response.data)
		} catch (error) {
			console.error('Error fetching forums:', error)
		}
	}

	const renderForums = forums => (
		<option key={forums.id} value={forums.id}>
			{forums.title}
		</option>
	)

	return (
		<div className='outer-card'>
			<Card className='card-center'>
				<Card.Body className='inside_the_card'>
					<Stack gap={3}>
						<Stack>
							<Form.Label>Форум</Form.Label>
							<Form.Select
								aria-label='Выберите форум'
								onChange={handleForumChange}
							>
								<option>Выберите форум</option>
								{forums.map(renderForums)}
							</Form.Select>
						</Stack>

						<Form.Group controlId='formTitle'>
							<Form.Label>Название</Form.Label>
							<Form.Control
								name='title'
								type='text'
								placeholder='Введите название'
								value={values.title}
								onChange={handleChanges}
							/>
						</Form.Group>

						<Form.Group controlId='formQuestion'>
							<Form.Label>Вопрос</Form.Label>
							<Form.Control
								as='textarea'
								name='question'
								type='text'
								placeholder='Введите вопрос'
								value={values.question}
								onChange={handleChanges}
								style={{
									height: '150px',
									resize: 'vertical',
									overflowY: 'auto',
								}}
							/>
						</Form.Group>

						<Button
							className='submit-button'
							variant='secondary'
							type='submit'
							onClick={handleSubmit}
						>
							Создать
						</Button>
					</Stack>
				</Card.Body>
			</Card>
		</div>
	)
}

export default AddTopic

import React, { useState } from 'react'
import { Container, Row, Col, Card, Stack, Form, Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import '../css/Card.css'

const AddForum = () => {
	const [values, setValues] = useState({})

	const navigate = useNavigate()

	const handleChanges = e => {
		setValues({ ...values, [e.target.name]: e.target.value })
	}

	const handleSubmit = async => {
		axios
			.post(`http://localhost:5000/api/createForum`, {
				...values,
			})
			.then(response => {
				navigate(`/`)
			})
			.catch(error => {
				console.log(error)
			})
	}

	return (
		<Container className='d-flex justify-content-center align-items-center vh-100 px-3'>
			<Row className='w-100'>
				<Col xs={12} sm={10} md={8} lg={6} className='mx-auto'>
					<Card className='card' style={{ marginTop: '5%' }}>
						<Card.Body className='inside_the_card p-5'>
							<Stack gap={3}>
								<Form.Group controlId='formTitle'>
									<h5>Название</h5>
									<Form.Control
										name='title'
										type='text'
										placeholder='Введите название'
										value={values.title}
										onChange={handleChanges}
									/>
								</Form.Group>

								<Form.Group controlId='formDescription'>
									<h5>Описание</h5>
									<Form.Control
										as='textarea'
										name='description'
										placeholder='Введите описание'
										value={values.description}
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
				</Col>
			</Row>
		</Container>
	)
}

export default AddForum

import React, { useState } from 'react'
import { Button, Card, Stack, Form } from 'react-bootstrap'
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
		<div className='outer-card'>
			<Card className='card-center'>
				<Card.Body className='inside_the_card'>
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
								type='text'
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
		</div>
	)
}

export default AddForum

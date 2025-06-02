import React, { useEffect, useState } from 'react'
import { Container, Row, Col, Card, Stack, Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import '../css/Card.css'

const DeleteForum = () => {
	const urlParams = new URLSearchParams(window.location.search)
	const deleted = urlParams.get('deleted')
	const id = urlParams.get('id')

	const navigate = useNavigate()

	const [forum, setForum] = useState([])
	const [topic, setTopic] = useState([])

	useEffect(() => {
		deleted === 'forum' && fetchForum()
		deleted === 'topic' && fetchTopic()
	}, [])

	const fetchForum = async () => {
		try {
			const response = await axios.get(
				`http://localhost:5000/api/getForum/${id}`
			)

			setForum(response.data)
		} catch (error) {
			console.error('Error fetching forum:', error)
		}
	}
	const fetchTopic = async () => {
		try {
			const response = await axios.get(
				`http://localhost:5000/api/getTopic/${id}`
			)

			setTopic(response.data)
		} catch (error) {
			console.error('Error fetching topic:', error)
		}
	}

	const deleteForum = async () => {
		try {
			await axios.delete(`http://localhost:5000/api/deleteForum/${id}`)
			navigate(-1)
		} catch (error) {
			console.error(error)
		}
	}
	const deleteTopic = async () => {
		try {
			await axios.delete(`http://localhost:5000/api/deleteTopic/${id}`)
			navigate(-1)
		} catch (error) {
			console.error(error)
		}
	}

	return (
		<Container className='my-3'>
			<Row className='justify-content-center'>
				<Col xs={12} sm={10} md={8} lg={6}>
					<Card className='card' style={{ marginTop: '45%' }}>
						<Card.Body className='inside_the_card p-5'>
							<Stack gap={3} className='text-center'>
								{deleted === 'forum' && (
									<>
										<h5>
											Вы действительно хотите удалить форум "{forum.title}"? Это
											действие нельзя будет отменить
										</h5>
										<Stack gap={2} direction='horizontal' className='w-100'>
											<Button
												variant='outline-secondary'
												type='button'
												onClick={() => navigate(-1)}
												className='flex-fill'
											>
												Отмена
											</Button>
											<Button
												variant='outline-danger'
												type='button'
												onClick={deleteForum}
												className='flex-fill'
											>
												Удалить
											</Button>
										</Stack>
									</>
								)}
								{deleted === 'topic' && (
									<>
										<h5>
											Вы действительно хотите удалить тему "{topic.title}"? Это
											действие нельзя будет отменить
										</h5>
										<Stack gap={2} direction='horizontal' className='w-100'>
											<Button
												variant='outline-secondary'
												type='button'
												onClick={() => navigate(-1)}
												className='flex-fill'
											>
												Отмена
											</Button>
											<Button
												variant='outline-danger'
												type='button'
												onClick={deleteTopic}
												className='flex-fill'
											>
												Удалить
											</Button>
										</Stack>
									</>
								)}
							</Stack>
						</Card.Body>
					</Card>
				</Col>
			</Row>
		</Container>
	)
}

export default DeleteForum

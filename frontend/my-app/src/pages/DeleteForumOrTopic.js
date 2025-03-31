import React, { useEffect, useState } from 'react'
import { Button, Card, Stack } from 'react-bootstrap'
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
		<div className='outer-card'>
			<Card className='card-center'>
				<Card.Body className='inside_the_card'>
					<Stack gap={3} style={{ textAlign: 'center' }}>
						{deleted === 'forum' && (
							<>
								<h5>
									Вы действительно хотите удалить форум "{forum.title}"? Это
									действие нельзя будет отменить
								</h5>
								<Stack gap={2} direction='horizontal' style={{ width: '100%' }}>
									<Button
										variant='outline-secondary'
										type='button'
										onClick={() => navigate(-1)}
										style={{ flex: 1 }}
									>
										Отмена
									</Button>
									<Button
										variant='outline-danger'
										type='button'
										onClick={deleteForum}
										style={{ flex: 1 }}
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
								<Stack gap={2} direction='horizontal' style={{ width: '100%' }}>
									<Button
										variant='outline-secondary'
										type='button'
										onClick={() => navigate(-1)}
										style={{ flex: 1 }}
									>
										Отмена
									</Button>
									<Button
										variant='outline-danger'
										type='button'
										onClick={deleteTopic}
										style={{ flex: 1 }}
									>
										Удалить
									</Button>
								</Stack>
							</>
						)}
					</Stack>
				</Card.Body>
			</Card>
		</div>
	)
}

export default DeleteForum

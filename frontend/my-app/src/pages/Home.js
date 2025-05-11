import React, { useState, useEffect } from 'react'
import { Card, Button, Stack } from 'react-bootstrap'
import Table from 'react-bootstrap/Table'
import { useNavigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import axios from 'axios'
import '../css/HomeCard.css'

const Home = () => {
	const navigate = useNavigate()
	const token = localStorage.getItem('token')

	const [forums, setForums] = useState([])
	const [role, setRole] = useState({})

	const handleNavigate = path => {
		navigate(path)
	}

	useEffect(() => {
		if (token) {
			const decodedToken = jwtDecode(token)
			setRole(decodedToken.role)
		} else {
			setRole('GUEST')
		}

		fetchForums()
	}, [token])

	const fetchForums = async () => {
		try {
			const response = await axios.get(`http://localhost:5000/api/getForums`)

			setForums(response.data)
		} catch (error) {
			console.error('Error fetching forums:', error)
		}
	}

	const renderForums = (forums, index) => (
		<tr key={index}>
			<td>
				<a
					href={`/topics?id=${forums.id}`}
					className='text-decoration-none'
					style={{ whiteSpace: 'nowrap' }}
				>
					<h5>{forums.title}</h5>
				</a>
				<p style={{ whiteSpace: 'nowrap' }}>{forums.description}</p>
			</td>
			<td>{forums.numberOfTopics}</td>
			<td>{forums.numberOfMessages}</td>
			{role === 'SUPER_ADMIN' && (
				<td>
					<Button
						variant='outline-danger'
						onClick={() =>
							handleNavigate(`/delete_forum?deleted=forum&id=${forums.id}`)
						}
					>
						Удалить
					</Button>
				</td>
			)}
		</tr>
	)

	return (
		<div className='outer-card'>
			<Card className='home-card'>
				<Card.Body>
					<div style={{ margin: '30px' }} className='inside'>
						<Stack gap={3}>
							{role === 'SUPER_ADMIN' && (
								<div
									style={{
										display: 'flex',
										justifyContent: 'flex-end',
										marginBottom: '12px',
									}}
								>
									<Button
										variant='outline-success'
										onClick={() => handleNavigate('/add_forum')}
										style={{
											borderRadius: '8px',
											whiteSpace: 'nowrap',
										}}
									>
										Добавить форум
									</Button>
								</div>
							)}

							<div
								style={{ maxHeight: '600px', overflowY: 'auto' }}
								className='table-responsive'
							>
								<Table striped bordered hover responsive>
									<thead>
										<tr>
											<th>Форум</th>
											<th>Темы</th>
											<th>Сообщения</th>
											{role === 'SUPER_ADMIN' && <th>Удалить</th>}
										</tr>
									</thead>
									<tbody>{forums.map(renderForums)}</tbody>
								</Table>
							</div>
						</Stack>
					</div>
				</Card.Body>
			</Card>
		</div>
	)
}

export default Home

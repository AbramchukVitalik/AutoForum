import React, { useState, useEffect } from 'react'
import {
	Button,
	Card,
	Stack,
	Table,
	Container,
	Row,
	Col,
} from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import axios from 'axios'
import '../css/Card.css'

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
		<Container
			fluid
			className='d-flex justify-content-center align-items-center min-vh-100'
		>
			<Row className='w-100 justify-content-center'>
				<Col xs={12} sm={10} md={8} lg={6}>
					<Card className='card'>
						<Card.Body>
							<Stack gap={3} className='m-3'>
								{role === 'SUPER_ADMIN' && (
									<div className='d-flex justify-content-end mb-3'>
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
									className='table-responsive'
									style={{ maxHeight: '600px', overflowY: 'auto' }}
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
						</Card.Body>
					</Card>
				</Col>
			</Row>
		</Container>
	)
}

export default Home

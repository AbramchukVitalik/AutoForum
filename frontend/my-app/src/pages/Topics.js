import React, { useState, useEffect, useMemo } from 'react'
import { Card, Form, Stack, Button } from 'react-bootstrap'
import Table from 'react-bootstrap/Table'
import { jwtDecode } from 'jwt-decode'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import '../css/HomeCard.css'
import { sortTopics } from '../sortUtils'

const Topics = () => {
	const urlParams = new URLSearchParams(window.location.search)
	const id = urlParams.get('id')

	const token = localStorage.getItem('token')
	const navigate = useNavigate()

	const [topics, setTopics] = useState([])
	const [sortOption, setSortOption] = useState('ascendingDate')

	const [role, setRole] = useState({})
	const [author, setAuthor] = useState({})

	const handleChanges = e => {
		setAuthor({ ...author, [e.target.name]: e.target.value })
	}
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

		fetchTopics()
	}, [])

	const fetchTopics = async () => {
		try {
			const response = await axios.get(
				`http://localhost:5000/api/getTopics/${id}`
			)
			setTopics(response.data)
		} catch (error) {
			console.error('Error fetching topics:', error)
			setTopics([])
		}
	}

	const filteredTopics = useMemo(() => {
		let topicsToFilter = topics

		if (author.author && author.author.trim() !== '') {
			const authorQuery = author.author.trim().toLowerCase()
			topicsToFilter = topicsToFilter.filter(topic =>
				topic.author.toLowerCase().includes(authorQuery)
			)
		}

		return sortTopics(sortOption, topicsToFilter)
	}, [topics, sortOption, author])

	const handleSortChange = option => {
		setSortOption(option)
	}

	const renderTopics = (topic, index) => (
		<tr key={index}>
			<td>
				<a href={`/chat?id=${topic.id}`} className='text-decoration-none'>
					<h5>{topic.title}</h5>
				</a>
			</td>
			<td>
				<a
					href={`/profile?id=${topic.authorId}`}
					className='text-decoration-none'
				>
					<h5>{topic.author}</h5>
				</a>
			</td>
			<td>{topic.numberOfMessages}</td>
			<td>{topic.numberOfViews}</td>
			{role === 'SUPER_ADMIN' && (
				<td>
					<Button
						variant='outline-danger'
						onClick={() =>
							handleNavigate(`/delete_forum?deleted=topic&id=${topic.id}`)
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
					<div style={{ margin: '30px' }}>
						<Stack gap={3}>
							<Stack>
								<Form.Label className='fw-bold'>Фильтры:</Form.Label>
								<Stack
									gap={2}
									direction='horizontal'
									className='w-100 flex-wrap'
								>
									<Card className='p-3 shadow-sm flex-grow-1'>
										<Form>
											<Form.Label className='fw-bold'>
												Сортировка по алфавиту
											</Form.Label>
											<Stack direction='horizontal' gap={3}>
												<Form.Check
													type='radio'
													name='sortOrderAlphabet'
													label='По возрастанию'
													id='ascendingTitle'
													checked={sortOption === 'ascendingTitle'}
													onChange={() => handleSortChange('ascendingTitle')}
												/>
												<Form.Check
													type='radio'
													name='sortOrderAlphabet'
													label='По убыванию'
													id='descendingTitle'
													checked={sortOption === 'descendingTitle'}
													onChange={() => handleSortChange('descendingTitle')}
												/>
											</Stack>
										</Form>
									</Card>

									<Card className='p-3 shadow-sm flex-grow-1'>
										<Form>
											<Form.Label className='fw-bold'>
												Сортировка по времени
											</Form.Label>
											<Stack direction='horizontal' gap={3}>
												<Form.Check
													type='radio'
													name='sortOrderTime'
													label='Сначала новые'
													id='ascendingDate'
													checked={sortOption === 'ascendingDate'}
													onChange={() => handleSortChange('ascendingDate')}
												/>
												<Form.Check
													type='radio'
													name='sortOrderTime'
													label='Сначала старые'
													id='descendingDate'
													checked={sortOption === 'descendingDate'}
													onChange={() => handleSortChange('descendingDate')}
												/>
											</Stack>
										</Form>
									</Card>

									<Card className='p-3 shadow-sm flex-grow-1'>
										<Form>
											<Form.Label className='fw-bold'>
												Сортировка по сообщениям
											</Form.Label>
											<Stack direction='horizontal' gap={3}>
												<Form.Check
													type='radio'
													name='sortOrderMessages'
													label='По возрастанию'
													id='ascendingMessages'
													checked={sortOption === 'ascendingMessages'}
													onChange={() => handleSortChange('ascendingMessages')}
												/>
												<Form.Check
													type='radio'
													name='sortOrderMessages'
													label='По убыванию'
													id='descendingMessages'
													checked={sortOption === 'descendingMessages'}
													onChange={() =>
														handleSortChange('descendingMessages')
													}
												/>
											</Stack>
										</Form>
									</Card>

									<Card className='p-3 shadow-sm flex-grow-1'>
										<Form>
											<Form.Label className='fw-bold'>
												Сортировка по просмотрам
											</Form.Label>
											<Stack direction='horizontal' gap={3}>
												<Form.Check
													type='radio'
													name='sortOrderViews'
													label='По возрастанию'
													id='ascendingViews'
													checked={sortOption === 'ascendingViews'}
													onChange={() => handleSortChange('ascendingViews')}
												/>
												<Form.Check
													type='radio'
													name='sortOrderViews'
													label='По убыванию'
													id='descendingViews'
													checked={sortOption === 'descendingViews'}
													onChange={() => handleSortChange('descendingViews')}
												/>
											</Stack>
										</Form>
									</Card>

									<Card className='p-3 shadow-sm flex-grow-1'>
										<Form>
											<Form.Label className='fw-bold'>
												Поиск по автору
											</Form.Label>
											<Form.Group controlId='formAuthor'>
												<Form.Control
													name='author'
													type='text'
													placeholder='Введите автора'
													value={author.author}
													onChange={handleChanges}
												/>
											</Form.Group>
										</Form>
									</Card>
								</Stack>
							</Stack>

							<div style={{ maxHeight: '420px', overflowY: 'auto' }}>
								<Table striped bordered hover>
									<thead>
										<tr>
											<th>Темы</th>
											<th>Автор</th>
											<th>Сообщения</th>
											<th>Просмотры</th>
											{role === 'SUPER_ADMIN' && <th>Удалить</th>}
										</tr>
									</thead>
									<tbody>
										{filteredTopics && filteredTopics.length > 0 ? (
											filteredTopics.map(renderTopics)
										) : (
											<tr>
												<td colSpan='4' style={{ textAlign: 'center' }}>
													Нет доступных тем
												</td>
											</tr>
										)}
									</tbody>
								</Table>
							</div>
						</Stack>
					</div>
				</Card.Body>
			</Card>
		</div>
	)
}

export default Topics

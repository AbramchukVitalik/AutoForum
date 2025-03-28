import React, { useState, useEffect, useMemo } from 'react'
import { Card, Form, Stack } from 'react-bootstrap'
import Table from 'react-bootstrap/Table'
import axios from 'axios'
import '../css/HomeCard.css'
import { sortTopics } from '../sortUtils'

const FindTopic = () => {
	const urlParams = new URLSearchParams(window.location.search)
	const find = urlParams.get('find_topic')

	const [topics, setTopics] = useState([])
	const [forums, setForums] = useState([])
	const [sortOption, setSortOption] = useState('ascendingDate')
	const [selectedForum, setSelectedForum] = useState('all')
	const [author, setAuthor] = useState({})

	const handleChanges = e => {
		setAuthor({ ...author, [e.target.name]: e.target.value })
	}

	useEffect(() => {
		fetchFindTopics()
		fetchForums()
	}, [])

	const fetchFindTopics = async () => {
		try {
			const response = await axios.post(
				'http://localhost:5000/api/findTopics',
				{ find }
			)
			setTopics(response.data)
		} catch (error) {
			console.error('Error fetching topics:', error)
			setTopics([])
		}
	}
	const fetchForums = async () => {
		try {
			const response = await axios.get(`http://localhost:5000/api/getForums`)
			setForums(response.data)
		} catch (error) {
			console.error('Error fetching forums:', error)
		}
	}

	const handleForumChange = e => {
		setSelectedForum(e.target.value)
	}

	const filteredTopics = useMemo(() => {
		let topicsToFilter =
			selectedForum === 'all'
				? topics
				: topics.filter(topic => topic.forumId === Number(selectedForum))

		if (author.author && author.author.trim() !== '') {
			const authorQuery = author.author.trim().toLowerCase()
			topicsToFilter = topicsToFilter.filter(topic =>
				topic.author.toLowerCase().includes(authorQuery)
			)
		}

		return sortTopics(sortOption, topicsToFilter)
	}, [topics, selectedForum, sortOption, author])

	const renderTopics = (topic, index) => (
		<tr key={index}>
			<td>
				<a href={`/chat?id=${topic.id}`}>
					<h5>{topic.title}</h5>
				</a>
			</td>
			<td>
				<a href={`/profile?id=${topic.authorId}`}>
					<h5>{topic.author}</h5>
				</a>
			</td>
			<td>{topic.numberOfMessages}</td>
			<td>{topic.numberOfViews}</td>
		</tr>
	)

	const renderForums = forum => (
		<option key={forum.id} value={forum.id}>
			{forum.title}
		</option>
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
													onChange={() => setSortOption('ascendingTitle')}
												/>
												<Form.Check
													type='radio'
													name='sortOrderAlphabet'
													label='По убыванию'
													id='descendingTitle'
													checked={sortOption === 'descendingTitle'}
													onChange={() => setSortOption('descendingTitle')}
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
													onChange={() => setSortOption('ascendingDate')}
												/>
												<Form.Check
													type='radio'
													name='sortOrderTime'
													label='Сначала старые'
													id='descendingDate'
													checked={sortOption === 'descendingDate'}
													onChange={() => setSortOption('descendingDate')}
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
													onChange={() => setSortOption('ascendingMessages')}
												/>
												<Form.Check
													type='radio'
													name='sortOrderMessages'
													label='По убыванию'
													id='descendingMessages'
													checked={sortOption === 'descendingMessages'}
													onChange={() => setSortOption('descendingMessages')}
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
													onChange={() => setSortOption('ascendingViews')}
												/>
												<Form.Check
													type='radio'
													name='sortOrderViews'
													label='По убыванию'
													id='descendingViews'
													checked={sortOption === 'descendingViews'}
													onChange={() => setSortOption('descendingViews')}
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

									<Card className='p-3 shadow-sm flex-grow-1'>
										<Form>
											<Form.Label className='fw-bold'>
												Поиск по форуму
											</Form.Label>
											<Form.Select
												aria-label='Выберите форум'
												onChange={handleForumChange}
												className='mt-2'
											>
												<option value='all'>Все форумы</option>
												{forums.map(renderForums)}
											</Form.Select>
										</Form>
									</Card>
								</Stack>
							</Stack>

							<div style={{ maxHeight: '400px', overflowY: 'auto' }}>
								<Table striped bordered hover>
									<thead>
										<tr>
											<th>Темы</th>
											<th>Автор</th>
											<th>Сообщения</th>
											<th>Просмотры</th>
										</tr>
									</thead>
									<tbody>
										{filteredTopics && filteredTopics.length > 0 ? (
											filteredTopics.map(renderTopics)
										) : (
											<tr>
												<td colSpan='4' style={{ textAlign: 'center' }}>
													<h2>
														К сожалению, таких тем пока нет. Но не волнуйтесь —
														вы можете создать новую тему прямо сейчас!
													</h2>
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

export default FindTopic

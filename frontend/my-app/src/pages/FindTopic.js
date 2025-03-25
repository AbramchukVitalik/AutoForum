import React, { useState, useEffect } from 'react'
import { Card } from 'react-bootstrap'
import Table from 'react-bootstrap/Table'
import axios from 'axios'
import '../css/HomeCard.css'

const FindTopic = () => {
	const urlParams = new URLSearchParams(window.location.search)
	const find = urlParams.get('find_topic')

	const [topics, setTopics] = useState([])

	useEffect(() => {
		fetchFindTopics()
	}, [])

	const fetchFindTopics = async () => {
		try {
			const response = await axios.post(
				'http://localhost:5000/api/findTopics',
				{
					find: find,
				}
			)

			setTopics(response.data)
		} catch (error) {
			console.error('Error fetching topics:', error)
		}
	}

	const renderTopics = (topics, index) => (
		<tr key={index}>
			<td>
				<a href={`/chat?id=${topics.id}`}>
					<h5>{topics.title}</h5>
				</a>
			</td>
			<td>
				<a href={`/profile?id=${topics.authorId}`}>
					<h5>{topics.author}</h5>
				</a>
				{}
			</td>
			<td>{topics.numberOfMessages}</td>
			<td>{topics.numberOfViews}</td>
		</tr>
	)

	return (
		<div className='outer-card'>
			<Card className='home-card'>
				<Card.Body>
					<div
						style={{ margin: '30px', maxHeight: '650px', overflowY: 'auto' }}
					>
						{topics && topics.length > 0 ? (
							<Table striped bordered hover style={{}}>
								<thead>
									<tr>
										<th>Темы</th>
										<th>Автор</th>
										<th>Сообщения</th>
										<th>Просмотры</th>
									</tr>
								</thead>
								<tbody>{topics.map(renderTopics)}</tbody>
							</Table>
						) : (
							<h2 style={{ textAlign: 'center' }}>
								"К сожалению, таких тем пока нет. Но не волнуйтесь — вы можете
								создать новую тему прямо сейчас!
							</h2>
						)}
					</div>
				</Card.Body>
			</Card>
		</div>
	)
}

export default FindTopic

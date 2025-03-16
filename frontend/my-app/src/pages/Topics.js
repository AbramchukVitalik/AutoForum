import React, { useState, useEffect } from 'react'
import { Card } from 'react-bootstrap'
import Table from 'react-bootstrap/Table'
import axios from 'axios'
import '../css/HomeCard.css'

const Topics = () => {
	const urlParams = new URLSearchParams(window.location.search)
	const id = urlParams.get('id')

	const [topics, setTopics] = useState([])

	useEffect(() => {
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
		}
	}

	const renderTopics = (topics, index) => (
		<tr key={index}>
			<td>
				<a href={`/topics?id=${topics.id}`}>
					<h5>{topics.title}</h5>
				</a>
			</td>
			<td>{topics.author}</td>
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
					</div>
				</Card.Body>
			</Card>
		</div>
	)
}

export default Topics

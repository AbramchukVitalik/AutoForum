import React, { useState, useEffect } from 'react'
import { Card } from 'react-bootstrap'
import Table from 'react-bootstrap/Table'
import axios from 'axios'
import '../css/HomeCard.css'

const Home = () => {
	const [forums, setForums] = useState([])

	useEffect(() => {
		fetchForums()
	}, [])

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
				<a href={`/topics?id=${forums.id}`}>
					<h5>{forums.title}</h5>
				</a>
				<p>{forums.description}</p>
			</td>
			<td>{forums.numberOfTopics}</td>
			<td>{forums.numberOfMessages}</td>
		</tr>
	)

	return (
		<div className='outer-card'>
			<Card className='home-card'>
				<Card.Body>
					<div
						style={{ margin: '30px', maxHeight: '650px', overflowY: 'auto' }}
					>
						<Table striped bordered hover>
							<thead>
								<tr>
									<th>Форум</th>
									<th>Темы</th>
									<th>Сообщения</th>
								</tr>
							</thead>
							<tbody>{forums.map(renderForums)}</tbody>
						</Table>
					</div>
				</Card.Body>
			</Card>
		</div>
	)
}

export default Home

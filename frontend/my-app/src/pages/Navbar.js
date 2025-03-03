import React, { useState, useEffect } from 'react'
import { Button, Dropdown } from 'react-bootstrap'
import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import Image from 'react-bootstrap/Image'
import { useNavigate, useLocation } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import axios from 'axios'

const CustomNavbar = () => {
	const navigate = useNavigate()
	const location = useLocation()

	const token = localStorage.getItem('token')
	const [userImage, setUserImage] = useState('')

	const handleNavigate = path => {
		navigate(path)
	}

	const handleLogout = () => {
		localStorage.removeItem('token')
		navigate('/login')
	}

	useEffect(() => {
		if (token) {
			try {
				const decodedToken = jwtDecode(token)
				const id = decodedToken.id

				fetchUserImage(id)
			} catch (error) {
				console.error('Invalid token:', error)
			}
		}
	}, [token])

	const fetchUserImage = async id => {
		try {
			const response = await axios.get(
				`http://localhost:5000/api/getUserImage/${id}`
			)
			setUserImage(response.data.image)
		} catch (error) {
			console.error('Error fetching user image:', error)
		}
	}

	return (
		<Navbar
			collapseOnSelect
			expand='lg'
			style={{ backgroundColor: '#373D3F' }}
			variant='dark'
			className='fixed-top'
		>
			<Container>
				<Navbar.Brand href='/'>PRIME-LB</Navbar.Brand>
				<Navbar.Toggle aria-controls='responsive-navbar-nav' />
				<Navbar.Collapse id='responsive-navbar-nav'>
					<Nav className='me-auto'></Nav>

					<Nav>
						{token ? (
							<Dropdown>
								<Dropdown.Toggle as='a' id='dropdown-custom-components'>
									<Image
										src={`http://localhost:5000/${userImage}`} // Укажите правильный путь к статическому изображению
										roundedCircle
										style={{
											cursor: 'pointer',
											width: '40px',
											height: '40px',
										}}
									/>
								</Dropdown.Toggle>

								<Dropdown.Menu style={{ backgroundColor: '#373D3F' }}>
									<Dropdown.Item style={{ backgroundColor: '#373D3F' }}>
										<Button variant='outline-light' onClick={handleLogout}>
											Выйти
										</Button>
									</Dropdown.Item>
								</Dropdown.Menu>
							</Dropdown>
						) : location.pathname === '/login' ? (
							<Button
								variant='outline-light'
								onClick={() => handleNavigate('/register')}
							>
								Регистрация
							</Button>
						) : (
							<Button
								variant='outline-light'
								onClick={() => handleNavigate('/login')}
							>
								Войти
							</Button>
						)}
					</Nav>
				</Navbar.Collapse>
			</Container>
		</Navbar>
	)
}

export default CustomNavbar

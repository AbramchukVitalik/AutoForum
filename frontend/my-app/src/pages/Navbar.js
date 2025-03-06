import React, { useState, useEffect } from 'react'
import { Button, Dropdown, Stack } from 'react-bootstrap'
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
	const [user, setUser] = useState({ profile: { image: '' } })

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

				fetchUser(id)
			} catch (error) {
				console.error('Invalid token:', error)
			}
		}
	}, [token])

	const fetchUser = async id => {
		try {
			const response = await axios.get(
				`http://localhost:5000/api/getUser/${id}`
			)
			setUser(response.data.user)
		} catch (error) {
			console.error('Error fetching user:', error)
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
				<Navbar.Brand href='/'>
					<b>PRIME-LB</b>
				</Navbar.Brand>
				<Navbar.Toggle aria-controls='responsive-navbar-nav' />
				<Navbar.Collapse id='responsive-navbar-nav'>
					<Nav className='me-auto'></Nav>
					{token ? (
						<>
							<Nav>
								<Dropdown align='end'>
									<Dropdown.Toggle
										as='a'
										id='dropdown-custom-components'
										className='custom-dropdown-toggle'
									>
										<Stack direction='horizontal' gap={2}>
											<h5 style={{ marginTop: '4px', color: '#ffffff' }}>
												{user.nickname}
											</h5>
											{user.profile && (
												<Image
													src={`http://localhost:5000/${user.profile.image}`}
													roundedCircle
													style={{
														cursor: 'pointer',
														width: '40px',
														height: '40px',
													}}
												/>
											)}
										</Stack>
									</Dropdown.Toggle>

									<Dropdown.Menu style={{ backgroundColor: '#373D3F' }}>
										<Container>
											<Dropdown.Item
												href={`/profile?id=${user.id}`}
												className='dropdown_item'
											>
												<b>Профиль</b>
											</Dropdown.Item>
											<Dropdown.Item href='/settings' className='dropdown_item'>
												<b>Настройки</b>
											</Dropdown.Item>
											<Dropdown.Divider
												style={{ backgroundColor: '#ffffff' }}
											/>
											<Dropdown.Item
												className='dropdown_item_exit'
												onClick={handleLogout}
											>
												<b>Выход</b>
											</Dropdown.Item>
										</Container>
									</Dropdown.Menu>
								</Dropdown>
							</Nav>
						</>
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
				</Navbar.Collapse>
			</Container>
		</Navbar>
	)
}

export default CustomNavbar

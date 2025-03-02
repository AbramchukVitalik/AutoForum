import React from 'react'
import { Button } from 'react-bootstrap'
import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import { useNavigate, useLocation } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'

const CustomNavbar = () => {
	const navigate = useNavigate()
	const location = useLocation()

	const handleNavigate = path => {
		navigate(path)
	}

	const handleLogout = () => {
		localStorage.removeItem('token')
		navigate('/login')
	}

	const token = localStorage.getItem('token')

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
							<Button variant='outline-light' onClick={handleLogout}>
								Выйти
							</Button>
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

import React from 'react'
import { Button } from 'react-bootstrap'
import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import { useNavigate, useLocation } from 'react-router-dom'

const CustomNavbar = () => {
	const navigate = useNavigate()
	const location = useLocation()

	const handleNavigate = path => {
		navigate(path)
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
						{location.pathname === '/register' ? (
							<Button
								variant='outline-light'
								onClick={() => handleNavigate('/login')}
							>
								Войти
							</Button>
						) : (
							<Button
								variant='outline-light'
								onClick={() => handleNavigate('/register')}
							>
								Регистрация
							</Button>
						)}
					</Nav>
				</Navbar.Collapse>
			</Container>
		</Navbar>
	)
}

export default CustomNavbar

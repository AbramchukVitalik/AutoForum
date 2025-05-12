import React from 'react'
import '../css/HomeCard.css'

const Footer = () => {
	return (
		<footer className='bg-dark text-light py-4'>
			<div className='container text-center'>
				<p style={{ color: '#918e90' }}>
					&copy; 2025 PRIME-LB. Все права защищены.
				</p>
				<p className='text-light'>
					<a href='/privacy' className='text-light'>
						Политика конфиденциальности
					</a>{' '}
					|
					<a href='/terms' className='text-light'>
						{' '}
						Условия использования
					</a>
				</p>
			</div>
		</footer>
	)
}

export default Footer

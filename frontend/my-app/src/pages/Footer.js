import '../css/Card.css'

const Footer = () => {
	return (
		<footer className='bg-dark text-light py-4 mt-5'>
			<div className='container text-center'>
				<p style={{ color: '#918e90' }}>
					&copy; 2025 PRIME-LB. Все права защищены.
				</p>
				<p className='text-light'>
					<a
						href='https://github.com/AbramchukVitalik/AutoForum/'
						className='text-light'
					>
						Github
					</a>{' '}
					|
					<a href='https://prime-lb.by/auto-parts' className='text-light'>
						{' '}
						Магазин
					</a>
				</p>
			</div>
		</footer>
	)
}

export default Footer

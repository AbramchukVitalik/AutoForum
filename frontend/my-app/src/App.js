import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './pages/Navbar.js'
import Login from './pages/Login.js'
import Home from './pages/Home.js'
import Register from './pages/Register.js'

function App() {
	return (
		<Router>
			<Navbar />
			<div className='background'>
				<Routes>
					<Route path='/' element={<Home />} />
					<Route path='/login' element={<Login />} />
					<Route path='/register' element={<Register />} />
				</Routes>
			</div>
		</Router>
	)
}

export default App

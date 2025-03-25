import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './pages/Navbar.js'
import Login from './pages/Login.js'
import Home from './pages/Home.js'
import Register from './pages/Register.js'
import Settings from './pages/Settings.js'
import Profile from './pages/Profile.js'
import Topics from './pages/Topics.js'
import Chat from './pages/Chat.js'
import AddTopic from './pages/AddTopic.js'

const token = localStorage.getItem('token')

function App() {
	return (
		<Router>
			<Navbar />
			<div className='background'>
				<Routes>
					<Route path='/' element={<Home />} />
					<Route path='/login' element={<Login />} />
					<Route path='/register' element={<Register />} />
					<Route path='/settings' element={token ? <Settings /> : <Login />} />
					<Route path='/profile' element={token ? <Profile /> : <Login />} />
					<Route path='/add_topic' element={token ? <AddTopic /> : <Login />} />
					<Route path='/topics' element={<Topics />} />
					<Route path='/chat' element={<Chat />} />
				</Routes>
			</div>
		</Router>
	)
}

export default App

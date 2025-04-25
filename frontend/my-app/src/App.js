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
import FindTopic from './pages/FindTopic.js'
import AddForum from './pages/AddForum.js'
import DeleteForum from './pages/DeleteForumOrTopic.js'

import { jwtDecode } from 'jwt-decode'

const token = localStorage.getItem('token')
const decodedToken = token ? jwtDecode(token) : null

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
					<Route
						path='/add_forum'
						element={
							token && decodedToken.role === 'SUPER_ADMIN' ? (
								<AddForum />
							) : (
								<Home />
							)
						}
					/>
					<Route
						path='/delete_forum'
						element={
							token && decodedToken.role === 'SUPER_ADMIN' ? (
								<DeleteForum />
							) : (
								<Home />
							)
						}
					/>
					<Route path='/topics' element={<Topics />} />
					<Route path='/chat' element={<Chat />} />
					<Route path='/find_topic' element={<FindTopic />} />
				</Routes>
			</div>
		</Router>
	)
}

export default App

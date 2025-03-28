import React, { createContext } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import 'bootstrap/dist/css/bootstrap.min.css'
import './css/Background.css'
import './css/Navbar.css'

const root = ReactDOM.createRoot(document.getElementById('root'))

root.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>
)

import React, { useEffect, useState } from 'react'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Login from './components/Login'
import Registration from './components/Registration'
import Main from './components/Main'
import Cookies from 'js-cookie'
import Feedback from './components/Feedback'
import Navbar from './components/Navbar'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/sign-in" element={<Login />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/feedback" element={<Feedback />} />
      </Routes>
    </Router>
  )
}

export default App

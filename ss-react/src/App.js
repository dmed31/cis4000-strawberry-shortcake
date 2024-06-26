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
import Gallery from './components/Gallery'
import Camera from './components/Camera'
import ExternalImageLink from './components/ExternalImageLink'
import FeedbackTable from './components/FeedbackTable'
import ApplyFilter from './components/ApplyFilter'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/sign-in" element={<Login />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/feedbackTable" element={<FeedbackTable />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/externalImageLink" element={<ExternalImageLink />} />
        <Route path="/applyFilter/:imageId" element={<ApplyFilter />} />
        <Route path="/camera" element={<Camera />} />
      </Routes>
    </Router>
  )
}

export default App

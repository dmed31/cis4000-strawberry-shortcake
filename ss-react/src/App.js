import React, { useEffect, useState } from 'react'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Login from './components/Login'
import Registration from './components/Registration'
import Main from './components/Main'
import Cookies from 'js-cookie'
import Feedback from './components/Feedback'

const App = () => {
  const handleLogout = () => {
    Cookies.remove('id');
    Cookies.remove('firstName');
    Cookies.remove('lastName');
    Cookies.remove('email');
  }

  return (
    <Router>
      <div className="App">
        <nav className="navbar navbar-expand-lg navbar-light fixed-top">
          <div className="container">
            <Link className="navbar-brand" to={'/main'}>
              Strawberry Shortcake
            </Link>
            <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
              <ul className="navbar-nav ml-auto">
                {/* <li className="nav-item">
                  <Link className="nav-link" to={'/sign-in'}>
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to={'/registration'}>
                    Sign up
                  </Link>
                </li> */}
                <li className="nav-item">
                  <Link className="nav-link" to={'/sign-in'} onClick={handleLogout}>
                    Log Out
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to={'/feedback'}>
                    Leave feedback
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
        <div className="auth-wrapper">
          <div className="auth-inner">
            <Routes>
              <Route exact path="/" element={<Login />} />
              <Route path="/sign-in" element={<Login />} />
              <Route path="/registration" element={<Registration />} />
              <Route path="/main" element={<Main />} />
              <Route path="/feedback" element={<Feedback />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  )
}

export default App

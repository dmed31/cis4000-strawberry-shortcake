import React from 'react'
import { Link } from 'react-router-dom'

const Navbar = ({ loggedIn }) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light fixed-top">
      <div className="container">
        <Link className="navbar-brand" to={'/'}>
          Strawberry Shortcake
        </Link>
        <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
          {loggedIn && <ul className="navbar-nav ml-auto">
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
              <Link className="nav-link" to={'/sign-in'}>
                Log Out
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to={'/feedback'}>
                Leave feedback
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to={'/gallery'}>
                Gallery
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to={'/camera'}>
                Camera
              </Link>
            </li>
          </ul>}
        </div>
      </div>
    </nav>
  )
}

export default Navbar

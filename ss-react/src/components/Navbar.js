import React from 'react'
import { Link } from 'react-router-dom'
import { NavDropdown } from 'react-bootstrap'

const Navbar = ({ loggedIn }) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light fixed-top">
      <div className="container">
        <Link className="navbar-brand" to={'/'}>
          Strawberry Shortcake
        </Link>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDarkDropdown" aria-controls="navbarNavDarkDropdown" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
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
            <NavDropdown title="Upload Image" id="basic-nav-dropdown">
              <NavDropdown.Item>
                <Link className="dropdown-item" to={'/camera'}>
                  Camera
                </Link>
              </NavDropdown.Item>
              <NavDropdown.Item>
                <Link className="dropdown-item" to={'/externalImageLink'}>
                  External Link
                </Link>
              </NavDropdown.Item>
            </NavDropdown>
          </ul>}
        </div>
      </div>
    </nav>
  )
}

export default Navbar

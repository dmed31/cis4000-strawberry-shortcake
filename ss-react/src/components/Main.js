import React, { useEffect } from 'react'
import Cookies from 'js-cookie'
import { Form, Button, FloatingLabel } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom';
import config from '../config.json';
import Navbar from './Navbar';

const Main = () => {
  const firstName = Cookies.get('firstName');
  const lastName = Cookies.get('lastName');
  const admin = Cookies.get('admin');
  console.log(typeof(admin))
  const navigate = useNavigate();
  useEffect(() => {
    const id = Cookies.get('id');
    if (!id) {
      navigate('/sign-in');
    }
  })
  return (
    <div className="App">
      <Navbar loggedIn={true}/>
      <div className="auth-wrapper">
        <div className="auth-inner">
          <div>Welcome {firstName} {lastName}!</div>
          {admin === "1" && <div>This is the admin dashboard.</div>}
        </div>
      </div>
    </div>
  )
}

export default Main
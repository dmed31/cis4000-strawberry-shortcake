import React, { useEffect } from 'react'
import Cookies from 'js-cookie'
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

const Main = () => {
  const firstName = Cookies.get('firstName');
  const lastName = Cookies.get('lastName');
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
        </div>
      </div>
    </div>
  )
}

export default Main

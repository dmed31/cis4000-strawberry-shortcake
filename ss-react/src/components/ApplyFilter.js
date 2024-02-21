import React, { useEffect } from 'react'
import Cookies from 'js-cookie'
import config from '../config.json';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

const ApplyFilter = () => {
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
        Under construction!
      </div>
    </div>
  )
}

export default ApplyFilter

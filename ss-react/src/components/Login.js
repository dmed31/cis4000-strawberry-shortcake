import React, { Component, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import config from '../config.json'
import logo from './Logo.png'

const Login = () => {
  const navigate = useNavigate();
  const login = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    let fetchBody = {};
    fetchBody['email'] = formData.get('email');
    fetchBody['password'] = formData.get('password');
    fetch(`http://${config.server_host}:${config.server_port}/login`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(fetchBody)
    })
      .then(res => res.json())
      .then(data => {
        if (data['status'] !== 'success') {
          if (data['reason'] === 'notFound') {
            alert('Incorrect username and password.');
          } else {
            alert('An error occurred. Please check that all fields are inputted correctly.');
          }
        } else {
          const userInfo = data['data'][0];
          Cookies.set('email', userInfo['email'], { expires: 1 });
          Cookies.set('firstName', userInfo['firstName'], { expires: 1 });
          Cookies.set('lastName', userInfo['lastName'], { expires: 1 });
          Cookies.set('id', userInfo['id'], { expires: 1 });
          navigate('/main');
        }
      })

  }

  useEffect(() => {
    Cookies.remove('id');
    Cookies.remove('firstName');
    Cookies.remove('lastName');
    Cookies.remove('email');
  }, []);

  return (
    <form onSubmit={login}>
      <div className="image-container">
        <img src={logo} alt="logo.png" width={150} height={150} />
      </div>
      <h3>Sign In</h3>
      <div className="mb-3">
        <label>Email address</label>
        <input
          name="email"
          type="email"
          className="form-control"
        />
      </div>
      <div className="mb-3">
        <label>Password</label>
        <input
          name="password"
          type="password"
          className="form-control"
        />
      </div>
      <div className="d-grid">
        <button type="submit" className="btn btn-primary">
          Log In
        </button>
        <button type="submit" className="btn btn-primary" onClick={() => navigate('/registration')}>
          Sign Up
        </button>
      </div>
      {/* <p className="forgot-password text-right">
        Forgot <a href="#">password?</a>
      </p> */}
    </form>
  )
}

export default Login

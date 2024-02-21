import React, { Component, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import config from '../config.json'
import logo from './Logo.png'
import Navbar from './Navbar'

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
          Cookies.set('admin', userInfo['admin'], { expires: 1 });
          navigate('/');
        }
      })

  }

  useEffect(() => {
    Cookies.remove('id');
    Cookies.remove('firstName');
    Cookies.remove('lastName');
    Cookies.remove('email');
  });

  return (
    <div className="App">
      <Navbar loggedIn={false}/>
      <div className="auth-wrapper">
      <form onSubmit={login} className="text-center">
        <div className="image-container mb-3">
          <img src={logo} alt="logo.png" width={150} height={150} style={{ marginBottom: '80px' }}/>
        </div>
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="mb-3 d-flex justify-content-center">
              <div className="d-flex flex-column align-items-start mb-3">
                <label>Email</label>
                <input
                  name="email"
                  type="email"
                  className="form-control rounded"
                  style={{ width: '320px', margin: 'auto', borderWidth: '1px', borderColor: '#000000'}}
                />
              </div>
            </div>
            <div className="mb-3 d-flex justify-content-center">
              <div className="d-flex flex-column align-items-start mb-3">
                <label>Password</label>
                <input
                  name="password"
                  type="password"
                  className="form-control rounded"
                  style={{ width: '320px', margin: 'auto', borderWidth: '1px', borderColor: '#000000'}}
                />
              </div>
            </div>
            <div className="mb-3">
              <button type="submit" className="btn btn-primary btn-md btn-block rounded-pill" 
              style={{ width: '200px', height: '45px', backgroundColor: '#D9D9D9', borderColor: '#D9D9D9', color: '#000000'}}>
                Log In
              </button>
            </div>
            <div className="mb-3">
              <button type="button" className="btn btn-primary btn-md btn-block rounded-pill" 
              style={{ width: '200px', height: '45px', backgroundColor: '#FFFFFF', borderColor: '#D9D9D9', color: '#000000'}} onClick={() => navigate('/registration')}>
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </form>

      </div>
    </div>
  )
}

export default Login

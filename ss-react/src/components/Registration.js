import React, { Component, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie'
import config from '../config.json'
import Navbar from './Navbar';

const Registration = () => {
  const navigate = useNavigate();
  const register = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    if (formData.get('password') !== formData.get('passwordCheck')) {
      alert('Passwords do not match!');
      return;
    }
    let fetchBody = {};
    fetchBody['email'] = formData.get('email');
    fetchBody['password'] = formData.get('password');
    fetchBody['firstName'] = formData.get('firstName');
    fetchBody['lastName'] = formData.get('lastName');
    fetch(`http://${config.server_host}:${config.server_port}/signup`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(fetchBody)
    })
      .then(res => res.json())
      .then(data => {
        if (data['status'] !== 'success') {
          if (data['reason'] === 'duplicate') {
            alert('An account with that email already exists.');
          } else {
            alert('An error occurred. Please check that all fields are inputted correctly.');
          }
        } else {
          alert('Successfully registered account!');
          navigate('/sign-in');
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
          <form onSubmit={register} className="text-center">
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
                      required
                    />
                  </div>
                </div>
                <div className="mb-3 d-flex justify-content-center">
                  <div className="d-flex flex-column align-items-start mb-3">
                    <label>First Name</label>
                    <input
                      name="firstName"
                      type="text"
                      className="form-control rounded"
                      style={{ width: '320px', margin: 'auto', borderWidth: '1px', borderColor: '#000000'}}
                      required
                    />
                  </div>
                </div>
                <div className="mb-3 d-flex justify-content-center">
                  <div className="d-flex flex-column align-items-start mb-3">
                    <label>Last Name</label>
                    <input
                      name="lastName"
                      type="text" 
                      className="form-control rounded"
                      style={{ width: '320px', margin: 'auto', borderWidth: '1px', borderColor: '#000000'}}
                      required
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
                      required
                    />
                  </div>
                </div>
                <div className="mb-3 d-flex justify-content-center">
                  <div className="d-flex flex-column align-items-start mb-3">
                    <label>Confirm Password</label>
                    <input
                      name="passwordCheck"
                      type="password"
                      className="form-control rounded"
                      style={{ width: '320px', margin: 'auto', borderWidth: '1px', borderColor: '#000000'}}
                      required
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <button type="button" className="btn btn-primary btn-md btn-block rounded-pill" 
                  style={{ width: '200px', height: '45px', backgroundColor: '#FFFFFF', borderColor: '#D9D9D9', color: '#000000', marginTop: '30px'}} onClick={() => navigate('/registration')}>
                    Sign Up
                  </button>
                </div>
                <p className="forgot-password text-center">
                  <a href="/sign-in">Already registered?</a>
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
  )
}

export default Registration

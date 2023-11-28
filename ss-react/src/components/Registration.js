import React, { Component, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie'
import config from '../config.json'

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
  }, []);

  return (
    <form onSubmit={register}>
      <h3>Sign Up</h3>
      <div className="mb-3">
        <label>Email</label>
        <input
          name="email"
          type="email"
          className="form-control"
          required
        />
      </div>
      <div className="mb-3">
        <label>First name</label>
        <input
          name="firstName"
          type="text"
          className="form-control"
          required
        />
      </div>
      <div className="mb-3">
        <label>Last name</label>
        <input
          name="lastName"
          type="text" 
          className="form-control"
          required 
        />
      </div>
      <div className="mb-3">
        <label>Password</label>
        <input
          name="password"
          type="password"
          className="form-control"
          required
        />
      </div>
      <div className="mb-3">
        <label>Confirm Password</label>
        <input
          name="passwordCheck"
          type="password"
          className="form-control"
          required
        />
      </div>
      <div className="d-grid">
        <button type="submit" className="btn btn-primary">
          Sign Up
        </button>
      </div>
      <p className="forgot-password text-right">
        <a href="/sign-in">Already registered?</a>
      </p>
    </form>
)
}

export default Registration

import React, { Component } from 'react'
import { useNavigate } from 'react-router-dom'
import logo from './Logo.png'

const Login = () => {
  const navigate = useNavigate();
  return (
    <form>
      <div className="image-container">
        <img src={logo} width={150} height={150}></img>
      </div>
      <h3>Sign In</h3>
      <div className="mb-3">
        <label>Email address</label>
        <input
          type="email"
          className="form-control"
        />
      </div>
      <div className="mb-3">
        <label>Password</label>
        <input
          type="password"
          className="form-control"
        />
      </div>
      <div className="d-grid">
        <h2/>
        <h2/>
        <h2/>
        <h2/>
        <button type="submit" className="btn btn-primary">
          Log In
        </button>
        <h2/>
        <h2/>
        <h2/>
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

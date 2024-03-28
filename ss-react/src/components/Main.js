import React, { useEffect } from 'react'
import Cookies from 'js-cookie'
import { Form, Button, FloatingLabel } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom';
import config from '../config.json';
import logo from './Logo.png'
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
        <div className="image-container mb-3">
          <img src={logo} alt="logo.png" width={150} height={150} style={{ marginBottom: '50px'}}/>
        </div>
        <div className="text-center" style={{ marginBottom: '50px'}}>
          Welcome to the filter lab{admin === "1" && " admin view"}! Through this application, you can:
        </div>
        <ol className="text-left mx-auto" style={{ maxWidth: "400px" }}>
        { admin === "0" ? <>
          <li className="mb-3">
            <a href="/camera">Take photos</a> with your camera 
            or <a href="/externalImageLink">upload an image</a> via URL.
          </li>
          <li className="mb-3">
            View all photos, original or generated, in <a href="/gallery">the gallery</a>!
          </li>
          <li className="mb-3">Apply a filter after taking an image or in the gallery.</li>
          <li className="mb-3">
            Provide specific feedback on photos in the gallery 
            and <a href="/feedback">general feedback</a> about the filters or website.
          </li>
        </> : <>
          <li className="mb-3">View all <a href="/gallery">user-submitted images</a>.</li>
          <li className="mb-3">View all <a href="/feedbackTable">user-submitted feedback</a>.</li>
        </> }
        </ol>
      </div>
    </div>
  )
}

export default Main
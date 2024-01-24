import React, { useEffect } from 'react'
import Cookies from 'js-cookie'
import { Form, Button, FloatingLabel } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom';
import config from '../config.json';
import Navbar from './Navbar';

const Main = () => {
  const firstName = Cookies.get('firstName');
  const lastName = Cookies.get('lastName');
  const navigate = useNavigate();
  const saveImage = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    let fetchBody = {};
    fetchBody['url'] = formData.get('imageUrl');
    fetchBody['userId'] = Cookies.get('id');
    fetch(`http://${config.server_host}:${config.server_port}/saveOriginalImage`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(fetchBody)
    })
      .then(res => res.json())
      .then(data => {
        if (data['status'] !== 'success') {
          alert('An error occurred while saving the image. Please try again.');
        } else {
          alert('Successfully saved image!');
        }
      })
  }
  useEffect(() => {
    const id = Cookies.get('id');
    // if (!id) {
    //   navigate('/sign-in');
    // }
  })
  return (
    <div className="App">
      <Navbar loggedIn={true}/>
      <div className="auth-wrapper">
        <div className="auth-inner">
          <div>Welcome {firstName} {lastName}!</div>
          <div>Type the url for an image below to save it to your account.</div>
          <Form autoComplete="off" className="" onSubmit={saveImage}>
            <FloatingLabel label="Image Url" className="dense mb-3">
              <Form.Control
                as="textarea"
                name="imageUrl"
                placeholder="Image Url"
                style={{ height: 50 }}
              />
            </FloatingLabel>
            <div className="d-flex justify-content-center align-items-center">
                <Button
                  style={{ backgroundColor: '#D9D9D9', color: '#000000',  borderColor: '#D9D9D9', fontSize:'14px'}}
                  size="lg"
                  type="submit"
                  className="rounded-pill"
                >
                  Save Image
                </Button>
              </div>
          </Form>
        </div>
      </div>
    </div>
  )
}

export default Main
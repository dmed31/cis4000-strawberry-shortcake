import React, { useEffect } from 'react'
import Cookies from 'js-cookie'
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import PhotoAlbum from 'react-photo-album'
import config from '../config.json'
import Webcam from "react-webcam";
import { Button } from 'react-bootstrap';
import { v4 as uuidv4 } from 'uuid';
import { useCallback, useRef, useState } from "react"; // import useCallback

const Camera = () => {
  const webcamRef = useRef(null); // create a webcam reference
  const [imgSrc, setImgSrc] = useState(null); // initialize it
  const navigate = useNavigate();

   // create a capture function
  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImgSrc(imageSrc);
  }, [webcamRef]);
  const resetCamera = () => { setImgSrc(null); }
  const saveImage = () => {
    let fetchBody = {};
    fetchBody['imageData'] = imgSrc;
    fetchBody['userId'] = Cookies.get('id');
    fetchBody['imageId'] = uuidv4()
    fetch(`http://${config.server_host}:${config.server_port}/saveOriginalImage`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(fetchBody)
    })
      .then(res => res.json())
      .then(data => {
        if (data['status'] === 'success') {
          alert('Successfully saved image!');
          navigate('/');
        } else if (data['status'] === 'rdsFailure') {
          alert('An error occurred while saving the image to RDS. Please try again.');
        } else {
          alert('An error occurred while saving the image to S3. Please try again.');
        }
      })
  }
  useEffect(() => {
    const id = Cookies.get('id');
    if (!id) {
      navigate('/sign-in');
    }
  })
  return (
    <div className="App">
      <Navbar loggedIn={true}/>
      <div className="container">
        {imgSrc ? (
          <img src={imgSrc} alt="webcamImg" />
        ) : (
          <Webcam height={600} width={600} ref={webcamRef} mirrored={true} screenshotFormat="image/jpeg"/>
        )}
        <div className="btn-container">
          {imgSrc ?
            <>
            <div className="text-center mb-4">
              <Button onClick={resetCamera} className="mr-3 rounded-pill" 
              style={{ width: '150px', height: '45px', backgroundColor: '#D9D9D9', 
              borderColor: '#D9D9D9', color: '#000000', marginTop: '30px' }}>
                  Retake Photo
              </Button>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <Button className="rounded-pill" 
              style={{ width: '150px', height: '45px', backgroundColor: '#D9D9D9', 
              borderColor: '#D9D9D9', color: '#000000', marginTop: '30px'}}>
                  Apply Filter
              </Button>
            </div>
            <Button onClick={saveImage} className="rounded-pill" 
            style={{ width: '150px', height: '45px', backgroundColor: 'white', 
            borderColor: '#D9D9D9', color: '#000000'}}>Save Image</Button>
            </> :
            <Button onClick={capture}className="rounded-pill" 
            style={{ width: '150px', height: '45px', backgroundColor: '#D9D9D9', 
            borderColor: '#D9D9D9', color: '#000000'}}>
              Take photo
            </Button>}
        </div>
      </div>
    </div>
  );
};
  
  export default Camera;
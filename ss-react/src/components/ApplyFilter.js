import React, { useState, useEffect } from 'react'
import Cookies from 'js-cookie'
import config from '../config.json';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import { Button } from 'react-bootstrap';

const ApplyFilter = ({ imageId, imageUrl }) => {
  const navigate = useNavigate();
  const [status, setStatus] = useState(0);
  const [outputUrl, setOutputUrl] = useState("");
  useEffect(() => {
    const id = Cookies.get('id');
    if (!id) {
      navigate('/sign-in');
    }
  })
  
  const runFilter = () => {
    setStatus(1);
    let fetchBody = {};
    fetchBody['userId'] = Cookies.get('id');
    fetchBody['originalImageId'] = imageId;
    fetchBody['url'] = imageUrl;

    fetch(`http://${config.server_host}:${config.server_port}/saveFilteredImage`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(fetchBody)
    })
      .then(res => res.json())
      .then(data => {
        if (data['status'] !== 'success') {
          alert('An error occurred in the filtering process. Please try again.');
          navigate('/');
        } else {
          setStatus(2);
          setOutputUrl(data['newImageUrl'])         
          alert('Successfully saved filtered image!');
        }
      })
  }

  return (
    <div className="App">
      <Navbar loggedIn={true}/>
      <div className="auth-wrapper text-center">
        {status === 0 &&
        <div>
          <img src={imageUrl} alt="OriginalImg" width="500px"/>
          <p>Click the button below to start the filter process for the above image!</p>
          <Button onClick={runFilter} className="rounded-pill" 
            style={{ width: '150px', height: '45px', backgroundColor: '#CACACA', 
            borderColor: '#D9D9D9', color: '#000000'}}>Apply Filter</Button>
        </div>}
        {status === 1 &&
        "Applying filter to image, please wait..."}
        {status === 2 &&<div>
        <img src={outputUrl} alt="OutputImg" width="500px"/>
        <p>This was the output for the filter.</p>
        </div>}
      </div>
    </div>
  )
}

export default ApplyFilter

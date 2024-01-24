import React, {useEffect } from 'react'
import Cookies from 'js-cookie'
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import PhotoAlbum from 'react-photo-album'
import config from '../config.json'
import Webcam from "react-webcam";
import { useCallback, useRef, useState } from "react"; // import useCallback

const Camera = () => {
    const webcamRef = useRef(null); // create a webcam reference
    const [imgSrc, setImgSrc] = useState(null); // initialize it

     // create a capture function
  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImgSrc(imageSrc);
  }, [webcamRef]);

  return (
    <div className="container">
      {imgSrc ? (
        <img src={imgSrc} alt="webcam" />
      ) : (
        <Webcam height={600} width={600} ref={webcamRef} />
      )}
      <div className="btn-container">
        <button onClick={capture}>Capture photo</button>
      </div>
    </div>
  );
};
  
  export default Camera;
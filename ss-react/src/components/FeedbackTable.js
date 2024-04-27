import React, { useState, useEffect } from 'react'
import Cookies from 'js-cookie'
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import config from '../config.json'

const FeedbackTable = () => {
  const admin = Cookies.get('admin');
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState([]);
  useEffect(() => {
    const id = Cookies.get('id');
    if (!id) {
      navigate('/sign-in');
    }
    if (!admin) {
      navigate('/');
    }
    fetch(`http://${config.server_host}:${config.server_port}/getAllFeedback`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data['status'] !== 'success') {
          alert('An error occurred while retrieving the feedback. Please try again.');
        } else {
          console.log(data['data']);
          setFeedback(data['data']);
        }
      })
  }, [])
  return (
    <div className="App">
      <Navbar loggedIn={true}/>
      <br /> 
        <br />
        <br />
        <br />
      <div className="auth-heading">
        <table class="table table-image">
          <thead>
            <tr>
              <th>Feedback Type</th>
              <th>Name</th>
              <th>Feedback</th>
              <th>{"Validity Rating (if applicable)"}</th>
              <th>{"Satisfaction Rating (if applicable)"}</th>
              <th>{"Filter Prompt (if applicable)"}</th>
              <th>{"Image (if applicable)"}</th>
              <th>{"Base Image (if applicable)"}</th>
            </tr>
          </thead>
          <tbody>
            {feedback.map(f => (
              <tr>
                <td>{f.feedbackType}</td>
                <td>{f.firstName} {f.lastName}</td>
                <td>{f.feedbackText}</td>
                <td>{f.ratingOne == 0 ? "N/A" : f.ratingOne}</td>
                <td>{f.ratingTwo == 0 ? "N/A" : f.ratingTwo}</td>
                <td>{f.filterPrompt ? f.filterPrompt : "N/A"}</td>
                <td className="w-25">
                  {!f.newUrl ? "N/A" : <img src={f.newUrl} alt="FeedbackImage" className="img-fluid img-thumbnail" />}
                </td>
                <td className="w-25">
                  {!f.originalUrl ? "N/A" : <img src={f.originalUrl} alt="FeedbackImage" className="img-fluid img-thumbnail" />}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <br /> 
        <br />
        <br />
        <br />
    </div>
  )
}

export default FeedbackTable

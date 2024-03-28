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
      <div className="auth-wrapper">
        <table class="table table-image">
          <thead>
            <tr>
              <th>Feedback Type</th>
              <th>Name</th>
              <th>Feedback</th>
              <th>{"Rating (if applicable)"}</th>
              <th>{"Image (if applicable)"}</th>
            </tr>
          </thead>
          <tbody>
            {feedback.map(f => (
              <tr>
                <td>{f.feedbackType}</td>
                <td>{f.firstName} {f.lastName}</td>
                <td>{f.feedbackText}</td>
                <td>{f.rating == 0 ? "N/A" : f.rating}</td>
                <td className="w-25">
                  {!f.url ? "N/A" : <img src={f.url} alt="FeedbackImage" className="img-fluid img-thumbnail" />}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default FeedbackTable

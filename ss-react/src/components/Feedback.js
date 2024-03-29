import React, { useState, useEffect } from "react";
import { Col, FloatingLabel, Form, Row, Button } from "react-bootstrap";
import * as bd from "react-basic-design";
import Navbar from "./Navbar";
import Cookies from 'js-cookie'
import config from '../config.json';
import { useNavigate } from "react-router-dom";
import Rating from "react-rating-stars-component";

const Feedback = () => {
  const navigate = useNavigate();
  const [dropdownRating, setDropdownRating] = useState('');
  const saveFeedback = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    let fetchBody = {};
    fetchBody['feedbackType'] = formData.get('type');
    fetchBody['feedbackOne'] = formData.get('question1');
    fetchBody['feedbackTwo'] = formData.get('question2');
    fetchBody['feedbackThree'] = formData.get('question3');
    fetchBody['dropdownRating'] = dropdownRating;
    fetchBody['userId'] = Cookies.get('id');
    fetch(`http://${config.server_host}:${config.server_port}/addBasicFeedback`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(fetchBody)
    })
      .then(res => res.json())
      .then(data => {
        if (data['status'] !== 'success') {
          alert('An error occurred. Please check that all fields are inputted correctly.');
        } else {
          alert('Successfully submitted feedback!');
          navigate('/');
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
      <div className="auth-wrapper">
        <div className="auth-inner">
          <bd.Paper className="p-3 my-3 mx-auto" style={{ maxWidth: 600 }}>
            <Form autoComplete="off" className="" onSubmit={saveFeedback}>
              <div className="text-primary text-center mb-4">
                <h3 className="mt-3"  style={{color:'black'}}>Image Feedback</h3>
              </div>

              {/* <FloatingLabel label="Email address" className="dense has-icon mb-3">
                <Form.Control
                  name="email"
                  type="email"
                  value={Cookies.get('email')}
                  disabled
                  readonly
                />
              </FloatingLabel> */}

              {/* <Row>
                <Col md>
                  <FloatingLabel label="Full Name" className="dense mb-3">
                    <Form.Control
                      name="fullName"
                      type="text"
                      value={`${Cookies.get('firstName')} ${Cookies.get('lastName')}`}
                      disabled
                      readonly
                    />
                  </FloatingLabel>
                </Col>

                <Col md>
                  <FloatingLabel label="Type" className="dense mb-3">
                    <Form.Select name="type" placeholder="Type">
                      <option>Suggestion</option>
                      <option>Bug Report</option>
                      <option>Others</option>
                    </Form.Select>
                  </FloatingLabel>
                </Col>
              </Row> */}

              {/* <FloatingLabel label="Type" className="dense mb-3">
                <Form.Select name="type" placeholder="Type">
                  <option value="suggestion">Suggestion</option>
                  <option value="bugReport">Bug Report</option>
                  <option value="others">Others</option>
                </Form.Select>
              </FloatingLabel> */}

              <FloatingLabel label="Rate the quality of the filtered image:" className="dense mb-3">
                <Form.Select
                  name="dropdownRating"
                  value={dropdownRating}
                  onChange={(e) => setDropdownRating(e.target.value)}
                >
                  <option value="">Select rating:</option>
                  <option value="1">⭐</option>
                  <option value="2">⭐⭐</option>
                  <option value="3">⭐⭐⭐</option>
                  <option value="4">⭐⭐⭐⭐</option>
                  <option value="5">⭐⭐⭐⭐⭐</option>
                </Form.Select>
              </FloatingLabel>

              <FloatingLabel label="Pros of the filtered image?" className="dense mb-3">
                <Form.Control
                  as="textarea"
                  name="question1"
                  placeholder=""
                  style={{ height: 50 }}
                />
              </FloatingLabel>

              <FloatingLabel label="What bias do you detect (if any)?" className="dense mb-3">
                <Form.Control
                  as="textarea"
                  name="question2"
                  placeholder=""
                  style={{ height: 50 }}
                />
              </FloatingLabel>

              <FloatingLabel label="Any additional thoughts?" className="dense mb-3">
                <Form.Control
                  as="textarea"
                  name="question3"
                  placeholder=""
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
                  Submit
                </Button>
              </div>
            </Form>
          </bd.Paper>
        </div>
      </div>
    </div>
  );

}

export default Feedback;

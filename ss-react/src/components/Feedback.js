import React, { useEffect } from "react";
import { Col, FloatingLabel, Form, Row, Button } from "react-bootstrap";
import * as bd from "react-basic-design";
import Navbar from "./Navbar";
import Cookies from 'js-cookie'
import config from '../config.json';
import { useNavigate } from "react-router-dom";

const Feedback = ({ imageId, imageUrl, originalImageId }) => {
  const navigate = useNavigate();
  const saveFeedback = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    if (formData.get('feedbackText') == "") {
      alert("Please input text in the feedback section.");
      return;
    }
    let fetchBody = {};
    fetchBody['feedbackType'] = formData.get('type') ?? "Image";
    fetchBody['feedbackText'] = formData.get('feedbackText');
    fetchBody['ratingOne'] = formData.get('ratingOne');
    fetchBody['ratingTwo'] = formData.get('ratingTwo');
    if (imageId) {
      fetchBody['imageId'] = imageId;
    }
    if (originalImageId) {
      fetchBody['originalImageId'] = originalImageId;
    }
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
      <Navbar loggedIn={true}/>
      <div className="auth-wrapper">
        <div className="auth-inner">
          <bd.Paper className="p-3 my-3 mx-auto" style={{ maxWidth: 600 }}>
            <Form autoComplete="off" className="" onSubmit={saveFeedback}>
              <div className="text-primary text-center mb-4">
                <h3 className="mt-3"  style={{color:'black'}}>{imageId && "Image "}Feedback</h3>
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

              {imageUrl && <><img src={imageUrl} alt="FeedbackImg" style={{objectFit: "contain", width: '308px'}}/><br />
              <br /></>}
              {!imageId && <FloatingLabel label="Type" className="dense mb-3">
                <Form.Select name="type" placeholder="Type">
                  <option value="Suggestion">Suggestion</option>
                  <option value="Bug Report">Bug Report</option>
                  <option value="Other">Other</option>
                </Form.Select>
              </FloatingLabel>}

              <FloatingLabel label="Feedback" className="dense mb-3">
                <Form.Control
                  as="textarea"
                  name="feedbackText"
                  placeholder="Feedback"
                  style={{ height: 50 }}
                />
              </FloatingLabel>

              {/* <FloatingLabel label="Question 2" className="dense mb-3">
                <Form.Control
                  as="textarea"
                  name="question2"
                  placeholder="Question 2"
                  style={{ height: 50 }}
                />
              </FloatingLabel>

              <FloatingLabel label="Question 3" className="dense mb-3">
                <Form.Control
                  as="textarea"
                  name="question3"
                  placeholder="Question 3"
                  style={{ height: 50 }}
                />
              </FloatingLabel> */}
              
              {imageId && 
              <>
              <br />
              <p> Is the output image what you expected? </p>
              <FloatingLabel label="Validity Rating" className="dense mb-3">
                <Form.Select
                  name="ratingOne"
                  placeholder="ratingOne"
                >
                  <option value={0}>Select rating</option>
                  <option value={1}>1 - Not at all what I expected</option>
                  <option value={2}>2 - Somewhat what I expected </option>
                  <option value={3}>3 - Adequately what I expected </option>
                  <option value={4}>4 - Mostly what I expected</option>
                  <option value={5}>5 - Exactly what I expected</option>
                </Form.Select>
              </FloatingLabel>
              <br />
              <p> How satisfied are you with the output image? </p>
              <FloatingLabel label="Satisfaction Rating" className="dense mb-3">
                <Form.Select
                  name="ratingTwo"
                  placeholder="ratingTwo"
                >
                  <option value={0}>Select rating</option>
                  <option value={1}>1 - Not satisfied at all </option>
                  <option value={2}>2 - Somewhat satisfied </option>
                  <option value={3}>3 - Adequately satisfied </option>
                  <option value={4}>4 - Mostly satisfied </option>
                  <option value={5}>5 - Very satisfied</option>
                </Form.Select>
              </FloatingLabel>
            </>
              }

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

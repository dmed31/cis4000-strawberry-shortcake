import React, { useState, useEffect } from 'react'
import Cookies from 'js-cookie'
import { Button, Modal } from "react-bootstrap"
import PhotoAlbum from 'react-photo-album'
import { useNavigate } from 'react-router-dom';
import { addToolbarButton, Lightbox } from "yet-another-react-lightbox";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";

import Navbar from './Navbar';
import ApplyFilter from './lightbox/ApplyFilter'
import EnterFeedback from './lightbox/EnterFeedback'
import config from '../config.json'
import FeedbackC from './Feedback'

const Gallery = () => {
  const admin = Cookies.get('admin');
  const navigate = useNavigate();
  const [urls, setUrls] = useState([]);
  const [index, setIndex] = useState(-1);
  const [isApplyingFilter, setIsApplyingFilter] = useState(false);
  const [isEnteringFeedback, setIsEnteringFeedback] = useState(false);

  const onFilterClick = () => {
    setIsApplyingFilter(!isApplyingFilter);
    setIsEnteringFeedback(false);
  }

  function Filter({ augment }) {
    augment(({ toolbar, ...restProps }) => ({
      toolbar: addToolbarButton(toolbar, "my-module", 
        <ApplyFilter
          clicked={isApplyingFilter} 
          onClick={onFilterClick} />),
      ...restProps,
    }));
  }

  const onFeedbackClick = () => {
    setIsApplyingFilter(false);
    setIsEnteringFeedback(!isEnteringFeedback);
  }

  function Feedback({ augment }) {
    augment(({ toolbar, ...restProps }) => ({
      toolbar: addToolbarButton(toolbar, "my-module", 
        <EnterFeedback 
          clicked={isEnteringFeedback}
          onClick={onFeedbackClick} />),
      ...restProps,
    }));
  }

  useEffect(() => {
    const id = Cookies.get('id');
    if (!id) {
      navigate('/sign-in');
    }
    if (admin === "1") {
      fetch(`http://${config.server_host}:${config.server_port}/getAllImages`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
      })
        .then(res => res.json())
        .then(data => {
          if (data['status'] !== 'success') {
            alert('An error occurred while retrieving the images. Please try again.');
          } else {
            const modifiedUrlList = data['data'].map(u => ({src: u.url, width: 400, height: 400}))
            setUrls(modifiedUrlList);
          }
        })
    } else {
      let fetchBody = {userId: id};
      fetch(`http://${config.server_host}:${config.server_port}/getAllUserImages`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(fetchBody)
    })
      .then(res => res.json())
      .then(data => {
        if (data['status'] !== 'success') {
          alert('An error occurred while retrieving the images. Please try again.');
        } else {
          const modifiedUrlList = data['data'].map(u => ({src: u.url, width: 400, height: 400}))
          setUrls(modifiedUrlList);
        }
      })
    }
  }, [])

  const pics = [
    { src: "https://lens-storage.storage.googleapis.com/previewimage/2c9a64f4-4406-4eaa-8718-bafcf97ad8fc_360_640", width: 400, height: 800},
    { src: 'https://images.wondershare.com/filmora/article-images/snapchat-cartoon-3d-filter-lens.jpg', width: 400, height: 800 },
    { src: "https://imageio.forbes.com/specials-images/imageserve/639fcff576cbed8923e81ff0/Lensa-s-AI-generated--magic-avatars-/960x0.jpg?format=jpg&width=1440", width: 800, height: 600 },
    { src: "https://imageio.forbes.com/specials-images/imageserve/639fcfb4ef6b8735909a89ff/Lensa-AI-generated-avatars-/960x0.jpg?format=jpg&width=1440", width: 800, height: 600},
    { src: "https://imageio.forbes.com/specials-images/imageserve/639fd0f876cbed8923e81ff2/Lensa-s-AI-generated-portrait-of-the-author-/960x0.jpg?format=jpg&width=1440", width: 800, height: 600},
    { src: "https://pics.craiyon.com/2023-11-14/60UmxA6eS9ubnjNgrdQ_ug.webp", width: 800, height: 800},
    { src: "https://assets-global.website-files.com/624ac40503a527cf47af4192/64959d16bc85a1e1f420919f_icon.png", width: 700, height: 700},
    { src: 'https://d.newsweek.com/en/full/1823238/snapchats-cartoon-3d-style-lens.webp?w=279&f=c23d04375fa0cca167579fdffb2e4b9a', width: 400, height: 800 },
    { src: "https://static.independent.co.uk/2021/06/17/13/Screenshot%202021-06-17%20at%2013.53.07.png?width=1200", width: 800, height: 600}
  ];

  //for when amazon links work

  /*const pics = [
    { src: "https://shortcake1-test.s3.amazonaws.com/1.jpeg", width: 400, height: 800},
    { src: 'https://shortcake1-test.s3.amazonaws.com/2.avif', width: 400, height: 800 },
    { src: "https://shortcake1-test.s3.amazonaws.com/3.webp", width: 800, height: 600 },
    { src: "https://shortcake1-test.s3.amazonaws.com/4.webp", width: 800, height: 600 },
    { src: "https://shortcake1-test.s3.amazonaws.com/5.webp", width: 800, height: 600 },
    { src: "https://shortcake1-test.s3.amazonaws.com/6.webp", width: 800, height: 800 },
    { src: "https://shortcake1-test.s3.amazonaws.com/7.png", width: 700, height: 700 },
    { src: 'https://shortcake1-test.s3.amazonaws.com/8.webp', width: 400, height: 800 },
    { src: "https://shortcake1-test.s3.amazonaws.com/9.avif", width: 800, height: 600 },
  ];*/
  return (
    <div className="App">
      <Navbar loggedIn={true}/>
      <div className="auth-wrapper">
        <div className="auth-heading">
            <h3> Welcome to the Gallery! </h3>
            <PhotoAlbum 
              layout="masonry" 
              photos={pics}
              onClick={({ index }) => setIndex(index)} 
            />

            <Lightbox
              slides={pics}
              open={(index >= 0) && (!isApplyingFilter && !isEnteringFeedback)}
              index={index}
              close={() => setIndex(-1)}
              // enable optional lightbox plugins
              plugins={[Feedback, Filter, Thumbnails]}
            />

            <Modal show={isApplyingFilter} onHide={onFilterClick} fullscreen={true}>
              <Modal.Header closeButton>
                <Modal.Title>Apply filter</Modal.Title>
              </Modal.Header>
              <Modal.Body>Apply filter here!</Modal.Body>
              <Modal.Footer>
                <Button variant="primary" onClick={onFilterClick}>
                  Generate
                </Button>
              </Modal.Footer>
            </Modal>

            <Modal show={isEnteringFeedback} onHide={onFeedbackClick} fullscreen={true}>
              <Modal.Header closeButton>
                <Modal.Title>Enter feedback</Modal.Title>
              </Modal.Header>
              <Modal.Body> <FeedbackC /></Modal.Body>
              <Modal.Footer>
                <Button variant="primary" onClick={onFeedbackClick}>
                  Submit
                </Button>
              </Modal.Footer>
            </Modal>
        </div>
      </div>

    </div>
  )
}

export default Gallery
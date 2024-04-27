const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const config = require('./config');
const routes = require('./routes');

const app = express();

const jsonParser = bodyParser.json();

app.use(cors({
  origin: '*',
}));

// ADD DATES TO FEEDBACK AND IMAGE TABLES

// ROUTES
// app.get('/getUser', jsonParser, routes.get_user);
app.post('/signup', jsonParser, routes.signup); // Used
app.post('/login', jsonParser, routes.login); // Used
app.post('/savePublicImage', jsonParser, routes.save_public_image); // Used
app.post('/saveOriginalImage', jsonParser, routes.save_original_image); // Used
app.post('/getAllUserImages', jsonParser, routes.get_all_user_images); // Used
app.post('/getAllImages', jsonParser, routes.get_all_images); // Used
app.post('/saveFilteredImage', jsonParser, routes.save_filtered_image);
app.post('/addBasicFeedback', jsonParser, routes.add_basic_feedback); // Used
app.post('/addMultiFeedback', routes.add_multi_feedback);
app.post('/getAllFeedback', jsonParser, routes.get_all_feedback); // Used

app.listen(config.server_port, () => {
  console.log(`Server running at http://${config.server_host}:${config.server_port}/`)
});

module.exports = app;
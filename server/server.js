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

// ROUTES
// app.get('/getUser', jsonParser, routes.get_user);
app.post('/signup', jsonParser, routes.signup);
app.post('/login', jsonParser, routes.login);
app.post('/saveOriginalImage', routes.save_original_image);
app.post('/saveFilteredImage', routes.save_filtered_image);
app.post('/addBasicFeedback', jsonParser, routes.add_basic_feedback);
app.post('/addMultiFeedback', routes.add_multi_feedback);

app.listen(config.server_port, () => {
  console.log(`Server running at http://${config.server_host}:${config.server_port}/`)
});

module.exports = app;
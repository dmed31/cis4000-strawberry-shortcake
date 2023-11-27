const express = require('express');
const cors = require('cors');
const config = require('./config');
const routes = require('./routes');

const app = express();

app.use(cors({
  origin: '*',
}));

// ROUTES
app.get('/userCheck', routes.user_check);
app.post('/signup', routes.signup);
app.get('/login', routes.login);
app.post('/saveOriginalImage', routes.save_original_image);
app.post('/saveFilteredImage', routes.save_filtered_image);
app.post('/addFeedback', routes.add_feedback);

app.listen(config.server_port, () => {
  console.log(`Server running at http://${config.server_host}:${config.server_port}/`)
});

module.exports = app;
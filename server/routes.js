const mysql = require('mysql');
const config = require('./config');
const { v4: uuidv4 } = require('uuid');

const connection = mysql.createConnection({
  host: config.rds_host,
  user: config.rds_user,
  password: config.rds_password,
  port: config.rds_port,
  database: config.rds_db
});

connection.connect((err) => err && console.log(err));

const user_check = async function(req, res) {
  connection.query(`
    SELECT email
    FROM users
    WHERE email == ${req.query.email}
  `, (err, data) => {
    if (err) {
      console.log(err);
      res.json({status: 'failure'});
    } else if (data.length === 0) {
      res.json({status: 'success', exists: 'false'});
    } else {
      res.json({status: 'success', exists: 'true'});
    }
  });
}

const signup = async function (req, res) {
  connection.query(`
    INSERT INTO users (id, email, password, firstName, lastName)
    VALUES (${uuidv4()}, ${req.query.email}, ${req.query.password}, ${req.query.firstName}, ${req.query.lastName})
  `, (err, data) => {
    if (err) {
      console.log(err);
      res.json({status: 'failure'});
    } else {
      res.json({status: 'success'});
    }
  });
}

const login = async function (req, res) {
  connection.query(`
    SELECT *
    FROM users
    WHERE ${req.query.email} == email AND ${req.query.password} == password
  `, (err, data) => {
    if (err) {
      console.log(err);
      res.json({status: 'failure'});
    } else if (data.length === 0) {
      res.json({status: 'success', found: 'false'});
    } else {
      res.json({status: 'success', found: 'true', data});
    }
  });
}

const save_original_image = async function (req, res) {
  connection.query(`
    INSERT INTO images (id, userId, url)
    VALUES (${uuidv4()}, ${req.query.userId}, ${req.query.url})
  `, (err, data) => {
    if (err) {
      console.log(err);
      res.json({status: 'failure'});
    } else {
      res.json({status: 'success'});
    }
  });
}

const save_filtered_image = async function (req, res) {
  connection.query(`
    INSERT INTO images (id, userId, originalImageId, url)
    VALUES (${uuidv4()}, ${req.query.userId}, ${req.query.originalImageId} ${req.query.url})
  `, (err, data) => {
    if (err) {
      console.log(err);
      res.json({status: 'failure'});
    } else {
      res.json({status: 'success'});
    }
  });
}

const add_feedback = async function (req, res) {
  const text = req.query.text ?? '';
  connection.query(`
    INSERT INTO feedback (id, userId, imageId, feedbackType, text)
    VALUES (${uuidv4()}, ${req.query.userId}, ${req.query.imageId}, ${req.query.feedbackType}, ${text})
  `, (err, data) => {
    if (err) {
      console.log(err);
      res.json({status: 'failure'});
    } else {
      res.json({status: 'success'});
    }
  });
}


module.exports = {
  user_check,
  signup,
  login,
  save_original_image,
  save_filtered_image,
  add_feedback
}
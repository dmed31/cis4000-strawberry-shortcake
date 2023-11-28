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

// const get_user = async function(req, res) {
//   connection.query(`
//     SELECT *
//     FROM users
//     WHERE email == '${req.query.email}'
//   `, (err, data) => {
//     if (err) {
//       console.log(err);
//       res.json({status: 'failure'});
//     } else if (data.length === 0) {
//       res.json({status: 'success', exists: 'false'});
//     } else {
//       res.json({status: 'success', exists: 'true'});
//     }
//   });
// }

const signup = async function (req, res) {
  connection.query(`
    SELECT email
    FROM users
    WHERE email = '${req.body.email}'
  `, (err, data) => {
    if (err) {
      console.log(err);
      res.json({status: 'failure', reason: 'error'});
    } else if (data.length !== 0) {
      res.json({status: 'failure', exists: 'duplicate'});
    } else {
      connection.query(`
        INSERT INTO users (id, email, password, firstName, lastName)
        VALUES ('${uuidv4()}', '${req.body.email}', '${req.body.password}', '${req.body.firstName}', '${req.body.lastName}')
      `, (err, data) => {
        if (err) {
          console.log(err);
          res.json({status: 'failure', reason: 'error'});
        } else {
          res.json({status: 'success'});
        }
      });
        }
      });
}

const login = async function (req, res) {
  connection.query(`
    SELECT *
    FROM users
    WHERE email = '${req.body.email}' AND password = '${req.body.password}'
  `, (err, data) => {
    if (err) {
      console.log(err);
      res.json({status: 'failure', reason: 'error'});
    } else if (data.length === 0) {
      res.json({status: 'failure', reason: 'notFound'});
    } else {
      res.json({status: 'success', data});
    }
  });
}

// NOT IN USE
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

// NOT IN USE
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

const add_basic_feedback = async function (req, res) {
  connection.query(`
    INSERT INTO feedback (id, userId, feedbackType, feedbackOne, feedbackTwo, feedbackThree)
    VALUES ('${uuidv4()}', '${req.body.userId}', '${req.body.feedbackType}', '${req.body.feedbackOne ?? ''}', '${req.body.feedbackTwo ?? ''}', '${req.body.feedbackThree ?? ''}')
  `, (err, data) => {
    if (err) {
      console.log(err);
      res.json({status: 'failure'});
    } else {
      res.json({status: 'success'});
    }
  });
}

// NOT IN USE
const add_multi_feedback = async function (req, res) {
  let sql = `INSERT INTO feedback (id, userId, imageId, feedbackType, text) `;
  const feedbackString = req.query.feedbackList
    .map((x) => `VALUES (${uuidv4()}, ${x.userId}, ${x.imageId}, ${x.feedbackType}, ${x.text ?? ''})`)
    .join(',\n');
  connection.query(
    'INSERT INTO feedback (id, userId, imageId, feedbackType, text)\n' + feedbackString
  , (err, data) => {
    if (err) {
      console.log(err);
      res.json({status: 'failure'});
    } else {
      res.json({status: 'success'});
    }
  });
}

module.exports = {
  // get_user,
  signup,
  login,
  save_original_image,
  save_filtered_image,
  add_basic_feedback,
  add_multi_feedback
}
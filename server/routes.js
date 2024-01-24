const mysql = require('mysql');
const config = require('./config');
const { v4: uuidv4 } = require('uuid');
const AWS = require('aws-sdk');

const s3 = new AWS.S3({
  accessKeyId: config.aws_access_key_id,
  secretAccessKey: config.aws_secret_access_key,
})
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
      res.json({status: 'failure', reason: 'duplicate'});
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

const save_public_image = async function (req, res) {
  connection.query(`
    INSERT INTO images (id, userId, url)
    VALUES ('${uuidv4()}', '${req.body.userId}', '${req.body.url}')
  `, (err, data) => {
    if (err) {
      console.log(err);
      res.json({status: 'failure'});
    } else {
      res.json({status: 'success'});
    }
  });
}
// Assume imgData, imgId, userId
const save_original_image = async function (req, res) {
  const buf = new Buffer.from(req.body.imageData.replace(/^data:image\/\w+;base64,/, ""), 'base64');
  const params = {
    Bucket: "cis4000-image-storage",
    Key: req.body.imageId + ".jpeg",
    Body: buf,
    ContentType: "image/jpeg",
    ContentEncoding: "base64"
  }
  try {
    await s3.upload(params).promise();
    const imageUrl = config.aws_image_base_path + "/" + req.body.imageId + ".jpeg";
    connection.query(`
      INSERT INTO images (id, userId, url)
      VALUES ('${req.body.imageId}', '${req.body.userId}', '${imageUrl}')
    `, (err, data) => {
      if (err) {
        console.log(err);
        res.json({status: 'rdsFailure'});
      } else {
        res.json({status: 'success'});
      }
    });
  } catch (err) {
    console.log(err);
    res.json({status: 's3Failure'});
  }
}

const get_all_user_images = async function (req, res) {
  connection.query(`
    SELECT url
    FROM images
    WHERE userId='${req.body.userId}'
  `, (err, data) => {
    if (err) {
      console.log(err);
      res.json({status: 'failure'});
    } else {
      res.json({status: 'success', data});
    }
  })
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
  save_public_image,
  save_original_image,
  get_all_user_images,
  save_filtered_image,
  add_basic_feedback,
  add_multi_feedback
}
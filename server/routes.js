const mysql = require('mysql');
const config = require('./config');
const { v4: uuidv4 } = require('uuid');
const AWS = require('aws-sdk');
const { SageMakerRuntimeClient, InvokeEndpointCommand } = require("@aws-sdk/client-sagemaker-runtime");
const { serialize, deserialize } = require("v8");

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

// UPDATED
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
        INSERT INTO users (id, email, password, firstName, lastName, admin)
        VALUES ('${uuidv4()}', '${req.body.email}', '${req.body.password}', '${req.body.firstName}', '${req.body.lastName}', 0)
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

// UPDATED
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

// ASDF
const save_public_image = async function (req, res) {
  connection.query(`
    INSERT INTO new_images (id, userId, url, time)
    VALUES ('${uuidv4()}', '${req.body.userId}', '${req.body.url}', NOW())
  `, (err, data) => {
    if (err) {
      console.log(err);
      res.json({status: 'failure'});
    } else {
      res.json({status: 'success'});
    }
  });
}

const get_all_user_images = async function (req, res) {
  connection.query(`
    SELECT A.id, A.originalImageId, A.url AS newUrl, B.url AS oldUrl, A.prompt AS filterPrompt
    FROM new_images A
    LEFT JOIN new_images B ON A.originalImageId = B.id
    WHERE A.userId='${req.body.userId}'
    ORDER BY A.time DESC
  `, (err, data) => {
    if (err) {
      console.log(err);
      res.json({status: 'failure'});
    } else {
      res.json({status: 'success', data});
    }
  })
}

const get_all_images = async function (req, res) {
  connection.query(`
    SELECT A.id, A.originalImageId, A.url AS newUrl, B.url AS oldUrl, A.prompt AS filterPrompt
    FROM new_images A
    LEFT JOIN new_images B ON A.originalImageId = B.id
    ORDER BY A.time DESC
  `, (err, data) => {
    if (err) {
      console.log(err);
      res.json({status: 'failure'});
    } else {
      res.json({status: 'success', data});
    }
  })
}

// ASDF
// Assume imgData, imgId, userId
const save_original_image = async function (req, res) {
  const buf = new Buffer.from(req.body.imageData.replace(/^data:image\/\w+;base64,/, ""), 'base64');
  console.log(req.body.imageData);
  console.log(buf);
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
      INSERT INTO new_images (id, userId, url, time)
      VALUES ('${req.body.imageId}', '${req.body.userId}', '${imageUrl}', NOW())
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

// ASDF
const save_filtered_image = async function (req, res) {
  const sagemakerClient = new SageMakerRuntimeClient({ region: "us-east-1",accessKeyId: config.aws_access_key_id,
  secretAccessKey: config.aws_secret_access_key });
  const prompt = req.body.prompt;
  console.log(prompt);
  const payload = {
    "img_url": req.body.url,
    "inputs": prompt
  };
  const input = {
    EndpointName: "huggingface-pytorch-inference-2024-04-19-11-56-32-278",
    Body: JSON.stringify(payload),
    ContentType: "application/json"
  };
  const command = new InvokeEndpointCommand(input);
  const response = await sagemakerClient.send(command);

  // console.log(responseJSON);
  const buf = new Buffer.from(response.Body, 'base64');
  const buf1 = buf + "";
  const finalresult = JSON.parse(buf1);
  const finalbody = finalresult['generated_images'][0];
  const finalbuf = new Buffer.from(finalbody, 'base64');
  // console.log(finalbuf);
  const filteredImageId = uuidv4();
  const params = {
    Bucket: "cis4000-image-storage",
    Key: filteredImageId + ".jpeg",
    Body: finalbuf,
    ContentType: "image/jpeg",
    ContentEncoding: "base64"
  }
  try {
    await s3.upload(params).promise();
    const imageUrl = config.aws_image_base_path + "/" + filteredImageId + ".jpeg";


    console.log(imageUrl);
    connection.query(`
      INSERT INTO new_images (id, userId, originalImageId, url, prompt, time)
      VALUES ('${filteredImageId}', '${req.body.userId}', '${req.body.originalImageId}', '${imageUrl}', '${prompt}', NOW())
    `, (err, data) => {
      if (err) {
        console.log(err);
        res.json({status: 'rdsFailure'});
      } else {
        res.json({status: 'success', newImageUrl: imageUrl});
      }
    });
  } catch (err) {
    console.log(err);
    res.json({status: 's3Failure'});
  }

  // connection.query(`
  //   INSERT INTO images (id, userId, originalImageId, url)
  //   VALUES (${uuidv4()}, ${req.body.userId}, ${req.body.originalImageId} ${req.body.url})
  // `, (err, data) => {
  //   if (err) {
  //     console.log(err);
  //     res.json({status: 'failure'});
  //   } else {
  //     res.json({status: 'success'});
  //   }
  // });
}

// ASDF
const add_basic_feedback = async function (req, res) {
  connection.query(`
    INSERT INTO new_feedback (id, userId, imageId, originalImageId, feedbackType, feedbackText, ratingOne, ratingTwo, time)
    VALUES ('${uuidv4()}', '${req.body.userId}', ${req.body.imageId ? `\'${req.body.imageId}\'` : 'null'}, ${req.body.originalImageId ? `\'${req.body.originalImageId}\'` : 'null'}, '${req.body.feedbackType}', '${req.body.feedbackText}', '${req.body.ratingOne}', '${req.body.ratingTwo}', NOW())
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
  let sql = `INSERT INTO new_feedback (id, userId, imageId, feedbackType, text) `;
  const feedbackString = req.query.feedbackList
    .map((x) => `VALUES (${uuidv4()}, ${x.userId}, ${x.imageId}, ${x.feedbackType}, ${x.text ?? ''})`)
    .join(',\n');
  connection.query(
    'INSERT INTO new_feedback (id, userId, imageId, feedbackType, text)\n' + feedbackString
  , (err, data) => {
    if (err) {
      console.log(err);
      res.json({status: 'failure'});
    } else {
      res.json({status: 'success'});
    }
  });
}

// ASDF
const get_all_feedback = async function (req, res) {
  connection.query(`
    SELECT C.url as newUrl, D.url AS originalUrl, firstName, lastName, feedbackType, feedbackText, ratingOne, ratingTwo, C.prompt AS filterPrompt
    FROM new_feedback A
    JOIN users B on A.userId = B.id
    LEFT JOIN new_images C on A.imageId = C.id
    LEFT JOIN new_images D on A.originalImageId = D.id
    ORDER BY A.time DESC
  `, (err, data) => {
    if (err) {
      console.log(err);
      res.json({status: 'failure'});
    } else {
      res.json({status: 'success', data});
    }
  })
}

module.exports = {
  // get_user,
  signup,
  login,
  save_public_image,
  save_original_image,
  get_all_user_images,
  get_all_images,
  save_filtered_image,
  add_basic_feedback,
  add_multi_feedback,
  get_all_feedback,
}
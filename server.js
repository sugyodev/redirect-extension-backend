const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');

app.all('/*', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "POST, GET");
  next();
});

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const DbConnection = mysql.createPool({
  connectionLimit: 10,
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'formx_tool'
});


/**
 * Create a new project
 */
app.post('/projects', (req, res) => {
  const category = 1;
  const name = 'San Jose';
  const address = 'ADU';
  const background = 'Some Background';
  const sqrt = 400;
  const description = 'Project Description';

  const sql = 'INSERT INTO projects (category, name, address, background, sqrt, description) VALUES (?, ?, ?, ?, ?, ?)';
  const values = [category, name, address, background, sqrt, description];
  DbConnection.query(sql, values, (error, results, fields) => {
    if (error) {
      console.error(error);
    } else {
      console.log('Data inserted successfully');
    }
  });
})

/**
 * Get all projects
 */
app.get('/projects', (req, res) => {
  DbConnection.query('SELECT * FROM projects', (error, results, fields) => {
    if (error) {
      res.send({ message: 'error' });
    } else {
      res.send({ message: 'success', data: results });
    }
  });
})

/**
 * User Login
 */
app.get('/login', (req, res) => {
  const { email, password } = req.query
  if (email && password) {
    DbConnection.query(`SELECT * FROM users WHERE email = '${email}' AND password = '${Buffer.from(password).toString('base64')}'`, (error, results, fields) => {
      if (error) {
        res.send({ message: 'error' });
      } else if (results.length > 0) {
        res.send({ message: 'success', user: results[0] });
      } else {
        res.send({ message: 'no registered user' });
      }
    });
  }
})

// DbConnection.end();
app.listen(8080);

require('dotenv').config()
const winston = require('winston')
const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require('cors')
require('./db/mongoose')
const app = express()
const {logger} = require('./logger/winstonLogger')

var corsOptions = {
  origin: 'http://localhost:3000',
  allow: 'POST'
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());
app.use(cookieParser());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// simple route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to yad2 latest server' });
});

// routes
require('./routes/user.routes')(app);
require('./routes/item.routes')(app);
// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}.`);
});
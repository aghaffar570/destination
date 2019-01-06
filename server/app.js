const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const path = require('path');
const db = require('./db');
const app = express();

// logging middleware
app.use(morgan('dev'));

// body parsing middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// api routes
app.use('/api', require('./api'));

// static middleware
app.use(express.static(path.join(__dirname, '..', 'public')));

// always send main index.html from server for backup
app.use('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public/index.html'));
});

// error handling endware
app.use((err, req, res, next) => {
  console.error(err);
  console.error(err.stack);
  res.status(err.status || 500).send(err.message || 'Internal server error.');
})

db.sync()
  .then(() => {
    console.log('DB synced!');
    app.listen(3000, () => {
      console.log(`Now listening to port ${3000}`);
    });
  });

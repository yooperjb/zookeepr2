const fs = require('fs');
const path = require('path');
const express = require('express');
const { animals } = require('./data/animals');
const { type } = require('os');
const apiRoutes = require('./routes/apiRoutes');
const htmlRoutes = require('./routes/htmlRoutes');

// This will set the PORT to the environment variable set by Heroku or Dreamhost or use 80
const PORT = process.env.PORT || 80;
// heroku app fathomless-brook-93890

const app = express();

// middleware for parsing data
// parse incoming string or array data
app.use(express.urlencoded({ extended: true}));
// parse income JSON data
app.use(express.json());
// /api routes serve apiRoutes
app.use('/api', apiRoutes);
// '/' routes serve htmlRoutes
app.use('/', htmlRoutes);
// location for our static files
app.use(express.static('public'));

// this tells the server to listen on PORT which is configured above
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});
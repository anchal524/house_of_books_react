const express = require('express');
const app = express();
const static = express.static(__dirname + '/public');
const configRoutes = require('./routes');
const cors = require('cors');
require('dotenv').config;
app.use(cors());
app.use('/public', static);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

configRoutes(app);

app.listen(process.env.PORT || 4000, () => {
    console.log("We've now got a server!");
    console.log('Your routes will be running on http://localhost:4000');
});

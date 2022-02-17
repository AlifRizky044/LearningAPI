var express = require('express');

var bodyParser = require('body-parser');

var mongoose = require('mongoose');

require('dotenv').config();

var cors = require('cors'); 

var adminRoutes = require('./routes/admin.js');

var userRoutes = require('./routes/user.js');

const app = express();

app.use(bodyParser.json({limit:"30mb",extended:true}));
app.use(bodyParser.urlencoded({limit:"30mb",extended:true}));

app.use(cors());

app.use('/admin', adminRoutes);
app.use('/users', userRoutes);
app.use('/users', userRoutes);
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.CONNECTION_URL, {useNewUrlParser: true, useUnifiedTopology:true})
    .then(()=>app.listen(PORT,()=>console.log("Server running")))
    .catch((err) => console.log(err))

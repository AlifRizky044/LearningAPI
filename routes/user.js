var express = require('express');
var router = express.Router();

const verify = require('./verifyToken');

var joi = require('@hapi/joi');
var {getCategory,getCourses,registerUser,loginUser,getCategoryPopular} = require('../controller/user-courses.controller.js');

router.get('/courses',verify, getCourses);

router.get('/category',verify, getCategory);

router.get('/category-popular',verify, getCategoryPopular);

router.post('/register', registerUser);

router.post('/login', loginUser);


module.exports = router;
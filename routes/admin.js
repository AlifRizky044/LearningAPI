var express = require('express');
var router = express.Router();
var {createCourses,deleteCourses, updateCourses, statisticCourses,getUsers,deleteUsers,createCategory,deleteCategory,registerAdmin,loginAdmin} = require('../controller/crud-courses.controller.js');
var {getCourses} = require('../controller/user-courses.controller.js');

const verify = require('./verifyToken');

router.get('/courses',verify, getCourses);

router.get('/users',verify, getUsers);

router.delete('/del-users/:id',verify, deleteUsers);

router.post('/add-courses',verify, createCourses);

router.delete('/del-courses/:id',verify, deleteCourses);

router.post('/add-category',verify, createCategory);

router.delete('/del-category/:id',verify, deleteCategory);

router.post('/upd-courses/:id',verify, updateCourses);

router.get('/courses/statistics',verify, statisticCourses);

router.post('/register', registerAdmin);

router.post('/login', loginAdmin);


module.exports = router;
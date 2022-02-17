var CoursesMessage = require('../models/courses.model.js');
var Users = require('../models/user.model.js');
var Admin = require('../models/admin.model.js');
var CategoryMessage = require('../models/category.model.js');
const { cloudinary } = require('../api/cloudinary.js');

const joi = require('@hapi/joi');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var {userSchema,userSchemaLogin} = require("../api/hapijoi.js");




const getCourses = async (req,res)=>{
    CoursesMessage.find()
    .then(posts=>res.json(posts))
    .catch(err=>res.status(400).json('Error: '+err));
}

const createCourses = async (req,res)=>{
    try{
    const images = await cloudinary.v2.uploader.upload(req.body.image, 
            {upload_preset:'setups'});

    await CategoryMessage.findById(req.body.category)
    .then(update => {
        update.popularity = update.popularity + 1;
        update.save();
    })
    .catch(err => res.status(400).json('Error: '+err));
 
    const newPost = new CoursesMessage({ 
        title:req.body.title,
        description:req.body.description,
        category:req.body.category,
        creator:req.body.creator,
        price:req.body.price,
        image_id:images['public_id'],
        image:images['secure_url']
    });
  
    newPost.save()
    .then(()=>res.json(newPost))
    .catch(err => res.status(400).json('Error : '+err))
    }catch(e){
        console.log(e);
    }
}

const deleteCourses = async (req,res)=>{

    await CoursesMessage.findById(req.params.id)
    .then(async (response) => {
        await CategoryMessage.findById(response.category)
        .then(update => {
            
            update.popularity = update.popularity != 0? update.popularity - 1:0;
            update.save();
        })
        .catch(err => res.status(400).json('Error: '+err));

        await cloudinary.v2.uploader.destroy(
            response.image_id, { invalidate: true, resource_type: "image" }, async (error, result)=> {
            if (error){
                return res.status(400).json(error)
            } 
        }); 
    }).catch(err => res.status(400).json('Error: '+err));

    await CoursesMessage.findByIdAndDelete(req.params.id)
    .then(async () => { 
        res.json({"status":200})
    })
    .catch(err => res.status(400).json('Error: '+err));
}

const updateCourses = (req, res) =>{
    CoursesMessage.findById(req.params.id)
      .then(update => {
        for(let i =0;i<Object.keys(req.body).length;i++){
            update[Object.keys(req.body)[i]] = req.body[Object.keys(req.body)[i]];
        }
        
  
        update.save()
        .then(()=>res.json({"status":200}))
        .catch(err => res.status(400).json('Error : '+err))
      })
      .catch(err => res.status(400).json('Error: '+err));
}

const statisticCourses = async (req, res) =>{
    var data = {};

    Promise.all([
        CoursesMessage.countDocuments({name: 'courses'}),
        CoursesMessage.countDocuments({price: 0})
      ]).then( ([ course, free ]) => {
        let result = {
            'total-course':course,
            'free-course':free
        };
        res.json(result);
      });
}

const getUsers = async (req, res) =>{
    if(req.query.length > 0){
        var query = req.query;
        try{
    
            for(let i =0;i<Object.keys(query).length;i++){
                if(Object.keys(query)[i].toLowerCase() != 'sort'){
                    query[Object.keys(query)[i]] = Object.keys(query)[i].toLowerCase() != 'flag'?{ "$regex": query[Object.keys(query)[i]], "$options": "i" }:query[Object.keys(query)[i]];
                }
            }
            Users.find(query)
                .then(posts=>res.json(posts))
                .catch(err=>res.status(400).json('Error: '+err));
    
        }catch(e){
            res.json(e);
        }
    }else{
        Users.find()
                    .then(posts=>res.json(posts))
                    .catch(err=>res.status(400).json('Error: '+err));
    }  
}

const deleteUsers = (req, res) =>{
    Users.findById(req.params.id)
      .then(update => {
        update.flag = 0;
  
        update.save()
        .then(()=>res.json({"status":200}))
        .catch(err => res.status(400).json('Error : '+err))
      })
      .catch(err => res.status(400).json('Error: '+err));
}

const createCategory = async (req,res)=>{
    const post = req.body;

    try{
    const newPost = new CategoryMessage({
        title:req.body.title,
        popularity:0
    });
  
    newPost.save()
    .then(()=>res.json({"status":200}))
    .catch(err => res.status(400).json('Error : '+err))
    }catch(e){
        console.log(e);
    }
}

const deleteCategory = async (req,res)=>{
    await CategoryMessage.findByIdAndDelete(req.params.id)
    .then(async () => {
        res.json({"status":200})
    })
    .catch(err => res.status(400).json('Error: '+err));
}

const registerAdmin = async (req,res)=>{
    const {error} = userSchema.validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const emailCheck = await Admin.findOne({email:req.body.email});

    if(emailCheck) return res.status(400).send("Email already exists");

    const images = await cloudinary.v2.uploader.upload(req.body.image, 
        {upload_preset:'setups'});

     const salt = await bcrypt.genSalt(10);
     const hashPassword = await bcrypt.hash(req.body.password,salt);
    try{ 
        const admin = new Admin({
            username:req.body.username,
            email:req.body.email,
            password:hashPassword,
            image_id:images['public_id'],
            image:images['secure_url'],
            flag:1
        });
        admin.save()
        .then(()=>res.json({admin:admin._id}))
        .catch(err => res. status(400).json('Error : '+err))
    }catch(e){
        res.json(e);
    }
}

const loginAdmin = async (req,res)=>{
    const {error} = userSchemaLogin.validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const emailCheck = await Admin.findOne({email:req.body.email,flag:1});
    if(!emailCheck) return res.status(400).send("Email or password doesn't exists");

    const validPass = await bcrypt.compare(req.body.password, emailCheck.password);
    if(!validPass) return res.status(400).send("Email or password wrong");

    const token = jwt.sign({_id:emailCheck._id}, process.env.TOKEN);
    res.header('auth-token', token).send(token);
}

module.exports = {registerAdmin,loginAdmin,getCourses,createCourses,deleteCourses,updateCourses,statisticCourses,getUsers,deleteUsers,createCategory,deleteCategory};
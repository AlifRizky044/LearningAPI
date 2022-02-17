var joi = require('@hapi/joi');
var CoursesMessage = require('../models/courses.model.js');
var CategoryMessage = require('../models/category.model.js');
var User = require('../models/user.model.js');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const { cloudinary } = require('../api/cloudinary.js');

var {userSchema,userSchemaLogin} = require("../api/hapijoi.js");




// const userSchema = joi.object({
//     username: joi.string()
//     .min(6).required(),
//     image: joi.string().required(),
//     email:joi.string()
//     .min(6).required().email(),
//     password:joi.string()
//     .min(6).required(),
// }); 

// const userSchemaLogin = joi.object({
//     email:joi.string()
//     .min(6).required().email(),
//     password:joi.string()
//     .min(6).required(),
// }); 

const getCourses = async (req,res)=>{
    if(req.query.length > 0){
        var query = req.query;
        try{
    
            for(let i =0;i<Object.keys(query).length;i++){
                if(Object.keys(query)[i].toLowerCase() != 'sort'){
                    query[Object.keys(query)[i]] = Object.keys(query)[i].toLowerCase() != 'price'?{ "$regex": query[Object.keys(query)[i]], "$options": "i" }:query[Object.keys(query)[i]];
                }else if(Object.keys(query)[i].toLowerCase() == 'sort' && query[Object.keys(query)[i]] == '0' || query[Object.keys(query)[i]].toLowerCase() == 'free'){
                    query['price'] = 0;
                    delete query[Object.keys(query)[i]];
                }
            }
            if(req.query.sort != null){
                CoursesMessage.find(query).sort({price: req.query.sort})
                .then(posts=>res.json(posts))
                .catch(err=>res.status(400).json('Error: '+err));
            }else{
                CoursesMessage.find(query)
                .then(posts=>res.json(posts))
                .catch(err=>res.status(400).json('Error: '+err));
            }
    
        }catch(e){
            res.json(e);
        }
    }else{
        CoursesMessage.find()
                    .then(posts=>res.json(posts))
                    .catch(err=>res.status(400).json('Error: '+err));
    }
}


const getCategory = (req,res)=>{
    try{
        CategoryMessage.find()
        .then(posts=>res.json(posts))
        .catch(err=>res.status(400).json('Error: '+err));
    }catch(e){
        res.json(e);
    }

}

const getCategoryPopular = (req,res)=>{
    try{
        CategoryMessage.find().sort({popularity: 'desc'})
        .then(posts=>res.json(posts))
        .catch(err=>res.status(400).json('Error: '+err));
    }catch(e){
        res.json(e);
    }

}

const registerUser = async (req,res)=>{
    const {error} = userSchema.validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const emailCheck = await User.findOne({email:req.body.email});

    if(emailCheck) return res.status(400).send("Email already exists");

    const images = await cloudinary.v2.uploader.upload(req.body.image, 
        {upload_preset:'setups'});

    console.log(images);

     const salt = await bcrypt.genSalt(10);
     const hashPassword = await bcrypt.hash(req.body.password,salt);
    try{ 
        const user = new User({
            username:req.body.username,
            email:req.body.email,
            password:hashPassword,
            image_id:images['public_id'],
            image:images['secure_url'],
            flag:1
        });
        user.save()
        .then(()=>res.json({user:user._id}))
        .catch(err => res. status(400).json('Error : '+err))
    }catch(e){
        res.json(e);
    }
}

const loginUser = async (req,res)=>{
    const {error} = userSchemaLogin.validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const emailCheck = await User.findOne({email:req.body.email,flag:1});
    if(!emailCheck) return res.status(400).send("Email or password doesn't exists");

    const validPass = await bcrypt.compare(req.body.password, emailCheck.password);
    if(!validPass) return res.status(400).send("Email or password wrong");

    const token = jwt.sign({_id:emailCheck._id}, process.env.TOKEN);
    res.header('auth-token', token).send(token);
}

module.exports = {getCategoryPopular,getCategory, getCourses,registerUser,loginUser};
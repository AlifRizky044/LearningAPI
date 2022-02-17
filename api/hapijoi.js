var joi = require('@hapi/joi');
const userSchema = joi.object({
    username: joi.string()
    .min(6).required(),
    image: joi.string().required(),
    email:joi.string()
    .min(6).required().email(),
    password:joi.string()
    .min(6).required(),
}); 

const userSchemaLogin = joi.object({
    email:joi.string()
    .min(6).required().email(),
    password:joi.string()
    .min(6).required(),
}); 

module.exports = {userSchema, userSchemaLogin}
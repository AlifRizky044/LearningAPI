
var mongoose = require('mongoose');
const userAdminSchema = mongoose.Schema({
    username: {
        type: String,
        required:true,
        min:5,
        max:255
    },
    email:{
        type: String,
        required:true,
        min:5,
        max:255
    },
    password:{
        type: String,
        required:true,
        min:6,
        max:1024
    },
    image:String,
    image_id:String,
    flag:Number,
    ceatedAt:{
        type:Date,
        default: new Date()
    }
});

const userAdminMessage = mongoose.model("admin", userAdminSchema);

module.exports =  userAdminMessage;
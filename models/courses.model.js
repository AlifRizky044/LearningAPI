
var mongoose = require('mongoose');
const coursesSchema = mongoose.Schema({
    title: String,
    description:String,
    category:String,
    creator:String,
    image:String,
    image_id:String,
    price:Number,
    ceatedAt:{
        type:Date,
        default: new Date()
    }
});

const CoursesMessage = mongoose.model("Courses", coursesSchema);

module.exports =  CoursesMessage;
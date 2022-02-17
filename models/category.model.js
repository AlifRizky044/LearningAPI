var mongoose = require('mongoose');
const categorySchema = mongoose.Schema({
    title: {
        type: String,
        required:true,
        max:255
    },
    popularity: {
        type: Number,
        required:true
    },
    ceatedAt:{
        type:Date,
        default: new Date()
    }
});

const categoryMessage = mongoose.model("categories", categorySchema);

module.exports =  categoryMessage;
const mongoose = require('mongoose');
const likeSchema =new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    //objectid of the liked object
    likeable: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'onModel', //dynamic refrence 
    },
    //type of the liked object
    onModel:{
        type: String,
        required: true,
        enum: ['Post', 'Comment'] //post or comment can be liked
    }
},{
    timestamps: true
});

module.exports = mongoose.model('Like', likeSchema);
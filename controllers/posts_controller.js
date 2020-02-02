const Post = require('../models/post')
module.exports.create = (req,res)=>{
    //create a new post
    Post.create({
        content: req.body.content,
        user: req.user._id
    },(err,post)=>{
        if(err) 
        {
             console.log('error in creating a post');
             return;
        }
        res.redirect('back');
    })
}
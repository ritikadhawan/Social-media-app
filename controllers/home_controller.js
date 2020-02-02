const Post = require('../models/post');
const User = require('../models/user');
module.exports.home = (req,res)=>{
    // console.log(req.cookies);
    // res.cookie('user_id',25);  //changing the value of cookie in response 

    //populate is used to exatract whole user not just its id
    Post.find({}).populate('user').exec((err,posts)=>{
        return res.render('home', {
            posts: posts,
        });
    });


}


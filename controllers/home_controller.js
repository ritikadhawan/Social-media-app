const Post = require('../models/post');
const User = require('../models/user');
module.exports.home = (req,res)=>{
    // console.log(req.cookies);
    // res.cookie('user_id',25);  //changing the value of cookie in response 

    //populate is used to exatract whole user not just its id
    //here we are extracting user of the post, comments and their respective users also using populate
    Post.find({})
    .populate('user')
    .populate({
        path: 'comments',
        populate:{
            path: 'user'
        }
    })
    .exec((err,posts)=>{

        User.find({},(err,user)=>{

            return res.render('home', {
                posts: posts,
                all_users: user
            });
        });

        
    });


}


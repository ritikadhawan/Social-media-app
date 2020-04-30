const Post = require('../models/post');
const User = require('../models/user');
module.exports.home = async (req,res)=>{
    // console.log(req.cookies);
    // res.cookie('user_id',25);  //changing the value of cookie in response 
    //any error will go to catch
    try
    {
        //populate is used to exatract whole user not just its id
        //here we are extracting user of the post, comments and their respective users also using populate
        //async-await to get ride of so many callbacks
        //await puts the execution of the next function on hold till this one gets executed
        let posts = await Post.find({})
        .sort('-createdAt')
        .populate('user')
        .populate({
            path: 'comments',
            populate:{
                path: 'user'
            },
            populate: {
                path: 'likes'
            }
        }).populate('likes')

        //after posts users will get executed
        let users = await User.find({});
        //then the funciton will return
        return res.render('home', {
            posts: posts,
            all_users: users
        });


    }
    catch(err)
    {
        console.log('Error',err);
        return;
    }
    

}


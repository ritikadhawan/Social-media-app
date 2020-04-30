const Post = require('../models/post');
const Comment = require('../models/comment');
const User = require('../models/user');
const Like = require('./../models/like');

module.exports.create = async (req,res)=>{
    //create a new post
    try{
        let post = await Post.create({
            content: req.body.content,
            user: req.user._id
        });

        if(req.xhr)
        {
            post = await post.populate('user', 'name').execPopulate();
            return res.status(200).json({
                data: {
                    post: post
                },
                message: 'Post Created'
            });
        }
        req.flash('success', 'Post published');
        res.redirect('back');
    }
    catch(err)
    {
        req.flash('error', err);
        res.redirect('back');
    }
    

}

module.exports.destroy = async (req,res)=>{
    //deleting a post if the user is authorized to do so
    // console.log(req.params.id);
    try{
        let post = await Post.findById(req.params.id);
        if(post.user == req.user.id)
        {
            await Like.deleteMany({likeable: req.params.id, onModel: 'Post'});
            await Like.deleteMany({_id: {$in:post.comments}});

            post.remove();
            //removing comments from db
            await Comment.deleteMany({post: req.params.id});
            if(req.xhr)
            {
                return res.status(200).json({
                    data: {
                        post_id: req.params.id
                    },
                    message: "Post deleted"
                });
            }
            req.flash('success', 'Post deleted');
            return res.redirect('back');
        }
        else
        {
            req.flash('error', 'You can not delete this post');
            res.redirect('back');
        }
    }
    catch(err)
    {
        req.flash('error', err);
        res.redirect('back');
    }
    
}

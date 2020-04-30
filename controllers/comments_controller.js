const Comment = require('../models/comment');
const Post = require('../models/post');
const User = require('../models/user');
const Like = require('./../models/like');
const commentMailer = require('../mailers/comments_mailer');
const queue =  require('../config/kue');
const commentEmailWorker = require('../workers/comment_email_worker');

module.exports.create = async (req,res)=>{
    //find if the post exist 
    //post id is hidden input in home.ejs form
    try
    {
        let post = await Post.findById(req.body.post);
        if (post)
        {
            let comment = await Comment.create({
                content: req.body.content,
                post: req.body.post,
                user: req.user._id
            });

            post.comments.push(comment);
            post.save();

            comment = await comment.populate('user', 'name email').execPopulate();
            // commentMailer.newComment(comment);  //moved to comment_email worker 
            let job = queue.create('emails', comment).save((err)=>{
                if(err){
                    console.log(`${err} error in creating a queue`);
                    return;
                }
                console.log('job enqueued',job.id);
            });
            if(req.xhr)
            {

                return res.status(200).json({
                    data: {
                        comment: comment

                    },
                    message: 'Comment created'
                })
            }
            req.flash('success', 'Comment published!');
            res.redirect('/');
        }
    }
    catch(err)
    {
        req.flash('error', err);
        return;
    }
    
}

module.exports.destroy = async (req,res)=>{
    try{
        let comment = await Comment.findById(req.params.id);
        //comment can be deleted by the owner of the comment
        if(comment.user == req.user.id)
        {
            //storing post id of the comment to be deleted before deleting it
            let postId = comment.post;
            comment.remove();

            // pull will pull out the comment with id from the comments array of the post
            let post = await Post.findByIdAndUpdate(postId,{ $pull: {comments: req.params.id}});

            //deleting associated likes 
            await Like.deleteMany({likeable: req.params.id, onModel: 'Comment'});
            
            if(req.xhr)
            {
                return res.status(200).json({
                    data: {
                        comment_id: comment._id
                    },
                    message: 'Comment Deleted'
                });
            }
            req.flash('success', 'Comment deleted!');
            return res.redirect('back');

        }
        else
        {
            req.flash('error', 'Unauthorized');
            return res.redirect('back');
        }
    }
    catch(err)
    {
        req.flash('error', err);
        return;
    }
    
}
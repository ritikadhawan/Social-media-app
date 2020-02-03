const Comment = require('../models/comment');
const Post = require('../models/post');

module.exports.create = (req,res)=>{
    //find if the post exist 
    //post id is hidden input in home.ejs form
    Post.findById(req.body.post, function(err, post){

        if (post){
            Comment.create({
                content: req.body.content,
                post: req.body.post,
                user: req.user._id
            }, function(err, comment){
                if(err){console.log(err); return;}

                post.comments.push(comment);
                post.save();

                res.redirect('/');
            });
        }

    });
}

module.exports.destroy = (req,res)=>{
    Comment.findById(req.params.id,(err,comment)=>{
        //comment can be deleted by the owner of the comment
        if(comment.user == req.user.id)
        {
            //storing post if of the comment to be deleted before deleting it
            let postId = comment.post;
            comment.remove();
            // pull will pull out the comment with id from the comments array of the post
            Post.findByIdAndUpdate(postId,{ $pull: {comments: req.params.id}}, (err,post)=>{
                return res.redirect('back');
            });

        }
        else
        {
            return res.redirect('back');
        }
    })
}
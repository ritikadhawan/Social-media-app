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
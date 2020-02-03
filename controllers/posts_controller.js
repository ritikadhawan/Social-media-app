const Post = require('../models/post');
const Comment = require('../models/comment');
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

module.exports.destroy = (req,res)=>{
    //deleting a post if the user is authorized to do so
    console.log(req.params.id);
    Post.findById(req.params.id,(err,post)=>{
        // if(err){ throw Error(err); return;}
        if(post.user == req.user.id)
        {
            post.remove();
            //removing comments from db
            Comment.deleteMany({post: req.params.id},(err)=>{
                return res.redirect('back');
            });
        }
        else
        {
            res.redirect('back');
        }
    });
}
// module.exports.destroy = function(req, res){
//     Post.findById(req.params.id, function(err, post){
//         // .id means converting the object id into string
//         if (post.user == req.user.id){
//             post.remove();

//             Comment.deleteMany({post: req.params.id}, function(err){
//                 return res.redirect('back');
//             });
//         }else{
//             return res.redirect('back');
//         }

//     });
// }
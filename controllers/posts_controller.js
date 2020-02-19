const Post = require('../models/post');
const Comment = require('../models/comment');
module.exports.create = async (req,res)=>{
    //create a new post
    try{
        await Post.create({
            content: req.body.content,
            user: req.user._id
        });
        res.redirect('back');
    }
    catch(err)
    {
        console.log(`Error ${err}`);
        return;
    }
    

}

module.exports.destroy = async (req,res)=>{
    //deleting a post if the user is authorized to do so
    // console.log(req.params.id);
    try{
        let post = await Post.findById(req.params.id);
        if(post.user == req.user.id)
        {
            post.remove();
            //removing comments from db
            await Comment.deleteMany({post: req.params.id});
            return res.redirect('back');
        }
        else
        {
            res.redirect('back');
        }
    }
    catch(err)
    {
        console.log(`Error ${err}`);
        return;
    }
    
}

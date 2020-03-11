const User = require('../models/user');
const path = require('path');
const fs = require('fs');
module.exports.signIn = (req,res)=>{
    if(req.isAuthenticated())
        res.redirect('/users/profile');
    return res.render('user_sign_in');
}

module.exports.signUp = (req,res)=>{
    if(req.isAuthenticated())
        res.redirect('/users/profile');
    return res.render('user_sign_up');
}

module.exports.profile = (req,res)=>{
    User.findById(req.params.id,(err,user)=>{
        return res.render('user_profile',{
            profile_user: user
        });
    });
    
}

module.exports.update = async (req,res)=>{
    if(req.user.id == req.params.id){
        try{
            //we won't be able to update directly using findByIdAndUpdate as now our form contains multipart data
            let user = await User.findById(req.params.id);
            User.uploadedAvatar(req,res,(err)=>{
                if(err){
                    console.log(err);
                    return;
                }
                user.name = req.body.name;
                user.email = req.body.email;
                if(req.file){
                    if (user.avatar){
                        fs.unlinkSync(path.join(__dirname, '..', user.avatar));
                    }
                    //this is storing the file path and its name in avatar field in our user db model
                    user.avatar = User.avatarPath + '/' + req.file.filename;
                }
                console.log(user.avatar);
                user.save();
                return res.redirect('back');

            });
        }
        catch(err){
            if(err){
                req.flash('error',err);
                return res.redirect('back');
            }
        }        
    }
    else{
        req.flash('error', 'Unauthorized!');
        res.status(401).send('Unauthorized');
    }
}

//get sign up data
module.exports.create = (req,res)=>{
    //check if password and confirm_password are same or not
    if(req.body.password != req.body.confirm_password)
    {
        req.flash('error', 'Passwords do not match');
        return res.redirect('back');
    }
    //check if user is already present or not if not then create one otherwise redirect to sign-in page
    User.findOne({email: req.email},(err,user)=>{
        if(err){req.flash('error', err); return;}

        if(!user)
        {
            User.create(req.body,(err,user)=>{
                if(err){req.flash('error', err); return;}

                return res.redirect('/users/sign-in');

            })
        }
        else{
            req.flash('success', 'You have signed up, login to continue!');
            return res.redirect('back');
        }
    })
}
//sign in and create session for user
module.exports.createSession = (req,res)=>{
    //sesssion is created by passport all we need to do is redirect to the home page
    req.flash('success','Logged in successfully');
    return res.redirect('/');
}
//destroyin session in case of sign out
module.exports.destroySession = (req,res)=>{
    req.logout();
    req.flash('success','You have logged out');
    return res.redirect('/');
}
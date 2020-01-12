const User = require('../models/user');
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
    return res.render('profile');
}

//get sign up data
module.exports.create = (req,res)=>{
    //check if password and confirm_password are same or not
    if(req.body.password != req.body.confirm_password)
    {
        return res.redirect('back');
    }
    //check if user is already present or not if not then create one otherwise redirect to sign-in page
    User.findOne({email: req.email},(err,user)=>{
        if(err){console.log('error in signing up user'); return;}

        if(!user)
        {
            User.create(req.body,(err,user)=>{
                if(err){console.log('error in creating user while signing up'); return;}

                return res.redirect('/users/sign-in');

            })
        }
        else{
            return res.redirect('back');
        }
    })
}
//sign in and create session for user
module.exports.createSession = (req,res)=>{
    //sesssion is created by passport all we need to do is redirect to the home page
    
    return res.redirect('/');
}
//destroyin session in case of sign out
module.exports.destroySession = (req,res)=>{
    req.logout();
    return res.redirect('/');
}
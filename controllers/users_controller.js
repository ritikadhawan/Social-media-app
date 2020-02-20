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
    User.findById(req.params.id,(err,user)=>{
        return res.render('user_profile',{
            profile_user: user
        });
    });
    
}

module.exports.update = (req,res)=>{
    //check if someone changed id in html page 
    if(req.user.id == req.params.id)
    {
        User.findByIdAndUpdate(req.params.id, {name: req.body.name, email: req.body.email}, (err,user)=>{
            return res.redirect('back');
        });
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
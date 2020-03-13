const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');

//authentication using passport
passport.use(new LocalStrategy({
        usernameField: 'email' , //syntax
        //as their is no req argument thus this argument is set to true
        passReqToCallback: true
    },
    (req,email,password,done)=>{
        //find a user and establish the identity
        User.findOne({email: email},(err,user)=>{
            if(err)
            {
                req.flash('error',err);
                return done(err);
            }
            if(!user || user.password != password){
                req.flash('error','Invalid username/password');
                return done(null,false);
            }

            return done(null,user);
        })
    }

));

//serializing user to decide which key is to be kept as a cookie
passport.serializeUser((user,done)=>{
    done(null,user.id); //we are encrypting user id in cookie
});
//deserializing the user from the key in the cookies
passport.deserializeUser((id,done)=>{
    User.findById(id,(err,user)=>{
        if(err)
            {
                console.log('error');
                return done(err);
            }
        done(null,user);
    });
});


//middleware to check if user is signed in or not
passport.checkAuthentication = (req,res,next)=>{
    //if user is signed in , then pass on the request to the next function(controller's action)
    if(req.isAuthenticated())
    {
        return next();
    }
    res.redirect('/user/sign-in');
}

passport.setAuthenticatedUser = (req,res,next)=>{
    if(req.isAuthenticated())
    {
        //req.user contains info about the current user signed in fron the session cookie & we are sending this ingo to locals for views

        res.locals.user = req.user;
    }
    next();
}


 module.exports = passport;
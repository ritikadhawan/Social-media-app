const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');

//authentication using passport
passport.use(new LocalStrategy({
    usernameField: 'email'  //syntax
    },
    (email,password,done)=>{
        //find a user and establish the identity
        User.findOne({email: email},(err,user)=>{
            if(err)
            {
                console.log('error');
                return done(err);
            }
            if(!user || user.password != password){
                console.log('Invalid Username/password');
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
 module.exports = passport;
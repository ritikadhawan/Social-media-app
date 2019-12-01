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

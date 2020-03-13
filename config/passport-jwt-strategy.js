const User = require('../models/user');
const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey : 'secretForNow'
}

passport.use(new JwtStrategy(opts, (jwt_payload, done)=> {
    User.findById( jwt_payload._id,(err, user)=> {
        if (err) {
            console.log(err);
            return done(err, false);
        }
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
          
        }
    });
}));

module.exports = passport;
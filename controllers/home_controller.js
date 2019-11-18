// const User = require('../models/user');
module.exports.home = function(req,res){
    console.log(req.cookies);
    res.cookie('user_id',25);  //changing the value of cookie in response 
    return res.render('home');
}

const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const AVATAR_PATH = path.join('/uploads/users/avatars');

const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    password: {
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    avatar: {
        type: String,
    }

},{
    timestamps:true
});
let storage = multer.diskStorage({
    //variable file is the file that we receive from req and cb is callback function 
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, '..', AVATAR_PATH));
    },
    filename: function (req, file, cb) {
        // field name is avatar here 
      cb(null, file.fieldname + '-' + Date.now());
      console.log(file.mimetype);
    }
  });

  //static functions like in programming
  userSchema.statics.uploadedAvatar = multer({storage: storage}).single('avatar'); //use single to upload single file
  userSchema.statics.avatarPath = AVATAR_PATH;
module.exports = mongoose.model('User',userSchema);
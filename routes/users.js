const express = require('express');
const router = express.Router();
const passport = require('passport');

const usersController = require('../controllers/users_controller');
router.get('/sign-in', usersController.signIn);
router.get('/sign-up',usersController.signUp);
router.get('/profile',passport.checkAuthentication,usersController.profile);

router.post('/create',usersController.create);
//use passport as a middleware to authenticater
router.post('/create-session',passport.authenticate(
    'local',  //our statergy
    {failureRedirect: '/users/sign-in'}
),usersController.createSession);

router.get('/sign-out', usersController.destroySession);
module.exports = router;

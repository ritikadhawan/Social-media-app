const express = require('express');
const cookieParser = require('cookie-parser');
const db = require('./config/mongoose');
const user = require('./models/user');
const app = express();
const PORT = 8000;
const expressLayouts = require('express-ejs-layouts');

//used for session cookie
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const passportJwt = require('./config/passport-jwt-strategy');
const passportGoogle = require('./config/passport-google-oauth2-strategy');
const MongoStore = require('connect-mongo')(session);
const sassMiddleware = require('node-sass-middleware');

const flash = require('connect-flash');
const customMiddleware = require('./config/middleware');

app.use(sassMiddleware({
    src: './static/scss',
    dest: './static/css',
    debug: true, //display errors if any
    outputStyle: 'extended', //output in multiple lines not in same line
    prefix: '/css'  //where server should look for css files
}));

app.use(express.urlencoded());
app.use(cookieParser());

app.use(express.static('./static'));
//make the upload path available to the browser
app.use('/uploads', express.static(__dirname + '/uploads'));

app.use(expressLayouts);
//extract styles and scripts from sub pages in layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);


//set up the view engine
app.set('view engine','ejs');
app.set('views','./views');

//mongo store is used to store the session cookie in the db
app.use(session({
    name: 'codeial',
    secret: 'anythingForNow',   //encryption key
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: 1000*60*100  // in milliseconds //after this time session will expire
    },
    store: new MongoStore({
        
            mongooseConnection: db,
            autoRemove: 'disabled'
        
    },(err)=>{console.log(err || 'connect-mongodb setup ok')})
}));
//telling server to use passport
app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);

//set up flash after the session cookies as it uses session
app.use(flash());
app.use(customMiddleware.setFlash);
//use express router
app.use('/',require('./routes'));

app.locals.rmWhitespace = true;
app.listen(PORT,(err)=>{
    if(err)
        console.log("Error occured");
    else
        console.log(`Server running on port ${PORT}`);
})
const express = require('express');
const cookieParser = require('cookie-parser');
const db = require('./config/mongoose');
const user = require('./models/user');
const app = express();
const PORT = 8000;
const expressLayouts = require('express-ejs-layouts');

app.use(express.urlencoded());
app.use(cookieParser());

app.use(expressLayouts);

app.use(express.static('./static'));

app.use('/',require('./routes'));

app.set('view engine','ejs');
app.set('views','./views');

app.locals.rmWhitespace = true;
app.listen(PORT,(err)=>{
    if(err)
        console.log("Error occured");
    else
        console.log(`Server running on port ${PORT}`);
})
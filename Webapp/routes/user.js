var express = require('express');
var router = express.Router();
var passport = require('passport');
var flash = require('connect-flash');


var winston = require('winston');
require('winston-mongodb').MongoDB;
const reqLogger = new (winston.Logger)({
    transports: [
        new(winston.transports.MongoDB)({
            db : 'mongodb://localhost:27020/coffee_shop',
            collection: 'useractivitylogs',
            //level:'info'
            // expireAfterSeconds: 2;
        })
    ],
});



/* GET users listing. */
router.get('/', function(req, res, next) {
 // res.send('respond with a resource');
 res.redirect('/user/signin');
});

router.get('/profile',isLoggedIn, function(req,res,next){

    res.render('user/profile');
});

router.get('/logout', isLoggedIn, function(req, res, next){
    //console.log(req.body.email);
    req.logOut();

    reqLogger.info(`user has logged out`,{
        httpRequest:{
            status: res.statusCode,
            requestUrl: req.url,
            requestMethod: req.method,
            remoteIp: req.connection.remoteAddress,
        }
    });
    req.session.destroy();
    res.redirect('/user/signin');
});

router.use('/',notLoggedIn, function (req,res,next) {
   next();
});

router.get('/signup', function(req,res,next){
    var messages = req.flash('error');
    console.log("messages");
    res.render('user/signup',{messages: messages, hasErrors: messages.length > 0});
});

router.post('/signup', passport.authenticate('local.signup',{
}),function(request, response) {
    console.log("inside signup");
        response.redirect('/productcatalog');
        //adding logs to db.
    }
    );

router.get('/signin', function(req,res,next){
    var messages = req.flash('error');
    console.log(messages);
    res.render('user/signin',{messages: messages, hasErrors: messages.length > 0});
});

router.post('/signin', passport.authenticate('local.signin',{
    //successRedirect: '/user/profile',
    failureRedirect: '/user/signin',
    failureFlash: true
}), function(request, response) {
        //req.flash('success', 'You are now logged in');
    
        //console.log(request.session.passport.user);
        //console.log(response);
        //console.log(request.user.email);
        response.redirect('/productcatalog');
        //adding logs to db.
    }
);

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/')
}

function notLoggedIn(req, res, next){
    if(!req.isAuthenticated()){
        return next();
    }
    res.render('user/signin');
}

module.exports = router;

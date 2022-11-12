let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let cors = require('cors');
let passport = require('passport');
let passportJWT = require('passport-jwt');
let JWTStrategy = passportJWT.Strategy;
let ExtractJWT = passportJWT.ExtractJwt;
//modules for authentication
let session = require('express-session');
//let passport = require('passport');
let passportLocal = require('passport-local');
let localStrategy = passportLocal.Strategy;
let flash = require('connect-flash');


let mongoose = require('mongoose');
let db=require('./db');
//point mongoose to the db URI
mongoose.connect(db.URI);
let mongoDB = mongoose.connection;
mongoDB.on('error',console.error.bind(console,'connection Error:'));
mongoDB.once('open',()=>{
  console.log('connected to MongoDB...');
})

let indexRouter = require('../routes/index');
let usersRouter = require('../routes/users');
let booksRouter = require('../routes/book');

let app = express();

// view engine setup
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../../public')));
app.use(express.static(path.join(__dirname, '../../node_modules')));

//setup express session
app.use(Session({
  secret:'SomeSecret',
  saveUninitialized:false,
  //resave:false
  reSave:false
}));

//initialize flash
app.use(flash());
//initialize passport
app.use(passport.initialize());
app.use(passport.session());
//passport user Configuration
//Create a user model instance
let userModel = require('../model/user');
let User = userModel.User;
passport.use(User.createStrategy());
//serialize and deserialize the user info
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

let jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJWT.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = db.Secret;
let strategy = new JWTStrategy(jwtOptions,(jwt_payload,done)=>{
  User.findById(jwt_payload.id)
  .then(User=>{
    return done(null,User);
  })
  .catch(err=>{
    return done(err,false);

  });
});
passport.use(strategy);
//routing
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/bookList',booksRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
 next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error',{title:'Error'});
});

module.exports = app;

var express = require('express');
var router = express.Router();
var UserSchema = require('../models/Users');
var TeachSchema = require('../models/Teacher');
var CourseSchema = require('../models/Cours');
var mongoose = require('mongoose');
var dotenv = require('dotenv');

dotenv.config();



var csrf = require('csurf');

var csrfProtection = csrf({ cookie: true })

let user = "";
let nameTeach = "";
let UserInfo = [];
let TeachInfo = [];
let CourseInfo = [];
let IndexListeCourse = [];

mongoose.connect(process.env.DB_CONNECT,
  { useNewUrlParser : true },
  ()=>{
    console.log('connected ....');
  }
);


/* GET home page. */
router.get('/', async function(req, res, next) {
  IndexListeCourse = [];
  console.log(req.session);
  const Cours = await CourseSchema.find({});
  for (let index = 0; index < 3; index++) {
      IndexListeCourse.push(Cours[index]);
  }
  console.log(IndexListeCourse);
  
  user = req.session.user;
  if (req.session.name) {
    nameTeach = req.session.name;
    res.render('index', { title: 'Express', user : user,nameT : nameTeach, Mysession : req.session, cours : IndexListeCourse});
  } else {
    res.render('index', { title: 'Express', user : user, Mysession : req.session , cours : IndexListeCourse });
  }
});

router.get('/login', csrfProtection, function(req, res, next){
  if (user == null) {
    res.render('pages/sign-in', { csrfToken: req.csrfToken() });
  } else {
    console.log(user);  
    
    res.redirect('/');
  }
});



router.get('/course', csrfProtection, async function(req, res, next){
    if (user != null) {
      
      var ChargementCourse = [];
      var totalVariable = req.session;
      console.log(totalVariable);
      var UserCourseInfo = await UserSchema.find({ _id : totalVariable._id});
      console.log(UserCourseInfo);
      console.log(UserCourseInfo[0].cours);
      
      if (UserCourseInfo[0].cours == 'chimie') {
          ChargementCourse = await CourseSchema.find({ category : 'chimie'});
          console.log(ChargementCourse);
      } else if (UserCourseInfo[0].cours == 'physique') {
          ChargementCourse = await CourseSchema.find({ category : 'physique'});
          console.log(ChargementCourse);
      }
      res.render('pages/cours',{ user : user, Mysession: req.session, ttc : ChargementCourse });
    } else {
      res.render('pages/sign-in', { csrfToken: req.csrfToken(), alert : 'no-identify' });
    }
});



router.get('/course-content/:id', async function(req, res, next){
  var id = req.params.id;
  var courseDetail = await CourseSchema.find({ _id : id });
  
  console.log(courseDetail);
  var idA = courseDetail[0]._idAuthor;
  courseDetail = courseDetail[0];
  var U = await TeachSchema.find({ _id : idA });
  U = U[0];
  console.log(U);
  
  res.render('pages/cours-content', { user : user, cours : courseDetail, teach : U });
});

router.get('/course-setup/:id', function(req, res, next){
  var idUser = req.params.id;
  res.render('pages/cours-setup', { user : user, id : idUser });
});

router.get('/profile-student/:id', async function(req, res, next){
  var id = req.params.id;
  console.log(id);

 UserInfo = await UserSchema.find({ _id : id });
  console.log(UserInfo);

  const ObjectUser = {};
  ObjectUser._id = UserInfo[0]._id
  ObjectUser.name = UserInfo[0].username 
  ObjectUser.email = UserInfo[0].email
  ObjectUser.cours = UserInfo[0].cours
  if (UserInfo[0].image == 'undefined') {
    ObjectUser.image = ''  
  } else {
    ObjectUser.image = UserInfo[0].image
  }
  
   

  res.render('pages/student', { user : user, info : ObjectUser });
});

router.get('/profile-teacher/:id', async function(req, res, next){
  var id_T = req.params.id;
  console.log(id_T);

  TeachInfo = await TeachSchema.find({ _id : id_T });
  CourseInfo = await CourseSchema.find({ _idAuthor : id_T });

  console.log(CourseInfo);
  console.log(CourseInfo.length);
  
  const ObjectTeach = {};
  const ObjectCourse = {};

  ObjectTeach._id = TeachInfo[0]._id;
  ObjectTeach.username = TeachInfo[0].username;
  ObjectTeach.name = TeachInfo[0].name + ' ' + TeachInfo[0].firstname;
  ObjectTeach.grade = TeachInfo[0].grade;
  if (TeachInfo[0].image == '') {
    ObjectTeach.image = '';
  } else {
    ObjectTeach.image = TeachInfo[0].image;
  }

  if (TeachInfo[0].biographie == '') {
    ObjectTeach.biographie = '';
  } else {
    ObjectTeach.biographie = TeachInfo[0].biographie;
  }

  
  //console.log(ObjectCourse);
  
  res.render('pages/teacher', { user : user, info : ObjectTeach, cours : CourseInfo });
});

/*
router.get('/update-cours/:id', async function(req,res,next) {
    var id = req.params.id;
    var MyCourseInfo = await CourseSchema.find({ _id : id });    
    console.log(MyCourseInfo);
    MyCourseInfo = MyCourseInfo[0];
    res.render('pages/cours-update', { cours : MyCourseInfo });
});*/

router.get('/dash', (req,res,next)=>{
  res.render('dashboard/index');
});

router.get('/about', (req,res,next) => {
  res.render('pages/about');
});



module.exports = router;


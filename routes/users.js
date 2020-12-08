var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var dotenv = require('dotenv');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var session = require('express-session');
var passport = require('passport'); 
var UserSchema = require('../models/Users');
var TeacherSchema = require('../models/Teacher');
var teachUser = require('../Hash/Username');


dotenv.config();


mongoose.connect("mongodb+srv://zidane:eschool@2020@cluster0-dlebu.mongodb.net/test?retryWrites=true&w=majority",
  { useNewUrlParser : true },
  ()=>{
    console.log('connected ....');
  }
);

let user_session = ""
let id_session = ""

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/register', async (req,res,next)=>{

  let hash = bcrypt.hashSync(req.body.password, 100000000);

  const user = new UserSchema({
    username : req.body.username,
    email : req.body.email,
    paiement_number : req.body.number,
    cours : req.body.course,
    password: hash,
    image : "undefined",
    remember : req.body.remember
  });

  const userSaved = await user.save();
  if (userSaved) {
    console.log('user is registered');
    let user_session = req.session;
    
    
    user_session.user = req.body.username;
    id_session.id = user._id;
    user_session._id = id_session;
    console.log(user_session);
    
   res.render('pages/sign-in',{ message : true });

  }
});

router.post('/TEA', async (req,res,next)=>{

  let hash2 = bcrypt.hashSync('123', 100000000);
  let UserTeach = teachUser(req.body.name+req.body.firstname);
  const Teach = new TeacherSchema({
      name : req.body.name ,
      firstname : req.body.firstname,
      username : UserTeach,
      email : req.body.email,
      grade : req.body.grade,
      biographie : '',
      password : hash2,
      image : ''
  });

  const TeachSaved = await Teach.save();
  if (TeachSaved) {
    console.log('teacher is registered');
    res.redirect('/dash');
  }

})


router.post('/login', async (req,res,next)=>{

TypeUser = req.body.username[0] + req.body.username[1] + req.body.username[2];
console.log(TypeUser);

if (TypeUser === "TEA") {
  console.log('cest un enseignant');

  const TeachValid = await TeacherSchema.find({ username : req.body.username });
  const PasswordTeachValid = await bcrypt.compare(req.body.password, TeachValid[0].password);
  if (TeachValid && PasswordTeachValid) {
    console.log('Prof is auth !');
    user_session = req.session;
    let nameTeach = TeachValid[0].name + ' ' + TeachValid[0].firstname;
    id_session = TeachValid[0]._id;
    user_session.user = TeachValid[0].username;
    user_session.name = nameTeach;
    user_session._id = id_session;
    res.redirect('/');
  } else {
    console.log('mot de passe ou username ffaux !');
    
  }

} else {
    
  const EmailValid = await UserSchema.find({ email : req.body.username });
  console.log(EmailValid);


  const PasswordValid = await bcrypt.compare(req.body.password, EmailValid[0].password);
  console.log(PasswordValid);

  if (EmailValid && PasswordValid) {
    console.log('user is authentificate');
    user_session = req.session;
    user_session.user = EmailValid[0].username;
    id_session = EmailValid[0]._id;
    console.log(id_session);
    debugger
    user_session._id = id_session;
    console.log(user_session);
    
    res.redirect('/');
  } else {
    console.log(" mot de passe ou email est faux ");
    res.render('pages/sign-in', { err : "Mot de passe incorrect !"});
    
  }
  
}
  
});



router.post('/demande',(req,res,next)=>{});


router.post('/logout', (req,res,next)=>{
  req.session.destroy((err)=>{
    console.log(err.message);
  });
  res.render('pages/sign-in');
});





module.exports = router;

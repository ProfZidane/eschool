let express = require('express');
let router = express.Router();
var fs = require('fs');
var mongoose = require('mongoose');
var dotenv = require('dotenv');
var multer = require('multer');
var upload = multer({dest : 'public/uploads/Course/'});

var CourseSchema = require('../models/Cours');

dotenv.config();


mongoose.connect(process.env.DB_CONNECT,
  { useNewUrlParser : true },
  ()=>{
    console.log('connected ....');
  }
);

router.post('/createCourse', upload.any() , async function(req,res,next) {
   console.log(req.files);
    
    let oldPath0 = req.files[0].path;
    let newpath0 = req.files[0].path + '.png';
    let urlImg0 = '/uploads/Course/'+req.files[0].filename+'.png';

    let oldPath1 = req.files[1].path;
    let newpath1 = req.files[1].path + '.mp4';
    let urlVids1 = '/uploads/Course/'+req.files[1].filename+'.mp4';

    fs.rename(oldPath0,newpath0, (err)=>{
        if (err) throw err;
        console.log('completed .... ');
    });

    fs.rename(oldPath1,newpath1, (err)=>{
        if (err) throw err;
        console.log('completed .... ');
    });

    const course = new CourseSchema({
        title : req.body.title,
        category : req.body.category,
        description : req.body.description,
        contentCourse : req.body.editor1,
        image : urlImg0,
        video : urlVids1,
        _idAuthor: req.body._id
    });

    const courseSaved = await course.save();
    if (courseSaved) {
        console.log('course is registered');
        res.redirect('/');
    }   
});

/*
router.post('/updateCourse', function(req,res,next) {
    let id = req.body._id
    let idAuthor = req.body._author;
    CourseSchema.updateOne({ _id : id },
        {
            title: req.body.title,
            category: req.body.category,
            description: req.body.description,
            contentCourse: req.body.editor1,
        }, (err, result)=>{
            if (err) {
                throw err;
            }
            if (result) throw result;
        });
        //alert('Cours modifié !');
        res.redirect('/profile-teacher/'+idAuthor);
});
*/

router.get('/delete-cours/:id', async function(req,res,next) {
    let idc = req.params.id;
    let recup = await CourseSchema.findById(idc).exec();
    //console.log(recup);
    
    recup = recup._idAuthor;
    CourseSchema.deleteOne({ _id : idc }, (err)=>{
        if (err) {
            throw err;
        } 
    })
    console.log('supprimer');
    res.redirect('/');
})
module.exports = router;
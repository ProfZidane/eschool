let express = require('express');
let router = express.Router();
var fs = require('fs');
var multer = require('multer');
var upload = multer({dest : 'public/uploads/Students/'});
var upload2 = multer({ dest : 'public/uploads/Teachers/'});

var UserSchema = require('../models/Users');
var TeachSchema = require('../models/Teacher');



router.post('/ChangeProfile/:id', upload.any() , function (req, res) {
    
    console.log(req.files);
    let id = req.params.id;

    let oldPath = req.files[0].path;
    let newpath = req.files[0].path + '.png';
    let urlImg = '/uploads/Students/'+req.files[0].filename+'.png';
    fs.rename(oldPath,newpath, (err)=>{
        if (err) throw err;
        console.log('completed .... ');
    });

    UserSchema.updateOne({ _id : id }, { image : urlImg }, (err,result)=>{
        if (err) {
            console.log(err);
        } else {
            console.log(result);
        }
    });

    res.redirect('/profile-student/'+id);
    
});

router.post('/ChangeProfileTea/:id', upload2.any() , function (req, res) {
    
    console.log(req.files);
    let id = req.params.id;

    let oldPath = req.files[0].path;
    let newpath = req.files[0].path + '.png';
    let urlImg = '/uploads/Teachers/'+req.files[0].filename+'.png';
    fs.rename(oldPath,newpath, (err)=>{
        if (err) throw err;
        console.log('completed .... ');
    });

    TeachSchema.updateOne({ _id : id }, { image : urlImg }, (err,result)=>{
        if (err) {
            console.log(err);
        } else {
            console.log(result);
        }
    });

    res.redirect('/profile-teacher/'+id);
    
});

router.post('/changeBio/:id', (req,res,next)=>{
    let id = req.params.id;
    let biographie = req.body.biographie;

    TeachSchema.updateOne({ _id : id }, { biographie : biographie }, (err, result)=>{
        if (err) {
            throw err;
        }
        if (result) throw result;
    });
    res.redirect('/profile-teacher/'+id);
})



module.exports = router;
var mongoose = require('mongoose');
var schema = mongoose.Schema;

var TeacherSchema = new schema({
    name : {
        type: String
    },
    firstname : {
        type: String
    },
    username : {
        type: String
    },
    email : {
        type: String
    },
    grade : {
        type: String
    },
    biographie : {
        type: String
    },
    password : {
        type: String
    },
    image : {
        type: String
    }

});

module.exports = mongoose.model('Teach' , TeacherSchema);
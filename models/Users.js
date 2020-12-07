var mongoose = require('mongoose');
var schema =  mongoose.Schema;

var userSchema = new schema({
    username :  {
        type: String
    },
    email : {
        type: String
    },
    paiement_number : {
        type: String
    },
    cours : {
        type: String
    },
    password : {
        type : String
    },
    image : {
        type : String
    },
    remember : {
        type : Boolean
    }   

});

module.exports = mongoose.model('User',userSchema);
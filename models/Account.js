var passport  = require('passport');
var dotenv = require('dotenv');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

dotenv.config();


mongoose.connect(process.env.DB_CONNECT,
    { useNewUrlParser : true },
    ()=>{
      console.log('connected ....');
    }
  );


var Account = new Schema({
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
    remember : {
        type : Boolean
    }   
});

Account.plugin(passportLocalMongoose);


module.exports = mongoose.model('Account', Account);
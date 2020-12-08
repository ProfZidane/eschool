var dotenv = require('dotenv');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

dotenv.config();

mongoose.connect("mongodb+srv://zidane:eschool@2020@cluster0-dlebu.mongodb.net/test?retryWrites=true&w=majority",
    { useNewUrlParser : true },
    ()=>{
      console.log('connected ....');
    }
  );

var CoursSchema = new Schema({
    title : {
        type: String
    },
    category : {
        type: String
    },
    description : {
        type: String
    },
    contentCourse : {
        type: String
    },
    image : {
        type: String
    },
    video : {
        type: String
    },
    _idAuthor: {
        type: String
    }
});

module.exports = mongoose.model('Cours', CoursSchema);

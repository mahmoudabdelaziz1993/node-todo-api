var mongoose = require('mongoose');


var UserSchema = new mongoose.Schema({
	email:{
		type: String,
		required: true,
		minlength:1,
		trim:true,
		unique: true
	}
});


var User = mongoose.model('users',UserSchema);
module.exports={User};
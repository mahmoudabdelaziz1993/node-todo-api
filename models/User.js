var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
const bycrpt = require('bcrypt-nodejs');


var UserSchema = new mongoose.Schema({
	email:{
		type: String,
		required: true,
		minlength:1,
		trim:true,
		unique: true
	},
	password:{
		type: String,
		required: true,
		minlength:1,
		trim:true,
	},
	token:{
		type: String,
		
	}
	
});

//---------------------------------- genrate the token  ---------------------------
UserSchema.methods.genratetoken=function(){
	var token = jwt.sign({ id:this._id.toHexString() }, 'secretxxx').toString();
	return token ;
};


//----------------------------------- verify the token ---------------------------

//-----------------------------------bycrpt password ---------------------------
UserSchema.methods.encryptpass = function (password) {
	return bycrpt.hashSync(password,bycrpt.genSaltSync(10),null);
}

//--------------------------------- compare password with the hash ----------------
UserSchema.methods.validpassword = function(password){
	return bycrpt.compareSync(password, this.password);

}


var User = mongoose.model('users',UserSchema);
module.exports={User};
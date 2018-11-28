var express = require('express');
var router = express.Router();
var {User} = require('../models/User');
var {mongoose} = require('../config/db');
var _ = require('lodash');
var jwt = require('jsonwebtoken');

/* GET users listing. */
router.post('/', function(req, res, next) {
  var body = _.pick(req.body,['email','password']);
  var newuser = new User();
  newuser.email = body.email;
  newuser.password = newuser.encryptpass(body.password);
 // newuser.token = newuser.genratetoken();
  newuser.save((err,user)=>{
  	if (err) {
  		res.status(404).send(err);
  	}
  	if (user) {
  		user.token =newuser.genratetoken();
  		user.save((err,user)=>{
  			if (err) {res.status(404).send(err);}
  			if (user) {res.header('x-auth',user.token).status(200).send({token:user.token});}
  		});
  		
  	}
  })
});

router.get('/',authorized, function(req, res, next) {
  res.send(req.user)
});

module.exports = router;

function authorized(req,res,next) {
	var token = req.header('x-auth');
	var decoded;
	if (_.isEmpty(token)) {
		res.status(404).send({"message":" not authorized "});
	}else{

		try{
			var decoded = jwt.verify(token, 'secretxxx');

		}catch(e){
			res.status(404).send({"message":" invalid token dsadsa "});
		}
		User.findOne({ token:token,_id:decoded.id }, function (err, user) {
			if (err) {
				res.status(404).send({"message":" invalid token ...... "});
			}
			if (user) {
				req.user = user;
				req.token = token;
				next();
			}
		});


	}
};

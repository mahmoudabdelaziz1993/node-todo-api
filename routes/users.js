var express = require('express');
var router = express.Router();
var {User} = require('../models/User');
var {mongoose} = require('../config/db');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var{authorized} =  require('../config/authmiddleware');




/* signup users  */
router.post('/signup', function(req, res, next) {
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

/* signin users  */
router.post('/signin', function(req, res, next) {
  var body = _.pick(req.body,['email','password']);
  User.findOne({ email: body.email }, function (err, user) {
  	if (err) {res.status(404).send(err);}
  	if (user) {
  		if (!user.validpassword(body.password)) {
  			res.status(404).send({message:"incorrect password"});
  		}
  		res.header('x-auth',user.token).status(200).send({token:user.token});
  	}
  });
});





router.get('/',authorized, function(req, res, next) {
  res.send(req.user)
});

module.exports = router;

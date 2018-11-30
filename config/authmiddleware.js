var express = require('express');
var router = express.Router();
var {User} = require('../models/User');
var {mongoose} = require('./db');
var _ = require('lodash');
var jwt = require('jsonwebtoken');

var authorized = function (req,res,next) {
	var token = req.header('x-auth');
	var decoded;
	if (_.isEmpty(token)) {
		res.status(401).send({"message":" not authorized "});
	}else{

		try{
			var decoded = jwt.verify(token, 'secretxxx');

		}catch(e){
			res.status(404).send({"message":" invalid token  "});
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

module.exports={authorized};
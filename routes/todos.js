var express = require('express');
var router = express.Router();
var _ = require('lodash');
var {Todo} = require('../models/Todo');
var {mongoose} = require('../config/db');
var {authorized} = require('../config/authmiddleware');



/* GET home page. */
//-----------------------------listing todos-------------
router.get('/',authorized, function(req, res, next) {
  Todo.find({user:req.user._id},function (err,todos) {
  	if (err) {
  		res.status(404).send(err);
  	}
  	if (todos) {
  		res.status(200).send({todos});
  	}

  });
});

//----------------------------create todo-------------
router.post('/',authorized,function(req,res,next) {
	var newtodo = new Todo({
		text:req.body.text,
    user:req.user._id
	});
	newtodo.save(function (err,docs) {
		if (err) {
			res.status(400).send(err);
		}
		if (docs) {
			res.status(201).send(docs);
		}
	});
});

//-----------------------------fetch a todo -------------
router.get('/:id',authorized, function(req, res, next) {
  Todo.findById(req.params.id,function(err,todo){
  	if (err) {
  		res.status(404).send(err);
  	}
  	if (todo) {
  		res.status(302).send({todo});
  	}
  })
});


//-----------------------------delete a todo -------------
router.delete('/:id',authorized, function(req, res, next) {
  Todo.findOneAndDelete({_id:req.params.id,user:req.user.id},function(todo){
  	if (!todo) {
  		res.status(404).send();
  	}
  	res.status(200).send({todo});
  	
  });
});

//-----------------------------update a todo -------------
router.patch('/:id',authorized, function(req, res, next) {
	var id = req.params.id;
	var body = _.pick(req.body,['text','completed']);
	if (_.isBoolean(body.completed)&&body.completed) {
		body.completedAt= new Date().getTime();
	}else{
		body.completed = false;
		body.completedAt= null;
	}
  Todo.findOneAndUpdate({_id:id,user:req.user.id}, {$set:body}, function(err,docs){
  	if (err) {
  		res.status(404).send();
  	}
  	if (docs) {
  		res.status(200).send({docs});
  	
  	}
  })
});


module.exports = router;

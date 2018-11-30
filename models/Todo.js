const mongoose = require('mongoose');


var TodoSchema = new mongoose.Schema({
	text:{
		type: String,
		required: true,
		minlength:1,
		trim:true
	},
	completed:{
		type:Boolean,
		default:false
	},
	completedAt:{
		type:Number,
		default:null
	} ,
	user:{
		type:mongoose.Schema.Types.ObjectId,
		required:true
	}
});

var Todo = mongoose.model('todos',TodoSchema);
module.exports={Todo};
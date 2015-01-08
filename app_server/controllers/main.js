var wordbank = require('../models/wordbank');

/* GET home page */
exports.index = function(req, res){
	var words = wordbank.createWordbank();			
	var first = words[0];
	var cluse = first.clue;	
	var length = first.length
	res.render('index', {a:cluse, b:length});
};

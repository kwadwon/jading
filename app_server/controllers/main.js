var dt = require('../models/dict');

//create dictionary
var dict = new dt.dictionary();
dict = Object.freeze(dict);

/* GET home page */
module.exports.index = function(req, res){
	var sess = req.session;
	if (!sess.losses)
		sess.losses = 0;
	if (!sess.wins)
		sess.wins = 0;
	var letters = ['A','B','C','D','E','F','G','H','I','J','K',
		'L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
	res.render('index', {letters:letters, wins: sess.wins, losses:sess.losses});
};

/* Get new word */
module.exports.getNewWord = function(req, res){
	var newWordInfo = dict.getNewWord(); //0 is word, 1 is index 
	var sess = req.session;
	sess.word = newWordInfo[0];
	sess.wordIndex = newWordInfo[1];
	sess.right = 0;
	sess.wrong = 0;
	sendJsonResponse(res, 200, {'length': sess.word.length, 'wins': sess.wins, 'losses':sess.losses});
};

/* Take a guess and see if correct */
module.exports.wordGuess = function(req, res) {
	var sess = req.session;
	if (req.params && req.params.letter && sess.wordIndex) {
		var word = ''; //fill in with word if sess.wrong gets to 10
		//check if letter is in word && update wrong count accordingly
		var positions = getPositions(req.params.letter, sess.wordIndex);
		if (positions.length == 0) {
				++sess.wrong;
				if (sess.wrong == 10) {
					++sess.losses;	
					word = sess.word;
				}
		} else {
			//update word letter correct count 
			sess.right += positions.length;
			if (sess.right == sess.word.length) {
				++sess.wins;
			} 
		}
		sendJsonResponse(res, 200,
			{'losses': sess.losses, 'wins': sess.wins, 'limit': 10, 'placement': positions, 'wrong': sess.wrong, 'right': sess.right, 'word': word}
		);
	} 
};

function getPositions(letter, wordIndex) {
	var word = dict.getWordAtIndex(wordIndex).toUpperCase();
	var positions = [];
	for (var l in word) {
		if (word[l] == letter) {
			positions.push(l);
		}
	}
	return positions;
}

function sendJsonResponse(res, status, content) {
	res.status(200);
	res.json(content);
};

var ctrl = require('../app_server/controllers/main');
module.exports = function(app){
	app.get('/', ctrl.index);
	app.get('/word/new', ctrl.getNewWord);
	app.get('/word/guess/:letter', ctrl.wordGuess);
}


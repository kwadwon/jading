var lineReader = require('line-reader');

module.exports.dictionary = function() {
	var dict = [];
	lineReader.eachLine('/usr/share/dict/words', function(line)	{
		dict.push(line)
	});
	this.dict = dict;
}

module.exports.dictionary.prototype.getNewWord = function() {
	var index = Math.floor(Math.random() * this.dict.length);
	return [this.dict[index], index];
};

module.exports.dictionary.prototype.getWordAtIndex = function (index) {
	return this.dict[index];
}

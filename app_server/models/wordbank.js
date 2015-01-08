var words = ['apple', 'banana', 'shoobx', 'penguin','test'];
var clues = ['fruit', 'fruit', 'startup', 'black and white swimmer', 'test'];

exports.createWordbank = function() {
	bank = [];
	for (var i = 0; i < words.length; i++) {
		bank.push(new Word(words[i], clues[i]));
	}	
	return bank;
}

function Word(word, clue) {
	this.clue = clue;
	this.length = word.length;
	this.letters = {};
	for (var i = 0; i < this.length; i++) {
		if (this.letters.hasOwnProperty([word[i]])) {
			this.letters[word[i]].push(i);
		} else {
			this.letters[word[i]] = [i];
		}	
	}
}

// See if letter is contained in word, if so return positions
// otherwise undefined
Word.prototype.getPosition = function (letter) {
	return this.letters[letter];
};


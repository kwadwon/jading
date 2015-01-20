$(document).ready(function(){

var currentWordLength;

/*
 * When the page is loaded, start game by resetting.
 */
	reset();

/*
 * Get canvas element and set up pen
 */
	var canvas = document.getElementById('canvas'); 
	var pen = canvas.getContext("2d");

/*
 * functions to draw different pieces of gallow and man, 
 * and clear canvas
 */

	// draw bottom of gallow
	function drawLine(startX,startY,finishX,finishY) {
		pen.moveTo(startX,startY);
		pen.lineTo(finishX,finishY);
		pen.stroke();	
	}

	// clear canvas
	function clearCanvas() {
		canvas.width = canvas.width;
		pen.lineWidth = 5;
		pen.strokeStyle = "white";
	}

	// draw base
	function drawBase() {
		drawLine(100,300,300,300);
	}

	//draw left
	function drawLeft() {
		drawLine(140,300,140,50);
	}

	//draw top
	function drawTop() {
		drawLine(140,50,250,50);
	}

	//draw right
	function drawRight() {
		drawLine(250,50,250,70);
	}

	//draw head
	function drawHead() {
		pen.beginPath();
		pen.arc(250, 100, 30, 0, 2* Math.PI, false);
		pen.stroke();
		pen.closePath();
	}

	//draw body
	function drawBody() {
		drawLine(250,130,250,250);
	}

	//daw left arm
	function drawLeftArm() {
		drawLine(250,160,220,210);
	}

	//draw right arm
	function drawRightArm() {
		drawLine(250,160,280,210);
	}

	//draw left leg
	function drawLeftLeg() {
		drawLine(250,250,220,280);
	}

	//draw right leg
	function drawRightLeg() {
		drawLine(250,250,280,280);
	}

	// components of gallow and man
	var components = [drawBase, drawLeft, drawTop, drawRight, drawHead,
    drawBody, drawLeftArm, drawRightArm, drawLeftLeg, drawRightLeg];
 
	// draw differnet component of gallow and man
	function drawComponent(number) {
	 	components[number]();
	}

/*
 * Clear everything and reset for a new round
 */	
	function reset() {
		$.ajax({
			url: '/word/new',
			success: function(data) {
				clearBlanks();
				toggleLetterClicks(false);
				updateWordLength(data.length);
				addBlanks(data.length);	
				clearCanvas();
				updateWinAndLoss(data.wins,data.losses);
			},
			dataType: 'json'
		});
	}


	//map keycodes to letter buttons(a is 65, z is 90)
	$(document).keydown(function(e) {
		if (e.keyCode >= 65 && e.keyCode <=90) {
			var letter = $("#letters button")[e.keyCode - 65];
			if (!$(letter).prop('disabled')){
				$(letter).click();	
			}
		} 
	});

	// bind letters to click functions
	$("#letters button").each(function() {
		var letter = $(this).attr('id');
		var that = $(this);
		$(this).click(function() {
			$.get('/word/guess/' + letter,
				function(data){
					if (data.placement) {
						if (data.placement.length > 0) {
							fillInBlanksWithLetter(letter,data.placement);
						} else {
							drawComponent(data.wrong-1);
						}
						that.addClass('clicked');
						that.prop('disabled',true);
						checkIfGameWon(data.wrong, data.right, data.losses, data.wins, data.limit, data.word);
					}
				});
		});
	});

/*
 * Disable or enable letters
 */
 function toggleLetterClicks(isOff) {
		$("#letters button").each(function() {
			$(this).prop('disabled',isOff);
			isOff ? $(this).addClass('clicked') : $(this).removeClass('clicked');
		});
	}

/*
 * update win and losses span
 */
	function updateWinAndLoss(wins, losses) {
			$("#wins").html(wins);
			$("#losses").html(losses);
	}

/*
 * Determine if game is over. Check number of incorrect guesses
 * and check to see if all blanks have been filled in.
 */
	function checkIfGameWon(wrong, right, losses, wins, limit, word) {
		if (wrong == limit) {
			//lost
			checkGameHelper(false, losses, wins, word);
		} else if (right == currentWordLength) {
			//won
			checkGameHelper(true, losses, wins, word);
		}  
	}
	
/*
 * Helper function, sets timeout on toggleWinLoss, and updateWinAndLoss
 */
	function checkGameHelper(isWon, losses, wins, word) {
		toggleWinLoss(isWon, word)
		setTimeout(function(){
			toggleWinLoss(isWon, '');
			updateWinAndLoss(wins, losses);
			reset()
		}, 4000);
	}

/*
 * Once a new word is received, update the word length,
 */
	function updateWordLength(length) {
		currentWordLength = length;
	};

/*
 * reset guesses by removing all blank lines, lines re-added
 * with addBlanks function based on length of word 
 */
	function clearBlanks() {
		$("#guesses").empty();	
	}

	function addBlanks(length) {
		var ul = $("#guesses");
		for(var i = 0; i < length; i++) {
			var child = $("<li id=" + i + ">____</li>");
			ul.append(child);
		}
	};

/*
 * Blanks matching letters are replaced with letter
 */
	function fillInBlanksWithLetter(letter, placements) {
		for (var i = 0;i < placements.length; i++) {
			$("#"+placements[i]).html(letter);
		}
	};

/*
 * Toggle win/loss text
 */
	function toggleWinLoss(isWin, word) {
		if (isWin) {
			$("p.bg-primary").toggleClass('invisible');
		} else {
			if (word){
				$("p.bg-loss").html("Sorry buddy, the word was "+ word.toUpperCase());
			}
			$("p.bg-loss").toggleClass('invisible');
		}
	}
});

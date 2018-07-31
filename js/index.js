//Minimax Algorithm used was made by Ahmad Abdolsaheb and found at: https://medium.freecodecamp.org/how-to-make-your-tic-tac-toe-game-unbeatable-by-using-the-minimax-algorithm-9d690bad4b37 and adapted to fit my game

var screen = 1;
var gameType = 3;
var p1 = "X";
var p2 = "O";
var huPlayer = "O";
var aiPlayer = "X";
var player1 = true;
var win = false;
var draw = false;
var moveCount = 0;
var zeroCount = 0;
var i = 0;
document.getElementById("textIn").autofocus = true;
var origBoard = [0, 1, 2, 3, 4, 5, 6, 7, 8];
$(document).ready(startGame());

function startGame() {
	document.getElementById("textIn").focus();
	$("button").prop("disabled", true);
	checkInput();
}

function checkInput() {
	$("#textIn").keypress(function(e) {
		if (e.which == 13) {
			var term = $("#textIn").val();
			document.getElementById("textIn").value = "";
			term = term.toLowerCase();
			if (gameType == 3) {
				switch (term) {
					case "1":
					case "one":
						gameType = 1;
						playOne();
						break;
						break;
					case "2":
					case "two":
						gameType = 2;
						playTwo();
						break;
						break;
					case "0":
					case "zero":
						gameType = 0;
						playZero();
						break;
						break;
					default:
						$("#mainText").html(
							"Improper Request<br>One or two players<br>Please list number of players"
						);
				}
			} else if (win) {
				switch (term) {
					case "yes":
					case "y":
						window.location.reload(false);
						break;
					case "no":
					case "n":
						document.getElementById("gameTable").style.display = "none";
						document.getElementById("endGame").style.display = "block";
						$("#endGame").html("GAME OVER");
						break;
				}
			} else if (gameType == 2) {
				switch (term) {
					case "x":
						$("button").prop("disabled", false);
						p1 = "X";
						p2 = "O";
						screen = 3;
						playTwo2();
						$("#textIn").prop("disabled", true);
						break;

					case "o":
					case "0":
						$("button").prop("disabled", false);
						p1 = "O";
						p2 = "X";
						screen = 3;
						$("#textIn").prop("disabled", true);
						playTwo2();
						break;
				}
			} else if (gameType == 1) {
				switch (term) {
					case "x":
						$("button").prop("disabled", false);
						huPlayer = "X";
						aiPlayer = "O";
						screen = 3;
						$("#textIn").prop("disabled", true);
						playOne2();
						break;

					case "o":
					case "0":
						$("button").prop("disabled", false);
						huPlayer = "O";
						aiPlayer = "X";
						screen = 3;
						$("#textIn").prop("disabled", true);
						playOne2();
						break;
				}
			}
		}
	});
}

function playOne() {
	$("button").html("&nbsp");
	$("p").html("X or O?");
	screen = 2;
}

function playOne2() {
	moveCount++;
	if (player1) {
		$("#mainText").html("Your turn");
		humanTurn(huPlayer);
	} else {
		setTimeout(function() {
			$("#mainText").html("Computer's turn");
		var aiMoveIndex = minimax(origBoard, aiPlayer).index;
		origBoard[aiMoveIndex] = aiPlayer;
		var currButton = document.getElementById((aiMoveIndex + 1).toString());
		$(currButton).html(aiPlayer);
		currButton.val = aiPlayer;
		$(currButton).prop("disabled", true);
		checkForWin((aiMoveIndex + 1).toString());
		origBoard[aiMoveIndex] = aiPlayer;
		player1 = true;
		if (!win) {
			playOne2();
		}
		}, 700);
	}
}

function emptyIndices(board) {
	return board.filter(s => s != "O" && s != "X");
}

function winning(board, player) {
	if (
		(board[0] == player && board[1] == player && board[2] == player) ||
		(board[3] == player && board[4] == player && board[5] == player) ||
		(board[6] == player && board[7] == player && board[8] == player) ||
		(board[0] == player && board[3] == player && board[6] == player) ||
		(board[1] == player && board[4] == player && board[7] == player) ||
		(board[2] == player && board[5] == player && board[8] == player) ||
		(board[0] == player && board[4] == player && board[8] == player) ||
		(board[2] == player && board[4] == player && board[6] == player)
	) {
		return true;
	} else {
		return false;
	}
}

function minimax(newBoard, player) {
	//available spots
	var availSpots = emptyIndices(newBoard);

	// checks for the terminal states such as win, lose, and tie
	//and returning a value accordingly
	if (winning(newBoard, huPlayer)) {
		return { score: -10 };
	} else if (winning(newBoard, aiPlayer)) {
		return { score: 10 };
	} else if (availSpots.length === 0) {
		return { score: 0 };
	}

	// an array to collect all the objects
	var moves = [];

	// loop through available spots
	for (var i = 0; i < availSpots.length; i++) {
		//create an object for each and store the index of that spot
		var move = {};
		move.index = newBoard[availSpots[i]];

		// set the empty spot to the current player
		newBoard[availSpots[i]] = player;

		/*collect the score resulted from calling minimax 
      on the opponent of the current player*/
		if (player == aiPlayer) {
			var result = minimax(newBoard, huPlayer);
			move.score = result.score;
		} else {
			var result = minimax(newBoard, aiPlayer);
			move.score = result.score;
		}

		// reset the spot to empty
		newBoard[availSpots[i]] = move.index;

		// push the object to the array
		moves.push(move);
	}
	// if it is the computer's turn loop over the moves and choose the move with the highest score
	var bestMove;
	if (player === aiPlayer) {
		var bestScore = -10000;
		for (var i = 0; i < moves.length; i++) {
			if (moves[i].score > bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	} else {
		// else loop over the moves and choose the move with the lowest score
		var bestScore = 10000;
		for (var i = 0; i < moves.length; i++) {
			if (moves[i].score < bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	}

	// return the chosen move (object) from the moves array
	return moves[bestMove];
}

function playTwo() {
	$("button").html("&nbsp");
	$("#mainText").html("Player one, X or O?");
	checkInput();
}

function playTwo2() {
	if (player1 == true) {
		$("#mainText").html("Ready Player One");
		humanTurn(p1);
	} else {
		$("#mainText").html("Ready Player Two");
		humanTurn(p2);
	}
}

function playZero() {
	$("#mainText").html("");
	origBoard = [0, 1, 2, 3, 4, 5, 6, 7, 8];
	$("button").html("&nbsp");
	zeroCount++;
	loopIterationsX(1000);
}

function loopIterationsX(timeX) {
		setTimeout(function() {
			playX();
			moveCount++;
			if(moveCount < 9) {
				loopIterationsO(timeX);
			} else if(zeroCount < 10) {
				setTimeout(function() {
					origBoard = [0, 1, 2, 3, 4, 5, 6, 7, 8];
				$("button").html("&nbsp");
				zeroCount++;
				moveCount = 0;
					loopIterationsO(timeX/2)
				}, timeX);
				
			} else {
				setTimeout(warGame,1000);
			}
		}, timeX)
	}

function loopIterationsO(timeO) {
		setTimeout(function() {
			playO();
			moveCount++;
			if(moveCount < 9) {
				loopIterationsX(timeO);
			} else if(zeroCount < 10) {
				setTimeout(function() {
					origBoard = [0, 1, 2, 3, 4, 5, 6, 7, 8];
				$("button").html("&nbsp");
				zeroCount++;
				moveCount = 0;
					loopIterationsO(timeO/2)
				}, timeO);
				
			} else {
				setTimeout(warGame, 1000);
			}
		}, timeO)
	}

function playX() {
	var aiMoveIndex;
	if(moveCount == 0) {
		aiMoveIndex = Math.floor(Math.random() * 8);  
	} else {
		aiMoveIndex = minimax(origBoard, "X").index;
	}
	console.log(aiMoveIndex + "X");
	origBoard[aiMoveIndex] = "X";
	var currButton = document.getElementById((aiMoveIndex + 1).toString());
	$(currButton).html("X");
	currButton.val = "X";
	$(currButton).prop("disabled", true);
	origBoard[aiMoveIndex] = "X";
}

function playO() {
	var aiMoveIndex;
	if(moveCount == 0) {
		aiMoveIndex = Math.floor(Math.random() * 8);  
	} else {
		aiMoveIndex = minimax(origBoard, "O").index;
	}
	console.log(aiMoveIndex + "O");
	origBoard[aiMoveIndex] = "O";
	var currButton = document.getElementById((aiMoveIndex + 1).toString());
	$(currButton).html("O");
	currButton.val = "O";
	$(currButton).prop("disabled", true);
	origBoard[aiMoveIndex] = "O";
}

function warGame() {
	document.getElementById("gameTable").style.display = "none";
	document.getElementById("endGame").style.display = "block";
	$("#endGame").html(
		"A STRANGE GAME<br>THE ONLY WINNING MOVE IS NOT TO PLAY<br>HOW ABOUT A NICE GAME OF CHESS?"
	);
}

function humanTurn(playLet) {
	$("button").off().on("click", function() {
		$(this).html(playLet);
		this.val = playLet;
		$(this).prop("disabled", true);
		if (player1) {
			player1 = false;
		} else {
			player1 = true;
		}
		checkForWin(this.id);
		origBoard[this.id - 1] = playLet;
		if (!win) {
			if (gameType == 2) {
				playTwo2();
			} else {
				playOne2();
			}
		}
	});
}

function checkForWin(buttonId) {
	if (moveCount == 9) {
		drawCase();
	}
	var a = document.getElementById("1");
	var b = document.getElementById("2");
	var c = document.getElementById("3");
	var d = document.getElementById("4");
	var e = document.getElementById("5");
	var f = document.getElementById("6");
	var g = document.getElementById("7");
	var h = document.getElementById("8");
	var i = document.getElementById("9");
	switch (buttonId) {
		case "1":
			if (
				(a.innerHTML == b.innerHTML && c.innerHTML == b.innerHTML) ||
				(a.innerHTML == e.innerHTML && e.innerHTML == i.innerHTML) ||
				(a.innerHTML == d.innerHTML && d.innerHTML == g.innerHTML)
			) {
				winCase();
			}
			break;
		case "2":
			if (
				(b.innerHTML == e.innerHTML && e.innerHTML == h.innerHTML) ||
				(a.innerHTML == b.innerHTML && c.innerHTML == b.innerHTML)
			) {
				winCase();
			}
			break;
		case "3":
			if (
				(a.innerHTML == b.innerHTML && c.innerHTML == b.innerHTML) ||
				(c.innerHTML == e.innerHTML && e.innerHTML == g.innerHTML) ||
				(c.innerHTML == f.innerHTML && f.innerHTML == i.innerHTML)
			) {
				winCase();
			}
			break;
		case "4":
			if (
				(d.innerHTML == e.innerHTML && e.innerHTML == f.innerHTML) ||
				(a.innerHTML == d.innerHTML && d.innerHTML == g.innerHTML)
			) {
				winCase();
			}
			break;
		case "5":
			if (
				(d.innerHTML == e.innerHTML && e.innerHTML == f.innerHTML) ||
				(b.innerHTML == e.innerHTML && e.innerHTML == h.innerHTML)
			) {
				winCase();
			}
			break;
		case "6":
			if (
				(d.innerHTML == e.innerHTML && e.innerHTML == f.innerHTML) ||
				(c.innerHTML == f.innerHTML && f.innerHTML == i.innerHTML)
			) {
				winCase();
			}
			break;
		case "7":
			if (
				(g.innerHTML == h.innerHTML && h.innerHTML == i.innerHTML) ||
				(g.innerHTML == d.innerHTML && d.innerHTML == a.innerHTML) ||
				(g.innerHTML == e.innerHTML && e.innerHTML == c.innerHTML)
			) {
				winCase();
			}
			break;
		case "8":
			if (
				(g.innerHTML == h.innerHTML && h.innerHTML == i.innerHTML) ||
				(h.innerHTML == e.innerHTML && e.innerHTML == b.innerHTML)
			) {
				winCase();
			}
			break;
		case "9":
			if (
				(g.innerHTML == h.innerHTML && h.innerHTML == i.innerHTML) ||
				(i.innerHTML == f.innerHTML && f.innerHTML == c.innerHTML) ||
				(i.innerHTML == e.innerHTML && e.innerHTML == a.innerHTML)
			) {
				winCase();
			}
			break;
	}
}

function winCase() {
	$("button").prop("disabled", true);
	var playerWin = "";
	if (!player1) {
		playerWin = "Player One Won!<br>Play again?";
	} else {
		playerWin = "Player Two Won!<br>Play again?";
	}
	if (gameType == 1) {
		playerWin = "Computer won.<br>Play again?";
	}
	win = true;
	$("#mainText").html(playerWin);
	$("#textIn").prop("disabled", false);
	document.getElementById("textIn").focus();
}

function drawCase() {
	$("button").prop("disabled", true);
	win = true;
	$("#mainText").html("It's a draw.<br>Play again?");
	$("#textIn").prop("disabled", false);
	document.getElementById("textIn").focus();
}
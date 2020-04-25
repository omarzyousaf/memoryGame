document.addEventListener('DOMContentLoaded', function() {
	const gameContainer = document.getElementById('game');
	const COLORS = [];
	let card1 = null;
	let card2 = null;
	let cardsFlipped = 0;
	let yourScore = 0;
	let noClicking = false;
	let gameSet = false;

	let score = document.querySelector('#score');
	let startBtn = document.querySelector('#start');
	let resetBtn = document.querySelector('#reset');
	let playerList = document.querySelector('#playerList');
	let challengeCount = document.querySelector('#challengeCount');
	let name = document.querySelector('#name');

	//rebuld the Scoreboard with localStorage
	function loadOldScores() {
		let oldScoreboard = Object.entries(localStorage);
		for (let player of oldScoreboard) {
			let oldScore = document.createElement('li');
			oldScore.innerText = `${player[0]}: ${player[1]}`;
			playerList.append(oldScore);
		}
	}
	loadOldScores();

	//generating random RGB color combinations for squares
	function randomColorFunc(randColor) {
		const newColor = Math.floor(Math.random() * 16777215).toString(16);
		return newColor;
	}

	// here is a helper function to shuffle an array
	// it returns the same array with values shuffled
	// it is based on an algorithm called Fisher Yates if you want to research more
	function shuffle(array) {
		let counter = array.length;

		// While there are elements in the array
		while (counter > 0) {
			// Pick a random index
			let index = Math.floor(Math.random() * counter);

			// Decrease counter by 1
			counter--;

			// And swap the last element with it
			let temp = array[counter];
			array[counter] = array[index];
			array[index] = temp;
		}

		return array;
	}

	// this function loops over the array of colors
	// it creates a new div and gives it a class with the value of the color
	// it also adds an event listener for a click for each card
	function createDivsForColors(colorArray) {
		for (let i = 0; i < challengeCount.value; i++) {
			let color = colorArray[i];

			// create a new div
			const newDiv = document.createElement('div');

			// give it a class attribute for the value we are looping over
			newDiv.classList.add(color);

			// call a function handleCardClick when a div is clicked on
			newDiv.addEventListener('click', handleCardClick);

			// append the div to the element with an id of game
			gameContainer.append(newDiv);

			//
		}
	}

	// TODO: Implement this function!
	function handleCardClick(event) {
		if (noClicking) return;
		// you can use event.target to see which element was clicked; code for informative purposes
		console.log(`You just clicked #${event.target.classList[0]}`);
		console.log(event.target);
		console.log(event.target.classList);

		//adding to the running score with each click
		yourScore++;
		score.textContent = yourScore;

		//allowing cards to change colors
		let currentCard = event.target;
		currentCard.style.backgroundColor = '#' + currentCard.classList[0];

		//if no cards are selected upon click
		if (card1 === null) {
			card1 = currentCard;
			card1.classList.add('flipped');
			//if one is already selected, select the second
		} else if (card2 === null) {
			card2 = currentCard;
			card2.classList.add('flipped');
		}

		//if both cards are selected
		if (card1 && card2) {
			noClicking = true;
			//then analyze these options
			//if they have the same class - colors and flipped
			if (card1.className === card2.className) {
				cardsFlipped += 2;
				card1.removeEventListener('click', handleCardClick);
				card2.removeEventListener('click', handleCardClick);
				card1 = null;
				card2 = null;
				noClicking = false;
				//if not, then wait one second and reset everything
			} else {
				setTimeout(() => {
					card1.classList.remove('flipped');
					card2.classList.remove('flipped');
					card1.style.backgroundColor = '';
					card2.style.backgroundColor = '';
					card1 = null;
					card2 = null;
					noClicking = false;
				}, 1000);
			}
		}
		//for showing if User won
		let numberCards = Number(challengeCount.value);
		if (cardsFlipped === numberCards) {
			setTimeout(() => {
				alert('YOU WON!');
			}, 500);

			//set to local storage
			localStorage.setItem(name.value, `${yourScore} points with ${numberCards} cards`);

			//create a new line item on the Scoreboard
			let newScore = document.createElement('li');
			newScore.innerText = `${name.value}: ${yourScore} points with ${numberCards} cards`;
			playerList.append(newScore);

			//reset game to false
			gameSet = false;
		}
	}

	//starting a NEW GAME, reset all values, create and shuffle new array, set game to true
	function newGame() {
		if (gameSet === false) {
			cardsFlipped = 0;
			gameContainer.textContent = '';
			yourScore = 0;
			score.textContent = 0;
			let placeholder;
			COLORS.length = 0;
			for (let i = 0; i < challengeCount.value / 2; i++) {
				placeholder = randomColorFunc();
				COLORS.push(placeholder);
				COLORS.push(placeholder);
			}
			let shuffledColors = shuffle(COLORS);
			createDivsForColors(shuffledColors);
			gameSet = true;
		} else {
			return;
		}
	}

	// START button, trigger newGame()
	startBtn.addEventListener('click', function(e) {
		if (!name.value || !challengeCount.value) {
			alert('Please enter all values!');
		} else {
			gameSet = false;
			newGame();
		}
	});

	// RESET button to clear localStorage and the Scoreboard
	resetBtn.addEventListener('click', function(e) {
		localStorage.clear();
		challengeCount.value = '';
		name.value = '';
		playerList.innerText = '';
	});
});

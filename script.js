const gameContainer = document.getElementById('game');
let card1 = null;
let card2 = null;
let cardsFlipped = 0;
let noClicking = false;
// const COLORS = [ 'red', 'blue', 'green', 'orange', 'purple', 'red', 'blue', 'green', 'orange', 'purple' ];
const COLORS = [];
let gameCounter = 0;
let startBtn = document.querySelector('#start');
let resetBtn = document.querySelector('#reset');
let gameSet = false;

let yourScore = 0;
let score = document.querySelector('#score');

let challengeCount = document.querySelector('#challengeCount');

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
	// you can use event.target to see which element was clicked
	console.log('you just clicked #', event.target.classList[0]);

	//running score
	yourScore++;
	score.textContent = yourScore;
	console.log(event.target);
	console.log(event.target.classList);
	//allowing cards to change colors
	let currentCard = event.target;
	currentCard.style.backgroundColor = '#' + currentCard.classList[0];

	//if none are selected
	if (card1 === null) {
		card1 = currentCard;
		card1.classList.add('flipped');
		//if one is already selected, select the second
	} else if (card2 === null) {
		card2 = currentCard;
		card2.classList.add('flipped');
	}

	//if both are selected
	if (card1 && card2) {
		noClicking = true;
		//then analyze these options
		//if they have the same class - colors and flipped
		if (card1.className === card2.className) {
			gameCounter += 2;
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
	//for gameCounter and showing if User won!
	let finalCount = Number(challengeCount.value);
	if (gameCounter === finalCount) {
		alert('YOU WON!');
		gameCounter = 0;
		gameSet = false;
	}
}

let newGame = function newGame() {
	if (gameSet === false) {
		gameCounter = 0;
		gameContainer.textContent = '';
		yourScore = 0;
		score.textContent = 0;
		let placeholder;
		COLORS.length = 0;
		for (let i = 0; i < Math.floor(challengeCount.value / 2); i++) {
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
};

// HIT THE START BUTTON TO START THE GAME
startBtn.addEventListener('click', function(e) {
	gameSet = false;
	newGame();
});

// HIT THE RESET BUTTON TO RESET THE BOARD
resetBtn.addEventListener('click', function(e) {
	gameSet = false;
	newGame();
});

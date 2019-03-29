/*
 * Create a list that holds all of your cards
 */
const deck = document.querySelector('.deck');
const stars = document.querySelector('.stars');
const moves = document.querySelector('.moves');
const restart = document.querySelector('.restart');
const winningBg = document.querySelector('.winning-bg');
const replayBtn = document.querySelector('.replay-btn');
const winningTime = document.querySelector('.winning-time');
const winningMoves = document.querySelector('.winning-moves');
const winningRating = document.querySelector('.winning-rating');
const timer = document.querySelector('.timer');
const cards = [...deck.children];

let movesCounter = 0;
let matches = 0;
let starsCounter = 3;
let openCards = [];

// timer
let timerDays = document.querySelector('#days');
let timerHours = document.querySelector('#hours');
let timerMinutes = document.querySelector('#minutes');
let timerSeconds = document.querySelector('#seconds');
let elapsedSeconds = 0;
let days = 0;
let hours = 0;
let minutes = 0;
let seconds = 0;

let gameStarted = false;
let timerInterval;

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

function initGame() {
    moves.textContent = `${movesCounter} moves`;
    // shuffle the list of cards using the provided "shuffle" method below
    const shuffledCard = shuffle(cards);
    for (const card of shuffledCard) {
        deck.appendChild(card);
        card.classList.remove('open', 'show', 'match', 'mismatchedCard');
        card.addEventListener('click', openCard);
    }
}

initGame();

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

// Add open and show classes to card
function openCard(card) {
    startTimer();
    if (!card.target.classList.contains('open') && !card.target.classList.contains('fa')) {
        card.target.classList.add('open', 'show');
    }

    cardsMatch(card);

}

function mismatchedCard(firstCard, secondCard) {
    firstCard.classList.add('mismatched-card');
    secondCard.classList.add('mismatched-card');
}

function closeCard(firstCard, secondCard) {
    setTimeout(() => {
        firstCard.classList.remove('open', 'show', 'mismatched-card');
        secondCard.classList.remove('open', 'show', 'mismatched-card');
    }, 550);
}

// for Matching the cards
function cardsMatch(card) {
    if (card.target !== openCards[0] && card.target.firstElementChild.className !== 'fa') {
        openCards.push(card.target);
    }
    if (openCards.length === 2) {
        const firstCard = openCards[0].firstElementChild.classList.item(1);
        const secondCard = openCards[1].firstElementChild.classList.item(1);

        if (firstCard === secondCard) {
            matches++;
            matchingCards(openCards[1], openCards[0]);
        } else {
            mismatchedCard(openCards[0], openCards[1]);
            closeCard(openCards[0], openCards[1]);
        }

        openCards = [];
        countMoves();
        checkGameWin();
    }

    function matchingCards(firstCard, secondCard) {
        firstCard.classList.add('match');
        secondCard.classList.add('match');
    }


    // Game displays the current number of moves a user has made.
    function countMoves() {
        movesCounter++;
        moves.textContent = movesCounter === 1 ? `${movesCounter} move` : `${movesCounter} moves`;
        ratingCounter();
    }

    function ratingCounter() {
        if (movesCounter === 10) {
            starsCounter--;
            stars.lastElementChild.firstElementChild.classList.replace('fa-star', 'fa-star-o');
        } else if (movesCounter === 20) {
            starsCounter--;
            stars.children[1].firstElementChild.classList.replace('fa-star', 'fa-star-o');
        }
    }


    // A restart button allows the player to reset the game board, the timer, and the star rating.
    function restartGame() {
        winningBg.style.display = 'none';
        openCards = [];
        initGame();
        resetStars();
        restMoves();
        resetTimer();
        resetMatches();
        stopTimer();
    }

    restart.addEventListener('click', restartGame);
    replayBtn.addEventListener('click', restartGame);

    function checkGameWin() {
        if (matches === 8) {
            openModal();
            stopTimer();
        }
    }
}

function addTowDigits(num) {
    return (num.toString().length < 2 ? `0${num}` : num).toString();
}

/* When a user wins the game,
 a modal appears to congratulate the player and ask if they want to play again.
 It should also tell the user how much time it took to win the game, and what the star rating was. */
function openModal() {
    winningTime.textContent = `You completed the game successfully in ${timer.textContent}.`;
    winningMoves.textContent = `You've moved ${movesCounter}.`;
    winningRating.textContent = `Your score is ${starsCounter} of 3.`;
    setTimeout(() => {
        winningBg.style.display = 'inline-block';
    }, 550);
}

// When the player starts a game, a displayed timer should also start. Once the player wins the game, the timer stops.
function setTimer() {
    let remainderSeconds = ++elapsedSeconds;
    days = Math.floor(remainderSeconds / 86400);
    if (days === 0) {
        timerMinutes.style.display = 'none';
    } else {
        timerMinutes.style.display = 'inline';
        timerMinutes.textContent = `${addTowDigits(days)} days`;
    }

    hours = Math.floor(remainderSeconds / 3600);
    if (hours === 0) {
        timerMinutes.style.display = 'none';
    } else {
        timerMinutes.style.display = 'inline';
        timerMinutes.textContent = `${addTowDigits(hours)} hours`;
    }

    remainderSeconds = remainderSeconds % 3600;
    minutes = Math.floor(remainderSeconds / 60);
    if (minutes === 0) {
        timerMinutes.style.display = 'none';
    } else {
        timerMinutes.style.display = 'inline';
        timerMinutes.textContent = `${addTowDigits(minutes)} minutes`;
    }

    seconds = remainderSeconds % 60;
    if (seconds >= 1) {
        timerSeconds.textContent = `${addTowDigits(seconds)} seconds`;
    }
    timerSeconds.textContent = seconds >= 1 ? `${addTowDigits(seconds)} seconds` : '00';
}

function startTimer() {
    if (!gameStarted) {
        gameStarted = true;
        timerInterval = setInterval(setTimer, 1000);
    }
}

function stopTimer() {
    gameStarted = false;
    clearInterval(timerInterval);
}

function resetStars() {
    starsCounter = 3;
    stars.lastElementChild.firstElementChild.classList.replace('fa-star-o', 'fa-star');
    stars.children[1].firstElementChild.classList.replace('fa-star-o', 'fa-star');
    stars.firstElementChild.firstElementChild.classList.replace('fa-star-o', 'fa-star');
}

function restMoves() {
    movesCounter = 0;
    moves.textContent = movesCounter;
}

function resetTimer() {
    elapsedSeconds = 0;
    days = 0;
    hours = 0;
    minutes = 0;
    seconds = 0;

    timerDays.textContent = '';
    timerDays.style.display = 'none';
    timerHours.textContent = '';
    timerHours.style.display = 'none';
    timerMinutes.textContent = '';
    timerMinutes.style.display = 'none';
    timerSeconds.textContent = '00';
}

// Reset the matching counter to 0
function resetMatches() {
    matches = 0;
}

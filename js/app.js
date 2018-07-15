/*
 * Create a list that holds all of your cards
 */

let cards = ['fa-diamond', 'fa-diamond',
            'fa-paper-plane-o', 'fa-paper-plane-o',
            'fa-anchor', 'fa-anchor',
            'fa-bolt', 'fa-bolt',
            'fa-cube', 'fa-cube',
            'fa-leaf', 'fa-leaf',
            'fa-bicycle', 'fa-bicycle',
            'fa-bomb', 'fa-bomb'];
            //stores all the cards in an array

function generateCard(card) { //gives HTML for each card
    return `<li class="card" data-card="${card}"><i class="fa ${card}"></i></li>`;
}


/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

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




function initGame() {
  const deck = document.querySelector('.deck'); //calls deck ul
    let cardHTML = shuffle(cards).map(function(card) { //map calls all the cards and translates into the function
        return generateCard(card); //creates array of strings
        });
    deck.innerHTML  = cardHTML.join(''); //turns the strings into HTML
}

function addMove() { //maintains count of moves
  moves++;
  const movesTest = document.querySelector('.moves');
    if (moves === 1) { //correct formatting
      movesTest.innerHTML = moves + "&nbsp;&nbsp;Move";
    } else {
      movesTest.innerHTML = moves + "&nbsp;&nbsp;Moves"
    }
}

function starScore() { //when to remove a star
  if (moves === 16 || moves === 24) {
    demote();
  }
}

function demote() {
  const starList = document.querySelectorAll('.stars li');
  for (star of starList) {
    if (star.style.display !== 'none') {
      star.style.display = 'none';
      break;
    }
  }
}

function getStars() {
  stars = document.querySelectorAll('.stars li');
  starCount = 0;
  for (star of stars) {
      if (star.style.display !== 'none') {
        starCount++;
      }
  }
  return starCount;
}

function startClock() { //starts timer
    clockId = setInterval(() => {
    time++; //increases the time by one second
    displayTime();
    console.log(time);
  }, 1000);
}

function displayTime() {
  let clock = document.querySelector('.clock');
  let minutes = Math.floor(time / 60); //because timer is calculating seconds this gets it in minutes
  let seconds = time % 60; //the remainder from minutes are the seconds

  if (seconds < 10) { //correct formatting
    clock.innerHTML = `${minutes}:0${seconds}`;
  } else {
    clock.innerHTML = `${minutes}:${seconds}`;
  }
}

function stopClock() {
  clearInterval(clockId);
}

function gameOver() {
  stopClock();
  displayModal();
}

function displayModal() {
  let modal = document.querySelector('.modalBackground');
  modal.classList.toggle('hide');
}

function writeModalStats() {
  let timeStat = document.querySelector('.modalTime');
  let clockTime = document.querySelector('.clock').innerHTML;
  let starsStat = document.querySelector('.modalStars');
  const stars = getStars();
  let movesStat = document.querySelector('.modalMoves');

  timeStat.innerHTML = `Time: ${clockTime}`;
  starsStat.innerHTML = `Stars: ${stars}`;
  movesStat.innerHTML = `Moves: ${moves}`;
}

document.querySelector('.modalCancel').addEventListener('click', () => {
  displayModal();
});

document.querySelector('.modalReplay').addEventListener('click', () => {
  console.log('replay');
});


//SETS GAME BOARD
initGame();

let allCards = document.querySelectorAll('.card'); //selects all in the card class from html
openCards = []; //open array to keep track of open cards
let moves = 0;
let time = 0;
let clockOff = true;
let clockId;

//modal testing
time = 121;
displayTime();
moves = 16;
starScore();
writeModalStats();
displayModal();


displayTime();

allCards.forEach(function(card) { //applies to all cards
     card.addEventListener('click', function(e) {

  if (!card.classList.contains('open') && !card.classList.contains('show') && !card.classList.contains('match')) {    //prevents flipped card from passing to array

    if (clockOff) { //starts game timer
        startClock();
        clockOff = false;
    }

         openCards.push(card); //pushes clicked card element to array
         card.classList.add('open', 'show'); //shows card

if (openCards.length === 2) { //limits flipped cards per turn to two
  addMove();
  starScore();

//CARDS MATCH
if (openCards[0].dataset.card === openCards[1].dataset.card) {

let pairs = (cards / 2);

    openCards[0].classList.add('match');
    openCards[0].classList.add('open');
    openCards[0].classList.add('show');

    openCards[1].classList.add('match');
    openCards[1].classList.add('open');
    openCards[1].classList.add('show');

    openCards = [];

          if ([(card.classList.contains('match') / 2)] === pairs) {
            gameOver();
          }
} else {
  //CARDS DON'T MATCH
    setTimeout(function() {
          openCards.forEach(function(card) { //times out shown cards
          card.classList.remove('open', 'show');
        });
            openCards = []; //empties array upon timeout
                }, 1000); //later can try to prevent user from three clicks
              }
             }
         }
     });
 });

//stores all the cards in an array
let cards = ['fa-diamond', 'fa-diamond',
            'fa-paper-plane-o', 'fa-paper-plane-o',
            'fa-anchor', 'fa-anchor',
            'fa-bolt', 'fa-bolt',
            'fa-cube', 'fa-cube',
            'fa-leaf', 'fa-leaf',
            'fa-bicycle', 'fa-bicycle',
            'fa-bomb', 'fa-bomb'];

//gives HTML for each card
function generateCard(card) {
    return `<li class="card" data-card="${card}"><i class="fa ${card}"></i></li>`;
}

//shuffle function from http://stackoverflow.com/a/2450976
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

//sets up game board
function initGame() {
  const deck = document.querySelector('.deck'); //calls deck ul
    let cardHTML = shuffle(cards).map(function(card) { //map calls all the cards and translates into the function
        return generateCard(card); //creates array of strings
        });
    deck.innerHTML  = cardHTML.join(''); //turns the strings into HTML
}

//maintains count of moves
function addMove() {
  moves++;
  const movesTest = document.querySelector('.moves');
    if (moves === 1) { //correct formatting
      movesTest.innerHTML = moves + "&nbsp;&nbsp;Move";
    } else {
      movesTest.innerHTML = moves + "&nbsp;&nbsp;Moves"
    }
}

//when to remove a star
function starScore() {
  if (moves === 16 || moves === 24) {
    demote();
  }
}

//'removes' a star
function demote() {
  const starList = document.querySelectorAll('.stars li');
  for (star of starList) {
    if (star.style.display !== 'none') {
      star.style.display = 'none';
      break;
    }
  }
}

//counts number stars
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

//starts timer
function startClock() {
    clockId = setInterval(() => {
    time++; //increases the time by one second
    displayTime();
    console.log(time);
  }, 1000);
}

//shows time
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

//stops timer
function stopClock() {
  clearInterval(clockId);
}

//ends game and triggers modal
function gameOver() {
  stopClock();
  writeModalStats();
  displayModal();
}

//displays modal
function displayModal() {
  let modal = document.querySelector('.modalBackground');
  modal.classList.toggle('hide');
}

//lists stats in modal
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

//cancel button on modal
document.querySelector('.modalCancel').addEventListener('click', () => {
  displayModal();
});

//replay button on modal
document.querySelector('.modalReplay').addEventListener('click', replay);

//restart button on game
document.querySelector('.restart').addEventListener('click', reset);

//resets game
function reset() {
  stopClock();
  clockOff = true;
  time = 0;
  displayTime();

  moves = 0;
  document.querySelector('.moves').innerHTML = "moves";

  stars = 0;
  const starList = document.querySelectorAll('.stars li');
  for (star of starList) {
    star.style.display = 'inline';
  }
}

//replay from modal button
function replay() {
  reset();
  displayModal();

  const cards = document.querySelectorAll('.deck li');
  for (let card of cards) {
    card.className = 'card';
  }
}




//starts game
initGame();

//global variables
let allCards = document.querySelectorAll('.card'); //selects all in the card class from html
let openCards = []; //open array to keep track of open cards
let moves = 0;
let time = 0;
let clockOff = true;
let clockId;
let matched = 0;

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

//if cards match
if (openCards[0].dataset.card === openCards[1].dataset.card) {

    const pairs = 8;

    openCards[0].classList.add('match');
    openCards[0].classList.add('open');
    openCards[0].classList.add('show');

    openCards[1].classList.add('match');
    openCards[1].classList.add('open');
    openCards[1].classList.add('show');

    openCards = [];
    matched++;

            if (matched === pairs) {
                gameOver();
            }

} else {
  //if cards don't match
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

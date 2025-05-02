// Memory Matching Game
const memoryGame = document.getElementById('memory-game');
const memoryMessage = document.getElementById('memory-message');
let cards = [];
let flippedCards = [];
let matchedPairs = 0;

const emojis = ['😊', '⭐', '🚀', '💡', '🎨', '📚', '😊', '⭐', '🚀', '💡', '🎨', '📚'];

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function createMemoryCards() {
  shuffleArray(emojis);
  emojis.forEach((emoji, index) => {
    const card = document.createElement('div');
    card.classList.add('memory-card');
    card.dataset.index = index;
    card.textContent = '?';
    card.addEventListener('click', flipCard);
    cards.push(card);
    memoryGame.appendChild(card);
  });
}

function flipCard() {
  if (flippedCards.length < 2 && !this.classList.contains('flipped')) {
    this.classList.add('flipped');
    this.textContent = emojis[this.dataset.index];
    flippedCards.push(this);

    if (flippedCards.length === 2) {
      setTimeout(checkMatch, 1000);
    }
  }
}

function checkMatch() {
  const [card1, card2] = flippedCards;
  if (card1.textContent === card2.textContent) {
    memoryMessage.textContent = 'Match found!';
    matchedPairs++;
    if (matchedPairs === emojis.length / 2) {
      memoryMessage.textContent = 'You won the Memory Game!';
    }
    flippedCards = [];
  } else {
    memoryMessage.textContent = 'Try again!';
    setTimeout(() => {
      card1.classList.remove('flipped');
      card2.classList.remove('flipped');
      card1.textContent = '?';
      card2.textContent = '?';
      flippedCards = [];
      memoryMessage.textContent = '';
    }, 1000);
  }
}

createMemoryCards();

// Number Slide Puzzle Game
const numberPuzzle = document.getElementById('number-puzzle');
const shuffleButton = document.getElementById('shuffle-button');
const puzzleMessage = document.getElementById('puzzle-message');
let puzzleTiles = [];
const gridSize = 3;
let emptyTileIndex = gridSize * gridSize - 1; // Bottom right

function createPuzzleTiles() {
  const numbers = Array.from({ length: gridSize * gridSize - 1 }, (_, i) => i + 1);
  numbers.push(null); // Represent the empty tile
  shuffleArray(numbers);

  numbers.forEach((number, index) => {
    const tile = document.createElement('div');
    tile.classList.add('puzzle-tile');
    tile.textContent = number || '';
    tile.dataset.index = index;
    if (number === null) {
      tile.classList.add('empty');
    } else {
      tile.addEventListener('click', moveTile);
    }
    puzzleTiles.push(tile);
    numberPuzzle.appendChild(tile);
  });
}

function shufflePuzzle() {
  let numbers = puzzleTiles.map(tile => tile.textContent === '' ? null : parseInt(tile.textContent));
  // Simple shuffling - can be improved for solvability
  shuffleArray(numbers);
  numbers.forEach((number, index) => {
    puzzleTiles[index].textContent = number || '';
    puzzleTiles[index].className = 'puzzle-tile';
    puzzleTiles[index].dataset.index = index;
    if (number === null) {
      puzzleTiles[index].classList.add('empty');
    } else {
      puzzleTiles[index].addEventListener('click', moveTile);
    }
  });
  puzzleMessage.textContent = '';
}

function moveTile() {
  const clickedIndex = parseInt(this.dataset.index);
  const emptyIndex = puzzleTiles.findIndex(tile => tile.textContent === '');

  const clickedRow = Math.floor(clickedIndex / gridSize);
  const clickedCol = clickedIndex % gridSize;
  const emptyRow = Math.floor(emptyIndex / gridSize);
  const emptyCol = emptyIndex % gridSize;

  if (
    (Math.abs(clickedRow - emptyRow) === 1 && clickedCol === emptyCol) ||
    (Math.abs(clickedCol - emptyCol) === 1 && clickedRow === emptyRow)
  ) {
    [puzzleTiles[clickedIndex].textContent, puzzleTiles[emptyIndex].textContent] = [puzzleTiles[emptyIndex].textContent, puzzleTiles[clickedIndex].textContent];
    puzzleTiles[clickedIndex].classList.add('empty');
    puzzleTiles[emptyIndex].classList.remove('empty');
    puzzleTiles[clickedIndex].addEventListener('click', moveTile);
    puzzleTiles[emptyIndex].removeEventListener('click', moveTile);
    checkPuzzleWin();
  }
}

function checkPuzzleWin() {
  const currentOrder = puzzleTiles.map(tile => tile.textContent === '' ? null : parseInt(tile.textContent));
  const winningOrder = Array.from({ length: gridSize * gridSize - 1 }, (_, i) => i + 1);
  winningOrder.push(null);

  if (JSON.stringify(currentOrder) === JSON.stringify(winningOrder)) {
    puzzleMessage.textContent = 'You solved the puzzle!';
  }
}

createPuzzleTiles();
shuffleButton.addEventListener('click', shufflePuzzle);
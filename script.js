// Initialize AOS animation library
AOS.init({
  duration: 800,
  easing: 'ease-in-out',
  once: true
});

// Game 1: Math Adventure
const mathQuestions = [
  { question: "5 × 4 = ?", answer: 20 },
  { question: "12 - 7 = ?", answer: 5 },
  { question: "8 + 9 = ?", answer: 17 },
  { question: "15 ÷ 3 = ?", answer: 5 },
  { question: "7 × 6 = ?", answer: 42 }
];

let currentMathQuestion = 0;
let starsCollected = 0;

const mathQuestionEl = document.getElementById('math-question');
const mathAnswerEl = document.getElementById('math-answer');
const mathSubmitBtn = document.getElementById('math-submit');
const mathFeedbackEl = document.getElementById('math-feedback');
const nextMathBtn = document.getElementById('next-math');
const progressStars = document.querySelectorAll('.progress-stars .star');
const mathProgressBar = document.getElementById('math-progress');

function setupMathGame() {
  mathQuestionEl.textContent = mathQuestions[currentMathQuestion].question;
  mathAnswerEl.value = '';
  mathAnswerEl.focus();
  mathFeedbackEl.classList.add('hidden');

  // Update progress
  const progress = (currentMathQuestion / mathQuestions.length) * 100;
  mathProgressBar.innerHTML = `<div style="width: ${progress}%"></div>`;
}

mathSubmitBtn.addEventListener('click', checkMathAnswer);
mathAnswerEl.addEventListener('keypress', function (e) {
  if (e.key === 'Enter') checkMathAnswer();
});

function checkMathAnswer() {
  const userAnswer = parseInt(mathAnswerEl.value);
  const correctAnswer = mathQuestions[currentMathQuestion].answer;

  if (userAnswer === correctAnswer) {
    starsCollected++;
    if (starsCollected <= 3) {
      progressStars[starsCollected - 1].classList.add('collected');
    }

    mathFeedbackEl.querySelector('.feedback-content').className = 'feedback-content feedback-success';
    mathFeedbackEl.querySelector('.feedback-title').textContent = 'Correct! ';
    mathFeedbackEl.querySelector('.feedback-text').textContent = `The answer is ${correctAnswer}. You've collected ${starsCollected} stars!`;
    createConfetti();
  } else {
    mathFeedbackEl.querySelector('.feedback-content').className = 'feedback-content feedback-error';
    mathFeedbackEl.querySelector('.feedback-title').textContent = 'Oops! ';
    mathFeedbackEl.querySelector('.feedback-text').textContent = `The correct answer is ${correctAnswer}. Try again!`;
  }

  mathFeedbackEl.classList.remove('hidden');
}

nextMathBtn.addEventListener('click', function () {
  currentMathQuestion = (currentMathQuestion + 1) % mathQuestions.length;
  setupMathGame();
});

// Game 2: Word Explorer
const wordLists = {
  3: ['cat', 'dog', 'sun', 'hat', 'pen'],
  4: ['fish', 'bird', 'cake', 'rain', 'book'],
  5: ['apple', 'tiger', 'house', 'water', 'smile']
};

let currentWordLength = 3;
let currentWord = '';
let currentLetters = [];
let wordScore = 0;
let wordRound = 1;

const letterTilesContainer = document.getElementById('letter-tiles');
const wordDisplayEl = document.getElementById('word-display');
const wordScoreEl = document.getElementById('word-score');
const wordTargetEl = document.getElementById('word-target');
const submitWordBtn = document.getElementById('submit-word');
const shuffleLettersBtn = document.getElementById('shuffle-letters');
const wordFeedbackEl = document.getElementById('word-feedback');
const nextWordBtn = document.getElementById('next-word');

function setupWordGame() {
  // Select a random word of current length
  const words = wordLists[currentWordLength];
  currentWord = words[Math.floor(Math.random() * words.length)];

  // Create letter tiles
  currentLetters = shuffleArray([...currentWord.toUpperCase()]);
  renderLetterTiles();

  // Clear word display
  wordDisplayEl.textContent = '';

  // Update UI
  wordTargetEl.textContent = currentWordLength;
  wordFeedbackEl.classList.add('hidden');
}

function renderLetterTiles() {
  letterTilesContainer.innerHTML = '';
  currentLetters.forEach(letter => {
    const tile = document.createElement('div');
    tile.className = 'letter-tile';
    tile.textContent = letter;
    tile.addEventListener('click', selectLetter);
    letterTilesContainer.appendChild(tile);
  });
}

function selectLetter(e) {
  const letter = e.target.textContent;
  wordDisplayEl.textContent += letter;
  e.target.classList.add('selected');
  e.target.removeEventListener('click', selectLetter);
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

shuffleLettersBtn.addEventListener('click', function () {
  currentLetters = shuffleArray(currentLetters);
  renderLetterTiles();
  wordDisplayEl.textContent = '';
});

submitWordBtn.addEventListener('click', function () {
  const userWord = wordDisplayEl.textContent.toLowerCase();

  if (userWord === currentWord) {
    wordScore += currentWordLength * 10;
    wordScoreEl.textContent = wordScore;

    wordFeedbackEl.querySelector('.feedback-content').className = 'feedback-content feedback-success';
    wordFeedbackEl.querySelector('.feedback-title').textContent = 'Great job! ';
    wordFeedbackEl.querySelector('.feedback-text').textContent = `"${currentWord}" is correct! You earned ${currentWordLength * 10} points!`;
    createConfetti();

    // Increase difficulty every 3 rounds
    wordRound++;
    if (wordRound % 3 === 0 && currentWordLength < 5) {
      currentWordLength++;
    }
  } else {
    wordFeedbackEl.querySelector('.feedback-content').className = 'feedback-content feedback-error';
    wordFeedbackEl.querySelector('.feedback-title').textContent = 'Try again! ';
    wordFeedbackEl.querySelector('.feedback-text').textContent = `"${userWord}" is not the correct word. Keep trying!`;
  }

  wordFeedbackEl.classList.remove('hidden');
});

nextWordBtn.addEventListener('click', function () {
  setupWordGame();
});

// Game 3: Memory Match
const memoryIcons = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊'];
let memoryCards = [];
let flippedCards = [];
let matchedPairs = 0;
let memoryMoves = 0;

const memoryBoardEl = document.getElementById('memory-board');
const memoryMovesEl = document.getElementById('memory-moves');
const memoryPairsEl = document.getElementById('memory-pairs');
const memoryRestartBtn = document.getElementById('memory-restart');
const memoryFeedbackEl = document.getElementById('memory-feedback');
const playAgainBtn = document.getElementById('play-again');

function setupMemoryGame() {
  // Create pairs of cards
  memoryCards = [...memoryIcons, ...memoryIcons];
  memoryCards = shuffleArray(memoryCards);

  // Reset game state
  flippedCards = [];
  matchedPairs = 0;
  memoryMoves = 0;
  memoryMovesEl.textContent = memoryMoves;
  memoryPairsEl.textContent = matchedPairs;

  // Create card elements
  memoryBoardEl.innerHTML = '';
  memoryCards.forEach((icon, index) => {
    const card = document.createElement('div');
    card.className = 'memory-card';
    card.dataset.index = index;
    card.innerHTML = `
      <div class="front">${icon}</div>
      <div class="back">?</div>
    `;
    card.addEventListener('click', flipCard);
    memoryBoardEl.appendChild(card);
  });

  memoryFeedbackEl.classList.add('hidden');
}

function flipCard() {
  // Don't allow flipping if already flipped or matched
  if (flippedCards.length >= 2 || this.classList.contains('flipped') || this.classList.contains('matched')) {
    return;
  }

  // Flip the card
  this.classList.add('flipped');
  flippedCards.push(this);

  // Check for match if two cards are flipped
  if (flippedCards.length === 2) {
    memoryMoves++;
    memoryMovesEl.textContent = memoryMoves;

    const card1 = flippedCards[0].querySelector('.front').textContent;
    const card2 = flippedCards[1].querySelector('.front').textContent;

    if (card1 === card2) {
      // Match found
      flippedCards.forEach(card => {
        card.classList.add('matched');
      });
      flippedCards = [];
      matchedPairs++;
      memoryPairsEl.textContent = matchedPairs;

      // Check if game is complete
      if (matchedPairs === memoryIcons.length) {
        setTimeout(() => {
          memoryFeedbackEl.querySelector('.feedback-content').className = 'feedback-content feedback-success';
          memoryFeedbackEl.querySelector('.feedback-title').textContent = 'Congratulations! ';
          memoryFeedbackEl.querySelector('.feedback-text').textContent = `You completed the game in ${memoryMoves} moves!`;
          memoryFeedbackEl.classList.remove('hidden');
          createConfetti();
        }, 500);
      }
    } else {
      // No match - flip back after delay
      setTimeout(() => {
        flippedCards.forEach(card => {
          card.classList.remove('flipped');
        });
        flippedCards = [];
      }, 1000);
    }
  }
}

memoryRestartBtn.addEventListener('click', setupMemoryGame);
playAgainBtn.addEventListener('click', setupMemoryGame);

// Game 4: Puzzle Challenge
const puzzleImages = [
  '1.png', '2.png', '3.png', '4.png', '5.png', '6.png', '7.png', '8.png', '9.png'
];
let puzzleBoard = [0, 1, 2, 3, 4, 5, 6, 7, 8];
let emptyIndex = 8;
let puzzleMoves = 0;

const puzzleBoardEl = document.getElementById('puzzle-board');
const puzzleMoveCountEl = document.getElementById('puzzle-move-count');
const puzzleShuffleBtn = document.getElementById('puzzle-shuffle');
const puzzleFeedbackEl = document.getElementById('puzzle-feedback');
const nextPuzzleBtn = document.getElementById('next-puzzle');

function setupPuzzleGame() {
  // Reset game state
  puzzleMoves = 0;
  puzzleMoveCountEl.textContent = puzzleMoves;
  puzzleBoard = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  emptyIndex = 8;

  // Create puzzle tiles
  puzzleBoardEl.innerHTML = '';
  puzzleBoard.forEach((tile, index) => {
    const tileEl = document.createElement('div');
    tileEl.className = 'puzzle-tile';
    tileEl.dataset.index = index;

    if (index === emptyIndex) {
      tileEl.classList.add('empty');
    } else {
      tileEl.innerHTML = `<img src="assets/puzzle/${puzzleImages[tile]}" alt="Puzzle piece ${tile + 1}">`;
      tileEl.addEventListener('click', moveTile);
    }

    puzzleBoardEl.appendChild(tileEl);
  });

  puzzleFeedbackEl.classList.add('hidden');
}

function moveTile() {
  const tileIndex = parseInt(this.dataset.index);
  const emptyRow = Math.floor(emptyIndex / 3);
  const emptyCol = emptyIndex % 3;
  const tileRow = Math.floor(tileIndex / 3);
  const tileCol = tileIndex % 3;

  // Check if tile is adjacent to empty space
  if ((Math.abs(emptyRow - tileRow) === 1 && emptyCol === tileCol) ||
    (Math.abs(emptyCol - tileCol) === 1 && emptyRow === tileRow)) {
    // Move the tile
    puzzleBoard[emptyIndex] = puzzleBoard[tileIndex];
    puzzleBoard[tileIndex] = 8; // Empty

    // Update UI
    this.dataset.index = emptyIndex;
    puzzleBoardEl.children[emptyIndex].innerHTML = this.innerHTML;
    puzzleBoardEl.children[emptyIndex].className = this.className;
    puzzleBoardEl.children[emptyIndex].addEventListener('click', moveTile);

    this.innerHTML = '';
    this.className = 'puzzle-tile empty';
    this.removeEventListener('click', moveTile);

    emptyIndex = tileIndex;
    puzzleMoves++;
    puzzleMoveCountEl.textContent = puzzleMoves;

    // Check if puzzle is solved
    if (isPuzzleSolved()) {
      puzzleFeedbackEl.querySelector('.feedback-content').className = 'feedback-content feedback-success';
      puzzleFeedbackEl.querySelector('.feedback-title').textContent = 'Puzzle Complete! ';
      puzzleFeedbackEl.querySelector('.feedback-text').textContent = `You solved the puzzle in ${puzzleMoves} moves!`;
      puzzleFeedbackEl.classList.remove('hidden');
      createConfetti();
    }
  }
}

function isPuzzleSolved() {
  for (let i = 0; i < puzzleBoard.length - 1; i++) {
    if (puzzleBoard[i] !== i) {
      return false;
    }
  }
  return true;
}

puzzleShuffleBtn.addEventListener('click', function () {
  // Simple shuffle - just make 100 random moves
  for (let i = 0; i < 100; i++) {
    const adjacentTiles = [];
    const emptyRow = Math.floor(emptyIndex / 3);
    const emptyCol = emptyIndex % 3;

    // Find all adjacent tiles
    if (emptyRow > 0) adjacentTiles.push(emptyIndex - 3);
    if (emptyRow < 2) adjacentTiles.push(emptyIndex + 3);
    if (emptyCol > 0) adjacentTiles.push(emptyIndex - 1);
    if (emptyCol < 2) adjacentTiles.push(emptyIndex + 1);

    // Pick a random adjacent tile and simulate click
    const randomTile = adjacentTiles[Math.floor(Math.random() * adjacentTiles.length)];
    const tileEl = puzzleBoardEl.children[randomTile];
    if (tileEl) {
      const event = new MouseEvent('click');
      tileEl.dispatchEvent(event);
    }
  }

  puzzleMoves = 0;
  puzzleMoveCountEl.textContent = puzzleMoves;
});

nextPuzzleBtn.addEventListener('click', setupPuzzleGame);

// Game 5: Coding Adventure
const codingLevels = [
  {
    board: [
      ['R', ' ', ' ', ' ', 'T'],
      [' ', '#', '#', ' ', ' '],
      [' ', ' ', ' ', '#', ' '],
      [' ', '#', ' ', ' ', ' '],
      [' ', ' ', ' ', '#', ' ']
    ],
    solution: ['right', 'right', 'right', 'down', 'down', 'right', 'down']
  },
  {
    board: [
      ['R', ' ', '#', ' ', ' '],
      [' ', '#', ' ', ' ', ' '],
      [' ', ' ', ' ', '#', ' '],
      [' ', '#', ' ', '#', ' '],
      [' ', ' ', ' ', ' ', 'T']
    ],
    solution: ['down', 'down', 'right', 'right', 'down', 'down', 'right', 'right']
  }
];

let currentLevel = 0;
let commandSequence = [];

const codingBoardEl = document.getElementById('coding-board');
const codingCommandsEl = document.getElementById('coding-commands');
const runCodeBtn = document.getElementById('run-code');
const resetCodeBtn = document.getElementById('reset-code');
const codingFeedbackEl = document.getElementById('coding-feedback');
const nextLevelBtn = document.getElementById('next-level');

function setupCodingGame() {
  const level = codingLevels[currentLevel];
  commandSequence = [];

  // Create board
  codingBoardEl.innerHTML = '';
  for (let row = 0; row < level.board.length; row++) {
    for (let col = 0; col < level.board[row].length; col++) {
      const cell = document.createElement('div');
      cell.className = 'coding-cell';
      cell.style.left = `${col * 60}px`;
      cell.style.top = `${row * 60}px`;

      if (level.board[row][col] === 'R') {
        cell.classList.add('robot');
        cell.textContent = '🤖';
        cell.dataset.row = row;
        cell.dataset.col = col;
      } else if (level.board[row][col] === 'T') {
        cell.classList.add('treasure');
        cell.textContent = '💰';
      } else if (level.board[row][col] === '#') {
        cell.style.backgroundColor = '#94a3b8';
      } else {
        cell.classList.add('path');
      }

      codingBoardEl.appendChild(cell);
    }
  }

  // Create command buttons
  codingCommandsEl.innerHTML = '';
  const commands = ['up', 'down', 'left', 'right'];
  commands.forEach(cmd => {
    const btn = document.createElement('div');
    btn.className = 'coding-command';
    btn.textContent = cmd;
    btn.dataset.command = cmd;
    btn.addEventListener('click', addCommand);
    codingCommandsEl.appendChild(btn);
  });

  codingFeedbackEl.classList.add('hidden');
}

function addCommand(e) {
  const command = e.target.dataset.command;
  commandSequence.push(command);

  // Show command sequence (simplified for demo)
  console.log('Command sequence:', commandSequence);
}

function executeCommands() {
  const robot = document.querySelector('.robot');
  let row = parseInt(robot.dataset.row);
  let col = parseInt(robot.dataset.col);
  let success = true;

  // Execute each command with delay
  commandSequence.forEach((cmd, i) => {
    setTimeout(() => {
      let newRow = row;
      let newCol = col;

      switch (cmd) {
        case 'up': newRow--; break;
        case 'down': newRow++; break;
        case 'left': newCol--; break;
        case 'right': newCol++; break;
      }

      // Check if move is valid
      if (newRow >= 0 && newRow < 5 && newCol >= 0 && newCol < 5) {
        const targetCell = document.querySelector(`.coding-cell[style*="left: ${newCol * 60}px"][style*="top: ${newRow * 60}px"]`);

        if (!targetCell.style.backgroundColor || targetCell.style.backgroundColor === 'rgb(219, 234, 254)') {
          // Valid move - update robot position
          robot.dataset.row = newRow;
          robot.dataset.col = newCol;
          robot.style.top = `${newRow * 60}px`;
          robot.style.left = `${newCol * 60}px`;

          row = newRow;
          col = newCol;

          // Check if reached treasure
          if (targetCell.classList.contains('treasure')) {
            codingFeedbackEl.querySelector('.feedback-content').className = 'feedback-content feedback-success';
            codingFeedbackEl.querySelector('.feedback-title').textContent = 'Success! ';
            codingFeedbackEl.querySelector('.feedback-text').textContent = 'You guided the robot to the treasure!';
            codingFeedbackEl.classList.remove('hidden');
            createConfetti();
          }
        } else {
          success = false;
        }
      } else {
        success = false;
      }

      // If last command and not successful
      if (i === commandSequence.length - 1 && !success) {
        codingFeedbackEl.querySelector('.feedback-content').className = 'feedback-content feedback-error';
        codingFeedbackEl.querySelector('.feedback-title').textContent = 'Oops! ';
        codingFeedbackEl.querySelector('.feedback-text').textContent = 'The robot hit an obstacle! Try a different path.';
        codingFeedbackEl.classList.remove('hidden');
      }
    }, i * 500);
  });
}

runCodeBtn.addEventListener('click', executeCommands);
resetCodeBtn.addEventListener('click', function () {
  commandSequence = [];
  setupCodingGame();
});
nextLevelBtn.addEventListener('click', function () {
  currentLevel = (currentLevel + 1) % codingLevels.length;
  setupCodingGame();
});

// Common functions
function createConfetti() {
  const colors = ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4CAF50', '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800', '#FF5722'];

  for (let i = 0; i < 50; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    confetti.style.left = Math.random() * 100 + 'vw';
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.width = Math.random() * 10 + 5 + 'px';
    confetti.style.height = Math.random() * 10 + 5 + 'px';
    confetti.style.animationDuration = Math.random() * 3 + 2 + 's';
    confetti.style.animationDelay = Math.random() * 2 + 's';
    document.getElementById('confetti-container').appendChild(confetti);

    setTimeout(() => {
      confetti.classList.add('animate-confetti');
    }, 10);

    setTimeout(() => {
      confetti.remove();
    }, 5000);
  }
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();

    const targetId = this.getAttribute('href');
    if (targetId === '#') return;

    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: 'smooth'
      });
    }
  });
});

// Initialize all games when page loads
document.addEventListener('DOMContentLoaded', function () {
  setupMathGame();
  setupWordGame();
  setupMemoryGame();
  setupPuzzleGame();
  setupCodingGame();
});
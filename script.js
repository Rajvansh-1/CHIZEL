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




// Game 4: Color Mix Lab
let targetColor = { r: 0, g: 0, b: 0 };
let currentLevel = 1; // Declare it once globally
let colorScore = 0;

const redSlider = document.getElementById('red-slider');
const greenSlider = document.getElementById('green-slider');
const blueSlider = document.getElementById('blue-slider');
const targetSwatch = document.querySelector('.target-swatch');
const resultSwatch = document.querySelector('.result-swatch');
const checkColorBtn = document.getElementById('check-color');
const newColorBtn = document.getElementById('new-color');
const colorFeedbackEl = document.getElementById('color-feedback');
const nextColorBtn = document.getElementById('next-color');

function setupColorGame() {
  // Generate random target color based on level difficulty
  const difficulty = Math.min(Math.floor(currentLevel / 3) + 1, 3);
  targetColor = generateTargetColor(difficulty);

  // Reset sliders
  redSlider.value = 0;
  greenSlider.value = 0;
  blueSlider.value = 0;

  // Update UI
  updateColorDisplays();
  colorFeedbackEl.classList.add('hidden');

  // Add event listeners to sliders
  redSlider.addEventListener('input', updateColorDisplays);
  greenSlider.addEventListener('input', updateColorDisplays);
  blueSlider.addEventListener('input', updateColorDisplays);
}

function generateTargetColor(difficulty) {
  // Difficulty levels:
  // 1: Primary colors (easy)
  // 2: Secondary colors (medium)
  // 3: Complex colors (hard)

  if (difficulty === 1) {
    // Primary colors or simple mixes
    const options = [
      { r: 255, g: 0, b: 0 },    // Red
      { r: 0, g: 255, b: 0 },    // Green
      { r: 0, g: 0, b: 255 },    // Blue
      { r: 255, g: 255, b: 0 },  // Yellow
      { r: 255, g: 0, b: 255 },  // Magenta
      { r: 0, g: 255, b: 255 }   // Cyan
    ];
    return options[Math.floor(Math.random() * options.length)];
  } else if (difficulty === 2) {
    // More complex mixes
    return {
      r: Math.floor(Math.random() * 256),
      g: Math.floor(Math.random() * 256),
      b: Math.floor(Math.random() * 256)
    };
  } else {
    // Very specific shades
    const baseColor = Math.floor(Math.random() * 3);
    if (baseColor === 0) {
      return { // Reds
        r: 150 + Math.floor(Math.random() * 106),
        g: Math.floor(Math.random() * 100),
        b: Math.floor(Math.random() * 100)
      };
    } else if (baseColor === 1) {
      return { // Greens
        r: Math.floor(Math.random() * 100),
        g: 150 + Math.floor(Math.random() * 106),
        b: Math.floor(Math.random() * 100)
      };
    } else {
      return { // Blues
        r: Math.floor(Math.random() * 100),
        g: Math.floor(Math.random() * 100),
        b: 150 + Math.floor(Math.random() * 106)
      };
    }
  }
}

function updateColorDisplays() {
  // Update target color display
  targetSwatch.style.backgroundColor = `rgb(${targetColor.r}, ${targetColor.g}, ${targetColor.b})`;

  // Update result color display
  const currentColor = {
    r: parseInt(redSlider.value),
    g: parseInt(greenSlider.value),
    b: parseInt(blueSlider.value)
  };
  resultSwatch.style.backgroundColor = `rgb(${currentColor.r}, ${currentColor.g}, ${currentColor.b})`;
}

function checkColorMatch() {
  const userColor = {
    r: parseInt(redSlider.value),
    g: parseInt(greenSlider.value),
    b: parseInt(blueSlider.value)
  };

  // Calculate color difference (simple Euclidean distance)
  const diff = Math.sqrt(
    Math.pow(targetColor.r - userColor.r, 2) +
    Math.pow(targetColor.g - userColor.g, 2) +
    Math.pow(targetColor.b - userColor.b, 2)
  );

  // Max possible difference is ~441 (black to white)
  const matchPercentage = Math.max(0, 100 - Math.floor((diff / 441) * 100));

  if (matchPercentage >= 90) {
    colorScore += currentLevel * 10;
    colorFeedbackEl.querySelector('.feedback-content').className = 'feedback-content feedback-success';
    colorFeedbackEl.querySelector('.feedback-title').textContent = 'Perfect Match! ';
    colorFeedbackEl.querySelector('.feedback-text').textContent = `You got ${matchPercentage}% match! +${currentLevel * 10} points`;

    // Level up every 3 perfect matches
    if (colorScore >= currentLevel * 30) {
      currentLevel++;
      colorFeedbackEl.querySelector('.feedback-text').textContent += ` Level up!`;
    }

    createConfetti();
  } else if (matchPercentage >= 70) {
    colorScore += currentLevel * 5;
    colorFeedbackEl.querySelector('.feedback-content').className = 'feedback-content feedback-success';
    colorFeedbackEl.querySelector('.feedback-title').textContent = 'Good Job! ';
    colorFeedbackEl.querySelector('.feedback-text').textContent = `You got ${matchPercentage}% match! +${currentLevel * 5} points`;
  } else {
    colorFeedbackEl.querySelector('.feedback-content').className = 'feedback-content feedback-error';
    colorFeedbackEl.querySelector('.feedback-title').textContent = 'Keep Trying! ';
    colorFeedbackEl.querySelector('.feedback-text').textContent = `You got ${matchPercentage}% match. Adjust the sliders carefully!`;
  }

  colorFeedbackEl.classList.remove('hidden');
}

checkColorBtn.addEventListener('click', checkColorMatch);
newColorBtn.addEventListener('click', setupColorGame);
nextColorBtn.addEventListener('click', setupColorGame);

// Initialize the game when page loads
document.addEventListener('DOMContentLoaded', function () {
  setupColorGame();
});

// Game 5: Pattern Match
const patternItems = ['🔴', '🔵', '🟡', '🟢', '⭐', '❤️', '▲', '●', '■'];
const patternTypes = [
  'simple-repeat',
  'alternating',
  'growing',
  'pyramid',
  'random-with-rule'
];

let currentLeve = 1;
let patternScore = 0;
let currentPattern = [];
let correctOptionIndex = 0;

const patternTargetEl = document.getElementById('pattern-target');
const patternOptionsEl = document.getElementById('pattern-options');
const patternLevelEl = document.getElementById('pattern-level');
const patternScoreEl = document.getElementById('pattern-score');
const newPatternBtn = document.getElementById('new-pattern');
const patternFeedbackEl = document.getElementById('pattern-feedback');
const nextPatternBtn = document.getElementById('next-pattern');

function setupPatternGame() {
  // Clear previous selections
  patternTargetEl.innerHTML = '';
  patternOptionsEl.innerHTML = '';
  patternFeedbackEl.classList.add('hidden');

  // Generate target pattern
  generatePattern();

  // Generate options (one correct, others incorrect)
  generateOptions();

  // Update UI
  patternLevelEl.textContent = currentLevel;
  patternScoreEl.textContent = patternScore;
}

function generatePattern() {
  const patternLength = Math.min(3 + Math.floor(currentLevel / 2), 6);
  const patternType = patternTypes[Math.min(Math.floor(currentLevel / 3), patternTypes.length - 1)];

  currentPattern = [];

  switch (patternType) {
    case 'simple-repeat':
      // Simple repeating pattern (AABB)
      const item1 = getRandomItem();
      const item2 = getRandomItem();
      for (let i = 0; i < patternLength; i++) {
        currentPattern.push(i % 2 === 0 ? item1 : item2);
      }
      break;

    case 'alternating':
      // Alternating between two items (ABAB)
      const items = [getRandomItem(), getRandomItem()];
      for (let i = 0; i < patternLength; i++) {
        currentPattern.push(items[i % 2]);
      }
      break;

    case 'growing':
      // Growing pattern (A, AB, ABC)
      for (let i = 0; i < patternLength; i++) {
        currentPattern.push(patternItems[i % patternItems.length]);
      }
      break;

    case 'pyramid':
      // Pyramid pattern (A, BB, CCC)
      for (let i = 0; i < patternLength; i++) {
        currentPattern.push(...Array(i + 1).fill(patternItems[i % patternItems.length]));
      }
      break;

    case 'random-with-rule':
      // Random pattern with simple rule (all same color/shape type)
      const type = Math.random() > 0.5 ? 'color' : 'shape';
      const matchingItems = patternItems.filter(item =>
        type === 'color' ? item.match(/[🔴🔵🟡🟢❤️]/) : item.match(/[▲●■⭐]/)
      );
      for (let i = 0; i < patternLength; i++) {
        currentPattern.push(matchingItems[Math.floor(Math.random() * matchingItems.length)]);
      }
      break;
  }

  // Display target pattern
  currentPattern.forEach(item => {
    const patternItem = document.createElement('div');
    patternItem.className = 'pattern-item';
    patternItem.textContent = item;
    patternTargetEl.appendChild(patternItem);
  });
}

function generateOptions() {
  // Create 4 options (1 correct, 3 incorrect)
  const options = [];
  correctOptionIndex = Math.floor(Math.random() * 4);

  // Generate correct option (same pattern type)
  options[correctOptionIndex] = [...currentPattern];

  // Generate incorrect options
  for (let i = 0; i < 4; i++) {
    if (i === correctOptionIndex) continue;

    // Create variations that are similar but wrong
    const variationType = Math.floor(Math.random() * 3);
    let wrongPattern;

    switch (variationType) {
      case 0: // Wrong order
        wrongPattern = shuffleArray([...currentPattern]);
        break;
      case 1: // Wrong items
        wrongPattern = currentPattern.map(item =>
          Math.random() > 0.5 ? item : getRandomItem()
        );
        break;
      case 2: // Completely different
        wrongPattern = Array(currentPattern.length).fill().map(() => getRandomItem());
        break;
    }

    // Ensure the wrong pattern isn't accidentally correct
    if (JSON.stringify(wrongPattern) === JSON.stringify(currentPattern)) {
      wrongPattern[0] = getRandomItem([wrongPattern[0]]);
    }

    options[i] = wrongPattern;
  }

  // Display options
  options.forEach((pattern, index) => {
    const option = document.createElement('div');
    option.className = 'pattern-option';
    option.dataset.index = index;

    pattern.forEach(item => {
      const patternItem = document.createElement('div');
      patternItem.className = 'pattern-item';
      patternItem.textContent = item;
      option.appendChild(patternItem);
    });

    option.addEventListener('click', () => selectPatternOption(index));
    patternOptionsEl.appendChild(option);
  });
}

function selectPatternOption(selectedIndex) {
  const options = document.querySelectorAll('.pattern-option');

  // Mark selected option
  options.forEach(option => option.classList.remove('selected'));
  options[selectedIndex].classList.add('selected');

  // Check if correct
  if (selectedIndex === correctOptionIndex) {
    options[selectedIndex].classList.add('correct');
    patternScore += currentLevel * 5;

    patternFeedbackEl.querySelector('.feedback-content').className = 'feedback-content feedback-success';
    patternFeedbackEl.querySelector('.feedback-title').textContent = 'Correct! ';
    patternFeedbackEl.querySelector('.feedback-text').textContent = `Great pattern recognition! +${currentLevel * 5} points`;

    // Level up every 3 correct answers
    if (patternScore >= currentLevel * 15) {
      currentLevel++;
      patternFeedbackEl.querySelector('.feedback-text').textContent += ` Level up!`;
    }

    createConfetti();
  } else {
    options[selectedIndex].classList.add('incorrect');
    options[correctOptionIndex].classList.add('correct');

    patternFeedbackEl.querySelector('.feedback-content').className = 'feedback-content feedback-error';
    patternFeedbackEl.querySelector('.feedback-title').textContent = 'Oops! ';
    patternFeedbackEl.querySelector('.feedback-text').textContent = 'Look carefully at the pattern rules';
  }

  patternFeedbackEl.classList.remove('hidden');
  patternScoreEl.textContent = patternScore;
}

function getRandomItem(exclude = []) {
  const availableItems = patternItems.filter(item => !exclude.includes(item));
  return availableItems[Math.floor(Math.random() * availableItems.length)];
}

newPatternBtn.addEventListener('click', setupPatternGame);
nextPatternBtn.addEventListener('click', setupPatternGame);

// Initialize the game when page loads
document.addEventListener('DOMContentLoaded', function () {
  setupPatternGame();
});

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


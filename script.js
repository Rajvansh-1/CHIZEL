// Initialize AOS animation library
AOS.init({
  duration: 800,
  easing: 'ease-in-out',
  once: true
});

// Math Game Demo
const mathOptions = document.querySelectorAll('.math-option');
const mathFeedback = document.getElementById('math-feedback');
const nextMathBtn = document.getElementById('next-math');

const mathQuestions = [
  { question: "3 + 5 = ?", answer: "8" },
  { question: "7 - 2 = ?", answer: "5" },
  { question: "4 × 3 = ?", answer: "12" }
];

let currentMathQuestion = 0;

mathOptions.forEach(option => {
  option.addEventListener('click', function () {
    const userAnswer = this.getAttribute('data-answer');
    const correctAnswer = mathQuestions[currentMathQuestion].answer;

    if (userAnswer === correctAnswer) {
      mathFeedback.querySelector('.feedback-title').textContent = 'Correct! ';
      mathFeedback.querySelector('.feedback-text').textContent = 'You earned 5 stars!';
      mathFeedback.querySelector('.feedback-content').className = 'feedback-content feedback-success';
      createConfetti();
    } else {
      mathFeedback.querySelector('.feedback-title').textContent = 'Oops! ';
      mathFeedback.querySelector('.feedback-text').textContent = `The correct answer is ${correctAnswer}. Try again!`;
      mathFeedback.querySelector('.feedback-content').className = 'feedback-content feedback-error';
    }

    mathFeedback.classList.remove('hidden');
  });
});

nextMathBtn.addEventListener('click', function () {
  currentMathQuestion = (currentMathQuestion + 1) % mathQuestions.length;
  document.getElementById('math-question').textContent = mathQuestions[currentMathQuestion].question;
  mathFeedback.classList.add('hidden');
});

// Word Game Demo
const letterTiles = document.querySelectorAll('.letter-tile');
const wordSlots = document.querySelectorAll('.word-slot');
const checkWordBtn = document.getElementById('check-word');
const wordFeedback = document.getElementById('word-feedback');
const nextWordBtn = document.getElementById('next-word');

let selectedLetters = [];

letterTiles.forEach(tile => {
  tile.addEventListener('click', function () {
    if (selectedLetters.length < 3) {
      const letter = this.textContent;
      selectedLetters.push(letter);
      wordSlots[selectedLetters.length - 1].textContent = letter;
      this.style.visibility = 'hidden';
    }
  });
});

checkWordBtn.addEventListener('click', function () {
  const word = selectedLetters.join('');

  if (word === 'CAT') {
    wordFeedback.querySelector('.feedback-title').textContent = 'Great job! ';
    wordFeedback.querySelector('.feedback-text').textContent = '"CAT" is correct! You found the treasure!';
    wordFeedback.querySelector('.feedback-content').className = 'feedback-content feedback-success';
    createConfetti();
  } else {
    wordFeedback.querySelector('.feedback-title').textContent = 'Not quite! ';
    wordFeedback.querySelector('.feedback-text').textContent = 'Try rearranging the letters to form an animal word.';
    wordFeedback.querySelector('.feedback-content').className = 'feedback-content feedback-error';
  }

  wordFeedback.classList.remove('hidden');
});

nextWordBtn.addEventListener('click', function () {
  selectedLetters = [];
  wordSlots.forEach(slot => slot.textContent = '');
  letterTiles.forEach(tile => tile.style.visibility = 'visible');
  wordFeedback.classList.add('hidden');
});

// Avatar Selection
const avatarOptions = document.querySelectorAll('.avatar-option');

avatarOptions.forEach(option => {
  option.addEventListener('click', function () {
    avatarOptions.forEach(opt => opt.classList.remove('selected'));
    this.classList.add('selected');
  });
});

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

// Confetti effect
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

// Animate CTA buttons on page load
document.addEventListener('DOMContentLoaded', () => {
  const ctaButtons = document.querySelectorAll('.btn-primary');
  ctaButtons.forEach((btn, index) => {
    setTimeout(() => {
      btn.classList.add('animate-bounce-in');
    }, index * 100);
  });
});
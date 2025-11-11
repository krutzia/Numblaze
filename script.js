const msg = document.getElementById("message");
const guessInput = document.getElementById("guessInput");
const guessBtn = document.getElementById("guessBtn");
const startBtn = document.getElementById("startBtn");
const resetBtn = document.getElementById("resetBtn");
const attemptsEl = document.getElementById("attempts");
const scoreEl = document.getElementById("score");
const highScoreEl = document.getElementById("highScore");
const timeLeftEl = document.getElementById("timeLeft");
const difficultyEl = document.getElementById("difficulty");
const correctSound = document.getElementById("correctSound");
const wrongSound = document.getElementById("wrongSound");

let secretNumber, attempts, score, highScore = 0;
let timer, timeLeft, gameActive = false;

function getRange() {
  switch (difficultyEl.value) {
    case "easy": return 50;
    case "medium": return 100;
    case "hard": return 200;
  }
}

// 🌟 Confetti / Sprinkler effect
function showConfetti() {
  const duration = 2 * 1000;
  const end = Date.now() + duration;

  (function frame() {
    confetti({
      particleCount: 4,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
    });
    confetti({
      particleCount: 4,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();
}

function startGame() {
  secretNumber = Math.floor(Math.random() * getRange()) + 1;
  attempts = 0;
  score = 0;
  timeLeft = difficultyEl.value === "hard" ? 25 : difficultyEl.value === "medium" ? 35 : 45;
  gameActive = true;
  msg.textContent = "🎲 Game started! Start guessing...";
  msg.style.color = "#a78bfa";
  attemptsEl.textContent = 0;
  scoreEl.textContent = 0;
  guessInput.disabled = false;
  guessBtn.disabled = false;
  startBtn.disabled = true;
  resetBtn.disabled = false;
  difficultyEl.disabled = true;
  guessInput.focus();
  startTimer();
}

function startTimer() {
  clearInterval(timer);
  timeLeftEl.textContent = timeLeft;
  timer = setInterval(() => {
    timeLeft--;
    timeLeftEl.textContent = timeLeft;
    if (timeLeft <= 0) endGame(false);
  }, 1000);
}

function getHint(diff) {
  const d = Math.abs(diff);
  if (d <= 3) return "🔥 Super close!";
  if (d <= 7) return "😯 Almost there!";
  if (d <= 15) return "🧊 Getting warm...";
  if (d <= 30) return "🥶 Pretty far off...";
  return "💨 Way off!";
}

function makeGuess() {
  if (!gameActive) return;
  const guess = Number(guessInput.value);
  if (!guess || guess < 1) {
    msg.textContent = "⚠️ Enter a valid number!";
    msg.style.color = "#ef4444";
    wrongSound.play();
    guessInput.focus();
    return;
  }

  attempts++;
  attemptsEl.textContent = attempts;

  if (guess === secretNumber) {
    correctSound.play();
    score = Math.max(0, Math.round((getRange() - attempts * 2 + timeLeft) / 2));
    scoreEl.textContent = score;
    msg.textContent = `🎉 Correct! The number was ${secretNumber}.`;
    msg.style.color = "#22c55e";
    showConfetti();
    endGame(true);
  } else {
    wrongSound.play();
    const diff = guess - secretNumber;
    msg.textContent = diff > 0
      ? `⬇️ Too High! ${getHint(diff)}`
      : `⬆️ Too Low! ${getHint(diff)}`;
    msg.style.color = diff > 0 ? "#f87171" : "#60a5fa";
    guessInput.focus(); // focus back to the box for next try
  }

  guessInput.value = "";
}

function endGame(win) {
  clearInterval(timer);
  gameActive = false;
  guessInput.disabled = true;
  guessBtn.disabled = true;
  startBtn.disabled = false;
  resetBtn.disabled = false;
  difficultyEl.disabled = false;

  if (!win) {
    msg.textContent = `💀 Time's up! The number was ${secretNumber}.`;
    msg.style.color = "#ef4444";
  }

  if (score > highScore) {
    highScore = score;
    highScoreEl.textContent = highScore;
  }
}

function resetGame() {
  clearInterval(timer);
  msg.textContent = "Game reset. Select difficulty and press Start!";
  msg.style.color = "#94a3b8";
  attemptsEl.textContent = "0";
  scoreEl.textContent = "0";
  timeLeftEl.textContent = "--";
  guessInput.disabled = true;
  guessBtn.disabled = true;
  startBtn.disabled = false;
  difficultyEl.disabled = false;
  resetBtn.disabled = true;
}

// ✅ Make Enter key submit your guess
guessInput.addEventListener("keydown", e => {
  if (e.key === "Enter" && gameActive) {
    makeGuess();
  }
});

guessBtn.addEventListener("click", makeGuess);
startBtn.addEventListener("click", startGame);
resetBtn.addEventListener("click", resetGame);

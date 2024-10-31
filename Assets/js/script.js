import programmingSubject from "./programmingSub.js";
import rizalSubject from "./rizalSub.js";
import discreteMathSubject from "./discreteMathSub.js";
import multimediaSubject from "./multimediaSub.js";

const quiz = document.getElementById("quiz");
const instruction = document.getElementById("instruction");
const someInfo = document.getElementById("info-container");
const answerElements = document.querySelectorAll(".answer");
const questionElement = document.getElementById("questions");
const a_text = document.getElementById("a_text");
const b_text = document.getElementById("b_text");
const c_text = document.getElementById("c_text");
const d_text = document.getElementById("d_text");

const programming = document.getElementById("programming");
const multimedia = document.getElementById("multimedia");
const rizal = document.getElementById("rizal");
const math = document.getElementById("discreteMath");

const submitButton = document.getElementById("submit");
const startButton = document.getElementById("start");
const continueButton = document.getElementById("continue");
const timerElement = document.getElementById("timer");

const progress = document.getElementById("progress");

let currentQuizPage = 0;
let score = 0;

let selectedSubject;

let timerInterval;

// Function to reset or clear the radio button inputs
const deselectAnswers = () => {
  answerElements.forEach((answer) => (answer.checked = false));
};

//Function to get the answers selected by user
const getSelectedAnswers = () => {
  let answer;
  answerElements.forEach((answerElement) => {
    if (answerElement.checked) {
      answer = answerElement.id;
    }
  });
  return answer;
};

// Display the selected subject quiz
const displayQuiz = () =>{

  progress.innerText = `${currentQuizPage + 1}/${selectedSubject.length}`;

  deselectAnswers();
  const currentQuizData = selectedSubject[currentQuizPage];
  const { question, a, b, c, d } = currentQuizData;
  questionElement.innerText = question;
  a_text.innerText = a;
  b_text.innerText = b;
  c_text.innerText = c;
  d_text.innerText = d;

  resetTimer();
};

const startTimer = () => {
  let timeLeft = 30; // 30 seconds per question
  timerElement.innerText = `Time left: ${timeLeft}s`;

  timerInterval = setInterval(() => {
    timeLeft--;
    timerElement.innerText = `Time left: ${timeLeft}s`;

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      currentQuizPage++;

      if (currentQuizPage < selectedSubject.length) {
        displayQuiz();
      } else {
        const existingScores = JSON.parse(localStorage.getItem("scores")) || [];
        const newScore = {
          [selectedSubject.name]: score,
        };
        const updatedScores = { ...existingScores, ...newScore };
        localStorage.setItem("scores", JSON.stringify(updatedScores));

        quiz.innerHTML = `<h1>Time is up! Your score is ${score}/${selectedSubject.length}</h1>
                           <button id="play-again" onclick="history.go(0)">Finished</button>`;
      }
    }
  }, 1000);
};

const resetTimer = () => {
  clearInterval(timerInterval);
  startTimer();
};

const getCorrectAnswers = () => {
  const answers = getSelectedAnswers();
  if (answers) {
    if (answers === selectedSubject[currentQuizPage].answer) {
      score++;
    }
    currentQuizPage++;

    if (currentQuizPage < selectedSubject.length) {
      displayQuiz();
    } else {
      const existingScores = JSON.parse(localStorage.getItem("scores")) || [];
      const newScore = {
        [selectedSubject.name]: score,
      };
      const updatedScores = { ...existingScores, ...newScore };
      localStorage.setItem("scores", JSON.stringify(updatedScores));

      clearInterval(timerInterval);
      quiz.innerHTML = `<h1>Your score is ${score}/${selectedSubject.length}</h1>
                           <button id="play-again" onclick="history.go(0)">Finished</button>`;
    }
  }
};


continueButton.addEventListener("click", () => {
  instruction.style.display = "block";
  someInfo.style.display = "none";
});

startButton.addEventListener("click", () => {
  // Determine which subject is selected and set the selectedSubject accordingly
  if (programming.checked) {
    selectedSubject = programmingSubject;
  } else if (multimedia.checked) {
    selectedSubject = multimediaSubject;
  } else if (rizal.checked) {
    selectedSubject = rizalSubject;
  } else if (math.checked) {
    selectedSubject = discreteMathSubject;
  }

  if (selectedSubject) {
    quiz.style.display = "block";
    instruction.style.display = "none";
    displayQuiz();
  }
});

submitButton.addEventListener("click", () => {
  getCorrectAnswers();
  resetTimer();
});




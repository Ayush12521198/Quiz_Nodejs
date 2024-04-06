document.addEventListener('DOMContentLoaded', () => {
  // DOM elements
  const quizForm = document.getElementById('quiz-form');
  const questionsList = document.getElementById('questions-list');
  const submitBtn = document.querySelector('.submit-btn');
  const resultsDiv = document.getElementById('results');
  const timeDisplay = document.getElementById('time-display');
  const progressBar = document.getElementById('progress-bar');

  // Quiz state variables
  let currentQuestionIndex = 0;
  let score = 0;
  let totalQuestions = 0;
  let quizData;
  let time = 0;
  let timerInterval; 
  const totalTime = 60; 

  // Function to update time display
  function updateTimeDisplay() {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    timeDisplay.textContent = `Time: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }

  // Function to update progress bar
  function updateProgressBar() {
    const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100; 
    progressBar.style.width = `${progress}%`; 
  }

  // Function to start the timer
  function startTimer() {
    timerInterval = setInterval(() => { 
      time++;
      updateTimeDisplay();
      if (time >= totalTime) {
        clearInterval(timerInterval);
        quizForm.submit(); 
      }
    }, 1000);
  }

  // Function to fetch quiz data
  function fetchQuizData() {
    fetch('/quiz')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log('Quiz data:', data); 
        quizData = data;
        totalQuestions = quizData.questions.length;
        displayQuestion(currentQuestionIndex);
        startTimer(); 
      })
      .catch(error => console.error('Error fetching quiz data:', error)); 
  }

  // Function to display questions
  function displayQuestion(questionIndex) {
    const question = quizData.questions[questionIndex];
    const options = question.options.map((option, index) => `
      <li>
        <label>
          <input type="radio" name="question${questionIndex}" value="${index}">
          ${option}
        </label>
      </li>
    `).join('');

    questionsList.innerHTML = `
      <strong>${question.question}</strong>
      <ul>${options}</ul>
    `;
    updateProgressBar(); 
  }

  // Function to show results
  function showResults() {
    clearInterval(timerInterval); 
    quizForm.style.display = 'none';
    resultsDiv.innerHTML = `
      <h2>Results</h2>
      <p>Your score: ${score}/${totalQuestions}</p>
    `;
    resultsDiv.style.display = 'block';
  }

  // Function to handle form submission
  quizForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const selectedOption = quizForm.elements[`question${currentQuestionIndex}`];
    if (!selectedOption) return;

    const userAnswerIndex = parseInt(selectedOption.value);
    const correctAnswerIndex = quizData.questions[currentQuestionIndex].correctIndex;

    if (userAnswerIndex === correctAnswerIndex) {
      score++;
    }

    if (currentQuestionIndex < totalQuestions - 1) {
      currentQuestionIndex++;
      displayQuestion(currentQuestionIndex);
    } else {
      showResults();
    }
  });

  fetchQuizData();
});

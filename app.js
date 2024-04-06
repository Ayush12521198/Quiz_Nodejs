const express = require('express');
const path = require('path');
const quizData = require('./data/quizData.json');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Serve quiz questions
app.get('/quiz', (req, res) => {
  res.json(quizData);
});

// Handle quiz submissions
app.post('/submit', (req, res) => {
    const answers = req.body.answers;
    let score = 0;
    const results = [];
  
    answers.forEach((answer, index) => {
      const correctIndex = quizData.questions[index].correctIndex;
      const correctAnswer = quizData.questions[index].options[correctIndex];
      const result = {
        question: quizData.questions[index].question,
        submittedAnswer: quizData.questions[index].options[answer],
        correctAnswer: correctAnswer,
        isCorrect: answer === correctIndex 
      };
      if (result.isCorrect) {
        score++;
      }
      results.push(result);
    });
  
    res.json({ score: score, results: results });
  });
  
// Error handling for invalid endpoints
app.use((req, res) => {
  res.status(404).send('Page not found!');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

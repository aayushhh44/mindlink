const { v4: uuidv4 } = require('uuid');
const QuizResult = require('../models/QuizResult');

// Submit quiz
async function submitQuiz(req, res) {
  const { score } = req.body;
  if (typeof score !== 'number' || isNaN(score)) {
    return res.status(400).json({ message: 'Score must be a number' });
  }
  try {
    const quizResult = await QuizResult.create({
      quizId: uuidv4(),
      userId: req.user.userId,
      score,
      timestamp: new Date(),
    });
    res.status(201).json({ message: 'Quiz submitted', quizResult });
  } catch (err) {
    res.status(500).json({ message: 'Error submitting quiz', error: err.message });
  }
}

// Get all quiz results for the logged-in user
async function getUserQuizResults(req, res) {
  try {
    const results = await QuizResult.findAll({
      where: { userId: req.user.userId },
      order: [['timestamp', 'DESC']],
    });
    res.json({ results });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching quiz results', error: err.message });
  }
}

const quizQuestions = [
  {
    id: 1,
    question: "How are you feeling today?",
    options: ["Good", "Okay", "Bad", "Very bad"]
  },
  {
    id: 2,
    question: "How well did you sleep last night?",
    options: ["Very well", "Okay", "Not well", "Didn't sleep"]
  },
  // Add more questions as needed
];

function getQuizQuestions(req, res) {
  res.json({ questions: quizQuestions });
}

module.exports = { submitQuiz, getUserQuizResults, getQuizQuestions }; 
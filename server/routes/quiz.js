const express = require('express');
const router = express.Router();
const { submitQuiz, getUserQuizResults, getQuizQuestions } = require('../controllers/quizController');
const auth = require('../middleware/auth');

router.post('/submit', auth, submitQuiz);
router.get('/', auth, getUserQuizResults);
router.get('/questions', auth, getQuizQuestions);

module.exports = router; 
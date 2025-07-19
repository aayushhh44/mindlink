const express = require('express');
const app = express();

const cors = require('cors');
const corsOptions = {
  origin: 'htpp://3.148.53.242',
  credentials: true
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const quizRoutes = require('./routes/quiz');
app.use('/api/quiz', quizRoutes);

const appointmentsRoutes = require('./routes/appointments');
app.use('/api/appointments', appointmentsRoutes);

const resourcesRoutes = require('./routes/resources');
app.use('/api/resources', resourcesRoutes);

const communityRoutes = require('./routes/community');
app.use('/api/community', communityRoutes);

app.get('/api/test', (req, res) => res.json({ message: 'Backend is working!' }));

module.exports = app;
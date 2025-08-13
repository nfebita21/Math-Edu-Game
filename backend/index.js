import express from 'express';
import studentRoutes from './routes/student.js';
import quizProgressRoutes from './routes/quiz-progress.js';
import loginRoutes from './routes/login.js';
import protectedRoutes from './routes/protected/protected.js';
import signupRoutes from './routes/sign-up.js';
import cityRoutes from './routes/city.js';
import modulRoutes from './routes/modul.js';
import cors from 'cors';

const app = express();
const PORT = 3000;

// Activate CORS for spesific domain
const whiteList = [
  'http://localhost:9000',
  'http://192.168.1.2:9000',
]

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) {
      callback(null, true);
    } else if (whiteList.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}

app.use(cors(corsOptions));

app.options('*', cors(corsOptions));

// Parse JSON requests
app.use(express.json());

app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});

// Use the student route
app.use('/students', studentRoutes);
app.use('/quiz-progress', quizProgressRoutes);
app.use('/login', loginRoutes);
app.use('/protected', protectedRoutes);
app.use('/sign-up', signupRoutes);
app.use('/city', cityRoutes);
app.use('/modul', modulRoutes);


// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
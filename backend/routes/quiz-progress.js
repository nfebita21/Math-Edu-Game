import express from 'express';
import connection from '../db.js';
import { getCurrentDate, getCurrentTime } from '../utils/time.js';

const router = express.Router();

router.get('/reward/:cityId/:rewardName', async (req, res) => {
  const { cityId, rewardName } = req.params;

  try {
    const searchQuery = 'SELECT candy_converted FROM game_reward WHERE city_id = ? AND img_url = ?';
    const [searchResult] = await connection.query(searchQuery, [cityId, rewardName]);

    return res.json(
      searchResult[0]
    )
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
});

router.get('/:studentId/:modulId/:level', async (req, res) => {
  const { studentId, modulId, level } = req.params;

  try {
    const searchQuery = "SELECT * FROM quiz_progress WHERE student_id = ? AND modul_id = ? AND level = ?";
    const [searchResult] = await connection.query(searchQuery, [studentId, modulId, level]);

    if (searchResult.length === 0) {
      return res.json({
        message: 'Student quiz progress not found',
        statusCode: 404
      })
    }

    res.json({ statusCode: 200, result: searchResult[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/high-score', async (req, res) => {
  const { studentId, cityId, level } = req.query;
  console.log(studentId, cityId, level)

  try {
    const query = 'SELECT MAX(score) AS high_score FROM quiz_history WHERE student_id = ? AND city_id = ? AND level = ?';
    let [result] = await connection.query(query, [studentId, cityId, level]);

    result = result[0]['high_score'] === null ? {high_score: 0} : result[0];
    res.json( result );
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



router.post('/new/:studentId', async (req, res) => {
  const { studentId } = req.params;
  const { modulId, level } = req.body;
  
  try {
    const query = "INSERT INTO quiz_progress (student_id, modul_id, level, is_tutorial_passed, date_and_time) VALUES (?, ?, ?, ?, ?)";

    const result = await connection.query(query, [studentId, modulId, level, 0, new Date()]);

    res.json({
      result: result[0],
      message: 'Quiz Progress succesfully added',
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/tutorial-passed/:quizProgressId', async (req, res) => {
   const { quizProgressId } = req.params;

   try {
    const query = "UPDATE quiz_progress SET is_tutorial_passed = 1 WHERE id = ?";
    const result = await connection.query(query, [quizProgressId]);

    res.json({result: result[0], message: 'Tutorial passed successfully updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/step/:quizProgressId', async (req, res) => {
  const { quizProgressId } = req.params;
  const { mainId, stepId, isCorrect } = req.body;

  try {
    const query = "INSERT INTO quiz_progress_detail(quiz_progress_id, main_id, step_id, is_correct) VALUES (?, ?, ?, ?)";
    const result = await connection.query(query, [quizProgressId, mainId, stepId, isCorrect]);

    res.json({result: result[0], message: 'Quiz Progress Detail succesfully added' })
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/search-passed-quizzes', async (req, res) => {
  const { studentId, cityId, level } = req.query;

  try {
    const query = "SELECT * FROM quiz_history WHERE student_id = ? AND city_id = ? AND level = ? AND is_passed = 1";
    const [result] = await connection.query(query, [studentId, cityId, level]);

    res.json({data: result});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/save-history', async (req, res) => {
  const { id } = req.query;
  const { score, totalCandy, overallValue, totalQuestions, correctAnswers, isPassed } = req.body;
  const currentTime = getCurrentTime();

  try {
    const query = "UPDATE quiz_history SET score = ?, candy = ?, overall_value = ?, total_questions = ?, correct_answers = ?, completed_at = ?, is_passed = ? WHERE id = ?";
    const result = await connection.query(query, [score, totalCandy, overallValue, totalQuestions, correctAnswers, currentTime, isPassed, id]); 

    res.json({result: result[0], message: "quiz history has successfully updated"});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.post('/start-quiz', async (req, res) => {
  const { studentId, cityId, level } = req.query;
  const score = 0, candy = 0, overallValue = null, totalQuestions = 0, correctAnswers = 0;
  const date = getCurrentDate();
  const currentTime = getCurrentTime();
  try {
    const query = "INSERT INTO quiz_history (date, student_id, city_id, level, score, candy, overall_value, total_questions, correct_answers, started_at, completed_at, is_passed) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    const result = await connection.query(query, [date, studentId, cityId, level, score, candy, overallValue, totalQuestions, correctAnswers, currentTime, null, 0]);
    
    res.json({historyId: result[0]['insertId'], message: "Quiz history has successfully added"});
    
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:progressQuizId', async (req, res) => {
  const { progressQuizId } = req.params;

  try {
    const searchQuery = "SELECT * FROM quiz_progress WHERE id = ?";
    const [searchResult] = await connection.query(searchQuery, [progressQuizId]);
    
    res.json({ statusCode: 200, result: searchResult[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
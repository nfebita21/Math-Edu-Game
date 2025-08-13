import express from 'express';
import connection from '../db.js';

const router = express.Router();


router.get('/quiz', async (req, res) => {
  let { modulId, level } = req.query;
  try {
    const query = "SELECT * FROM main_quiz WHERE modul_id = ? AND level = ?";
    const [result] = await connection.query(query, [modulId, level]);

    const criteriaQuery = "SELECT * FROM criteria_quiz WHERE modul_id = ? AND level = ?";
    const [criteriaResult] = await connection.query(criteriaQuery, [modulId, level]);

    const subQuizQuery = "SELECT * FROM sub_quiz WHERE modul_id = ? AND level = ?";
    const [subQuizResult] = await connection.query(subQuizQuery, [modulId, level]);

    const optionQuery = "SELECT * FROM quiz_option WHERE modul_id = ? AND level = ?";
    const [optionResult] = await connection.query(optionQuery, [modulId, level]);

    res.json({ data: result, criteria: criteriaResult[0], subQuiz: subQuizResult, options: optionResult });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:modulId', async (req, res) => {
  let { modulId } = req.params;
  modulId = modulId.replace('%20', ' ');
  try {
    const query = 'SELECT * FROM modul WHERE id = ?';
    const result = await connection.query(query, [modulId]);
    res.json({ data: result[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



export default router;
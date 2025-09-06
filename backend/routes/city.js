import e from "express";
import connection from "../db.js";

const router = e.Router();




router.get('/progress/:cityId', async (req, res) => {
  const { cityId } = req.params;
  try {
    const query = 'SELECT * FROM city_score WHERE city_id = ? AND is_locked = 0';
    const result = await connection.query(query, [cityId]);
    res.json({ data: result[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/modul/:cityId', async (req, res) => {
  const { cityId } = req.params;
  try {
    const query = `SELECT * FROM modul WHERE city_id = ?`;
    const result = await connection.query(query, [cityId]);
    res.json({ data: result[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/quiz-result-template/:cityId', async (req, res) => {
  const { cityId } = req.params;
  try {
    const query = "SELECT game_result_template FROM city WHERE id = ?"
    const result = await connection.query(query, [cityId]);
    res.json(result[0][0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/leaderboard/:cityId', async (req, res) => {
  const { cityId } = req.params;
  try {
    const query = "SELECT cp.student_id, SUM(qh.score) AS total_score FROM city_progress cp JOIN quiz_history qh ON cp.student_id = qh.student_id AND cp.city_id = qh.city_id WHERE cp.city_id = ? AND cp.is_locked = 0 GROUP BY cp.student_id ORDER BY total_score DESC";
    const [result] = await connection.query(query, [cityId]);
    res.json( result );
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/high-score', async (req, res) => {
  const { studentId, cityId } = req.query;
  try {
    const query = 'SELECT MAX(score) AS high_score FROM quiz_history WHERE student_id = ? AND city_id = ?';
    let [result] = await connection.query(query, [studentId, cityId]);
    result = result[0]['high_score'] === null ? {high_score: 0} : result[0];
    res.json( result );
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/level-progress', async (req, res) => {
  const { cityId, studentId } = req.query;

  try {
    const query = "SELECT * FROM level_progress WHERE city_id = ? AND student_id = ?";
    const [result] = await connection.query(query, [cityId, studentId]);
    res.json({ data: result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/level', async (req, res) => {
  const { cityId, levelNumber } = req.query;

  try {
    const query = "SELECT * FROM level WHERE city_id = ? AND level_num = ?";
    const [result] = await connection.query(query, [cityId, levelNumber]);
    res.json( result[0] );
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/reward', async (req, res) => {
  let { cityId, level } = req.query;
  try {
    const query = 'SELECT * FROM game_reward WHERE city_id = ? AND level = ?';
    const result = await connection.query(query, [cityId, level]);
    res.json({ data: result[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/gallery/:cityId', async (req, res) => {
  let { cityId } = req.params;
  try {
    const query = 'SELECT * FROM gallery WHERE city_id = ?';
    const result = await connection.query(query, [cityId]);
    res.json({ data: result[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:cityName', async (req, res) => {
  let { cityName } = req.params;
  cityName = cityName.replace('%20', ' ');
  try {
    const query = 'SELECT * FROM city WHERE city_name = ?';
    const result = await connection.query(query, [cityName]);
    res.json({ data: result[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const query = `SELECT * FROM city`;
    const result = await connection.query(query);

    res.json({ city: result[0] });
  } catch (err) {
    res.json({ error: err.message });
  }
});

export default router;
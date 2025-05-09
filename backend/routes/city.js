import e from "express";
import connection from "../db.js";

const router = e.Router();

router.get('/', async (req, res) => {
  try {
    const query = `SELECT * FROM city`;
    const result = await connection.query(query);

    res.json({ city: result[0] });
  } catch (err) {
    res.json({ error: err.message });
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

router.get('/reward/:cityId', async (req, res) => {
  let { cityId } = req.params;
  try {
    const query = 'SELECT * FROM game_reward WHERE city_id = ?';
    const result = await connection.query(query, [cityId]);
    res.json({ data: result[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/progress/:cityId', async (req, res) => {
  const { cityId } = req.params;
  try {
    const query = 'SELECT * FROM student_exp WHERE city_id = ? AND is_locked = 0';
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
})

export default router;
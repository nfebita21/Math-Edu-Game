import express from 'express';
import connection from '../db.js';

const router = express.Router();

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
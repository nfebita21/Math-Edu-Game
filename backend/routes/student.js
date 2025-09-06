import express from 'express';
import connection from '../db.js';
import { isRewardGranted } from '../utils/random.js';
import { getCurrentTime } from '../utils/time.js';

const router = express.Router();


router.post('/add-gallery/:studentId', async (req, res) => {
  const { studentId } = req.params;
  const { galleryId } = req.body;

  try {
    const query = "INSERT INTO student_gallery (student_id, gallery_id) VALUES (?, ?)";
    const [result] = await connection.query(query, [studentId, galleryId]);

    res.json({ result, message: 'Student gallery successfully added.' })
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/search/:identityNumber', async (req, res) => {
  try {
    const { identityNumber } = req.params;
    const query = 'SELECT * FROM student WHERE identity_number = ?';
    const [result] = await connection.query(query, [identityNumber]);

    if (result.length === 0) {
      return res.status(404).json({
        message: 'Student not found',
        statusCode: 404,
      });
    }

    res.json({ 
      message: 'Student is available',
      statusCode: 200,
      data: result[0]
    });
  } catch(err) {
    res.status(500).json({ error: err.message});
  }
});

router.get('/gallery/:studentId', async (req, res) => {
  try {
    const { studentId } = req.params;
    const query = 'SELECT g.spot_name, g.picture_url, g.city_id, g.type FROM student_gallery sg INNER JOIN gallery g on sg.gallery_id = g.id WHERE student_id = ?';
    const [result] = await connection.query(query, [studentId]);

    if(result.length === 0) {
      return res.status(404).json({ statusCode: 404, message: 'The student do not have any picture', result });
    }

    res.json({ statusCode: 200, result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



router.get('/:studentId/total-score', async (req, res) => {
  try {
    const { studentId } = req.params;
    console.log('ini rute quiz progress')

    const query = 'SELECT SUM(score) AS total_score FROM quiz_history WHERE student_id = ?';
    let result = await connection.query(query, [studentId]);
    result = result[0][0]['total_score'] === null ? {'total_score': 0} : result[0][0];
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:studentId/:cityId', async (req, res) => {
  try {
    const { studentId, cityId } = req.params;

    const query = 'SELECT * FROM city_progress WHERE student_id = ? AND city_id = ?';
    const result = await connection.query(query, [studentId, cityId]);
    res.json({ data: result[0][0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.put('/:studentId/buy-city', async (req, res) => {
  const { studentId } = req.params;
  const { cityId } = req.body;
  try {
    const query = 'UPDATE city_progress SET is_locked = 0 WHERE student_id = ? AND city_id = ?'
    const result = await connection.query(query, [studentId, cityId]);

    res.json({result: result[0], message: 'City unlocked', studentId, cityId});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:studentId/add-candy', async (req, res) => {
  const { studentId } = req.params;
  const { amount } = req.body;

  try {
    const query = "UPDATE student SET candy = candy + ? WHERE id = ?";
    const [result] = await connection.query(query, [amount, studentId]);
    if (result.affectedRows === 0){
      res.status(404).json({ message: 'Student not found' });
    }

    res.json({message: 'Candy successfully updated'});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/leaderboard', async (req, res) => {
  try {
    const query = 'SELECT s.nick_name, s.avatar_url, SUM(qh.score) AS total_score FROM quiz_history qh INNER JOIN student s on qh.student_id = s.id GROUP BY s.id HAVING total_score > 0 ORDER BY total_score DESC';
    const result = await connection.query(query);
    res.json({ data: result[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/process-quiz-complete', async (req, res) => {
  const { studentId, cityId, level } = req.query;
  const { mainId, historyId, isPassed, detailAnswer } = req.body;

  try {
    // History Saving
    const query = "INSERT INTO quiz_history_detail (history_id, main_id, step_id, answer, is_correct) VALUES (?, ?, ?, ?, ?)";

    // Student Reward Progress
    let rewardGranted = false;
    let rewardType = null;
    let quizCounter = 0;
    let attemptCounter = 0;

    let [rewardProgress] = await connection.query(
      "SELECT quiz_passed_count, attempt_counter, last_reward_at FROM student_rewards_progress WHERE student_id = ? AND city_id = ?",
      [studentId, cityId]
    );

    if (!rewardProgress.length) {
      await connection.query(
        "INSERT INTO student_rewards_progress (student_id, city_id, quiz_passed_count, last_reward_at, attempt_counter) VALUES (?, ?, ?, ?, ?)",
        [studentId, cityId, 0, null, 0]
      );
      rewardProgress = [{ quiz_passed_count: 0, attempt_counter: 0, last_reward_at: null }];
    }

    // Sesuaikan dengan database
    quizCounter = rewardProgress[0].quiz_passed_count;
    attemptCounter = rewardProgress[0].attempt_counter;
    let lastRewardAt = rewardProgress[0].last_reward_at;

    const [oldCriteria] = await connection.query(
        `SELECT * FROM reward_criteria 
        WHERE min_quiz_count <= ?
        ORDER BY min_quiz_count DESC
        LIMIT 1`,
        [quizCounter]
      );

      rewardType = oldCriteria.length >= 1 ? oldCriteria[0].reward_type : null;

    if (isPassed) {

      quizCounter++;

      const [criteria] = await connection.query(
        `SELECT * FROM reward_criteria 
        WHERE min_quiz_count <= ?
        ORDER BY min_quiz_count DESC
        LIMIT 1`,
        [quizCounter]
      );

      if (criteria.length > 0) {
        const newRewardType = criteria[0].reward_type;

        // Reset attemptCounter kalau type berubah
        if (rewardType !== newRewardType) {
          attemptCounter = 0;
        }

        rewardType = newRewardType;
        attemptCounter++;

        if (attemptCounter <= criteria[0].max_attempts) {

          if (isRewardGranted(criteria[0].chance_denom)) {
            // ✅ Reward didapatkan
            rewardGranted = true;
            attemptCounter = 0;

            if (rewardType === "Advanced") {
              quizCounter = 0;
            }

            lastRewardAt = new Date();
          }
        } else { // Kalau udah melebihi max attempts
          rewardType = null;
          quizCounter = 0;
          attemptCounter = 0;
        }
      } // penutup jika kriteria ada
    } // penutup kuis yg lulus nilai

    // 🔄 Simpan progress
    await connection.query(
      "UPDATE student_rewards_progress SET quiz_passed_count = ?, attempt_counter = ?, last_reward_at = ? WHERE student_id = ? AND city_id = ?",
      [quizCounter, attemptCounter, lastRewardAt, studentId, cityId]
    );

    // Simpan jawaban detail
    await Promise.all(detailAnswer.map(answer =>
      connection.query(query, [
        historyId, mainId, answer.stepId, answer.answer, answer.isCorrect
      ])
    ));

    res.json({
      message: "Quiz answer successfully saved",
      rewardGranted,
      rewardType,
      quizCounter,
      attemptCounter
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:identityNumber', async (req, res) => {
  const { identityNumber } = req.params;

  const { nickName, avatarUrl } = req.body;

  try {
    const [result] = await connection.query('UPDATE student set nick_name = ?, avatar_url = ?, is_setup = 1 WHERE identity_number = ?', [nickName, avatarUrl, identityNumber]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Student not found'});
    }
    res.status(200).json({ message: 'Student updated succesfully', statusCode: 200});
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const query = 'SELECT * FROM student';
    const [result] = await connection.query(query);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
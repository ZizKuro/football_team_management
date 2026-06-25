const express = require('express');
const teamController = require('../controllers/teamController');
const { protect, restrictTo } = require('../middleware/auth');

const router = express.Router();

router.get('/stats/:season', protect, teamController.getSeasonStats);
router.get('/top/:minWins', protect, teamController.getTopTeams);

router
  .route('/')
  .get(protect, teamController.getTeams)
  .post(protect, restrictTo('admin'), teamController.createTeam);

router
  .route('/:id')
  .get(protect, teamController.getTeam)
  .put(protect, restrictTo('admin'), teamController.updateTeam)
  .delete(protect, restrictTo('admin'), teamController.deleteTeam);

module.exports = router;

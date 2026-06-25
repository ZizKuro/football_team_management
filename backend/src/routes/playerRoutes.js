const express = require('express');
const playerController = require('../controllers/playerController');
const { protect, restrictTo } = require('../middleware/auth');

const router = express.Router();

router.get('/scorers/top', protect, playerController.getTopScorers);

router
  .route('/')
  .get(protect, playerController.getPlayers)
  .post(protect, restrictTo('admin'), playerController.createPlayer);

router
  .route('/:id')
  .get(protect, playerController.getPlayer)
  .put(protect, restrictTo('admin'), playerController.updatePlayer)
  .delete(protect, restrictTo('admin'), playerController.deletePlayer);

module.exports = router;

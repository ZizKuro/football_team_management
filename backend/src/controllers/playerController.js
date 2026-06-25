const playerService = require('../services/playerService');

const createPlayer = async (req, res, next) => {
  try {
    const player = await playerService.createPlayer(req.body, req.user._id);
    res.status(201).json({
      success: true,
      message: 'Player registered with GFF',
      data: player,
    });
  } catch (error) {
    next(error);
  }
};

const getPlayers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const { search, position, team } = req.query;
    const result = await playerService.getPlayers({ page, limit, search, position, team });
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

const getPlayer = async (req, res, next) => {
  try {
    const player = await playerService.getPlayerById(req.params.id);
    res.status(200).json({ success: true, data: player });
  } catch (error) {
    next(error);
  }
};

const updatePlayer = async (req, res, next) => {
  try {
    const player = await playerService.updatePlayer(req.params.id, req.body);
    res.status(200).json({
      success: true,
      message: 'Player record updated',
      data: player,
    });
  } catch (error) {
    next(error);
  }
};

const deletePlayer = async (req, res, next) => {
  try {
    await playerService.deletePlayer(req.params.id);
    res.status(200).json({
      success: true,
      message: 'Player removed from registry',
    });
  } catch (error) {
    next(error);
  }
};

const getTopScorers = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 10;
    const players = await playerService.getTopScorers(limit);
    res.status(200).json({ success: true, count: players.length, data: players });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPlayer,
  getPlayers,
  getPlayer,
  updatePlayer,
  deletePlayer,
  getTopScorers,
};

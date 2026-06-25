const Player = require('../models/Player');
const Team = require('../models/Team');
const AppError = require('../utils/AppError');

const createPlayer = async (data, userId) => {
  const team = await Team.findById(data.team);
  if (!team) throw new AppError('Club not found', 404);

  const player = await Player.create({ ...data, createdBy: userId });
  return player.populate('team', 'name city season');
};

const getPlayers = async ({ page = 1, limit = 10, search = '', position = '', team = '' }) => {
  const query = {};

  if (search) {
    query.fullName = { $regex: search, $options: 'i' };
  }
  if (position) {
    query.position = position;
  }
  if (team) {
    query.team = team;
  }

  const skip = (page - 1) * limit;
  const [players, total] = await Promise.all([
    Player.find(query)
      .populate('team', 'name city season')
      .sort({ goals: -1, fullName: 1 })
      .skip(skip)
      .limit(limit),
    Player.countDocuments(query),
  ]);

  return {
    players,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(total / limit) || 1,
      totalItems: total,
      itemsPerPage: limit,
    },
  };
};

const getPlayerById = async (id) => {
  const player = await Player.findById(id).populate('team', 'name city season stadium');
  if (!player) throw new AppError('Player not found', 404);
  return player;
};

const updatePlayer = async (id, data) => {
  if (data.team) {
    const team = await Team.findById(data.team);
    if (!team) throw new AppError('Club not found', 404);
  }

  const player = await Player.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  }).populate('team', 'name city season');

  if (!player) throw new AppError('Player not found', 404);
  return player;
};

const deletePlayer = async (id) => {
  const player = await Player.findByIdAndDelete(id);
  if (!player) throw new AppError('Player not found', 404);
  return player;
};

const getTopScorers = async (limit = 10) => {
  return Player.find({ goals: { $gt: 0 } })
    .populate('team', 'name city')
    .sort({ goals: -1 })
    .limit(limit);
};

module.exports = {
  createPlayer,
  getPlayers,
  getPlayerById,
  updatePlayer,
  deletePlayer,
  getTopScorers,
};

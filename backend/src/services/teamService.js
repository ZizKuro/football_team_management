const Team = require('../models/Team');
const AppError = require('../utils/AppError');

const createTeam = async (data, userId) => {
  const team = await Team.create({ ...data, createdBy: userId });
  return team;
};

const getTeams = async ({ page = 1, limit = 10, search = '', city = '', season = '' }) => {
  const query = {};

  if (search) {
    query.name = { $regex: search, $options: 'i' };
  }
  if (city) {
    query.city = city;
  }
  if (season) {
    query.season = parseInt(season, 10);
  }

  const skip = (page - 1) * limit;
  const [teams, total] = await Promise.all([
    Team.find(query).sort({ season: -1, points: -1 }).skip(skip).limit(limit),
    Team.countDocuments(query),
  ]);

  return {
    teams,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(total / limit) || 1,
      totalItems: total,
      itemsPerPage: limit,
    },
  };
};

const getTeamById = async (id) => {
  const team = await Team.findById(id);
  if (!team) throw new AppError('Club not found', 404);
  return team;
};

const updateTeam = async (id, data) => {
  const team = await Team.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
  if (!team) throw new AppError('Club not found', 404);
  return team;
};

const deleteTeam = async (id) => {
  const team = await Team.findByIdAndDelete(id);
  if (!team) throw new AppError('Club not found', 404);
  return team;
};

const getTopTeams = async (minWins = 0) => {
  return Team.find({ wins: { $gte: minWins } })
    .sort({ wins: -1, points: -1 })
    .limit(10);
};

const getSeasonStats = async (season) => {
  const seasonNum = parseInt(season, 10);
  if (Number.isNaN(seasonNum)) throw new AppError('Season must be a valid year', 400);

  const stats = await Team.aggregate([
    { $match: { season: seasonNum } },
    {
      $group: {
        _id: null,
        totalClubs: { $sum: 1 },
        totalGames: { $sum: '$gamesPlayed' },
        totalWins: { $sum: '$wins' },
        totalDraws: { $sum: '$draws' },
        totalLosses: { $sum: '$losses' },
        totalGoalsFor: { $sum: '$goalsFor' },
        totalGoalsAgainst: { $sum: '$goalsAgainst' },
        totalPoints: { $sum: '$points' },
      },
    },
  ]);

  if (!stats.length) throw new AppError(`No league data found for season ${seasonNum}`, 404);
  return { season: seasonNum, ...stats[0] };
};

module.exports = {
  createTeam,
  getTeams,
  getTeamById,
  updateTeam,
  deleteTeam,
  getTopTeams,
  getSeasonStats,
};

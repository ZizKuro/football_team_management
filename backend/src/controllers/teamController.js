const teamService = require('../services/teamService');

const createTeam = async (req, res, next) => {
  try {
    const team = await teamService.createTeam(req.body, req.user._id);
    res.status(201).json({
      success: true,
      message: 'Gambian club registered successfully',
      data: team,
    });
  } catch (error) {
    next(error);
  }
};

const getTeams = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const { search, city, season } = req.query;
    const result = await teamService.getTeams({ page, limit, search, city, season });
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

const getTeam = async (req, res, next) => {
  try {
    const team = await teamService.getTeamById(req.params.id);
    res.status(200).json({ success: true, data: team });
  } catch (error) {
    next(error);
  }
};

const updateTeam = async (req, res, next) => {
  try {
    const team = await teamService.updateTeam(req.params.id, req.body);
    res.status(200).json({
      success: true,
      message: 'Club updated successfully',
      data: team,
    });
  } catch (error) {
    next(error);
  }
};

const deleteTeam = async (req, res, next) => {
  try {
    await teamService.deleteTeam(req.params.id);
    res.status(200).json({
      success: true,
      message: 'Club removed from league records',
    });
  } catch (error) {
    next(error);
  }
};

const getTopTeams = async (req, res, next) => {
  try {
    const minWins = parseInt(req.params.minWins, 10) || 0;
    const teams = await teamService.getTopTeams(minWins);
    res.status(200).json({ success: true, count: teams.length, data: teams });
  } catch (error) {
    next(error);
  }
};

const getSeasonStats = async (req, res, next) => {
  try {
    const stats = await teamService.getSeasonStats(req.params.season);
    res.status(200).json({ success: true, data: stats });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTeam,
  getTeams,
  getTeam,
  updateTeam,
  deleteTeam,
  getTopTeams,
  getSeasonStats,
};

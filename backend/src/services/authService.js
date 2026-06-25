const User = require('../models/User');
const AppError = require('../utils/AppError');
const { signToken } = require('../middleware/auth');

const register = async ({ name, email, password, role, region }) => {
  if (!name || !email || !password) {
    throw new AppError('Name, email, and password are required', 400);
  }

  if (password.length < 6) {
    throw new AppError('Password must be at least 6 characters', 400);
  }

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    throw new AppError('Email is already registered', 409);
  }

  const user = await User.create({
    name,
    email,
    password,
    role: 'user',
    region: region || 'Greater Banjul',
  });

  const token = signToken(user._id, user.role);
  return { user, token };
};

const login = async ({ email, password }) => {
  if (!email || !password) {
    throw new AppError('Email and password are required', 400);
  }

  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    throw new AppError('Invalid email or password', 401);
  }

  const token = signToken(user._id, user.role);
  user.password = undefined;
  return { user, token };
};

const getProfile = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError('User not found', 404);
  return user;
};

module.exports = { register, login, getProfile };

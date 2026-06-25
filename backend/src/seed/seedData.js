require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('../config/db');
const User = require('../models/User');
const Team = require('../models/Team');
const Player = require('../models/Player');

const GAMBIAN_CLUBS = [
  { name: 'Real de Banjul FC', city: 'Banjul', stadium: 'Independence Stadium', founded: 1968, season: 2025, gamesPlayed: 22, wins: 14, draws: 5, losses: 3, goalsFor: 38, goalsAgainst: 15, points: 47 },
  { name: 'Gamtel FC', city: 'Banjul', stadium: 'Bakau Independence Stadium', founded: 1998, season: 2025, gamesPlayed: 22, wins: 12, draws: 6, losses: 4, goalsFor: 35, goalsAgainst: 18, points: 42 },
  { name: 'Armed Forces FC', city: 'Banjul', stadium: 'Independence Stadium', founded: 1979, season: 2025, gamesPlayed: 22, wins: 11, draws: 7, losses: 4, goalsFor: 32, goalsAgainst: 20, points: 40 },
  { name: 'Fortune FC', city: 'Serrekunda', stadium: 'Serrekunda East Mini-Stadium', founded: 2016, season: 2025, gamesPlayed: 22, wins: 10, draws: 5, losses: 7, goalsFor: 28, goalsAgainst: 24, points: 35 },
  { name: 'Hawks FC', city: 'Banjul', stadium: 'Independence Stadium', founded: 1974, season: 2025, gamesPlayed: 22, wins: 9, draws: 8, losses: 5, goalsFor: 27, goalsAgainst: 22, points: 35 },
  { name: 'Brikama United FC', city: 'Brikama', stadium: 'Brikama Box Bar Stadium', founded: 2000, season: 2025, gamesPlayed: 22, wins: 8, draws: 6, losses: 8, goalsFor: 25, goalsAgainst: 26, points: 30 },
  { name: 'Steve Biko FC', city: 'Banjul', stadium: 'Independence Stadium', founded: 1982, season: 2025, gamesPlayed: 22, wins: 7, draws: 7, losses: 8, goalsFor: 22, goalsAgainst: 25, points: 28 },
  { name: 'GPA FC', city: 'Banjul', stadium: 'Independence Stadium', founded: 1975, season: 2025, gamesPlayed: 22, wins: 6, draws: 5, losses: 11, goalsFor: 18, goalsAgainst: 30, points: 23 },
];

const SAMPLE_PLAYERS = [
  { fullName: 'Modou Barrow', position: 'Forward', jerseyNumber: 9, goals: 12, assists: 4, appearances: 20 },
  { fullName: 'Assan Ceesay', position: 'Forward', jerseyNumber: 10, goals: 10, assists: 3, appearances: 19 },
  { fullName: 'Bubacarr Jobe', position: 'Midfielder', jerseyNumber: 8, goals: 5, assists: 7, appearances: 21 },
  { fullName: 'Pa Modou Jagne', position: 'Defender', jerseyNumber: 4, goals: 1, assists: 2, appearances: 22 },
  { fullName: 'Baboucarr Gaye', position: 'Goalkeeper', jerseyNumber: 1, goals: 0, assists: 0, appearances: 22 },
];

const seed = async () => {
  try {
    await connectDB();
    await Promise.all([User.deleteMany(), Team.deleteMany(), Player.deleteMany()]);

    const admin = await User.create({
      name: 'GFF Admin',
      email: 'admin@gff.gm',
      password: 'admin123',
      role: 'admin',
      region: 'Banjul',
    });

    await User.create({
      name: 'Fan User',
      email: 'fan@gff.gm',
      password: 'user123',
      role: 'user',
      region: 'Serrekunda',
    });

    const teams = await Team.insertMany(
      GAMBIAN_CLUBS.map((club) => ({ ...club, createdBy: admin._id }))
    );

    const players = SAMPLE_PLAYERS.map((p, i) => ({
      ...p,
      team: teams[i % teams.length]._id,
      nationality: 'Gambian',
      createdBy: admin._id,
    }));

    await Player.insertMany(players);

    console.log('Database seeded with Gambian league data');
    console.log('Admin login: admin@gff.gm / admin123');
    console.log('User login: fan@gff.gm / user123');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seed();

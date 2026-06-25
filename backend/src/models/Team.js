const mongoose = require('mongoose');

/**
 * Team Model - Gambian GFF League clubs
 * Represents clubs in the Gambia Football Federation domestic league
 */
const teamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Club name is required'],
      trim: true,
      maxlength: [120, 'Club name cannot exceed 120 characters'],
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      enum: {
        values: ['Banjul', 'Serrekunda', 'Bakau', 'Brikama', 'Farafenni', 'Basse', 'Soma', 'Georgetown'],
        message: 'City must be a recognised Gambian location',
      },
    },
    stadium: {
      type: String,
      trim: true,
      default: 'Independence Stadium',
    },
    founded: {
      type: Number,
      min: [1800, 'Founded year must be realistic'],
      max: [new Date().getFullYear(), 'Founded year cannot be in the future'],
    },
    season: {
      type: Number,
      required: [true, 'Season year is required'],
      min: [2000, 'Season must be 2000 or later'],
      max: [new Date().getFullYear() + 1, 'Invalid season year'],
    },
    gamesPlayed: { type: Number, default: 0, min: 0 },
    wins: { type: Number, default: 0, min: 0 },
    draws: { type: Number, default: 0, min: 0 },
    losses: { type: Number, default: 0, min: 0 },
    goalsFor: { type: Number, default: 0, min: 0 },
    goalsAgainst: { type: Number, default: 0, min: 0 },
    points: { type: Number, default: 0, min: 0 },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

teamSchema.index({ name: 1, season: 1 }, { unique: true });

teamSchema.virtual('goalDifference').get(function goalDifference() {
  return this.goalsFor - this.goalsAgainst;
});

teamSchema.set('toJSON', { virtuals: true });
teamSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Team', teamSchema);

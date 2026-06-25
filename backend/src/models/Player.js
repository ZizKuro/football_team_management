const mongoose = require('mongoose');

/**
 * Player Model - Registered players in the GFF league
 * Linked to a Team via teamId (many-to-one relationship)
 */
const playerSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Player full name is required'],
      trim: true,
      maxlength: [120, 'Name cannot exceed 120 characters'],
    },
    position: {
      type: String,
      required: [true, 'Position is required'],
      enum: {
        values: ['Goalkeeper', 'Defender', 'Midfielder', 'Forward'],
        message: 'Position must be Goalkeeper, Defender, Midfielder, or Forward',
      },
    },
    jerseyNumber: {
      type: Number,
      required: [true, 'Jersey number is required'],
      min: [1, 'Jersey number must be at least 1'],
      max: [99, 'Jersey number cannot exceed 99'],
    },
    nationality: {
      type: String,
      default: 'Gambian',
      trim: true,
    },
    dateOfBirth: {
      type: Date,
      validate: {
        validator(value) {
          return !value || value < new Date();
        },
        message: 'Date of birth must be in the past',
      },
    },
    goals: { type: Number, default: 0, min: 0 },
    assists: { type: Number, default: 0, min: 0 },
    appearances: { type: Number, default: 0, min: 0 },
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team',
      required: [true, 'Player must belong to a club'],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

playerSchema.index({ team: 1, jerseyNumber: 1 }, { unique: true });

module.exports = mongoose.model('Player', playerSchema);

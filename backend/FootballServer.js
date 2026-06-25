const express = require("express");
const cors = require('cors');
const { connectDB } = require('./Footballdb');
const FootballTeam = require('./FootballSchema');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'Football Team Management API is running',
    timestamp: new Date().toISOString()
  });
});

// Connect to MongoDB and start server
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

// API Routes

// Add a new team
app.post('/api/teams', async (req, res) => {
    try {
        const { Team, GamesPlayed, Win, Draw, Loss, GoalsFor, GoalsAgainst, Points, Year } = req.body;
        
        // Basic validation
        if (!Team || !Year) {
            return res.status(400).json({ 
                error: 'Validation failed', 
                message: 'Team name and Year are required' 
            });
        }

        // Check if team already exists for the same year
        const existingTeam = await FootballTeam.findOne({ Team, Year });
        if (existingTeam) {
            return res.status(409).json({ 
                error: 'Conflict', 
                message: 'Team already exists for this year' 
            });
        }

        const newTeam = new FootballTeam({
            Team,
            'Games Played': GamesPlayed || 0,
            Win: Win || 0,
            Draw: Draw || 0,
            Loss: Loss || 0,
            'Goals For': GoalsFor || 0,
            'Goals Against': GoalsAgainst || 0,
            Points: Points || 0,
            Year: parseInt(Year)
        });

        await newTeam.save();
        res.status(201).json({ 
            success: true,
            message: 'Team added successfully!', 
            data: newTeam 
        });
    } catch (error) {
        console.error('Add team error:', error);
        res.status(500).json({ 
            error: 'Internal server error', 
            message: 'Failed to add team',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Update a team
app.put('/api/teams/:teamId', async (req, res) => {
    try {
        const { teamId } = req.params;
        const updateFields = req.body;
        
        // Remove undefined fields
        Object.keys(updateFields).forEach(key => {
            if (updateFields[key] === undefined) {
                delete updateFields[key];
            }
        });

        const updatedTeam = await FootballTeam.findByIdAndUpdate(
            teamId,
            { $set: updateFields },
            { new: true, runValidators: true }
        );
        
        if (updatedTeam) {
            res.status(200).json({ 
                success: true,
                message: 'Team updated successfully!', 
                data: updatedTeam 
            });
        } else {
            res.status(404).json({ 
                error: 'Not found', 
                message: 'Team not found!' 
            });
        }
    } catch (error) {
        console.error('Update team error:', error);
        res.status(500).json({ 
            error: 'Internal server error', 
            message: 'Failed to update team',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Delete a team
app.delete('/api/teams/:teamId', async (req, res) => {
    try {
        const { teamId } = req.params;
        const deletedTeam = await FootballTeam.findByIdAndDelete(teamId);
        
        if (deletedTeam) {
            res.status(200).json({ 
                success: true,
                message: 'Team deleted successfully!', 
                data: deletedTeam 
            });
        } else {
            res.status(404).json({ 
                error: 'Not found', 
                message: 'Team not found!' 
            });
        }
    } catch (error) {
        console.error('Delete team error:', error);
        res.status(500).json({ 
            error: 'Internal server error', 
            message: 'Failed to delete team',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Get team statistics for a specific year
app.get('/api/stats/:year', async (req, res) => {
    try {
        const { year } = req.params;
        const yearNum = parseInt(year);
        
        if (isNaN(yearNum)) {
            return res.status(400).json({ 
                error: 'Invalid year', 
                message: 'Year must be a valid number' 
            });
        }

        const stats = await FootballTeam.aggregate([
            { $match: { Year: yearNum } },
            {
                $group: {
                    _id: null,
                    totalGamesPlayed: { $sum: "$Games Played" },
                    totalWins: { $sum: "$Win" },
                    totalDraws: { $sum: "$Draw" },
                    totalLosses: { $sum: "$Loss" },
                    totalGoalsFor: { $sum: "$Goals For" },
                    totalGoalsAgainst: { $sum: "$Goals Against" },
                    totalPoints: { $sum: "$Points" },
                    teamCount: { $sum: 1 }
                },
            },
        ]);
        
        const result = stats[0];
        if (result) {
            res.status(200).json({ 
                success: true,
                year: yearNum,
                data: result 
            });
        } else {
            res.status(404).json({ 
                error: 'Not found', 
                message: 'No data found for the given year' 
            });
        }
    } catch (error) {
        console.error('Get stats error:', error);
        res.status(500).json({ 
            error: 'Internal server error', 
            message: 'Failed to fetch stats',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Get top teams by minimum wins
app.get('/api/teams/top/:minWins', async (req, res) => {
    try {
        const { minWins } = req.params;
        const minWinsNum = parseInt(minWins);
        
        if (isNaN(minWinsNum)) {
            return res.status(400).json({ 
                error: 'Invalid wins parameter', 
                message: 'Minimum wins must be a valid number' 
            });
        }

        const teams = await FootballTeam.find({ Win: { $gte: minWinsNum } })
            .sort({ Win: -1, Points: -1 })
            .limit(10)
            .exec();
            
        res.status(200).json({ 
            success: true,
            minWins: minWinsNum,
            count: teams.length,
            data: teams 
        });
    } catch (error) {
        console.error('Get top teams error:', error);
        res.status(500).json({ 
            error: 'Internal server error', 
            message: 'Failed to fetch top teams',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Get average goals for teams in a specific year
app.get('/api/goals/average/:year', async (req, res) => {
    try {
        const { year } = req.params;
        const yearNum = parseInt(year);
        
        if (isNaN(yearNum)) {
            return res.status(400).json({ 
                error: 'Invalid year', 
                message: 'Year must be a valid number' 
            });
        }

        const teams = await FootballTeam.aggregate([
            { $match: { Year: yearNum } },
            {
                $group: {
                    _id: "$Team",
                    avgGoalsFor: { $avg: "$Goals For" },
                    avgGoalsAgainst: { $avg: "$Goals Against" },
                    totalGames: { $sum: "$Games Played" }
                },
            },
            { $sort: { avgGoalsFor: -1 } }
        ]);
        
        res.status(200).json({ 
            success: true,
            year: yearNum,
            count: teams.length,
            data: teams 
        });
    } catch (error) {
        console.error('Get average goals error:', error);
        res.status(500).json({ 
            error: 'Internal server error', 
            message: 'Failed to fetch average goals',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Get all teams (with pagination)
app.get('/api/teams', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        
        const teams = await FootballTeam.find()
            .sort({ Year: -1, Points: -1 })
            .skip(skip)
            .limit(limit)
            .exec();
            
        const total = await FootballTeam.countDocuments();
        
        res.status(200).json({
            success: true,
            data: teams,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalItems: total,
                itemsPerPage: limit
            }
        });
    } catch (error) {
        console.error('Get teams error:', error);
        res.status(500).json({ 
            error: 'Internal server error', 
            message: 'Failed to fetch teams',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// 404 handler for undefined routes
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Route not found',
        message: `Cannot ${req.method} ${req.originalUrl}`
    });
});
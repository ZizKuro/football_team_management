import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { statsAPI } from '../services/api';
import { useApi } from '../hooks/useApi';

const TeamStats = () => {
  const [year, setYear] = useState('');
  const { data: stats, loading, error, execute } = useApi(statsAPI.getTeamStats);

  const fetchStats = async () => {
    if (!year || year < 1900 || year > new Date().getFullYear() + 1) {
      toast.error('Please enter a valid year');
      return;
    }

    try {
      await execute(year);
      toast.success('Stats loaded successfully!');
    } catch (err) {
      toast.error(error || 'Failed to fetch stats');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      fetchStats();
    }
  };

  return (
    <div className="form-container">
      <h1>📊 Team Statistics</h1>
      
      <div className="input-group">
        <label htmlFor="year">Enter Year:</label>
        <input
          id="year"
          type="number"
          name="Year"
          placeholder="Enter year (e.g., 2023)"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          onKeyPress={handleKeyPress}
          min="1900"
          max={new Date().getFullYear() + 1}
        />
        <button 
          onClick={fetchStats} 
          disabled={loading || !year}
          className="fetch-btn"
        >
          {loading ? '⏳ Loading...' : '📊 Get Statistics'}
        </button>
      </div>

      {error && (
        <div className="error-message">
          ❌ {error}
        </div>
      )}

      {stats && (
        <div className="scoreboard">
          <h2>📈 Statistics for {stats.year}</h2>
          
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">⚽</div>
              <div className="stat-content">
                <h3>Total Games</h3>
                <p className="stat-number">{stats.data.totalGamesPlayed || 0}</p>
              </div>
            </div>

            <div className="stat-card wins">
              <div className="stat-icon">🏆</div>
              <div className="stat-content">
                <h3>Total Wins</h3>
                <p className="stat-number">{stats.data.totalWins || 0}</p>
              </div>
            </div>

            <div className="stat-card draws">
              <div className="stat-icon">🤝</div>
              <div className="stat-content">
                <h3>Total Draws</h3>
                <p className="stat-number">{stats.data.totalDraws || 0}</p>
              </div>
            </div>

            <div className="stat-card losses">
              <div className="stat-icon">😔</div>
              <div className="stat-content">
                <h3>Total Losses</h3>
                <p className="stat-number">{stats.data.totalLosses || 0}</p>
              </div>
            </div>

            <div className="stat-card goals">
              <div className="stat-icon">🎯</div>
              <div className="stat-content">
                <h3>Goals For</h3>
                <p className="stat-number">{stats.data.totalGoalsFor || 0}</p>
              </div>
            </div>

            <div className="stat-card goals-against">
              <div className="stat-icon">🛡️</div>
              <div className="stat-content">
                <h3>Goals Against</h3>
                <p className="stat-number">{stats.data.totalGoalsAgainst || 0}</p>
              </div>
            </div>

            <div className="stat-card points">
              <div className="stat-icon">⭐</div>
              <div className="stat-content">
                <h3>Total Points</h3>
                <p className="stat-number">{stats.data.totalPoints || 0}</p>
              </div>
            </div>

            <div className="stat-card teams">
              <div className="stat-icon">👥</div>
              <div className="stat-content">
                <h3>Teams Count</h3>
                <p className="stat-number">{stats.data.teamCount || 0}</p>
              </div>
            </div>
          </div>

          {stats.data.totalGamesPlayed > 0 && (
            <div className="summary-stats">
              <h3>📋 Summary</h3>
              <div className="summary-grid">
                <div className="summary-item">
                  <span className="label">Win Rate:</span>
                  <span className="value">
                    {((stats.data.totalWins / stats.data.totalGamesPlayed) * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="summary-item">
                  <span className="label">Draw Rate:</span>
                  <span className="value">
                    {((stats.data.totalDraws / stats.data.totalGamesPlayed) * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="summary-item">
                  <span className="label">Loss Rate:</span>
                  <span className="value">
                    {((stats.data.totalLosses / stats.data.totalGamesPlayed) * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="summary-item">
                  <span className="label">Avg Goals/Game:</span>
                  <span className="value">
                    {(stats.data.totalGoalsFor / stats.data.totalGamesPlayed).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TeamStats;

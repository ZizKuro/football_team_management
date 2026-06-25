import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { teamAPI } from '../services/api';
import { useApi } from '../hooks/useApi';

const TopTeams = () => {
  const [wins, setWins] = useState('');
  const { data: teamsData, loading, error, execute } = useApi(teamAPI.getTopTeams);

  const fetchTopTeams = async () => {
    if (!wins || wins < 0) {
      toast.error('Please enter a valid number of wins');
      return;
    }

    try {
      await execute(wins);
      toast.success('Top teams loaded successfully!');
    } catch (err) {
      toast.error(error || 'Failed to fetch top teams');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      fetchTopTeams();
    }
  };

  return (
    <div className="form-container">
      <h1>🏆 Top Teams</h1>
      
      <div className="input-group">
        <label htmlFor="wins">Minimum Wins:</label>
        <input
          id="wins"
          type="number"
          name="Wins"
          placeholder="Enter minimum wins (e.g., 10)"
          value={wins}
          onChange={(e) => setWins(e.target.value)}
          onKeyPress={handleKeyPress}
          min="0"
        />
        <button 
          onClick={fetchTopTeams} 
          disabled={loading || !wins}
          className="fetch-btn"
        >
          {loading ? '⏳ Loading...' : '🏆 Get Top Teams'}
        </button>
      </div>

      {error && (
        <div className="error-message">
          ❌ {error}
        </div>
      )}

      {teamsData && teamsData.data && teamsData.data.length > 0 && (
        <div className="top-teams">
          <h2>🏆 Top {teamsData.count} Teams (Min. {teamsData.minWins} wins)</h2>
          <table>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Team</th>
                <th>Games</th>
                <th>Wins</th>
                <th>Draws</th>
                <th>Losses</th>
                <th>Goals For</th>
                <th>Goals Against</th>
                <th>Points</th>
                <th>Year</th>
              </tr>
            </thead>
            <tbody>
              {teamsData.data.map((team, index) => (
                <tr key={index}>
                  <td>
                    <span className="rank-badge">
                      {index + 1}
                    </span>
                  </td>
                  <td className="team-name">{team.Team}</td>
                  <td>{team['Games Played']}</td>
                  <td className="wins">{team.Win}</td>
                  <td className="draws">{team.Draw}</td>
                  <td className="losses">{team.Loss}</td>
                  <td className="goals-for">{team['Goals For']}</td>
                  <td className="goals-against">{team['Goals Against']}</td>
                  <td className="points">{team.Points}</td>
                  <td>{team.Year}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {teamsData && teamsData.data && teamsData.data.length === 0 && (
        <div className="no-data">
          <h3>📭 No teams found</h3>
          <p>No teams found with {wins} or more wins.</p>
        </div>
      )}
    </div>
  );
};

export default TopTeams;

import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { statsAPI } from '../services/api';
import { useApi } from '../hooks/useApi';

const AverageGoals = () => {
  const [year, setYear] = useState('');
  const { data: goalsData, loading, error, execute } = useApi(statsAPI.getAverageGoals);

  const fetchAverageGoals = async () => {
    if (!year || year < 1900 || year > new Date().getFullYear() + 1) {
      toast.error('Please enter a valid year');
      return;
    }

    try {
      await execute(year);
      toast.success('Average goals loaded successfully!');
    } catch (err) {
      toast.error(error || 'Failed to fetch average goals');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      fetchAverageGoals();
    }
  };

  return (
    <div className="form-container">
      <h1>🎯 Average Goals</h1>
      
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
          onClick={fetchAverageGoals} 
          disabled={loading || !year}
          className="fetch-btn"
        >
          {loading ? '⏳ Loading...' : '🎯 Get Average Goals'}
        </button>
      </div>

      {error && (
        <div className="error-message">
          ❌ {error}
        </div>
      )}

      {goalsData && goalsData.data && goalsData.data.length > 0 && (
        <div className="top-teams">
          <h2>🎯 Average Goals for {goalsData.year}</h2>
          <table>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Team</th>
                <th>Avg Goals For</th>
                <th>Avg Goals Against</th>
                <th>Total Games</th>
                <th>Goal Difference</th>
              </tr>
            </thead>
            <tbody>
              {goalsData.data.map((team, index) => (
                <tr key={index}>
                  <td>
                    <span className="rank-badge">
                      {index + 1}
                    </span>
                  </td>
                  <td className="team-name">{team._id}</td>
                  <td className="goals-for">{team.avgGoalsFor.toFixed(2)}</td>
                  <td className="goals-against">{team.avgGoalsAgainst.toFixed(2)}</td>
                  <td>{team.totalGames}</td>
                  <td className={team.avgGoalsFor - team.avgGoalsAgainst > 0 ? 'positive' : 'negative'}>
                    {(team.avgGoalsFor - team.avgGoalsAgainst).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {goalsData && goalsData.data && goalsData.data.length === 0 && (
        <div className="no-data">
          <h3>📭 No data found</h3>
          <p>No teams found for the year {year}.</p>
        </div>
      )}
    </div>
  );
};

export default AverageGoals;

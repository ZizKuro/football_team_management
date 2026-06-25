import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { teamAPI } from '../services/api';
import { useFormSubmit } from '../hooks/useApi';

const AddTeam = () => {
  const [teamData, setTeamData] = useState({
    Team: '',
    GamesPlayed: '',
    Win: '',
    Draw: '',
    Loss: '',
    GoalsFor: '',
    GoalsAgainst: '',
    Points: '',
    Year: ''
  });

  const { loading, error, success, submit, reset } = useFormSubmit(teamAPI.createTeam);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTeamData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!teamData.Team.trim()) {
      toast.error('Team name is required');
      return;
    }
    
    if (!teamData.Year || teamData.Year < 1900 || teamData.Year > new Date().getFullYear() + 1) {
      toast.error('Please enter a valid year');
      return;
    }

    try {
      const result = await submit(teamData);
      toast.success(result.message || 'Team added successfully!');
      
      // Reset form
      setTeamData({
        Team: '',
        GamesPlayed: '',
        Win: '',
        Draw: '',
        Loss: '',
        GoalsFor: '',
        GoalsAgainst: '',
        Points: '',
        Year: ''
      });
      reset();
    } catch (err) {
      toast.error(error || 'Failed to add team');
    }
  };

  return (
    <div className="form-container">
      <h1>⚽ Add a New Team</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="Team">Team Name *</label>
          <input 
            type="text" 
            id="Team"
            name="Team" 
            placeholder="Enter team name" 
            value={teamData.Team} 
            onChange={handleInputChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="Year">Year *</label>
          <input 
            type="number" 
            id="Year"
            name="Year" 
            placeholder="Enter year" 
            value={teamData.Year} 
            onChange={handleInputChange}
            min="1900"
            max={new Date().getFullYear() + 1}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="GamesPlayed">Games Played</label>
          <input 
            type="number" 
            id="GamesPlayed"
            name="GamesPlayed" 
            placeholder="Games played" 
            value={teamData.GamesPlayed} 
            onChange={handleInputChange}
            min="0"
          />
        </div>

        <div className="form-group">
          <label htmlFor="Win">Wins</label>
          <input 
            type="number" 
            id="Win"
            name="Win" 
            placeholder="Number of wins" 
            value={teamData.Win} 
            onChange={handleInputChange}
            min="0"
          />
        </div>

        <div className="form-group">
          <label htmlFor="Draw">Draws</label>
          <input 
            type="number" 
            id="Draw"
            name="Draw" 
            placeholder="Number of draws" 
            value={teamData.Draw} 
            onChange={handleInputChange}
            min="0"
          />
        </div>

        <div className="form-group">
          <label htmlFor="Loss">Losses</label>
          <input 
            type="number" 
            id="Loss"
            name="Loss" 
            placeholder="Number of losses" 
            value={teamData.Loss} 
            onChange={handleInputChange}
            min="0"
          />
        </div>

        <div className="form-group">
          <label htmlFor="GoalsFor">Goals For</label>
          <input 
            type="number" 
            id="GoalsFor"
            name="GoalsFor" 
            placeholder="Goals scored" 
            value={teamData.GoalsFor} 
            onChange={handleInputChange}
            min="0"
          />
        </div>

        <div className="form-group">
          <label htmlFor="GoalsAgainst">Goals Against</label>
          <input 
            type="number" 
            id="GoalsAgainst"
            name="GoalsAgainst" 
            placeholder="Goals conceded" 
            value={teamData.GoalsAgainst} 
            onChange={handleInputChange}
            min="0"
          />
        </div>

        <div className="form-group">
          <label htmlFor="Points">Points</label>
          <input 
            type="number" 
            id="Points"
            name="Points" 
            placeholder="Total points" 
            value={teamData.Points} 
            onChange={handleInputChange}
            min="0"
          />
        </div>

        <button type="submit" disabled={loading} className="submit-btn">
          {loading ? '⏳ Adding...' : '⚽ Add Team'}
        </button>
        
        {error && (
          <div className="error-message">
            ❌ {error}
          </div>
        )}
      </form>
    </div>
  );
};

export default AddTeam;
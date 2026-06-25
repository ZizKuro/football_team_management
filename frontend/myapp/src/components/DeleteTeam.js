import React, { useState } from 'react';
import axios from 'axios';

const DeleteTeam = () => {
    const [teamName, setTeamName] = useState('');

    const handleDelete = async () => {
        try {
            const response = await axios.post('http://localhost:5000/deleteteam', { Team: teamName });
            alert('Team deleted successfully!');
        } catch (error) {
            alert('Failed to delete team');
        }
    };

    return (
        <div className="form-container">
            <h1>Delete Football Team</h1>
            <input
                type="text"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="Enter Team Name"
            />
            <button onClick={handleDelete}>Delete Team</button>
        </div>
    );
};

export default DeleteTeam;
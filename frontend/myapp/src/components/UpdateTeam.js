import React, { useState } from 'react';
import axios from 'axios';

const UpdateTeam = () => {
    const [teamData, setTeamData] = useState({
        Team: '',
        'Games Played': '',
        Win: '',
        Draw: '',
        Loss: '',
        'Goals For': '',
        'Goals Against': '',
        Points: '',
        Year: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTeamData({ ...teamData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/updateteam', teamData);
            alert('Team updated successfully!');
        } catch (error) {
            alert('Failed to update team');
        }
    };

    return (
        <div className="form-container">
            <h1>Update Football Team</h1>
            <form onSubmit={handleSubmit}>
                <input type="text" name="Team" placeholder="Team Name" onChange={handleChange} required />
                <input type="number" name="Games Played" placeholder="Games Played" onChange={handleChange} />
                <input type="number" name="Win" placeholder="Win" onChange={handleChange} />
                <input type="number" name="Draw" placeholder="Draw" onChange={handleChange} />
                <input type="number" name="Loss" placeholder="Loss" onChange={handleChange} />
                <input type="number" name="Goals For" placeholder="Goals For" onChange={handleChange} />
                <input type="number" name="Goals Against" placeholder="Goals Against" onChange={handleChange} />
                <input type="number" name="Points" placeholder="Points" onChange={handleChange} />
                <input type="number" name="Year" placeholder="Year" onChange={handleChange} />
                <button type="submit">Update Team</button>
            </form>
        </div>
    );
};

export default UpdateTeam;
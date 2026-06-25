import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import AddTeam from './components/AddTeam';
import UpdateTeam from './components/UpdateTeam';
import TeamStats from './components/TeamStats';
import DeleteTeam from './components/DeleteTeam';
import TopTeams from './components/TopTeams';
import AverageGoals from './components/AverageGoals';
import Navbar from './components/Navbar';

import './App.css';

const App = () => {
    return (
        <Router>
            <div className="App">
                <Navbar />
                <main className="main-content">
                    <Routes>
                        <Route path="/" element={<AddTeam />} />
                        <Route path="/addteam" element={<AddTeam />} />
                        <Route path="/updateteam" element={<UpdateTeam />} />
                        <Route path="/teamstats" element={<TeamStats />} />
                        <Route path="/deleteteam" element={<DeleteTeam />} />
                        <Route path="/topteams" element={<TopTeams />} />
                        <Route path="/averagegoals" element={<AverageGoals />} />
                    </Routes>
                </main>
                
                <ToastContainer
                    position="top-right"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="dark"
                />
            </div>
        </Router>
    );
};

export default App;
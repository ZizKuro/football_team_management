//importing mongoose
const mongoose = require('mongoose');
// creating schema same as football csv file
const footballSchema = new mongoose.Schema({
    Team: { type: String, required: true },
    "Games Played": { type: Number },
    Win: { type: Number },
    Draw: { type: Number },
    Loss: { type: Number },
    "Goals For": { type: Number },
    "Goals Against": { type: Number },
    Points: { type: Number },
    Year: { type: Number }
});

  // creating a model
const FootballTeam = mongoose.model('Footballdb', footballSchema,'footballc');
// exporting to use other files
module.exports = FootballTeam;
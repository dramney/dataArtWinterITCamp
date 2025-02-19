var mongoose = require("mongoose");

var jokeSchema = new mongoose.Schema({
    question: { type: String, required: true }, // The question of the joke
    answer: { type: String, required: true }, // The answer to the joke
    votes: [
        {
            value: { type: Number, default: 0 }, // Number of votes for a particular label
            label: { type: String, required: true }, // The emoji label representing the vote
        },
    ],
    availableVotes: [{ type: String }], // List of available emoji labels for voting
});

module.exports = mongoose.model("Joke", jokeSchema); 

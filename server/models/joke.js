var mongoose = require("mongoose");

var jokeSchema = new mongoose.Schema({
    question: { type: String, required: true },
    answer: { type: String, required: true },
    votes: [
        {
            value: { type: Number, default: 0 }, // Number of votes
            label: { type: String, required: true }, // Emoji label
        },
    ],
    availableVotes: [{ type: String }], // List of available emoji votes
});

module.exports = mongoose.model("Joke", jokeSchema);

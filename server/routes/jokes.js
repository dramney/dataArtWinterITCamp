var express = require('express');
var router = express.Router();

var Joke = require("../models/joke");

/* GET random joke */
router.get("/random", async function (req, res) {
    try {
        const count = await Joke.countDocuments(); // Get the total number of jokes in the database
        const randomIndex = Math.floor(Math.random() * count); // Generate a random index
        const randomJoke = await Joke.findOne().skip(randomIndex); // Find a random joke using the index

        if (!randomJoke) {
            return res.status(404).json({ message: "No jokes found!" }); // If no joke is found, return a 404 error
        }

        res.json(randomJoke); // Send the random joke as a response
    } catch (error) {
        console.error("Error fetching joke:", error); // Log any errors during fetch
        res.status(500).json({ message: "Internal server error" }); // Return a 500 error if something goes wrong
    }
});

/* POST vote for a joke */
router.post("/vote/:id", async (req, res) => {
    const { id } = req.params; // Extract joke ID from request parameters
    const { label } = req.body; // Extract the vote label from the request body

    console.log('Received vote request:', { id, label }); // Log the vote request

    if (!label) {
        return res.status(400).json({ message: "Label is required" }); // If no label is provided, return a 400 error
    }

    try {
        const joke = await Joke.findById(id); // Find the joke by ID

        if (!joke) {
            return res.status(404).json({ message: "Joke not found" }); // If the joke doesn't exist, return a 404 error
        }

        // Find the index of the vote option with the given label
        const voteIndex = joke.votes.findIndex(v => v.label === label);
        if (voteIndex === -1) {
            return res.status(400).json({ message: "Invalid vote option" }); // If the label is invalid, return a 400 error
        }

        joke.votes[voteIndex].value += 1; // Increment the vote count for the selected label
        await joke.save(); // Save the updated joke document

        res.json({
            message: "Vote submitted successfully", // Send a success message with the updated joke
            joke: joke
        });
    } catch (error) {
        console.error("Error submitting vote:", error); // Log any errors during vote submission
        res.status(500).json({ message: "Internal Server Error" }); // Return a 500 error if something goes wrong
    }
});

/* POST revote for a joke */
router.post("/revote/:id", async (req, res) => {
    const { id } = req.params; // Extract joke ID from request parameters
    const { label } = req.body; // Extract the vote label from the request body

    console.log('Received revote request:', { id, label }); // Log the revote request

    if (!label) {
        return res.status(400).json({ message: "Label is required" }); // If no label is provided, return a 400 error
    }

    try {
        const joke = await Joke.findById(id); // Find the joke by ID

        if (!joke) {
            return res.status(404).json({ message: "Joke not found" }); // If the joke doesn't exist, return a 404 error
        }

        // Find the index of the vote option with the given label
        const voteIndex = joke.votes.findIndex(v => v.label === label);
        if (voteIndex === -1) {
            return res.status(400).json({ message: "Invalid vote option" }); // If the label is invalid, return a 400 error
        }

        joke.votes[voteIndex].value -= 1; // Decrement the vote count for the selected label (revote)
        await joke.save(); // Save the updated joke document

        res.json({
            message: "Revote submitted successfully", // Send a success message with the updated joke
            joke: joke
        });
    } catch (error) {
        console.error("Error submitting revote:", error); // Log any errors during revote submission
        res.status(500).json({ message: "Internal Server Error" }); // Return a 500 error if something goes wrong
    }
});

module.exports = router; 
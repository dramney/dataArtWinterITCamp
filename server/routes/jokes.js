var express = require('express');
var router = express.Router();

var Joke = require("../models/joke");




/* GET joke */
router.get("/random", async function (req, res) {
    try {
        const count = await Joke.countDocuments();
        const randomIndex = Math.floor(Math.random() * count);
        const randomJoke = await Joke.findOne().skip(randomIndex);


        if (!randomJoke) {
            return res.status(404).json({ message: "No jokes found!" });
        }

        res.json(randomJoke);
    } catch (error) {
        console.error("Error fetching joke:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});



/* POST vote for a joke */
router.post("/vote/:id", async (req, res) => {
    const { id } = req.params;
    const { label } = req.body;

    console.log('Received vote request:', { id, label });

    if (!label) {
        return res.status(400).json({ message: "Label is required" });
    }

    try {
        const joke = await Joke.findById(id);

        if (!joke) {
            return res.status(404).json({ message: "Joke not found" });
        }

        // Find and update the vote
        const voteIndex = joke.votes.findIndex(v => v.label === label);
        if (voteIndex === -1) {
            return res.status(400).json({ message: "Invalid vote option" });
        }

        joke.votes[voteIndex].value += 1;
        await joke.save();

        res.json({
            message: "Vote submitted successfully",
            joke: joke
        });
    } catch (error) {
        console.error("Error submitting vote:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});


/* POST revote for a joke */
router.post("/revote/:id", async (req, res) => {
    const { id } = req.params;
    const { label } = req.body;

    console.log('Received vote request:', { id, label });

    if (!label) {
        return res.status(400).json({ message: "Label is required" });
    }

    try {
        const joke = await Joke.findById(id);

        if (!joke) {
            return res.status(404).json({ message: "Joke not found" });
        }

        // Find and update the vote
        const voteIndex = joke.votes.findIndex(v => v.label === label);
        if (voteIndex === -1) {
            return res.status(400).json({ message: "Invalid vote option" });
        }

        joke.votes[voteIndex].value -= 1;
        await joke.save();

        res.json({
            message: "Vote submitted successfully",
            joke: joke
        });
    } catch (error) {
        console.error("Error submitting vote:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});




module.exports = router;


import { useState, useEffect } from "react";
import "../styles/JokePage.css";

// Map of emoji for votes
const emojiMap = {
    "A": "😂",
    "B": "👍",
    "C": "❤️"
};

const JokePage = () => {
    const [joke, setJoke] = useState(null); // State for storing the current joke
    const [loading, setLoading] = useState(true); // State for loading status
    const [error, setError] = useState(null); // State for error handling
    const [userVotes, setUserVotes] = useState(new Set()); // Track user votes

    // Fetch a random joke from the API
    const fetchJoke = () => {
        setLoading(true); // Set loading to true while fetching
        setError(null); // Clear previous errors
        fetch("http://localhost:3000/api/jokes/random")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch joke");
                }
                return response.json(); // Convert response to JSON
            })
            .then((data) => {
                if (data && data.question) {
                    setJoke(data); // Set the joke if data is valid
                    setUserVotes(new Set()); // Clear user votes when a new joke is fetched
                } else {
                    setJoke(null); // Set joke to null if no data found
                }
                setLoading(false); // Set loading to false after data is fetched
            })
            .catch((error) => {
                console.error("Error fetching joke:", error); // Log any fetch error
                setError(error.message); // Set error message
                setLoading(false); // Set loading to false on error
            });
    };

    useEffect(() => {
        fetchJoke(); // Fetch joke when component mounts
    }, []);

    // Handle user voting for a specific label
    const handleVote = (label) => {
        if (!joke) return; // Exit if no joke exists

        const updatedVotes = new Set(userVotes); // Copy current votes
        const isRemoving = updatedVotes.has(label); // Check if the vote is being removed

        if (isRemoving) {
            updatedVotes.delete(label); // Remove the vote
            sendRevote(label); // Call revote function
        } else {
            updatedVotes.add(label); // Add the new vote
            sendVote(label); // Call vote function
        }

        setUserVotes(updatedVotes); // Update user votes state
    };

    // Send the user's vote to the server
    const sendVote = (label) => {
        fetch(`http://localhost:3000/api/jokes/vote/${joke._id}`, {
            method: "POST", // POST method for voting
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ label }), // Send the label in the request body
        })
            .then((response) => {
                if (!response.ok) {
                    return response.json().then(err => {
                        throw new Error(err.message || 'Failed to submit vote');
                    });
                }
                return response.json();
            })
            .then((data) => {
                console.log('Vote successful:', data); // Log success
                setJoke(data.joke); // Update joke with new data
            })
            .catch((error) => {
                console.error("Error voting:", error); // Log error
                setError(error.message); // Set error message
            });
    };

    // Send a revote (reversing the previous vote) to the server
    const sendRevote = (label) => {
        fetch(`http://localhost:3000/api/jokes/revote/${joke._id}`, {
            method: "POST", // POST method for revoting
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ label }), // Send the label in the request body
        })
            .then((response) => {
                if (!response.ok) {
                    return response.json().then(err => {
                        throw new Error(err.message || 'Failed to revote');
                    });
                }
                return response.json();
            })
            .then((data) => {
                console.log('Revote successful:', data); // Log success
                setJoke(data.joke); // Update joke with new data
            })
            .catch((error) => {
                console.error("Error revoting:", error); // Log error
                setError(error.message); // Set error message
            });
    };

    // Return loading, error, or no joke state as necessary
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!joke) return <div>No jokes available</div>;

    return (
        <div className="joke-page">
            <h2>{joke.question}</h2>
            <p>{joke.answer}</p>
            <div className="vote-buttons">
                {joke.votes.map((vote) => (
                    <button
                        key={vote._id}
                        className={`vote-button ${userVotes.has(vote.label) ? "selected" : ""}`}
                        onClick={() => handleVote(vote.label)} // Handle click on vote button
                    >
                        {emojiMap[vote.label] || vote.label} - {vote.value} {/* Display emoji and vote value */}
                    </button>
                ))}
            </div>
            <button className="next-button" onClick={fetchJoke}>Next Joke</button> {/* Button to fetch next joke */}
        </div>
    );
};

export default JokePage;

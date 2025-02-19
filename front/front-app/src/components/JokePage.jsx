import { useState, useEffect } from "react";
import "../styles/JokePage.css";


const JokePage = () => {
    const [joke, setJoke] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchJoke = () => {
        setLoading(true);
        setError(null);
        fetch("http://localhost:3000/api/jokes/random")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch joke");
                }
                return response.json();
            })
            .then((data) => {
                if (data && data.question) {
                    setJoke(data);
                } else {
                    setJoke(null);
                }
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching joke:", error);
                setError(error.message);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchJoke();
    }, []);

    const handleVote = (label) => {
        if (!joke) return;

        console.log('Sending vote for joke:', joke._id, 'label:', label);

        fetch(`http://localhost:3000/api/jokes/vote/${joke._id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ label }),
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
                console.log('Vote successful:', data);
                setJoke(data.joke);
            })
            .catch((error) => {
                console.error("Error voting:", error);
                setError(error.message);
            });
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!joke) {
        return <div>No jokes available</div>;
    }

    return (
        <div className="joke-page">
            <h2>{joke.question}</h2>
            <p>{joke.answer}</p>
            <div className="vote-buttons">
                {joke.votes.map((vote) => (
                    <button
                        key={vote._id}
                        className="vote-button"
                        onClick={() => handleVote(vote.label)}
                    >
                        {vote.label} - {vote.value}
                    </button>
                ))}
            </div>
            <button className="next-button" onClick={fetchJoke}>
                Next Joke
            </button>
        </div>
    );
};

export default JokePage;

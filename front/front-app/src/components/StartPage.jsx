import { useNavigate } from 'react-router-dom';
import '../styles/StartPage.css';

const StartPage = () => {
    const navigate = useNavigate(); // Initialize the navigate function for routing
    const goToJokePage = () => {
        navigate('/joke');  // This will navigate to the /joke route
    };

    return (
        <div className="start-page">
            <h1 className="title">Welcome to the Joke App!</h1> {/* Main title */}
            <p className="description">
                Get ready to laugh with our random jokes! Enjoy your time and vote for your favorite jokes!
            </p> {/* Description of the app */}
            <button className="start-button" onClick={goToJokePage}>Start Laughing</button> {/* Button to navigate to joke page */}
        </div>
    );
};

export default StartPage;
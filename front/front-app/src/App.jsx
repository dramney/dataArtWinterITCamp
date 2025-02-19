import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import StartPage from './components/StartPage.jsx';
import JokePage from './components/JokePage.jsx';
import './App.css'

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Define the routes using element */}
          <Route path="/" element={<StartPage />} />
          <Route path="/joke" element={<JokePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App

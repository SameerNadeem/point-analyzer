import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

const Home = () => <div>Home Page - Rankings will go here</div>;
const CarDetail = () => <div>Car Detail Page - will show car details</div>;

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>Baja SAE Results Tracker</h1>
        </header>

        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/car/:carNumber" element={<CarDetail />} />
          </Routes>
        </main>

        <footer>
          <p>API Test: Check if backend is running</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
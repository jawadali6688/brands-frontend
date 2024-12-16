import React from 'react';
import { Link } from 'react-router-dom';
import '../Styles/HomePage.css';

function HomePage() {
  return (
    <div className="home-page-container">
      <div className="options">
        <Link to="/search/color" className="option">Color</Link>
        <Link to="/search/design" className="option">Design</Link>
      </div>
      <h1>Visualize Your Search</h1>
      <p>Find More with Images</p>
      <button>Watch the Video</button>
    </div>
  );
}

export default HomePage;

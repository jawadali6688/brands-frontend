import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../Styles/CameraPage.css';

function CameraPage() {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const handleWatchVideoClick = () => {
    setIsVideoPlaying(true);
  };

  const handleBackClick = () => {
    setIsVideoPlaying(false);
  };

  return (
    <div className="camera-page-container">
      {!isVideoPlaying ? (
        <>
          <video autoPlay muted loop className="background-video">
          <source src="../../../assets/videos/06_AW24_SELECTION_16_9_CLEAN.webm" type="video/webm" />
            Your browser does not support the video tag.
          </video>
          <div className="overlay-content bg-gray-400">
            <div className="centered-options">
              <Link to="/by-color" className="option">Color</Link>
              <Link to="/by-design" className="option">Design</Link>
            </div>
            <h1 className="title">Visualize Your Search</h1>
            <p className="subtitle">Find More with Images</p>
            <button className="watch-video-button" onClick={handleWatchVideoClick}>Watch the Video</button>
          </div>
        </>
      ) : (
        <div className="full-screen-video-container">
          <video autoPlay controls className="full-screen-video">
            <source src="../../../assets/videos/06_AW24_SELECTION_16_9_CLEAN.webm" type="video/webm" />
            Your browser does not support the video tag.
          </video>
          <button className="back-button" onClick={handleBackClick}>Back</button>
        </div>
      )}
    </div>
  );
}

export default CameraPage;

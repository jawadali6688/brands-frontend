import React from 'react';  
import { Link } from 'react-router-dom';
import '../Styles/Header.css';

function Header() {
  return (
    <>
      <div className="header-container">
        <div className="logo">
          <img src="../../../assets/logo.jpg" alt="FashionFusion Logo" />
        </div>
        <div className="search-bar">
          <input type="text" placeholder="Find your favorite product" />
          {/* Link to the image upload page when the camera icon is clicked */}
          <Link to="/Camera-page">
            <button className="camera-icon-button">
              <i className="fas fa-camera"></i>
            </button>
          </Link>
        </div>
        <div className="icons">
          <i className="fas fa-user"></i>
          <Link to="/wishlist"> {/* Link to the Wishlist page */}
            <i className="fas fa-heart"></i>
          </Link>
          {/* Link to the Cart page */}
          <Link to="/cart">
            <i className="fas fa-shopping-cart"></i>
          </Link>
        </div>
      </div>
      <div className="navbar">
        <Link to="/">Home</Link>
        <Link to="/rent">Rent</Link>
        <Link to="/brands">Brands</Link>
        <Link to="/Contact">Contact Us</Link>
        <Link to="/About">About Us</Link>
      </div>
    </>
  );
}

export default Header;

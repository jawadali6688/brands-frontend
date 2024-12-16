import React from 'react';
import '../Styles/Footer.css'; // Import the CSS file

function Footer() {
  return (
    <footer className="footer-container">
      <div className="footer-icons">
        <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer">
          <i className="fab fa-instagram"></i>
        </a>
      </div>
      <div className="footer-content">
        <p>© 2024 FashionFusion, Inc.</p>
        <div className="footer-links">
          <a href="/policy">Privacy Policy</a> | 
          <a href="/security">Contact Us</a> | 
          <a href="/accessibility">About</a> | 
        </div>
      </div>
    </footer>
  );
}

export default Footer;
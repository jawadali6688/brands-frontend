import React from 'react';
import '../Styles/CreateBrand.css'; // Ensure this path matches the file location
import { useNavigate } from 'react-router-dom';

const CreateBrand = () => {
  const navigate = useNavigate();

  const handleApplyNewBrand = () => {
    navigate('/BrandForm'); // Adjust the route to match your Brand form route
  };

  return (
    <div className="page-container">
      <div className="brand-info-container">
        <div className="brand-info-header">
          <div>
            <h2>Brand Information</h2>
            <p>See the performance of the Brand Registered here</p>
          </div>
          <button className="apply-button" onClick={handleApplyNewBrand}>
            Apply for a new brand
          </button>
        </div>
        <div className="brand-info-filters">
          <input type="text" placeholder="Enter brand name" className="filter-input" />
          <input type="text" placeholder="Enter brand owner" className="filter-input" />
          <button className="search-button">Search</button>
        </div>
        <div className="brand-info-list">
          {/* Placeholder for displaying data */}
          {/* Replace this with your dynamic content */}
          <div className="brand-item">
            <p>Brand Name: </p>
            <p>Status: Approved</p>
            <p>Other Info: Example details</p>
            {/* Add more brand information here */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateBrand;

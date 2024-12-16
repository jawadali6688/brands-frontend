import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/Brands.css";

// Importing assets
import promoVideo from "../../../assets/WhatsApp Video 2024-09-13 at 10.50.03_4240b66c.mp4";
import shirtImage1 from "../../../assets/s1.jpeg";
import shirtImage2 from "../../../assets/s2.jpeg";
import pantsImage1 from "../../../assets/p1.jpeg";
import pantsImage2 from "../../../assets/p2.jpeg";
import stitchedImage1 from "../../../assets/b1.jpeg";
import stitchedImage2 from "../../../assets/b2.jpeg";
import unstitchedImage1 from "../../../assets/u1.jpeg";
import unstitchedImage2 from "../../../assets/u2.jpeg";
import footwearImage1 from "../../../assets/f1.jpg";
import footwearImage2 from "../../../assets/f2.jpg";

function Brands() {
  const [currentShirtImage, setCurrentShirtImage] = useState(shirtImage1);
  const [currentPantsImage, setCurrentPantsImage] = useState(pantsImage1);
  const [currentStitchedImage, setCurrentStitchedImage] = useState(stitchedImage1);
  const [currentUnstitchedImage, setCurrentUnstitchedImage] = useState(unstitchedImage1);
  const [currentFootwearImage, setCurrentFootwearImage] = useState(footwearImage1);
  const [brands, setBrands] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const imageInterval = setInterval(() => {
      setCurrentShirtImage((prev) => (prev === shirtImage1 ? shirtImage2 : shirtImage1));
      setCurrentPantsImage((prev) => (prev === pantsImage1 ? pantsImage2 : pantsImage1));
      setCurrentStitchedImage((prev) => (prev === stitchedImage1 ? stitchedImage2 : stitchedImage1));
      setCurrentUnstitchedImage((prev) => (prev === unstitchedImage1 ? unstitchedImage2 : unstitchedImage1));
      setCurrentFootwearImage((prev) => (prev === footwearImage1 ? footwearImage2 : footwearImage1));
    }, 1000);

    return () => clearInterval(imageInterval);
  }, []);

  useEffect(() => {
    async function fetchBrands() {
      try {
        const response = await fetch("http://localhost:8000/api/brands");
        const data = await response.json();
        const approvedBrands = data.filter((brand) => brand.status === "Approved");
        setBrands(approvedBrands);
      } catch (error) {
        console.error("Error fetching brands:", error);
      }
    }

    fetchBrands();
  }, []);

  const handleRegisterClick = () => {
    navigate("/CreateBrand");
  };

  return (
    <div className="brands-container">
      <div className="video-section">
        <video autoPlay loop muted className="promo-video">
          <source src={promoVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <h2>Shop it-girl looks</h2>
      </div>

      {/* Section: Our Products */}
      <div className="our-products-section lemon-style black-text">
        <h2>Our Products</h2>
      </div>

      {/* Section 2: Categories */}
      <div className="categories-section">
        <div className="category-card">
          <a href="/Shirts">
            <img src={currentShirtImage} alt="Shirts" />
            <h3>Shirts</h3>
          </a>
          <p>Explore our collection of stylish shirts.</p>
        </div>
        <div className="category-card">
          <a href="/Pents">
            <img src={currentPantsImage} alt="Pents" />
            <h3>Pents</h3>
          </a>
          <p>Find your perfect fit from our wide range.</p>
        </div>
        <div className="category-card">
          <a href="/Stiched">
            <img src={currentStitchedImage} alt="Stiched" />
            <h3>Stitched</h3>
          </a>
          <p>Discover our ready-to-wear stitched collection.</p>
        </div>
        <div className="category-card">
          <a href="/Unstiched">
            <img src={currentUnstitchedImage} alt="Unstiched" />
            <h3>Unstiched</h3>
          </a>
          <p>Create your own style with our unstitched fabrics.</p>
        </div>
        <div className="category-card">
          <a href="/Footwear">
            <img src={currentFootwearImage} alt="Footwear" />
            <h3>Footwear</h3>
          </a>
          <p>Step into style with our exclusive footwear collection.</p>
        </div>
      </div>

   {/* Trending Brands */}
<div className="trending-brands-section lemon-style">
  <h2 className="text-xl font-bold text-center mb-4">Trending Brands</h2>
  <div className="brands-list grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
    {brands.map((brand) => (
      <div
        key={brand._id}
        className="brand-card cursor-pointer bg-white shadow-md rounded-lg p-2 hover:shadow-lg transition-shadow duration-300"
        onClick={() => navigate(`/brand/${brand._id}/productss`)}
      >
        <img
          src={brand.brandImage}
          alt={brand.brandName}
          className="h-24 w-24 mx-auto object-cover rounded-md"
        />
        <h3 className="text-center text-sm font-medium mt-2">{brand.brandName}</h3>
      </div>
    ))}
  </div>
</div>


      {/* Register Button */}
      <div className="register-brand-section">
        <button onClick={handleRegisterClick} className="register-button">
          Register Your Brand Now
        </button>
      </div>
    </div>
  );
}

export default Brands;

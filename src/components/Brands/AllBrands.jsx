import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate to navigate on click

const AllBrands = () => {
  const [brands, setBrands] = useState([]);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    // Fetch the list of brands from your API
    const fetchBrands = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/brands");
        const data = await response.json();
        setBrands(data); // Assuming this returns the list of brands
      } catch (error) {
        console.error("Error fetching brands:", error);
      }
    };

    fetchBrands();
  }, []);

  const handleBrandClick = (brandId) => {
    // Navigate to the products page of the clicked brand
    navigate(`/brand/${brandId}/products`);
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-center mb-8">All Brands</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {brands.length > 0 ? (
          brands.map((brand) => (
            <div
              key={brand._id}
              className="brand-card bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow duration-300 cursor-pointer"
              onClick={() => handleBrandClick(brand._id)}
            >
              <div className="flex justify-center">
                <img
                  src={brand.brandImage}
                  alt={brand.brandName}
                  className="h-40 w-40 object-cover rounded-md"
                />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-center">
                {brand.brandName}
              </h3>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600">
            No brands available at the moment.
          </p>
        )}
      </div>
    </div>
  );
};

export default AllBrands;

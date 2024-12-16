import React, { useState, useEffect } from "react";
import axios from "axios";

const BulkData = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");
  const [file, setFile] = useState(null);
  const [brands, setBrands] = useState([]); // Store fetched brands
  const [selectedBrand, setSelectedBrand] = useState(""); // Track the selected brand

  // Function to handle template download
  const handleDownloadTemplate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      window.location.href =
        "https://res.cloudinary.com/duh4hll1l/raw/upload/v1726654050/BrandTemplate_uwcjw6.xlsx"; // Correct URL to the template file
    }, 3000); // Simulate a 3-second download preparation
  };

  // Fetch brands from API
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/brands"); // Fetch brands from API
        const data = await response.json();
        setBrands(data); // Set brands in state
      } catch (error) {
        console.error("Error fetching brands:", error);
      }
    };

    fetchBrands();
  }, []);

  // Handle file change
  const handleFileChange = (e) => {
    setFile(e.target.files[0]); // Set the selected file in state
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setUploadStatus("Please select a file to upload.");
      return;
    }

    if (!selectedBrand) {
      setUploadStatus("Please select a brand.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file); // Append the selected file
    formData.append("brand", selectedBrand); // Append the selected brand

    try {
      // Correct backend route
      await axios.post(
        "http://localhost:8000/api/products/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setUploadStatus("File uploaded successfully!");
    } catch (error) {
      console.error("Error uploading file:", error);
      setUploadStatus("Failed to upload the file. Please try again.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-8 bg-white shadow-lg rounded-lg">
      <h2 className="text-3xl font-semibold text-center text-gray-800 mb-8">
        Bulk Add Product
      </h2>

      {/* Step 1: Download Template */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-[#bf7d50] mb-2">
          1) Download and fill in the template
        </h3>
        <button
          onClick={handleDownloadTemplate}
          className="w-full py-3 px-4 bg-[#cA7e58] text-white font-bold rounded-lg hover:bg-orange-300 transition duration-300"
        >
          Download Advanced Template
        </button>
        {isGenerating && (
          <div className="mt-3 text-center text-gray-600">
            <p>Generating template, please wait...</p>
            <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-[#bf7d50]"></div>
          </div>
        )}
      </div>

      {/* Step 2: Select Brand */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-[#bf7d50] mb-2">
          2) Select a Brand
        </h3>
        <div className="relative">
          <select
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            className="block w-full px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:ring-[#bf7d50] focus:border-[#bf7d50]"
            required
          >
            <option value="">Select Brand</option>
            {brands.map((brand) => (
              <option key={brand._id} value={brand._id}>
                {brand.brandName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Step 3: Upload Template */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-[#030201] mb-2">
          3) Upload the completed template
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="file"
            onChange={handleFileChange}
            className="block w-full text-gray-700 px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:ring-[#bf7d50] focus:border-[#bf7d50]"
            required
          />
          <button
            type="submit"
            className="w-full py-3 px-4 bg-[#ca7e58] text-white font-bold rounded-lg hover:bg-orange-300 transition duration-300"
          >
            Upload Template
          </button>
        </form>
        {uploadStatus && (
          <p className="mt-4 text-center text-gray-700">{uploadStatus}</p>
        )}
      </div>
    </div>
  );
};

export default BulkData;

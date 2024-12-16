import React, { useState } from "react";
import "../Styles/BrandForm.css";

const BrandForm = () => {
  const [brandName, setBrandName] = useState("");
  const [brandAuth, setBrandAuthenticationDocument] = useState(null);
  const [brandCategory, setBrandCategory] = useState("");
  const [brandImage, setBrandImage] = useState(null);
  const [categories, setCategories] = useState({
    pant: false,
    shirt: false,
    stitch: false,
    unstitch: false,
  });
  const [showModal, setShowModal] = useState(false); // Success modal state
  const [errorModal, setErrorModal] = useState(false); // Duplicate name error modal state
  const [errorMessage, setErrorMessage] = useState(""); // General error message state
  const [loading, setLoading] = useState(false); // Loading state for submission

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Show loading state during submission
    setLoading(true);

    const formData = new FormData();
    formData.append("brandName", brandName);
    formData.append("brandCategory", brandCategory);
    formData.append("brandImage", brandImage);
    formData.append("brandAuth", brandAuth);
    formData.append("categories", JSON.stringify(categories));

    try {
      const response = await fetch("http://localhost:8000/api/brands/submit", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data.message);
        setShowModal(true); // Show success modal
      } else {
        const errorData = await response.json();
        if (errorData.message === "Brand name already exists. Try another name.") {
          setErrorModal(true); // Show error modal for duplicate name
          setErrorMessage(errorData.message); // Set error message for modal
        } else {
          console.error("Error submitting form:", errorData.message);
          setErrorMessage("An error occurred. Please try again.");
          setErrorModal(true); // Show general error modal
        }
      }
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage("An unexpected error occurred. Please try again later.");
      setErrorModal(true); // Show error modal for unexpected errors
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleCloseErrorModal = () => {
    setErrorModal(false);
    setErrorMessage("");
  };

  return (
    <div className="max-w-lg mx-auto p-8 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold mb-6 text-center text-[#bf7d50]">
        Verify Brand Information
      </h2>
      <form onSubmit={handleSubmit}>
        {/* Brand Name */}
        <div className="mb-4">
          <label className="block text-[#bf7d50] font-semibold mb-2">
            Brand Name
          </label>
          <input
            type="text"
            value={brandName}
            onChange={(e) => setBrandName(e.target.value)}
            placeholder="Please Input"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#bf7d50]"
            required
          />
        </div>

        {/* Brand Category */}
        <div className="mb-4">
          <label className="block text-[#bf7d50] font-semibold mb-2">
            Brand Category
          </label>
          <input
            type="text"
            value={brandCategory}
            onChange={(e) => setBrandCategory(e.target.value)}
            placeholder="Enter brand category"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#bf7d50]"
            required
          />
        </div>

        {/* Brand Logo */}
        <div className="mb-4">
          <label className="block text-[#bf7d50] font-semibold mb-2">
            Brand Logo
          </label>
          <input
            type="file"
            onChange={(e) => setBrandImage(e.target.files[0])}
            className="w-full text-gray-500 p-3 border border-gray-300 rounded-lg cursor-pointer focus:outline-none"
            required
          />
        </div>

        {/* Authentication Document */}
        <div className="mb-4">
          <label className="block text-[#bf7d50] font-semibold mb-2">
            Any Authentication Document
          </label>
          <input
            type="file"
            onChange={(e) =>
              setBrandAuthenticationDocument(e.target.files[0])
            }
            className="w-full text-gray-500 p-3 border border-gray-300 rounded-lg cursor-pointer focus:outline-none"
            required
          />
        </div>

        {/* Select Categories */}
        <div className="mb-4">
          <label className="block text-[#bf7d50] font-semibold mb-2">
            Select Category
          </label>
          <div className="grid grid-cols-2 gap-2">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={categories.pant}
                onChange={() =>
                  setCategories({ ...categories, pant: !categories.pant })
                }
                className="form-checkbox text-[#bf7d50] h-5 w-5"
              />
              <span className="ml-2 text-gray-700">Pant</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={categories.shirt}
                onChange={() =>
                  setCategories({ ...categories, shirt: !categories.shirt })
                }
                className="form-checkbox text-[#bf7d50] h-5 w-5"
              />
              <span className="ml-2 text-gray-700">Shirt</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={categories.stitch}
                onChange={() =>
                  setCategories({ ...categories, stitch: !categories.stitch })
                }
                className="form-checkbox text-[#bf7d50] h-5 w-5"
              />
              <span className="ml-2 text-gray-700">Stitch</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={categories.unstitch}
                onChange={() =>
                  setCategories({
                    ...categories,
                    unstitch: !categories.unstitch,
                  })
                }
                className="form-checkbox text-[#bf7d50] h-5 w-5"
              />
              <span className="ml-2 text-gray-700">Unstitch</span>
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-6">
          <button
            type="submit"
            className={`w-full py-3 rounded-lg font-bold text-white ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#bf7d50] hover:bg-[#a16640] transition duration-300"
            }`}
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>

      {/* Success Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm text-center">
            <h3 className="text-xl font-bold text-[#bf7d50] mb-4">Success!</h3>
            <p>Your request has been submitted successfully!</p>
            <button
              onClick={handleCloseModal}
              className="mt-4 bg-[#bf7d50] text-white py-2 px-4 rounded-lg hover:bg-[#a16640] transition duration-300"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Error Modal */}
      {errorModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm text-center">
            <h3 className="text-xl font-bold text-red-500 mb-4">Error!</h3>
            <p>{errorMessage}</p>
            <button
              onClick={handleCloseErrorModal}
              className="mt-4 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition duration-300"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrandForm;

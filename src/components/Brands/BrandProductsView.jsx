import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FaHeart, FaShoppingCart } from "react-icons/fa";

const BrandProductsView = () => {
  const { brandId } = useParams();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState(null); // Track the currently active filter
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 100; // Items per page

  // Fetch products from the server
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/api/products/${brandId}/products`
        );
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        if (data && data.products && Array.isArray(data.products)) {
          setProducts(data.products);
          setFilteredProducts(data.products); // Initialize filtered products
          setTotalPages(Math.ceil(data.products.length / itemsPerPage));
        } else {
          setError("Unexpected response format");
        }
      } catch (error) {
        console.error("Fetch error:", error);
        setError("Error fetching products.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [brandId]);

  // Apply filters to products based on the active filter
  useEffect(() => {
    let filtered = products;

    if (activeFilter) {
      filtered = products.filter((product) =>
        product.category.toLowerCase() === activeFilter.toLowerCase()
      );
    }

    setFilteredProducts(filtered);
    setTotalPages(Math.ceil(filtered.length / itemsPerPage));
    setCurrentPage(1); // Reset to the first page when filters change
  }, [activeFilter, products]);

  // Handle selecting a filter (single filter active at a time)
  const handleFilterChange = (filterName) => {
    setActiveFilter((prevFilter) =>
      prevFilter === filterName ? null : filterName // Toggle the filter
    );
  };

  // Pagination logic
  const handlePageChange = (direction) => {
    if (direction === "next" && currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    } else if (direction === "prev" && currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = filteredProducts.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  if (loading) return <p>Loading products...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="max-w-7xl mx-auto p-8">
      <h2 className="text-3xl font-bold mb-6">Products for the Selected Brand</h2>

      {/* Filter Buttons */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => handleFilterChange("Shirts")}
          className={`px-4 py-2 rounded ${
            activeFilter === "Shirts"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-black"
          }`}
        >
          Shirts
        </button>
        <button
          onClick={() => handleFilterChange("Pents")}
          className={`px-4 py-2 rounded ${
            activeFilter === "Pents"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-black"
          }`}
        >
          Pents
        </button>
        <button
          onClick={() => handleFilterChange("Stiched")}
          className={`px-4 py-2 rounded ${
            activeFilter === "Stiched"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-black"
          }`}
        >
          Stiched
        </button>
        <button
          onClick={() => handleFilterChange("Unstiched")}
          className={`px-4 py-2 rounded ${
            activeFilter === "Unstiched"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-black"
          }`}
        >
          Unstiched
        </button>
        <button
          onClick={() => handleFilterChange("Footwear")}
          className={`px-4 py-2 rounded ${
            activeFilter === "Footwear"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-black"
          }`}
        >
          Footwear
        </button>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {currentProducts.length === 0 ? (
          <p>No products available for the selected filter.</p>
        ) : (
          currentProducts.map((product) => (
            <div key={product._id} className="bg-white p-8 rounded-lg shadow-lg">
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-100 sm:h-70 lg:h-100 object-cover rounded mb-4"
              />
              <h3 className="text-xl font-semibold">{product.title}</h3>
              <p className="text-gray-600">{product.description}</p>
              <p className="text-green-600 font-bold mt-2">PKR {product.price}</p>

              <div className="flex justify-between mt-4">
                <button className="text-red-600">
                  <FaHeart />
                </button>
                <button className="text-blue-600">
                  <FaShoppingCart />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6">
        <button
          onClick={() => handlePageChange("prev")}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded ${
            currentPage === 1 ? "bg-gray-300" : "bg-blue-500 text-white"
          }`}
        >
          Previous
        </button>
        <p>
          Page {currentPage} of {totalPages}
        </p>
        <button
          onClick={() => handlePageChange("next")}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 rounded ${
            currentPage === totalPages ? "bg-gray-300" : "bg-blue-500 text-white"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default BrandProductsView;

import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
// import "../Styles/AllRent.css";

function AllRent() {
  // State management
  const navigate = useNavigate()
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [perPage, setPerPage] = useState(8);
  const [curAllRent, setCurAllRent] = useState(1);

  // Filter states
  const [filters, setFilters] = useState({
    color: "",
    price: "",
    brand: "",
    category: "",
    size: "",
  });

  const [showFilters, setShowFilters] = useState(false);

  // Fetch products once when the component mounts
  useEffect(() => {
    fetchProducts();
  }, []);

  // Apply filters when the filters state changes
  useEffect(() => {
    applyFilters();
  }, [filters, products]);

  // Fetch products data from the API
  const fetchProducts = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/productss");
      const data = await response.json();
      setProducts(data);
      setFilteredProducts(data);
      setTotalProducts(data.length);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // Apply filters to the product list
  const applyFilters = () => {
    let filtered = [...products];
    if (filters.color) filtered = filtered.filter((p) => p.color === filters.color);
    if (filters.price) filtered = filtered.filter((p) => p.price <= filters.price);
    if (filters.brand) filtered = filtered.filter((p) => p.brand === filters.brand);
    if (filters.category) filtered = filtered.filter((p) => p.category === filters.category);
    if (filters.size) filtered = filtered.filter((p) => p.size === filters.size);

    setFilteredProducts(filtered);
    setTotalProducts(filtered.length);
    setCurAllRent(1);
  };

  // Update a specific filter
  const handleFilterChange = (key, value) => {
    setFilters((prevFilters) => ({ ...prevFilters, [key]: value }));
  };

  // Get the userId (replace logic with your auth system)
  const getUserId = () => localStorage.getItem("userId");

  // Add product to wishlist
  const addToWishlist = async (product) => {
    try {
      const response = await fetch("http://localhost:8000/api/wishlist/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: getUserId(), productId: product._id }),
      });
      const data = await response.json();
      alert(data.success ? "Product added to wishlist" : "Failed to add product");
    } catch (error) {
      console.error("Error adding to wishlist:", error);
    }
  };

  // Add product to cart
  const addToCart = async (product) => {
    try {
      const response = await fetch("http://localhost:8000/api/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: getUserId(), productId: product._id, quantity: 1 }),
      });
      const data = await response.json();
      alert(data.success ? "Product added to cart" : "Failed to add product");
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  // Pagination handlers
  const handleNextPage = () => {
    if (curAllRent < Math.ceil(totalProducts / perPage)) setCurAllRent((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    if (curAllRent > 1) setCurAllRent((prev) => prev - 1);
  };



//   Handle Delete 

const handleDelete = async (productId) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/rent/${productId}`,
        { method: "DELETE" }
      );
      if (response.ok) {
        setProducts((prevProducts) =>
          prevProducts.filter((product) => product._id !== productId)
        );
        setFilteredProducts((prevProducts) =>
          prevProducts.filter((product) => product._id !== productId)
        );
      } else {
        throw new Error("Failed to delete the product.");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <div className="rent-page-container">
        <h1 className="text-2xl font-bold">Manage All Rents</h1>
      {/* Header Section */}
     

      {/* Buttons Section */}
      <div className="button-section">
        <button className="filter-button" onClick={() => setShowFilters(!showFilters)}>
          <i className="fas fa-filter"></i> Filter
        </button>
        
      </div>

      {/* Filters Section */}
      {showFilters && (
        <div className="filter-section">
          <label>Color: <input onChange={(e) => handleFilterChange("color", e.target.value)} /></label>
          <label>Price (Max): <input type="number" onChange={(e) => handleFilterChange("price", e.target.value)} /></label>
          <label>Brand: <input onChange={(e) => handleFilterChange("brand", e.target.value)} /></label>
          <label>Category: <input onChange={(e) => handleFilterChange("category", e.target.value)} /></label>
          <label>Size: <input onChange={(e) => handleFilterChange("size", e.target.value)} /></label>
        </div>
      )}

      {/* Products Per Page */}
      <div className="products-per-page mb-4">
        <label>Select Products Per Page:</label>
        <select onChange={(e) => setPerPage(Number(e.target.value))}>
          <option value="8">8</option>
          <option value="16">16</option>
          <option value="24">24</option>
          <option value="100">100</option>
        </select>
      </div>

      {/* Product Grid */}
      <div className="rent-products">
        <h1 className="text-2xl font-bold mb-4">Rent Products</h1>
       
        <div className="product-grid grid grid-cols-4 gap-4">
          {filteredProducts
            .slice((curAllRent - 1) * perPage, curAllRent * perPage)
            .map((product) => (
              <>
              {
                 (product?.status !== "published" || product?.status !== "rejetected") && (
                  <div className="product-item border p-4 rounded shadow" key={product._id}>
                  <Link to={`/product/${product._id}`}>
                  {
                    product?.imagePath ? (
                      <img
                      src={product?.imagePath}
                      alt={product["Product Name"]}
                      className="product-img w-full h-48 object-cover"
                    />
                    ): (
  <img
                      src={`http://localhost:5173${product["Img Path"]}`}
                      alt={product["Product Name"]}
                      className="product-img w-full h-48 object-cover"
                    />
                    )
                  }
                    
                  </Link>
                  <div className="product-details mt-2">
                    <p className="font-semibold">{product["Product Name"] || product?.productName}</p>
                    <p>PKR {product.Price || product.price}</p>
                  </div>
                  <div className="product-actions flex justify-between mt-2">
                    <Button 
                    onClick = {() => handleDelete(product?._id)}
                     className = "bg-red-600 hover:bg-red-700">Delete</Button>
                    <Button
                    onClick = {() => navigate(`/edit_rent/${product._id}`)}
                    >Edit</Button>
                  </div>
                </div>
                 )
              }
              
              </>
            ))}
        </div>

        {/* Pagination Controls */}
        <div className="pagination-controls mt-4 flex justify-between items-center">
          <button
            className="pagination-button btn bg-dark text-white px-4 py-2"
            onClick={handlePrevPage}
            disabled={curAllRent === 1}
          >
            Previous
          </button>
          <span>
            Page {curAllRent} of {Math.ceil(totalProducts / perPage)}
          </span>
          <button
            className="pagination-button btn bg-dark text-white px-4 py-2"
            onClick={handleNextPage}
            disabled={curAllRent === Math.ceil(totalProducts / perPage)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default AllRent;

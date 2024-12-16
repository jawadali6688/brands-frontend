import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";

const BrandProducts = () => {
  const { brandId } = useParams();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editProduct, setEditProduct] = useState(null);
  const [image, setImage] = useState(null);
  const [activeFilter, setActiveFilter] = useState(null); // Track the currently active filter

  const navigate = useNavigate();

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
    if (!activeFilter) {
      // No filter is active, show all products
      setFilteredProducts(products);
      return;
    }

    const filtered = products.filter(
      (product) => product.category === activeFilter
    );
    setFilteredProducts(filtered);
  }, [activeFilter, products]);

  // Handle selecting a filter (single filter active at a time)
  const handleFilterChange = (filterName) => {
    setActiveFilter((prevFilter) =>
      prevFilter === filterName ? null : filterName // Toggle the filter
    );
  };

  // Handle delete product
  const handleDelete = async (productId) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/products/${productId}`,
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

  // Handle edit product
  const handleEdit = (product) => {
    setEditProduct(product);
  };

  // Handle submit edit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("title", editProduct.title);
      formData.append("description", editProduct.description);
      formData.append("price", editProduct.price);
      if (image) {
        formData.append("image", image);
      }

      const response = await fetch(
        `http://localhost:8000/api/products/${editProduct._id}`,
        {
          method: "PUT",
          body: formData,
        }
      );

      if (response.ok) {
        const updatedProduct = await response.json();
        setProducts((prevProducts) =>
          prevProducts.map((product) =>
            product._id === updatedProduct._id ? updatedProduct : product
          )
        );
        setFilteredProducts((prevProducts) =>
          prevProducts.map((product) =>
            product._id === updatedProduct._id ? updatedProduct : product
          )
        );
        setEditProduct(null);
        setImage(null);
      } else {
        throw new Error("Failed to update the product.");
      }
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

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
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProducts.length === 0 ? (
          <p>No products available for the selected filter.</p>
        ) : (
          filteredProducts.map((product) => (
            <div key={product._id} className="bg-white p-8 rounded-lg shadow-lg">
              {editProduct && editProduct._id === product._id ? (
                <form onSubmit={handleSubmit}>
                  <input
                    type="text"
                    name="title"
                    value={editProduct.title}
                    onChange={handleInputChange}
                    className="w-full mb-2 p-2 border rounded"
                    placeholder="Product Title"
                  />
                  <input
                    type="text"
                    name="description"
                    value={editProduct.description}
                    onChange={handleInputChange}
                    className="w-full mb-2 p-2 border rounded"
                    placeholder="Product Description"
                  />
                  <input
                    type="number"
                    name="price"
                    value={editProduct.price}
                    onChange={handleInputChange}
                    className="w-full mb-2 p-2 border rounded"
                    placeholder="Price"
                  />
                  <input type="file" onChange={handleImageChange} className="w-full mb-2" />
                  <button type="submit" className="bg-green-500 text-white p-2 rounded">
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditProduct(null)}
                    className="bg-gray-500 text-white p-2 ml-2 rounded"
                  >
                    Cancel
                  </button>
                </form>
              ) : (
                <>
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-100 sm:h-70 lg:h-100 object-cover rounded mb-4"
                  />
                  <h3 className="text-xl font-semibold">{product.title}</h3>
                  <p className="text-gray-600">{product.description}</p>
                  <p className="text-green-600 font-bold mt-2">${product.price}</p>

                  <div className="flex justify-between mt-4">
                    <button
                      onClick={() => handleEdit(product)}
                      className="text-blue-600"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="text-red-600"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BrandProducts;

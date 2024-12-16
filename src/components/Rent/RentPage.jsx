import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { FaHeart, FaShoppingCart } from "react-icons/fa";
import { Link } from "react-router-dom";

function RentPage() {
  const [products, setProducts] = useState([]);
  const [favorites, setFavorites] = useState([]);

  const userId = useSelector((state) => state.auth?.user?._id); // Get userId from Redux state
  console.log(userId)
  // Fetch products and favorites when component mounts
  useEffect(() => {
    fetchProducts();
    fetchFavorites();
  }, [userId]);

  const fetchProducts = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/productss");
      const data = await response.json();
      const approved = data.filter((item) => item.status === "approved");
      setProducts(approved);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const fetchFavorites = async () => {
    if (!userId) return; // Avoid fetching if no userId
    try {
      const response = await fetch(`http://localhost:8000/api/wishlist/${userId}`, {
        method: "POST",
      });
      const data = await response.json();
      console.log(data, 'fav')
      setFavorites(data?.favourites || []);
    } catch (error) {
      console.error("Error fetching favorites:", error);
    }
  };

  // Toggle product favorite status
  const toggleFavorite = async (productId) => {
    console.log(productId, "this is products id")
    try {
      const isFavorite = favorites.some((fav) => fav?._id === productId);

      if (isFavorite) {
        // Remove from favorites
         try {
          const data = await fetch("http://localhost:8000/api/wishlist/remove", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId, productId }),
          });
          setFavorites((prev) => prev.filter((fav) => fav?._id !== productId));
          console.log(data)
         } catch (error) {
          console.log(error, "error in removing")
         }
      } else {
        // Add to favorites
        try {
          const response = await fetch("http://localhost:8000/api/wishlist/add", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId, productId }),
          });
          console.log(response)
          const data = await response.json();
          console.log(data)
          setFavorites(data?.favourites?.favourites || []);
        } catch (error) {
          console.log(error, "Error in adding")
        }
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-8">
      <h2 className="text-3xl font-bold mb-6">Rent Page</h2>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product) => (
          <div key={product._id} className="p-4 bg-white shadow rounded-lg">
            <Link to={`/product/${product._id}`}>
                      {product?.imagePath ? (
                        <img
                          src={product?.imagePath}
                          alt={product["Product Name"]}
                          className="product-img w-full h-48 object-cover"
                        />
                      ) : (
                        <img
                          src={`http://localhost:5173${product["Img Path"]}`}
                          alt={product["Product Name"]}
                          className="product-img w-full h-48 object-cover"
                        />
                      )}
                    </Link>
            <h3 className="text-lg font-semibold">{product.title}</h3>
              <p className="font-semibold">
                        {product["Product Name"] || product?.productName}
                      </p>
                      <p className="font-bold text-green-600">PKR {product.Price || product.price}</p>
            <div className="flex justify-between mt-2">
              <FaHeart
                className={`text-4xl hover:cursor-pointer ${
                  favorites.some((fav) => fav?._id === product._id)
                    ? "text-red-600" // Filled heart for favorite
                    : "text-gray-500" // Empty heart for non-favorite
                }`}
                onClick={() => toggleFavorite(product._id)}
              />
              <FaShoppingCart className="text-blue-500 text-4xl hover:cursor-pointer" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RentPage;

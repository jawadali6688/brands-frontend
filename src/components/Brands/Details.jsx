import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../Styles/ProductDetailPage.css';

const Details = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [userId, setUserId] = useState('66fe1c03aa1c11fb4ef98d79');
  const [isAdded, setIsAdded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  console.log(productId)
  useEffect(() => {
    fetchProductDetails();
  }, [productId]);

      const fetchProductDetails = async () => {
        try {
          const response = await fetch(`http://localhost:8000/api/products/${productId}`);
          
          const data = await response.json();
          console.log('Fetched product:', data); // Log the full response
          setProduct(data);
        } catch (error) {
          console.error('Error fetching product details:', error);
          setError('Failed to fetch product details');
        }
      };
      

  const handleAddToCart = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/cart/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, userId }),
      });
      const data = await response.json();
      alert(data.success ? 'Product added to cart!' : 'Failed to add product to cart');
    } catch (error) {
      console.error('Error adding product to cart:', error);
      alert('Failed to add product to cart');
    }
  };

  const handleAddToMixAndMatch = async (productId) => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8000/api/products/mixandmatch', { productId, userId });
      if (response.status === 201) {
        setIsAdded(true);
        alert('Product successfully added to Mix and Match!');
      }
    } catch (error) {
      console.error('Error adding product to Mix and Match:', error);
      alert('Failed to add product to Mix and Match');
    } finally {
      setLoading(false);
    }
  };

  if (!product) return <div>Loading...</div>;

  return (
    <div className="product-detail-container flex justify-center items-center py-12 bg-gray-50">
      <div className="product-card flex bg-white shadow-lg rounded-lg p-6 w-4/5 max-w-5xl">
        {/* Image Section */}
        <div className="product-image w-1/2 pr-6">
          <img
            src={product.image}
            alt={product.productName}
            className="w-full h-auto object-cover rounded-lg"
          />
        </div>

        {/* Details Section */}
        <div className="product-details w-1/2">
          <h1 className="text-2xl font-bold mb-4">{product.productName}</h1>
          <p className="mb-2">
            <strong>Price:</strong> PKR {product.price}
          </p>
          <p className="mb-2">
            <strong>Description:</strong> {product.description}
          </p>
          <p className="mb-2">
            <strong>Availability:</strong> {product.availability}
          </p>
          <p className="mb-2">
            <strong>Color:</strong> {product.color}
          </p>
          <p className="mb-2">
            <strong>Brand:</strong> {product.brand ? product.brand.brandName : 'Unknown'} {/* Display the brand name */}
          </p>
          <p className="mb-2">
            <strong>Category:</strong> {product.category}
          </p>
          <p className="mb-2">
            <strong>Size:</strong> {product.size}
          </p>

          {/* Styled Buttons */}
          <div className="mt-6 flex gap-4">
            <button
              className="flex-1 bg-black text-white py-3 px-6 rounded-md hover:bg-gray-800 transition-shadow shadow-md"
              onClick={handleAddToCart}
            >
              Add to Cart
            </button>
            {!['Stiched', 'Unstiched'].includes(product.category) && (
              <button
                className={`flex-1 bg-black text-white py-3 px-6 rounded-md hover:bg-gray-800 transition-shadow shadow-md ${loading && 'opacity-50 cursor-not-allowed'}`}
                onClick={() => handleAddToMixAndMatch(productId)}
                disabled={loading}
              >
                {loading ? 'Adding...' : 'Add to Mix & Match'}
              </button>
            )}
          </div>

          {/* Success and Error Messages */}
          {isAdded && <p style={{ color: 'green', fontWeight: 'bold', marginTop: '1rem' }}>Product successfully added to Mix & Match!</p>}
          {error && <p className="text-red-600 mt-4">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default Details;

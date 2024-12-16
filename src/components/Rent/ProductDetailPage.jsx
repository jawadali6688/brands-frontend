import React, { useState, useEffect, useRef } from 'react'; 
import { useParams } from 'react-router-dom';
import '../Styles/ProductDetailPage.css';  // Make sure this CSS file handles layout and styling

const ProductDetailPage = () => {
  const { productId } = useParams();  // Get the product ID from the URL
  const [product, setProduct] = useState(null);
  const [feedbackText, setFeedbackText] = useState('');  // State for feedback
  const [feedbackList, setFeedbackList] = useState([]);  // State to store all feedback
  const [sentiment, setSentiment] = useState(null);      // State for sentiment
  const [rentalDate, setRentalDate] = useState('');      // State to store rental date
  const chartRef = useRef(null);  // Use a ref to store the chart instance

  useEffect(() => {
    fetchProductDetails();
    fetchFeedbackStatistics();
    fetchProductFeedback();
  }, [productId]);

  const fetchProductDetails = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/productss/${productId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log(data, "this is data")
      setProduct(data);
    } catch (error) {
      console.error('Error fetching product details:', error);
    }
  };

  const fetchFeedbackStatistics = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/feedback/statistics/${productId}`);
      const data = await response.json();
      updateChart([data.positive, data.neutral, data.negative]);  // Update chart with API data
    } catch (error) {
      console.error('Error fetching feedback statistics:', error);
    }
  };

  const fetchProductFeedback = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/feedback/${productId}`);
      const data = await response.json();
      setFeedbackList(data);  // Set feedback list state
    } catch (error) {
      console.error('Error fetching product feedback:', error);
    }
  };
  const updateChart = (chartData) => {
    const ctx = chartRef.current?.getContext('2d');
    if (!ctx) return; // If chartRef.current is null, exit the function
  
    if (chartRef.current.chartInstance) {
      chartRef.current.chartInstance.destroy();
    }
  
    chartRef.current.chartInstance = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Positive', 'Neutral', 'Negative'],
        datasets: [{
          data: chartData,
          backgroundColor: ['#4caf50', '#ffc107', '#f44336'],
          borderWidth: 1,
        }]
      },
      options: {
        responsive: true,
      }
    });
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, feedbackText })
      });
      const data = await response.json();
      setSentiment(data.sentiment);
      setFeedbackText('');
      fetchProductFeedback();
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  };
  const handleRentNow = async () => {
    const userId = "user_id"; // Replace this with actual user ID logic
    if (!rentalDate) {
      alert("Please select a rental date");
      return;
    }
  
    try {
      const response = await fetch('http://localhost:8000/api/cart/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, productId, rentalDate }),  // Make sure all data is sent correctly
      });
  
      const data = await response.json();
  
      if (data.success) {
        alert('Product added to cart!');
      } else {
        alert('Failed to add product to cart');
      }
    } catch (error) {
      console.error('Error adding product to cart:', error);
    }
  };
  

  if (!product) return <div>Loading...</div>;

  return (
    <div className="product-detail-container">
      <div className="product-detail">
        <div className="product-image">
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
        </div>

        <div className="product-info">
          <h1>{product["Product Name"]}</h1>
          <p><strong>Price:</strong> PKR {product.Price || product.price}</p>
          <p><strong>Product Description:</strong> {product["Product Description"]}</p>
          <p><strong>Availability:</strong> {(product["Availability"] || product?.availability) ? "Yes Available": "Not Available"}</p>
          <p><strong>Color:</strong> {product.Color || product?.color}</p>
          <p><strong>Brand:</strong> {product.Brand || product?.brand}</p>
          <p><strong>Category:</strong> {product.Category || product?.category}</p>
          <p><strong>Size:</strong> {product.Size || product?.size}</p>
          <div className="rental-date">
            <label>Rental Date:</label>
            <input 
              type="date" 
              name="rental-date" 
              value={rentalDate} 
              onChange={(e) => setRentalDate(e.target.value)} 
            />
          </div>
           <button className="view-feedback-button" onClick={() => window.location.href = `/feedback/${productId}`}>
           Feedback
          </button>
          <button className="rent-button" onClick={handleRentNow}>Rent it now</button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;

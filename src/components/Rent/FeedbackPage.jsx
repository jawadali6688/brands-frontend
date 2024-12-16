import React, { useState, useEffect, useRef } from 'react'; 
import { useParams } from 'react-router-dom';
import '../Styles/FeedbackPage.css';
const FeedbackPage = () => {
  const { productId } = useParams();
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackList, setFeedbackList] = useState([]);
  const [sentiment, setSentiment] = useState(null);
  const chartRef = useRef(null);

  useEffect(() => {
    fetchFeedbackStatistics();
    fetchProductFeedback();
  }, [productId]);

  const fetchFeedbackStatistics = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/feedback/statistics/${productId}`);
      const data = await response.json();
      updateChart([data.positive, data.neutral, data.negative]);
    } catch (error) {
      console.error('Error fetching feedback statistics:', error);
    }
  };

  const fetchProductFeedback = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/feedback/${productId}`);
      const data = await response.json();
      setFeedbackList(data);
    } catch (error) {
      console.error('Error fetching product feedback:', error);
    }
  };

  const updateChart = (chartData) => {
    const ctx = chartRef.current.getContext('2d');
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
      fetchProductFeedback();  // Fetch new feedback to update the list
  
      // Fetch new statistics to update the chart
      fetchFeedbackStatistics();
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  };
  
  return (
    <div className="feedback-section">
      <h2>Leave Your Feedback</h2>
      <form onSubmit={handleFeedbackSubmit}>
        <textarea
          value={feedbackText}
          onChange={(e) => setFeedbackText(e.target.value)}
          placeholder="Write your feedback..."
        />
        <button type="submit">Submit</button>
      </form>
      {sentiment && <p>Sentiment of feedback: {sentiment}</p>}

      <h2>Feedback Sentiment Analysis</h2>
      <canvas ref={chartRef} style={{ maxWidth: '400px', maxHeight: '400px' }}></canvas>


      <h2>Customer Feedback</h2>
      {feedbackList.length > 0 ? (
        <ul>
          {feedbackList.map(feedback => (
            <li key={feedback._id}>
              <p><strong>Anonymous</strong> ({new Date(feedback.createdAt).toLocaleDateString()})</p>
              <p>{feedback.feedbackText}</p>
              <p>Rating: {feedback.sentiment === 'Positive' ? '⭐⭐⭐⭐⭐' : feedback.sentiment === 'Neutral' ? '⭐⭐⭐' : '⭐'}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No feedback available for this product.</p>
      )}
    </div>
  );
};

export default FeedbackPage;

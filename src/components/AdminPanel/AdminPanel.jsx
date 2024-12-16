import React from 'react';
import { Link, Route, Routes, useNavigate } from 'react-router-dom'; // Added useNavigate for navigation after logout
import { useDispatch } from 'react-redux'; // Import useDispatch from react-redux to dispatch actions
import axios from 'axios'; // Make sure axios is imported to make the logout API call
import { toast } from 'sonner'; // Import toast for notifications
import '../Styles/AdminPanel.css';
import BrandRequests from './BrandRequests'; // Corrected import
import MyBrand from '../Brands/MyBrand'; // Corrected import
import { setAuthUser } from '@/redux/authSlice'; // Replace with correct action import

function AdminPanel() {
  const navigate = useNavigate(); // Navigate after logout
  const dispatch = useDispatch(); // Dispatch actions for logout
  
  const logoutHandler = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/v1/user/logout', { withCredentials: true });
      if (res.data.success) {
        dispatch(setAuthUser(null)); // Clear auth user state
       
        navigate("/login"); // Redirect to login page after logout
        toast.success(res.data.message); // Show success message
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error logging out"); // Show error message
    }
  };

  return (
    <>
      <div className="admin-panel-container">
        <header className="header">
          <h1>Admin Panel</h1>
        </header>
        <aside className="sidebar">
          <h2>Main Menu</h2>
          <div className="menu-item">
            <h3>Brand</h3>
            <ul>
              <li>
                <Link to="/Brandreq">Brand Requests</Link> {/* Updated to relative path */}
              </li>
              <li>
                <Link to="/all-brands">Manage Brands</Link> {/* Updated to relative path */}
              </li>
            </ul>
          </div>
          <div className="menu-item">
            <h3>Rental</h3>
            <ul>
              <li>
                <Link to="/Rentreq">Rental Requests</Link>
              </li>
              <li>
                <Link to="/all-rents">Manage Rentals</Link>
              </li>
            </ul>
          </div>
          <button className="logout-button" onClick={logoutHandler}>Logout</button> {/* Call logoutHandler on click */}
        </aside>
        <main className="content">
          {/* Define Routes for dynamic content */}
          <Routes>
            <Route path="/BrandRequests" element={<BrandRequests />} />
            <Route path="/MyBrand" element={<MyBrand />} />
            {/* Uncomment and correct imports if these components exist */}
            {/* <Route path="admin/rental-requests" element={<RentalRequests />} /> */}
            {/* <Route path="admin/manage-rentals" element={<ManageRentals />} /> */}
            <Route path="*" element={<h1>Welcome to the Admin Panel</h1>} /> {/* Default screen */}
          </Routes>
        </main>
      </div>
    </>
  );
}

export default AdminPanel;

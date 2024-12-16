import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner"; // For displaying notifications
import { setAuthUser } from "@/redux/authSlice"; // Assuming these are your Redux slices
import { setPosts, setSelectedPost } from "@/redux/postSlice";
import "../Styles/Navbaar.css"; // Ensure your CSS file is correctly named and linked

const Navbar = () => {
  const [expanded, setExpanded] = useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.auth); // Fetching user details from Redux

  // Toggle function to expand/collapse menu items
  const toggleExpand = (menu) => {
    setExpanded((prevState) => ({
      ...prevState,
      [menu]: !prevState[menu],
    }));
  };

  // Handle Logout Logic
  const handleLogout = async () => {
    try {
      // Making the logout request to the backend
      const res = await axios.get("http://localhost:8000/api/v1/user/logout", {
        withCredentials: true,
      });
      if (res.data.success) {
        // Dispatch Redux actions to clear user state and posts
        dispatch(setAuthUser(null));
        dispatch(setSelectedPost(null));
        dispatch(setPosts([]));

        // Navigate to the login page after successful logout
        navigate("/login");
        toast.success(res.data.message); // Show success message
      }
    } catch (error) {
      // Show error message if something goes wrong
      toast.error(error.response?.data?.message || "Failed to log out");
    }
  };

  return (
    <div className="side-navbar">
      <div className="logo">
        {/* Update the path to your logo image */}
        <img src="\assets\logo.jpg" alt="FashionFusion Logo" />
       
      </div>
      <div className="menu">
        {/* My Brand Menu */}
        <div className="menu-item flex items-center p-3 text-base font-normal text-blue-gray-700 hover:bg-blue-gray-50 hover:text-blue-gray-900 rounded-lg">
  <Link to="/MyBrand" className="menu-link flex items-center w-full">
    <i className="fas fa-box mr-4"></i>
    <span>My Brand</span>
  </Link>
</div>



        {/* Products Menu */}
        <div className="menu-item" onClick={() => toggleExpand("products")}>
          <i className="fas fa-box"></i>
          <span>Products</span>
        </div>
        {expanded.products && (
          <div className="submenu">
            <Link to="/manage-products">Manage Products</Link>
            <Link to="/AddProduct">Add Products</Link>
            <Link to="/bulkData">Bulk Add</Link>
          </div>
        )}

        {/* Orders Menu */}
        <div className="menu-item" onClick={() => toggleExpand("orders")}>
          <i className="fas fa-shopping-cart"></i>
          <span>Orders</span>
        </div>
        {expanded.orders && (
          <div className="submenu">
            <Link to="/orders/view">View Orders</Link>
            <Link to="/orders/track">Track Orders</Link>
          </div>
        )}

        {/* Account Management Menu */}
        <div className="menu-item" onClick={() => toggleExpand("account")}>
          <i className="fas fa-user-circle"></i>
          <span>Account Management</span>
        </div>
        {expanded.account && (
          <div className="submenu">
            <Link to="/account/settings">Settings</Link>
            <Link to="/account/profile">Profile</Link>
          </div>
        )}

        {/* Logout Option */}
        <div className="menu-item" onClick={handleLogout}>
          <i className="fas fa-sign-out-alt"></i>
          <span>Logout</span>
        </div>
      </div>
    </div>
  );
};

export default Navbar;

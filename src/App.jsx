import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import { setSocket } from './redux/socketSlice';
import { setOnlineUsers } from './redux/chatSlice';
import { setLikeNotification } from './redux/rtnSlice';

// Import components
import Layout from './components/Layout/Layout';
import About from './components/Pages/About';
import Contact from './components/Pages/Contact';
import Policy from './components/Pages/Policy';
import PageNotFound from './components/Pages/PageNotFound';
import Brands from './components/Brands/Brands';
import BrandLogin from './components/BrandLogin';
import CreateBrand from './components/Brands/CreateBrand';
import Navbar from './components/SellerCenterLayout/Navbar';
import BrandForm from './components/Brands/BrandForm';
import MyBrand from './components/Brands/MyBrand';
import AddProduct from './components/Brands/AddProduct';
import BulkUpload from './components/Brands/BulkUpload';
import ChatPage from './components/ChatPage';
import EditProfile from './components/EditProfile';
import MainLayout from './components/MainLayout';
import Profile from './components/Profile';
import Signup from './components/Signup';
import ProtectedRoutes from './components/ProtectedRoutes';
import Login from './components/Login';
import Home from './components/Home';
import AdminPanel from './components/AdminPanel/AdminPanel';  // Ensure this is imported
import Chatbot from './components/chabot/chatbot';
import BulkData from "./components/Brands/bulkData";
import BrandRequests from "./components/AdminPanel/BrandRequests";
import BrandProducts from "./components/Brands/BrandProducts";
import AllBrands from "./components/Brands/AllBrands";
import CameraPage from "./components/Pages/CameraPage";
import SearchPage from './components/Pages/SearchPage';
import RentPage from './components/Rent/RentPage';
import EarnWithUsPage from './components/Rent/EarnWithUsPage';
import ProductDetailPage from './components/Rent/ProductDetailPage'; 
import FeedbackPage from './components/Rent/FeedbackPage';
import WishlistPage from './components/Pages/WishlistPage';
import Cart from './components/Pages/Cart';
import Shirts from './components/Brands/Shirts';
import Pents from './components/Brands/Pents';
import Stiched from './components/Brands/Stiched';
import Unstiched from './components/Brands/Unstiched';
import Footwear from './components/Brands/Footwear';
import BrandProductsView from './components/Brands/BrandProductsView';
import Details from './components/Brands/Details';
import RentRequests from './components/AdminPanel/RentRequests';
import AllRent from './components/AdminPanel/AllRents';
import EditRent from './components/AdminPanel/EditRent';
function App() {
  const { user } = useSelector(store => store.auth);  // Access logged-in user data
  const { socket } = useSelector(store => store.socketio);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      const socketio = io('http://localhost:8000', {
        query: {
          userId: user?._id
        },
        transports: ['websocket']
      });
      dispatch(setSocket(socketio));

      socketio.on('getOnlineUsers', (onlineUsers) => {
        dispatch(setOnlineUsers(onlineUsers));
      });

      socketio.on('notification', (notification) => {
        dispatch(setLikeNotification(notification));
      });

      return () => {
        socketio.close();
        dispatch(setSocket(null));
      };
    } else if (socket) {
      socket.close();
      dispatch(setSocket(null));
    }
  }, [user, dispatch]);

  const getRoleBasedRedirect = () => {
    if (user?.role === 'admin') {
      return <Navigate to="/admin/panel" />;
    } else if (user?.role === 'brand') {
      return <Navigate to="/CreateBrand" />;
    } else {
      return <Navigate to="/Home" />;
    }
  };

  return (
    <Router>
      <Routes>
        {/* Default route */}
        <Route path="/" element={user ? getRoleBasedRedirect() : <Login />} />

        {/* Authentication routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected routes */}
        {user && (
          <Route element={<ProtectedRoutes><MainLayout /></ProtectedRoutes>}>
            <Route path="/Home" element={<Home />} />
            <Route path="/profile/:id" element={<Profile />} />
            <Route path="/account/edit" element={<EditProfile />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path = '/fashion-stylist' element ={<Chatbot/>}> </Route>
          </Route>
        )}

      
        {/* Brand-specific routes */}
        {user?.role === "brand" && (
          <>
            <Route path="/BrandLogin" element={<BrandLogin />} />
            <Route path="/MyBrand" element={<MyBrand />} />
            <Route path="/AddProduct" element={<AddProduct />} />
            <Route path="/BulkUpload" element={<BulkUpload />} />
            <Route path="/bulkData" element={<BulkData />} />
          </>
        )}


        {/* Admin routes */}
        {user?.role === 'admin' && (
          <Route path="/admin/panel" element={<AdminPanel />} />
        )}

         {/* Pages with Layout */}
         <Route path="/all-brands" element={<AllBrands />} />
         <Route path="/all-rents" element={<AllRent />} />
         <Route path="/edit_rent/:productId" element={<EditRent />} />
      {/* <Route path="/brand/:brandId/products" element={<BrandProducts />} />{" "} */}
      <Route path="/brand/:brandId/products" element={<BrandProducts />} />
       {/* Pages with Layout */}
       <Route element={<LayoutWrapper />}>
          <Route path="/Brands" element={<Brands />} />
          <Route path="/About" element={<About />} />
          <Route path="/Contact" element={<Contact />} />
          
  <Route path="/shirts" element={<Shirts />} />
  <Route path="/Pents" element={<Pents />} />
  <Route path="/Stiched" element={<Stiched />} />
  <Route path="/Unstiched" element={<Unstiched />} />
  <Route path="/Footwear" element={<Footwear />} />
  <Route
            path="/brand/:brandId/productss"
            element={<BrandProductsView />}
          />{" "}


          <Route path="/policy" element={<Policy />} />
          <Route path="*" element={<PageNotFound />} />
          <Route path="/rent" element={<RentPage />} /> {/* Rent page route */}
          <Route path="/earn-with-us" element={<EarnWithUsPage />}/> 
          <Route path="/Camera-page" element={<CameraPage />} />
          <Route path="/by-color" element={<SearchPage searchType="Color" />} />
        <Route path="/by-design" element={<SearchPage searchType="Design" />} />
        <Route path="/product/:productId" element={<ProductDetailPage />} />
        <Route
            path="/brand_details/:productId"
            element={<Details />}
          />
        <Route path="/feedback/:productId" element={<FeedbackPage/>} />
        <Route path="/wishlist" element={<WishlistPage /> } /> 
          <Route path="/cart" element={<Cart />} />
        </Route>
          <Route path="/Brandreq" element={<BrandRequests />} />
          <Route path="/Rentreq" element={<RentRequests />} />
          <Route path="/BrandLogin" element={<BrandLogin />} />
          <Route
            path="/CreateBrand"
            element={<WithNavbar component={CreateBrand} />}
          />
          <Route
            path="/BrandForm"
            element={<WithNavbar component={BrandForm} />}
          />
          <Route path="/brands" element={<Brands />} />
          <Route
            path="/brand/:brandId/products"
            element={<BrandProducts />}
          />{" "}
          <Route
            path="/brand/:brandId/productss"
            element={<BrandProductsView />}
          />{" "}
          {/* Add this route */}
          <Route path="*" element={<PageNotFound />} />
       
        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

// Higher-order component for wrapping content with Navbar
const WithNavbar = ({ component: Component }) => (
  <>
    <Navbar />
    <Component />
  </>
);
const LayoutWrapper = () => (
  <Layout>
    <Routes>
      <Route path="/Home" element={<Home />} />
      <Route path="/Brands" element={<Brands />} />
      <Route path="/About" element={<About />} />
      <Route path="/Contact" element={<Contact />} />
      
  <Route path="/shirts" element={<Shirts />} />
  <Route path="/Pents" element={<Pents />} />
  <Route path="/Stiched" element={<Stiched />} />
  <Route path="/Unstiched" element={<Unstiched />} />
  <Route path="/Footwear" element={<Footwear />} />
  <Route
            path="/brand_details/:productId"
            element={<Details />}
          />
  <Route
            path="/brand/:brandId/productss"
            element={<BrandProductsView />}
          />{" "}
  

      <Route path="/policy" element={<Policy />} />
      <Route path="*" element={<PageNotFound />} />
      <Route path="/rent" element={<RentPage />} /> {/* Rent page route */}
          <Route path="/earn-with-us" element={<EarnWithUsPage />}/> 
          <Route path="/Camera-page" element={<CameraPage />} />
          <Route path="/by-color" element={<SearchPage searchType="Color" />} />
        <Route path="/by-design" element={<SearchPage searchType="Design" />} />
        <Route path="/product/:productId" element={<ProductDetailPage />} />
        <Route path="/feedback/:productId" element={<FeedbackPage/>} />
        <Route path="/wishlist" element={<WishlistPage /> } /> 
          <Route path="/cart" element={<Cart />} />
    </Routes>
  </Layout>
);


<Routes>
<Route path="/Home" element={<Home />} />
<Route path="/Brands" element={<Brands />} />
<Route path="/About" element={<About />} />
<Route path="/Contact" element={<Contact />} />
<Route path="/policy" element={<Policy />} />
<Route path="/Brandreq" element={<BrandRequests />} />
<Route path="/BrandLogin" element={<BrandLogin />} />
<Route
  path="/CreateBrand"
  element={<WithNavbar component={CreateBrand} />}
/>
<Route path="/BrandForm" element={<WithNavbar component={BrandForm} />} />
<Route path="/brands" element={<Brands />} />

{/* Add this route */}
<Route path="*" element={<PageNotFound />} />
</Routes>

export default App;

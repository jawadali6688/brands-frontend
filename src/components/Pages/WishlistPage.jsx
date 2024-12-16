import React, { useState, useEffect } from 'react';
import '../Styles/WishlistPage.css';  // Add this stylesheet
import { useSelector } from 'react-redux';
import axios from 'axios';
import { Button } from '../ui/button';
import { useNavigate } from 'react-router-dom';

function WishlistPage() {


  const navigate = useNavigate()
  

  //  My Logic
  const userId = useSelector(state => state.auth?.user?._id);

  const [wishList, setWishlist] = useState([])
  const fetchWishListData = async () => {
    try {
      const { data } = await axios.post(`http://localhost:8000/api/wishlist/${userId}`);

      setWishlist(data?.favourites || []);
      console.log(data)
    } catch (error) {
      console.log(error)
    }
  }

  // removing

  const removeFromWishlist = async (productId) => {
    try {
      const response = await axios.post(`http://localhost:8000/api/wishlist/remove/`, { userId, productId });
      setWishlist(wishList?.filter((wish) => wish?._id !== productId))
      console.log(response)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchWishListData()
  }, [])


  const clearWishlist = async () => {
    try {
      const response = await axios.post(`http://localhost:8000/api/wishlist/remove_all/`, { userId });
      console.log(response)
      setWishlist([])
    } catch (error) {
      console.log(error)
    }
  }
  
  return (
    <div className="wishlist-container">
      
          <div className="wishlist-actions">
        <h2><i className="fas fa-heart"></i> Wishlist</h2>
        {
        wishList?.length > 1 && (
        <button onClick={() => clearWishlist()} className="remove-all">Remove All</button>
      )
    }

      </div>
      
      {
       ( wishList?.length < 1 || !wishList) && (
          <div className='flex flex-col justify-center items-center my-10'>
            <h1 className='text-2xl font-bold text-red-600'>No Data in Wishlist</h1>
          </div>
        )
      }
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-8">
        {wishList?.map((product) => (
          <div key={product._id} className="p-4 bg-white shadow rounded-lg">
            <img 
             onClick={() => navigate(`/brand_details/${product._id}`)}
            src={product.image} alt={product.title} className="w-full h-60 object-cover mb-4 cursor-pointer" />
            <h3 className="text-lg font-semibold">{product.title}</h3>
            <p className="text-gray-600 w-[99%] truncate">{product.description}</p>
            <p className="font-bold text-green-600">PKR {product.price}</p>
            <div className="flex items-end justify-between mt-2">
              <Button 
              onClick = {() => removeFromWishlist(product?._id)}
              className="bg-red-600">
                Remove
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default WishlistPage;

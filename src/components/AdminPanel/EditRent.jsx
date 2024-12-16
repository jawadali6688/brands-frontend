import React, { useEffect, useState } from 'react';

import { Link, useNavigate, useParams } from 'react-router-dom'; // Ensure the navbar remains functional
import axios from 'axios';
import { toast } from 'sonner';

function EditRent() {
    const navigate = useNavigate()
    const { productId } = useParams()

    const [product, setProduct] = useState([])
    const fetchProductDetails = async () => {
        try {
          const response = await fetch(`http://localhost:8000/api/productss/${productId}`);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          setProduct(data);
          console.log(data)
        } catch (error) {
          console.error('Error fetching product details:', error);
        }
      };

      useEffect(() => {
        fetchProductDetails()
      }, [])
  const [loader, setLoader] = useState(false)
  const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        contactNumber: '',
        email: '',
        city: '',
        brand: '',
        price: '',
        size: '',
        rentalDate: '',
        image: null,
        productName: '',
        productDescription: '',
        color: '',
        category: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      image: e.target.files[0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });

    try {
      setLoader(true)
      const response = await axios.post(`http://localhost:8000/api/rent/edit/${productId}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data', // Required for file upload
        },
      });
      console.log(response)
      if (response.status !== 200) throw new Error("something went wrong")
      if (response.status == 201 || response.status == 200) {
        toast.success("Data Edit Successfully!")
        console.log('Response:', response.data);
      setLoader(false)
      setFormData({
        firstName: '',
        lastName: '',
        contactNumber: '',
        email: '',
        city: '',
        brand: '',
        price: '',
        size: '',
        rentalDate: '',
        image: null,
        productName: '',
        productDescription: '',
        color: '',
        category: '',
      })
      navigate("/all-rents")
      }

      
      
    } catch (error) {
      toast.error("Please try again!")
      setLoader(false)
      console.error('Error ', error);
    }
  };

  return (
    <div className="earn-with-us-page">
      {/* Form only, no Navbar */}
      <div className="form-container">
        <h1>Edit Rent Data</h1>
        <form onSubmit={handleSubmit}>
        <input
          defaultValue={product.productName}
            type="text"
            name="productName"
            placeholder="Product Name"
            onChange={handleChange}
          />
          <input
          defaultValue={product.firstName}
            type="text"
            name="firstName"
            placeholder="Your First Name"
            onChange={handleChange}
          />
          <input
          defaultValue={product.lastName}
            type="text"
            name="lastName"
            placeholder="Your Last Name"
            onChange={handleChange}
          />
          <input
          defaultValue={product.contactNumber}
            type="text"
            name="contactNumber"
            placeholder="Contact Number"
            onChange={handleChange}
          />
          <input
          defaultValue={product.email}
            type="email"
            name="email"
            placeholder="Email Address (Optional)"
            onChange={handleChange}
          
          />
          <input
          defaultValue={product.city}
            type="text"
            name="city"
            placeholder="City"
            onChange={handleChange}
          />
          <input
          defaultValue={product.color}
            type="text"
            name="color"
            placeholder="Dress Color"
            onChange={handleChange}
          />
          <input
          defaultValue={product.brand}
            type="text"
            name="brand"
            placeholder="Brand"
            onChange={handleChange}
          />
          <input
          defaultValue={product.price}
            type="number"
            name="price"
            placeholder="Price of Dress"
            onChange={handleChange}
          />
          <input
          defaultValue={product.category}
            type="text"
            name="category"
            placeholder="Category"
            onChange={handleChange}
          />
          <select 
          
          name="size" onChange={handleChange}>
            <option defaultValue="">Select Size</option>
            <option defaultValue="S">Small</option>
            <option defaultValue="M">Medium</option>
            <option defaultValue="L">Large</option>
          </select>
          <input
          defaultValue={product.rentalDate}
            type="date"
            name="rentalDate"
            onChange={handleChange}
          />
          <textarea
          defaultValue={product.productDescription}
           cols={10}
           rows={5}
           className='border border-gray-300 rounded-md my-2 p-4'
            placeholder='Description'
            name="productDescription"
            onChange={handleChange}
          />
          <input
          
            type="file"
            onChange={handleFileChange}
          />
          <button type="submit">
            {
              loader ? "Please wait...": "Edit"
            }
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditRent;

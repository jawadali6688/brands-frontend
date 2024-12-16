import React, { useState } from 'react';
import '../Styles/EarnWithUsPage.css'; // Create this CSS file for styling
import { Link } from 'react-router-dom'; // Ensure the navbar remains functional
import axios from 'axios';
import { toast } from 'sonner';

function EarnWithUsPage() {
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
      const response = await axios.post(`http://localhost:8000/api/rent/publish`, data, {
        headers: {
          'Content-Type': 'multipart/form-data', // Required for file upload
        },
      });
      console.log(response)
      if (response.status !== 200) throw new Error("something went wrong")
      if (response.status == 201 || response.status == 200) {
        toast.success("Data Posted Successfully!")
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
        <h1>Rent a Closet</h1>
        <form onSubmit={handleSubmit}>
        <input
          value={formData.productName}
            type="text"
            name="productName"
            placeholder="Product Name"
            onChange={handleChange}
          />
          <input
          value={formData.firstName}
            type="text"
            name="firstName"
            placeholder="Your First Name"
            onChange={handleChange}
          />
          <input
          value={formData.lastName}
            type="text"
            name="lastName"
            placeholder="Your Last Name"
            onChange={handleChange}
          />
          <input
          value={formData.contactNumber}
            type="text"
            name="contactNumber"
            placeholder="Contact Number"
            onChange={handleChange}
          />
          <input
          value={formData.email}
            type="email"
            name="email"
            placeholder="Email Address (Optional)"
            onChange={handleChange}
          
          />
          <input
          value={formData.city}
            type="text"
            name="city"
            placeholder="City"
            onChange={handleChange}
          />
          <input
          value={formData.color}
            type="text"
            name="color"
            placeholder="Dress Color"
            onChange={handleChange}
          />
          <input
          value={formData.brand}
            type="text"
            name="brand"
            placeholder="Brand"
            onChange={handleChange}
          />
          <input
          value={formData.price}
            type="number"
            name="price"
            placeholder="Price of Dress"
            onChange={handleChange}
          />
          <input
          value={formData.category}
            type="text"
            name="category"
            placeholder="Category"
            onChange={handleChange}
          />
          <select 
          
          name="size" onChange={handleChange}>
            <option value="">Select Size</option>
            <option value="S">Small</option>
            <option value="M">Medium</option>
            <option value="L">Large</option>
          </select>
          <input
          value={formData.rentalDate}
            type="date"
            name="rentalDate"
            onChange={handleChange}
          />
          <textarea
          value={formData.productDescription}
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
              loader ? "Please wait...": "Submit"
            }
          </button>
        </form>
      </div>
    </div>
  );
}

export default EarnWithUsPage;

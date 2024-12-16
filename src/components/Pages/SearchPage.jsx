import React, { useState } from 'react'; 
import '../Styles/SearchPage.css'; 
import axios from 'axios';
import { Button } from '../ui/button';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

function SearchPage({ searchType }) {
  const navigate = useNavigate()
  const [selectedImage, setSelectedImage] = useState(null);
  const [results, setResults] = useState(null);
  const [searchLoader, setSearchLoader] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [file, setFile] = useState(null)
  const [category, setCategory] = useState('')

  // Search API
  const searchingImagesAPI = async () => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('category',category)
    try {
      if (!category) {
        toast.error("Please select category!")
        return
      }
      if (!file) {
        toast.error("Please upload image first!")
        return
      }
      setSearchLoader(true);
      setErrorMessage('');
      const { data } = await axios.post('http://localhost:8000/api/brands/search_by_image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(data?.relatedImages)
      setResults(data?.relatedImages || []); 
      setFile(null)
      setSelectedImage(null)
    } catch (error) {
      setErrorMessage('Something went wrong. Please try again later.');
      console.error('Error fetching search results:', error);
    } finally {
      setSearchLoader(false);
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
      setFile(file)
    }
  };

  const navigateToDetails = async (product) => {
    const url = product?.imageUrl
    console.log(url, product)
    try {
      const { data } = await axios.post(`http://localhost:8000/api/products/fetch_by_url`, {url})
      console.log(data?.data?._id)
      navigate(`/brand_details/${data?.data?._id}`)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="search-page-container">
      {/* Upload section */}
      <div className="upload-section">
        <select onChange={(e) => setCategory(e.target.value)} className='w-full py-4 px-2 border  rounded-md  my-2 border-gray-300'>
        <option value="">Select Image Category</option>
          <option value="shirt">Shirt</option>
          <option value="Pents">Pants</option>
          <option value="stitched">Stitched</option>
          <option value="unstitched">Unstitched</option>

        </select>
        <label className="upload-label">
          <input type="file" accept="image/*" onChange={handleImageUpload} hidden />
          <div className="upload-box">
            <span>Click to upload or drag and drop</span>
          </div>
        </label>
        {selectedImage && <>
        <Button 
          onClick={() => searchingImagesAPI()}
          className="w-full my-2">Search Result</Button>
          <img src={selectedImage} alt="Input" className="uploaded-image-preview w-40 mx-auto rounded-lg" />
        </>}
        
      </div>

      {/* Loader */}
      {searchLoader && <div class="w-full h-full fixed top-0 left-0 backdrop-blur-lg bg-gray-100  opacity-75 z-50">
  <div class="flex flex-col gap-4 justify-center items-center mt-[50vh]">
    <div class="fas fa-circle-notch fa-spin fa-5x text-gray-900"></div>
    <h1>Searching related images...</h1>
  </div>
</div>}

      {/* Error Message */}
      {errorMessage && <p className="error-message">{errorMessage}</p>}

      {/* Results section */}
      {
        (results?.length > 1) && (
          <h1 className='text-2xl my-2 text-gray-800'>Image Bases Search Result</h1>
        ) 
      }
      {
        (results?.length < 1) && (
          <h1 className='text-2xl my-2 text-gray-800'>No Result Found or Invalid Category</h1>
        ) 
      }
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {results?.map((product) => (
          <div key={product.imageUrl} className="p-4 bg-white shadow rounded-lg">
            <img 
            onClick={() => navigateToDetails(product)}
            src={product.imageUrl} alt={product.title} className="w-full h-60 object-cover mb-4 cursor-pointer" />
            <h3 className="text-lg font-semibold">{product.title}</h3>
            <p className="text-gray-600">{product.description}</p>
            <p className="font-bold text-green-600">PKR {product.price}</p>
            
          </div>
        ))}
      </div>
    </div>
  );
}

export default SearchPage;

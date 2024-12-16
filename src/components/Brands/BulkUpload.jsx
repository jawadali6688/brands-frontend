import React, { useState } from 'react';
import axios from 'axios';
import '../Styles/BulkUpload.css'; // Add your custom styles here

const BulkUpload = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const [file, setFile] = useState(null);

  // Function to handle template download
  const handleDownloadTemplate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      // Simulate template generation process
      setIsGenerating(false);
      window.location.href = '/path-to-template/template.xlsx'; // Change the path to your actual template
    }, 3000); // Mocking a 3-second loading time
  };

  // Function to handle file change event
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', file);

    try {
      await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setUploadStatus('File uploaded successfully. It may take some time to appear on the website.');
    } catch (error) {
      setUploadStatus('Failed to upload the file. Please try again.');
    }
  };

  return (
    <div className="bulk-upload-container">
      <h2>Bulk Add Product</h2>
      <div className="instruction-container">
        <h3> Download and fill in the template</h3>
        <div className="template-section">
          <button onClick={handleDownloadTemplate} className="download-button">Download Advanced Template</button>
          {isGenerating && (
            <div className="loading-indicator">
              <p>Generating template, please wait...</p>
              <div className="loading-spinner"></div>
            </div>
          )}
        </div>
      </div>

      <div className="instruction-container">
        <h3> Upload the completed template</h3>
        <form onSubmit={handleSubmit}>
          <input type="file" onChange={handleFileChange} required />
          <button type="submit" className="upload-button">Upload Template</button>
        </form>
        {uploadStatus && <p className="status-message">{uploadStatus}</p>}
      </div>
    </div>
  );
};

export default BulkUpload;

import React from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    // Here you can add any login logic if required
    navigate('/CreateBrand'); // Navigate to BrandManagement screen
  };

  return (
    <div className='flex items-center justify-center h-screen'>
      {/* A simple button to navigate to BrandManagement */}
      <button
        onClick={handleLogin}
        className='px-6 py-3 bg-blue-500 text-white rounded-md'
      >
        Login
      </button>
    </div>
  );
};

export default Login;

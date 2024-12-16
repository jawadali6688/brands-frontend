import React from 'react';
import Header from './Header';
import Footer from './Footer';

const Layout = ({ children }) => {
  return (
    <div className="page-container">  {/* Use specific class */}
      <Header />
      <div className="content-wrapper">  {/* Content wrapper */}
        {children}
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
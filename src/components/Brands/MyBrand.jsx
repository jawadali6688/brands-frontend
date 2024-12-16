import React, { useEffect, useState } from "react";
import axios from "axios";

const MyBrand = () => {
  const [brand, setBrand] = useState(null);

  useEffect(() => {
    const fetchBrand = async () => {
      try {
        const response = await axios.get("/api/brands/my-brand", { withCredentials: true });
        setBrand(response.data.brand);
      } catch (error) {
        console.error("Error fetching brand:", error);
      }
    };

    fetchBrand();
  }, []);

  if (!brand) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{brand.brandName}</h1>
      <p>Category: {brand.brandCategory}</p>
      {/* Display other brand details */}
    </div>
  );
};

export default MyBrand;

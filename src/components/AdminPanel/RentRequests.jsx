import React, { useState, useEffect } from "react";
import axios from "axios";

const RentRequests = () => {
  const [requests, setRequests] = useState([]);
  const [approvedBrands, setApprovedBrands] = useState([]);

  useEffect(() => {
    const fetchPendingRequests = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/productss"
        );
        console.log(response, 'resp')
        const pending = response.data.filter(data => data?.status === "published")
        console.log(pending)
        setRequests(pending);
      } catch (error) {
        console.error("Error fetching pending requests:", error);
      }
    };

    const fetchApprovedBrands = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/productss");
        const approved = response.data.filter(data => data?.status === "approved")
        setApprovedBrands(approved);
      } catch (error) {
        console.error("Error fetching approved brands:", error);
      }
    };

    fetchPendingRequests();
    fetchApprovedBrands();
  }, []);

  const handleApprove = async (id) => {
    try {
      await axios.post("http://localhost:8000/api/rent/approve", {
        id,
        status: "approved",
      });
      setRequests((prevRequests) =>
        prevRequests.filter((request) => request._id !== id)
      );
      const approvedBrand = requests.find((request) => request._id === id);
      setApprovedBrands((prevApprovedBrands) => [
        ...prevApprovedBrands,
        { ...approvedBrand, status: "approved" },
      ]);
    } catch (error) {
      console.error("Error approving brand:", error);
    }
  };

  const handleDisapprove = async (id) => {
    const reason = prompt("Enter reason for disapproval:");
    if (reason) {
      try {
        await axios.post("http://localhost:8000/api/rent/disapprove", {
          id,
          status: "disapproved",
          reason,
        });
        setRequests((prevRequests) =>
          prevRequests.filter((request) => request._id !== id)
        );
      } catch (error) {
        console.error("Error disapproving brand:", error);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
        Pending Rent Requests
      </h2>

      <div className="overflow-x-auto shadow-lg rounded-lg border border-gray-200">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-6 text-left text-md font-semibold text-gray-700">Product Name</th>
              <th className="py-3 px-6 text-left text-md font-semibold text-gray-700">Color</th>
              <th className="py-3 px-6 text-left text-md font-semibold text-gray-700">User Name</th>
              <th className="py-3 px-6 text-left text-md font-semibold text-gray-700">User Contact</th>
              <th className="py-3 px-6 text-left text-md font-semibold text-gray-700">Price</th>
              <th className="py-3 px-6 text-left text-md font-semibold text-gray-700">Image</th>
              <th className="py-3 px-6 text-left text-md font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.length > 0 ? (
              requests.map((request, index) => (
                <tr key={index} className="border-t hover:bg-gray-50 transition">
                  <td className="py-4 px-6 text-gray-700">{request?.productName || request["Product Name"]}</td>
                  <td className="py-4 px-6 text-gray-700">{request?.color || request?.Color}</td>
                  <td className="py-4 px-6 text-gray-700">{request?.firstName}</td>
                  <td className="py-4 px-6 text-gray-700">{request?.contactNumber}</td>
                  <td className="py-4 px-6 text-gray-700">{request?.Price || request.price}</td>
                  <td className="py-4 px-6">
                    {
                        request?.imagePath ? (
<img
                        src={request?.imagePath}
                        alt="Authentication Document"
                        className="h-16 w-16 object-cover rounded-md shadow-sm border border-gray-300"
                      />
                        ): (
<img
                        src={request["Img Path"]}
                        alt="Authentication Document"
                        className="h-16 w-16 object-cover rounded-md shadow-sm border border-gray-300"
                      />
                        )
                    }
                    
                  </td>
                  <td className="py-4 px-6">
                    <button
                      onClick={() => handleApprove(request._id)}
                      className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition duration-300 mr-2"
                    >
                      ✔
                    </button>
                    <button
                      onClick={() => handleDisapprove(request._id)}
                      className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition duration-300"
                    >
                      ✖
                    </button>
                  </td>
                  {/* <td className="py-4 px-6">
                    <textarea
                      value={request.otherInfo || ""}
                      placeholder="Add description or reason"
                      className="w-full p-2 border rounded-md focus:ring focus:ring-orange-300"
                      disabled
                    />
                  </td> */}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="py-4 px-6 text-center text-gray-500">
                  No Data Available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <h2 className="text-3xl font-bold text-center mt-10 mb-8 text-gray-800">
        Approved Rents
      </h2>
      <div className="overflow-x-auto shadow-lg rounded-lg border border-gray-200">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-6 text-left text-md font-semibold text-gray-700">Product Name</th>
              <th className="py-3 px-6 text-left text-md font-semibold text-gray-700">Color</th>
              <th className="py-3 px-6 text-left text-md font-semibold text-gray-700">User Name</th>
              <th className="py-3 px-6 text-left text-md font-semibold text-gray-700">User Contact</th>
              <th className="py-3 px-6 text-left text-md font-semibold text-gray-700">Price</th>
              <th className="py-3 px-6 text-left text-md font-semibold text-gray-700">Image</th>
            </tr>
          </thead>
          <tbody>
            {approvedBrands.length > 0 ? (
              approvedBrands.map((brand, index) => (
                <tr key={index} className="border-t hover:bg-gray-50 transition">
                  <td className="py-4 px-6 text-gray-700">{brand?.productName || brand["Product Name"]}</td>
                  <td className="py-4 px-6 text-gray-700">{brand?.color || brand?.Color}</td>
                  <td className="py-4 px-6 text-gray-700">{brand?.firstName}</td>
                  <td className="py-4 px-6 text-gray-700">{brand?.contactNumber}</td>
                  <td className="py-4 px-6 text-gray-700">{brand?.Price || brand.price}</td>
                  <td className="py-4 px-6">
                    {
                        brand?.imagePath ? (
<img
                        src={brand?.imagePath}
                        alt="Authentication Document"
                        className="h-16 w-16 object-cover rounded-md shadow-sm border border-gray-300"
                      />
                        ): (
<img
                        src={brand["Img Path"]}
                        alt="Authentication Document"
                        className="h-16 w-16 object-cover rounded-md shadow-sm border border-gray-300"
                      />
                        )
                    }
                    
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="py-4 px-6 text-center text-gray-500">
                  No Approved Rents Yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RentRequests;

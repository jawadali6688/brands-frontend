import React, { useState, useEffect } from "react";
import axios from "axios";

const BrandRequests = () => {
  const [requests, setRequests] = useState([]);
  const [approvedBrands, setApprovedBrands] = useState([]);

  useEffect(() => {
    const fetchPendingRequests = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/brands/pending"
        );
        setRequests(response.data);
      } catch (error) {
        console.error("Error fetching pending requests:", error);
      }
    };

    const fetchApprovedBrands = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/brands");
        setApprovedBrands(response.data);
      } catch (error) {
        console.error("Error fetching approved brands:", error);
      }
    };

    fetchPendingRequests();
    fetchApprovedBrands();
  }, []);

  const handleApprove = async (id) => {
    try {
      await axios.post("http://localhost:8000/api/brands/approve", {
        id,
        status: "Approved",
      });
      setRequests((prevRequests) =>
        prevRequests.filter((request) => request._id !== id)
      );
      const approvedBrand = requests.find((request) => request._id === id);
      setApprovedBrands((prevApprovedBrands) => [
        ...prevApprovedBrands,
        { ...approvedBrand, status: "Approved" },
      ]);
    } catch (error) {
      console.error("Error approving brand:", error);
    }
  };

  const handleDisapprove = async (id) => {
    const reason = prompt("Enter reason for disapproval:");
    if (reason) {
      try {
        await axios.post("http://localhost:8000/api/brands/approve", {
          id,
          status: "Disapproved",
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
        Pending Brand Requests
      </h2>

      <div className="overflow-x-auto shadow-lg rounded-lg border border-gray-200">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-6 text-left text-md font-semibold text-gray-700">Name</th>
              <th className="py-3 px-6 text-left text-md font-semibold text-gray-700">Category</th>
              <th className="py-3 px-6 text-left text-md font-semibold text-gray-700">Authentication Document</th>
              <th className="py-3 px-6 text-left text-md font-semibold text-gray-700">Approve/Not Approve</th>
              <th className="py-3 px-6 text-left text-md font-semibold text-gray-700">Other Info</th>
            </tr>
          </thead>
          <tbody>
            {requests.length > 0 ? (
              requests.map((request, index) => (
                <tr key={index} className="border-t hover:bg-gray-50 transition">
                  <td className="py-4 px-6 text-gray-700">{request.brandName}</td>
                  <td className="py-4 px-6 text-gray-700">{request.brandCategory}</td>
                  <td className="py-4 px-6">
                    {request.brandAuth && (
                      <img
                        src={request.brandAuth}
                        alt="Authentication Document"
                        className="h-16 w-16 object-cover rounded-md shadow-sm border border-gray-300"
                      />
                    )}
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
                  <td className="py-4 px-6">
                    <textarea
                      value={request.otherInfo || ""}
                      placeholder="Add description or reason"
                      className="w-full p-2 border rounded-md focus:ring focus:ring-orange-300"
                      disabled
                    />
                  </td>
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
        Approved Brands
      </h2>
      <div className="overflow-x-auto shadow-lg rounded-lg border border-gray-200">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-6 text-left text-md font-semibold text-gray-700">Name</th>
              <th className="py-3 px-6 text-left text-md font-semibold text-gray-700">Category</th>
              <th className="py-3 px-6 text-left text-md font-semibold text-gray-700">Authentication Document</th>
            </tr>
          </thead>
          <tbody>
            {approvedBrands.length > 0 ? (
              approvedBrands.map((brand, index) => (
                <tr key={index} className="border-t hover:bg-gray-50 transition">
                  <td className="py-4 px-6 text-gray-700">{brand.brandName}</td>
                  <td className="py-4 px-6 text-gray-700">{brand.brandCategory}</td>
                  <td className="py-4 px-6">
                    <img
                      src={brand.brandAuth}
                      alt="Authentication Document"
                      className="h-16 w-16 object-cover rounded-md shadow-sm border border-gray-300"
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="py-4 px-6 text-center text-gray-500">
                  No Approved Brands Yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BrandRequests;

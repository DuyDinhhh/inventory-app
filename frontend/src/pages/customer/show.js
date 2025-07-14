import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import CustomerService from "../../services/customerService";

const CustomerShow = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    (async () => {
      try {
        const data = await CustomerService.show(id);
        setCustomer(data);
      } catch (err) {
        setCustomer(null);
      }
      setLoading(false);
    })();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-6 min-h-[60vh] flex items-center justify-center">
        <div className="text-xl text-center">Loading...</div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="max-w-5xl mx-auto px-6 min-h-[60vh] flex items-center justify-center">
        <div>
          <div className="text-xl text-center">Customer not found.</div>
          <div className="flex justify-center mt-4">
            <button
              onClick={() => navigate(-1)}
              className="bg-blue-100 text-gray-700 font-bold py-2 px-4 rounded border border-blue-200 shadow cursor-pointer"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-5xl mx-auto px-6">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-700 mb-0">
            Customer Details
          </h2>
          <nav className="text-sm text-gray-500 mt-2">
            <Link
              to="/customers"
              className="underline text-blue-600 hover:text-blue-800"
            >
              Customers
            </Link>{" "}
            &gt;{" "}
            <Link
              to={`/customer/show/${id}`}
              className="underline text-blue-600 hover:text-blue-800"
            >
              {customer.name}
            </Link>
          </nav>
        </div>
        <div className="flex flex-col md:flex-row gap-6 flex-wrap">
          {/* Image Card */}
          <div className="w-full max-w-md md:w-1/3 bg-white rounded-xl shadow-lg border border-gray-200 p-5">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">
              Customer Photo
            </h3>
            <img
              className="rounded w-full object-cover max-h-64 mb-2 border border-blue-200 shadow bg-white"
              src={customer.photo || "/assets/img/customers/default.webp"}
              alt={customer.name}
              id="image-preview"
            />
          </div>
          {/* Details Card */}
          <div className="w-full flex-1 min-w-[320px] bg-white rounded-xl shadow-lg border border-gray-200">
            <div className="px-6 py-5 border-b border-blue-200">
              <h3 className="text-lg font-semibold text-gray-700 m-0">
                Customer Details
              </h3>
            </div>
            <div className="p-6 overflow-x-auto">
              <table className="w-full table-auto text-sm text-gray-800">
                <tbody>
                  <tr>
                    <td className="py-2 px-4 font-medium">Name</td>
                    <td className="py-2 px-4">{customer.name}</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 font-medium">Email</td>
                    <td className="py-2 px-4">{customer.email}</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 font-medium">Phone</td>
                    <td className="py-2 px-4">{customer.phone}</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 font-medium">Address</td>
                    <td className="py-2 px-4 whitespace-pre-line">
                      {customer.address}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 font-medium">Account Holder</td>
                    <td className="py-2 px-4">{customer.account_holder}</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 font-medium">Account Number</td>
                    <td className="py-2 px-4">{customer.account_number}</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 font-medium">Bank Name</td>
                    <td className="py-2 px-4">{customer.bank_name}</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 font-medium">Created By</td>
                    <td className="py-2 px-4">
                      {customer.created_by.name ?? "-"}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 font-medium">Updated By</td>
                    <td className="py-2 px-4">
                      {customer.updated_by.name ?? "-"}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 font-medium">Created At</td>
                    <td className="py-2 px-4">
                      {new Date(customer.created_at).toLocaleString()}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 font-medium">Updated At</td>
                    <td className="py-2 px-4">
                      {new Date(customer.updated_at).toLocaleString()}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="flex justify-end gap-2 border-t border-blue-200 px-6 py-5">
              <Link
                to={`/customer/edit/${customer.id}`}
                className="bg-yellow-400 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded flex items-center shadow"
              >
                Edit
              </Link>
              <Link
                to="/customers"
                className="bg-blue-200 hover:bg-blue-300 text-gray-700 font-bold py-2 px-4 rounded flex items-center shadow"
              >
                Cancel
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerShow;

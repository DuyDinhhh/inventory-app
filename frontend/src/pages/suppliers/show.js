import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import SupplierService from "../../services/supplierService"; // You should have this service similar to ProductService

const SupplierShow = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [supplier, setSupplier] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    (async () => {
      try {
        const data = await SupplierService.show(id);
        setSupplier(data);
      } catch (err) {
        setSupplier(null);
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

  if (!supplier) {
    return (
      <div className="max-w-5xl mx-auto px-6 min-h-[60vh] flex items-center justify-center">
        <div>
          <div className="text-xl text-center">Supplier not found.</div>
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
            Supplier Details
          </h2>
          <nav className="text-sm text-gray-500 mt-2">
            <Link
              to="/suppliers"
              className="underline text-blue-600 hover:text-blue-800"
            >
              Suppliers
            </Link>{" "}
            &gt;{" "}
            <Link
              to={`/supplier/show/${id}`}
              className="underline text-blue-600 hover:text-blue-800"
            >
              {supplier.name}
            </Link>
          </nav>
        </div>
        <div className="flex flex-col md:flex-row gap-6 flex-wrap">
          {/* Image Card */}
          <div className="w-full max-w-md md:w-1/3 bg-white rounded-xl shadow-lg border border-gray-200 p-5">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">
              Supplier Photo
            </h3>
            <img
              className="rounded w-full object-cover max-h-64 mb-2 border border-blue-200 shadow bg-white"
              src={supplier.photo || "/assets/img/suppliers/default.webp"}
              alt={supplier.name}
              id="image-preview"
            />
          </div>
          {/* Details Card */}
          <div className="w-full flex-1 min-w-[320px] bg-white rounded-xl shadow-lg border border-gray-200">
            <div className="px-6 py-5 border-b border-blue-200">
              <h3 className="text-lg font-semibold text-gray-700 m-0">
                Supplier Details
              </h3>
            </div>
            <div className="p-6 overflow-x-auto">
              <table className="w-full table-auto text-sm text-gray-800">
                <tbody>
                  <tr>
                    <td className="py-2 px-4 font-medium">Name</td>
                    <td className="py-2 px-4">{supplier.name}</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 font-medium">Shop Name</td>
                    <td className="py-2 px-4">{supplier.shopname}</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 font-medium">Type</td>
                    <td className="py-2 px-4">
                      <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs">
                        {supplier.type}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 font-medium">Email</td>
                    <td className="py-2 px-4">{supplier.email}</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 font-medium">Phone</td>
                    <td className="py-2 px-4">{supplier.phone}</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 font-medium">Address</td>
                    <td className="py-2 px-4 whitespace-pre-line">
                      {supplier.address}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 font-medium">Account Holder</td>
                    <td className="py-2 px-4">{supplier.account_holder}</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 font-medium">Account Number</td>
                    <td className="py-2 px-4">{supplier.account_number}</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 font-medium">Bank Name</td>
                    <td className="py-2 px-4">{supplier.bank_name}</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 font-medium">Created At</td>
                    <td className="py-2 px-4">
                      {new Date(supplier.created_at).toLocaleString()}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 font-medium">Updated At</td>
                    <td className="py-2 px-4">
                      {new Date(supplier.updated_at).toLocaleString()}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="flex justify-end gap-2 border-t border-blue-200 px-6 py-5">
              <Link
                to={`/supplier/edit/${supplier.id}`}
                className="bg-yellow-400 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded flex items-center shadow"
              >
                Edit
              </Link>
              <Link
                to="/suppliers"
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

export default SupplierShow;

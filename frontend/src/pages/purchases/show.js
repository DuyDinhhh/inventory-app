import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import PurchaseService from "../../services/purchaseService";

const PurchaseShow = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [purchase, setPurchase] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    (async () => {
      try {
        const data = await PurchaseService.show(id);
        setPurchase(data);
      } catch (err) {
        setPurchase(null);
      }
      setLoading(false);
    })();
  }, [id]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return `${String(d.getDate()).padStart(2, "0")}-${String(
      d.getMonth() + 1
    ).padStart(2, "0")}-${d.getFullYear()}`;
  };

  const handleApprove = async () => {
    try {
      await PurchaseService.approve(purchase.id);
      navigate("/purchases");
    } catch (error) {
      console.error("Failed to approve purchase:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-xl text-center">Loading...</div>
      </div>
    );
  }

  if (!purchase) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div>
          <div className="text-xl text-center">Purchase not found.</div>
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

  // Single purchase page
  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-5xl mx-auto px-6">
        <div className="bg-white rounded-xl shadow-lg mb-6 border border-gray-200">
          {/* Card Header */}
          <div className="border-b border-gray-200 px-6 py-5 flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-semibold text-gray-700 m-0">
                Purchase Details
              </h3>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/purchases")}
                className="bg-transparent border-0 text-2xl text-gray-400 hover:text-gray-700 cursor-pointer"
                title="Close"
              >
                ×
              </button>
            </div>
          </div>
          {/* Card Body */}
          <div className="p-6 space-y-8">
            {/* 1. Purchase Info */}
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
              <div className="flex flex-wrap gap-6">
                <div className="flex-1 min-w-[180px]">
                  <label className="font-medium mb-1 block text-gray-700">
                    Purchase Date
                  </label>
                  <input
                    type="text"
                    className="w-full border border-blue-200 rounded-md px-3 py-2 bg-white text-base"
                    value={formatDate(purchase.date)}
                    disabled
                  />
                </div>
                <div className="flex-1 min-w-[180px]">
                  <label className="font-medium mb-1 block text-gray-700">
                    Purchase No.
                  </label>
                  <input
                    type="text"
                    className="w-full border border-blue-200 rounded-md px-3 py-2 bg-white text-base"
                    value={purchase.purchase_no}
                    disabled
                  />
                </div>
                <div className="flex-1 min-w-[180px]">
                  <label className="font-medium mb-1 block text-gray-700">
                    Created By
                  </label>
                  <input
                    type="text"
                    className="w-full border border-blue-200 rounded-md px-3 py-2 bg-white text-base"
                    value={purchase.created_by?.name || ""}
                    disabled
                  />
                </div>
                <div className="flex-1 min-w-[180px]">
                  <label className="font-medium mb-1 block text-gray-700">
                    Status
                  </label>
                  <input
                    type="text"
                    className="w-full border border-blue-200 rounded-md px-3 py-2 bg-white text-base"
                    value={
                      purchase.status === 1
                        ? "Approved"
                        : purchase.status === 0
                        ? "Pending"
                        : "Unknown"
                    }
                    disabled
                  />
                </div>
              </div>
            </div>
            {/* 2. Supplier Info */}
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
              <div className="flex flex-wrap gap-6">
                <div className="flex-1 min-w-[180px]">
                  <label className="font-medium mb-1 block text-gray-700">
                    Supplier Name
                  </label>
                  <input
                    type="text"
                    className="w-full border border-blue-200 rounded-md px-3 py-2 bg-white text-base"
                    value={purchase.supplier?.name || ""}
                    disabled
                  />
                </div>
                <div className="flex-1 min-w-[180px]">
                  <label className="font-medium mb-1 block text-gray-700">
                    Email
                  </label>
                  <input
                    type="text"
                    className="w-full border border-blue-200 rounded-md px-3 py-2 bg-white text-base"
                    value={purchase.supplier?.email || ""}
                    disabled
                  />
                </div>
                <div className="flex-1 min-w-[180px]">
                  <label className="font-medium mb-1 block text-gray-700">
                    Phone
                  </label>
                  <input
                    type="text"
                    className="w-full border border-blue-200 rounded-md px-3 py-2 bg-white text-base"
                    value={purchase.supplier?.phone || ""}
                    disabled
                  />
                </div>
                <div className="flex-1 min-w-[180px]">
                  <label className="font-medium mb-1 block text-gray-700">
                    Shop Name
                  </label>
                  <input
                    type="text"
                    className="w-full border border-blue-200 rounded-md px-3 py-2 bg-white text-base"
                    value={purchase.supplier?.shopname || ""}
                    disabled
                  />
                </div>
                <div className="flex-1 min-w-[180px]">
                  <label className="font-medium mb-1 block text-gray-700">
                    Supplier Type
                  </label>
                  <input
                    type="text"
                    className="w-full border border-blue-200 rounded-md px-3 py-2 bg-white text-base"
                    value={purchase.supplier?.type || ""}
                    disabled
                  />
                </div>
                <div className="flex-1 min-w-[180px]">
                  <label className="font-medium mb-1 block text-gray-700">
                    Bank Name
                  </label>
                  <input
                    type="text"
                    className="w-full border border-blue-200 rounded-md px-3 py-2 bg-white text-base"
                    value={purchase.supplier?.bank_name || ""}
                    disabled
                  />
                </div>
                <div className="flex-1 min-w-[180px]">
                  <label className="font-medium mb-1 block text-gray-700">
                    Account Holder
                  </label>
                  <input
                    type="text"
                    className="w-full border border-blue-200 rounded-md px-3 py-2 bg-white text-base"
                    value={purchase.supplier?.account_holder || ""}
                    disabled
                  />
                </div>
                <div className="flex-1 min-w-[180px]">
                  <label className="font-medium mb-1 block text-gray-700">
                    Account Number
                  </label>
                  <input
                    type="text"
                    className="w-full border border-blue-200 rounded-md px-3 py-2 bg-white text-base"
                    value={purchase.supplier?.account_number || ""}
                    disabled
                  />
                </div>
                <div className="flex-1 min-w-[180px]">
                  <label className="font-medium mb-1 block text-gray-700">
                    Address
                  </label>
                  <textarea
                    className="w-full border border-blue-200 rounded-md px-3 py-2 bg-white text-base"
                    value={purchase.supplier?.address || ""}
                    disabled
                  />
                </div>
              </div>
            </div>
            {/* 3. Products Table */}
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-base">
                  <thead className="bg-blue-50">
                    <tr>
                      <th className="py-2 px-3 border-b-2 border-blue-200 text-center font-semibold">
                        No.
                      </th>
                      <th className="py-2 px-3 border-b-2 border-blue-200 text-center font-semibold">
                        Photo
                      </th>
                      <th className="py-2 px-3 border-b-2 border-blue-200 text-center font-semibold">
                        Product Name
                      </th>
                      <th className="py-2 px-3 border-b-2 border-blue-200 text-center font-semibold">
                        Product Code
                      </th>
                      <th className="py-2 px-3 border-b-2 border-blue-200 text-center font-semibold">
                        Current Stock
                      </th>
                      <th className="py-2 px-3 border-b-2 border-blue-200 text-center font-semibold">
                        Quantity
                      </th>
                      <th className="py-2 px-3 border-b-2 border-blue-200 text-center font-semibold">
                        Price
                      </th>
                      <th className="py-2 px-3 border-b-2 border-blue-200 text-center font-semibold">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {purchase.purchase_details &&
                    purchase.purchase_details.length > 0 ? (
                      purchase.purchase_details.map((item, idx) => (
                        <tr key={item.id || idx}>
                          <td className="text-center py-2 px-3 align-middle">
                            {idx + 1}
                          </td>
                          <td className="text-center py-2 px-3 align-middle">
                            <div className="max-w-[80px] max-h-[80px] mx-auto">
                              <img
                                src={
                                  item.product.product_image
                                    ? item.product.product_image
                                    : "/assets/img/products/default.webp"
                                }
                                alt={item.product?.name || ""}
                                className="max-w-[80px] max-h-[80px] rounded object-contain bg-white border border-gray-200 block"
                              />
                            </div>
                          </td>
                          <td className="text-center py-2 px-3 align-middle">
                            {item.product?.name || ""}
                          </td>
                          <td className="text-center py-2 px-3 align-middle">
                            <span className="inline-block bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded text-xs">
                              {item.product?.code || ""}
                            </span>
                          </td>
                          <td className="text-center py-2 px-3 align-middle">
                            <span className="inline-block bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs">
                              {item.product?.quantity}
                            </span>
                          </td>
                          <td className="text-center py-2 px-3 align-middle">
                            <span className="inline-block bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs">
                              {item.quantity}
                            </span>
                          </td>
                          <td className="text-center py-2 px-3 align-middle">
                            {Number(item.unitcost).toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                            })}
                          </td>
                          <td className="text-center py-2 px-3 align-middle">
                            {Number(item.total).toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                            })}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={8} className="text-center py-4">
                          No products.
                        </td>
                      </tr>
                    )}
                    <tr>
                      <td
                        colSpan={7}
                        className="text-right py-2 px-3 font-semibold text-gray-600"
                      >
                        Total
                      </td>
                      <td className="text-center py-2 px-3">
                        {Number(purchase.total_amount).toLocaleString(
                          undefined,
                          {
                            minimumFractionDigits: 2,
                          }
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            {/* End of 3 divs */}
            <div className="flex justify-end gap-2 border-t border-blue-200 px-6 py-5">
              {purchase.status === 0 && (
                <button
                  onClick={handleApprove}
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded flex items-center shadow mr-2"
                >
                  Approve
                </button>
              )}
              <Link
                to="/purchases"
                className="bg-blue-200 hover:bg-blue-300 text-gray-700 font-bold py-2 px-4 rounded flex items-center shadow"
              >
                Back to List
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseShow;

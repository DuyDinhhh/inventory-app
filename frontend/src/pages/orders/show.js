import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import OrderService from "../../services/orderService";
import { toast } from "react-toastify";
const OrderShow = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    (async () => {
      try {
        const data = await OrderService.show(id);
        setOrder(data);
      } catch (err) {
        setOrder(null);
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

  const handleComplete = async () => {
    try {
      const respone = await OrderService.complete(order.id);
      if (respone.status) {
        toast.success("Order completed successfully!", {
          autoClose: 500,
          onClose: () => navigate("/orders"),
        });
      }
    } catch (error) {
      console.error("Failed to complete order:", error);
    }
  };

  const handleCancel = async () => {
    try {
      const respone = await OrderService.cancel(order.id);
      if (respone.status) {
        toast.success("Order canceled successfully!", {
          autoClose: 500,
          onClose: () => navigate("/orders"),
        });
      }
    } catch (error) {
      console.error("Failed to cancel order:", error);
    }
  };

  const handleReturn = async () => {
    try {
      const respone = await OrderService.return(order.id);
      if (respone.status) {
        toast.success("Order returned successfully!", {
          autoClose: 500,
          onClose: () => navigate("/orders"),
        });
      }
    } catch (error) {
      console.error("Failed to return order:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-xl text-center">Loading...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div>
          <div className="text-xl text-center">Order not found.</div>
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

  // Single order page
  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-5xl mx-auto px-6">
        <div className="bg-white rounded-xl shadow-lg mb-6 border border-gray-200">
          {/* Card Header */}
          <div className="border-b border-gray-200 px-6 py-5 flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-semibold text-gray-700 m-0">
                Order Details
              </h3>
            </div>

            <div className="flex items-center gap-4">
              {order.created_by?.name && (
                <div className="flex items-center gap-x-1 text-base text-gray-800">
                  <span className="font-medium text-sm text-gray-700">
                    Created by:
                  </span>
                  <span id="created_by">{order.created_by.name}</span>
                </div>
              )}
              <button
                onClick={() => navigate("/orders")}
                className="bg-transparent border-0 text-2xl text-gray-400 hover:text-gray-700 cursor-pointer"
                title="Close"
              >
                ×
              </button>
            </div>
          </div>
          {/* Card Body */}
          <div className="p-6">
            <div className="flex flex-wrap gap-6 mb-6">
              {/* Order Date */}
              <div className="flex-1 min-w-[180px]">
                <label
                  htmlFor="order_date"
                  className="font-medium mb-1 block text-gray-700"
                >
                  Order Date
                </label>

                <input
                  type="text"
                  id="order_date"
                  className="w-full border border-blue-200 rounded-md px-3 py-2 bg-blue-50 text-base"
                  value={formatDate(order.order_date)}
                  disabled
                />
              </div>
              <div className="flex-1 min-w-[180px]">
                <label
                  htmlFor="invoice_no"
                  className="font-medium mb-1 block text-gray-700"
                >
                  Invoice No.
                </label>
                <input
                  type="text"
                  id="invoice_no"
                  className="w-full border border-blue-200 rounded-md px-3 py-2 bg-blue-50 text-base"
                  value={order.invoice_no}
                  disabled
                />
              </div>
              <div className="flex-1 min-w-[180px]">
                <label
                  htmlFor="customer"
                  className="font-medium mb-1 block text-gray-700"
                >
                  Customer
                </label>
                <input
                  type="text"
                  id="customer"
                  className="w-full border border-blue-200 rounded-md px-3 py-2 bg-blue-50 text-base"
                  value={order.customer?.name || ""}
                  disabled
                />
              </div>

              <div className="flex-1 min-w-[180px]">
                <label
                  htmlFor="payment_type"
                  className="font-medium mb-1 block text-gray-700"
                >
                  Payment Type
                </label>
                <input
                  type="text"
                  id="payment_type"
                  className="w-full border border-blue-200 rounded-md px-3 py-2 bg-blue-50 text-base"
                  value={order.payment_type}
                  disabled
                />
              </div>
            </div>
            {/* Table */}
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
                  {order.details && order.details.length > 0 ? (
                    order.details.map((item, idx) => (
                      <tr key={item.id || idx}>
                        <td className="text-center py-2 px-3 align-middle">
                          {idx + 1}
                        </td>
                        <td className="text-center py-2 px-3 align-middle">
                          <div className="max-w-[80px] max-h-[80px] mx-auto">
                            <img
                              src={
                                item.product?.product_image
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
                          {item.product?.code || ""}
                        </td>
                        <td className="text-center py-2 px-3 align-middle">
                          {item.quantity}
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
                      <td colSpan={7} className="text-center py-4">
                        No products.
                      </td>
                    </tr>
                  )}
                  <tr>
                    <td
                      colSpan={6}
                      className="text-right py-2 px-3 font-semibold text-gray-600"
                    >
                      Payed amount
                    </td>
                    <td className="text-center py-2 px-3">
                      {Number(order.pay).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                      })}
                    </td>
                  </tr>
                  <tr>
                    <td
                      colSpan={6}
                      className="text-right py-2 px-3 font-semibold text-gray-600"
                    >
                      Due
                    </td>
                    <td className="text-center py-2 px-3">
                      {Number(order.due).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                      })}
                    </td>
                  </tr>
                  <tr>
                    <td
                      colSpan={6}
                      className="text-right py-2 px-3 font-semibold text-gray-600"
                    >
                      VAT
                    </td>
                    <td className="text-center py-2 px-3">
                      {Number(order.vat).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                      })}
                    </td>
                  </tr>
                  <tr>
                    <td
                      colSpan={6}
                      className="text-right py-2 px-3 font-semibold text-gray-600"
                    >
                      Total
                    </td>
                    <td className="text-center py-2 px-3">
                      {Number(order.total).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                      })}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="flex justify-end gap-2 border-t border-blue-200 px-6 py-5">
              {order.order_status === 0 && (
                <>
                  <button
                    onClick={handleCancel}
                    className="bg-red-400 hover:bg-red-600 text-white font-bold py-2 px-4 rounded flex items-center shadow"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleComplete}
                    className="bg-green-400 hover:bg-green-600 text-white font-bold py-2 px-4 rounded flex items-center shadow"
                  >
                    Complete
                  </button>
                </>
              )}
              {order.order_status === 1 && (
                <>
                  <button
                    onClick={handleReturn}
                    className="bg-red-400 hover:bg-red-600 text-white font-bold py-2 px-4 rounded flex items-center shadow"
                  >
                    Return
                  </button>
                </>
              )}
              <Link
                to="/orders"
                className="bg-blue-200 hover:bg-blue-300 text-gray-700 font-bold py-2 px-4 rounded flex items-center shadow"
              >
                Back to orders
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderShow;

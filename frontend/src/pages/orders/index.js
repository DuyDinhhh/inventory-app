import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import OrderService from "../../services/orderService";

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await OrderService.index();
        setOrders(data);
      } catch (err) {
        setOrders([]);
      }
      setLoading(false);
    })();
  }, []);

  return (
    <div className="container px-6 mx-auto grid">
      <div className="flex justify-between items-center my-6">
        <h2 className="text-2xl font-semibold text-gray-700">Orders</h2>
        <Link
          to="/orders/create"
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
          <span className="ml-2">Create Order</span>
        </Link>
      </div>
      <div className="w-full overflow-x-auto shadow-lg bg-blue-100 rounded-lg border border-blue-200">
        <table className="w-full whitespace-no-wrap rounded-lg">
          <thead>
            <tr className="text-xs font-semibold tracking-wide text-left text-gray-700 uppercase border-b bg-blue-50">
              <th className="px-4 py-3">Invoice No.</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Payment</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-blue-50 divide-y">
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center py-8">
                  Loading...
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-8">
                  No orders found.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} className="text-gray-800">
                  <td className="px-4 py-3 font-semibold">
                    {order.invoice_no}
                  </td>
                  <td className="px-4 py-3">{order.customer?.name ?? "-"}</td>
                  <td className="px-4 py-3">
                    {order.order_date
                      ? new Date(order.order_date).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="px-4 py-3">{order.payment_type ?? "-"}</td>
                  <td className="px-4 py-3">
                    {order.total
                      ? order.total.toLocaleString(undefined, {
                          style: "currency",
                          currency: "EUR",
                        })
                      : "-"}
                  </td>
                  <td className="px-4 py-3">
                    {order.order_status === 0 && (
                      <span className="px-2 py-1 rounded text-xs font-semibold bg-yellow-100 text-yellow-800">
                        Pending
                      </span>
                    )}
                    {order.order_status === 1 && (
                      <span className="px-2 py-1 rounded text-xs font-semibold bg-green-100 text-green-800">
                        Complete
                      </span>
                    )}
                    {order.order_status === 2 && (
                      <span className="px-2 py-1 rounded text-xs font-semibold bg-red-100 text-red-700">
                        Cancel
                      </span>
                    )}
                    {[0, 1, 2].indexOf(order.order_status) === -1 && "-"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-row items-center gap-2">
                      <Link
                        to={`/orders/show/${order.id}`}
                        className="w-9 h-9 bg-blue-600 text-white hover:bg-blue-700 rounded-md flex items-center justify-center"
                        title="Show"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="w-5 h-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                          />
                        </svg>
                      </Link>
                      <Link
                        to={`/orders/print/${order.id}`}
                        className="w-9 h-9 bg-purple-500 hover:bg-purple-700 text-white rounded-md flex items-center justify-center"
                        title="Print"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="w-5 h-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M7.5 19.5v-3A2.25 2.25 0 0 1 9.75 14.25h4.5a2.25 2.25 0 0 1 2.25 2.25v3"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 9V7.5A2.25 2.25 0 0 1 8.25 5.25h7.5A2.25 2.25 0 0 1 18 7.5V9"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M18 9V7.5A2.25 2.25 0 0 0 15.75 5.25h-7.5A2.25 2.25 0 0 0 6 7.5V9m12 0H6"
                          />
                        </svg>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Order;

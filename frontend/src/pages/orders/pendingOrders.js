import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import OrderService from "../../services/orderService";
import { toast } from "react-toastify";

const PendingOrder = () => {
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // Fetch orders with pagination and search term
  const fetchOrders = async (_page = 1, searchTerm = "") => {
    setLoading(true);
    try {
      let response;

      if (searchTerm) {
        response = await OrderService.search(searchTerm, _page);
      } else {
        response = await OrderService.pendingOrders(_page);
      }
      setOrders(response.data);
      setPagination({
        current_page: response.current_page,
        last_page: response.last_page,
        per_page: response.per_page,
        total: response.total,
        from: response.from,
        to: response.to,
      });
    } catch (err) {
      setOrders([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders(page, isSearching ? searchInput : "");
    // eslint-disable-next-line
  }, [page, isSearching]);

  const handleSearch = async (e) => {
    e.preventDefault();
    setIsSearching(true);
    fetchOrders(1, searchInput);
  };

  const handleResetSearch = async () => {
    setSearchInput("");
    setIsSearching(false);
    fetchOrders(1, "");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;
    try {
      await OrderService.destroy(id);
      setOrders((prev) => prev.filter((item) => item.id !== id));
      toast.success("Order deleted successfully!", { autoClose: 800 });
    } catch (error) {
      console.error("Failed to delete Order:", error);
      toast.error("Error deleting Order. Please try again.");
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= (pagination.last_page || 1)) {
      setPage(newPage);
    }
  };

  // Responsive pagination window
  const getPageNumbers = () => {
    const totalPages = pagination.last_page || 1;
    const maxPagesToShow = 5;
    let start = Math.max(1, page - Math.floor(maxPagesToShow / 2));
    let end = start + maxPagesToShow - 1;
    if (end > totalPages) {
      end = totalPages;
      start = Math.max(1, end - maxPagesToShow + 1);
    }
    const pageNumbers = [];
    for (let i = start; i <= end; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  };

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4">
      {/* Header, search and create order button */}
      <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center my-6">
        <h2 className="text-2xl font-semibold text-gray-700">Pending Orders</h2>
        <form
          onSubmit={handleSearch}
          className="flex flex-col sm:flex-row gap-2 w-full md:w-auto"
        >
          <input
            type="text"
            placeholder="Search by invoice or customer"
            className="border px-3 py-2 rounded w-full sm:w-auto"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded w-full sm:w-auto"
            >
              Search
            </button>
            {isSearching && (
              <button
                type="button"
                onClick={handleResetSearch}
                className="bg-gray-400 text-white px-4 py-2 rounded w-full sm:w-auto"
              >
                Reset
              </button>
            )}
          </div>
        </form>
        <Link
          to="/orders/create"
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded flex items-center justify-center w-full md:w-auto"
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

      {/* Responsive table */}
      <div className="w-full overflow-x-auto shadow-lg bg-blue-100 rounded-lg border border-blue-200">
        <table className="w-full min-w-[650px] whitespace-nowrap rounded-lg">
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
                <td colSpan={7} className="text-center py-8">
                  Loading...
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-8">
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
                          currency: "VND",
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
                      <button
                        onClick={() => handleDelete(order.id)}
                        className="w-9 h-9 bg-red-500 text-white hover:bg-red-700 rounded-md flex items-center justify-center"
                        title="Delete"
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
                            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                          />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex flex-wrap justify-center items-center gap-2 my-4">
        <button
          onClick={() => handlePageChange(page - 1)}
          className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={page <= 1}
        >
          Prev
        </button>
        {getPageNumbers().map((num) => (
          <button
            key={num}
            onClick={() => handlePageChange(num)}
            className={`px-3 py-1 rounded transition ${
              page === num
                ? "bg-blue-500 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {num}
          </button>
        ))}
        <button
          onClick={() => handlePageChange(page + 1)}
          className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={page >= (pagination.last_page || 1)}
        >
          Next
        </button>
      </div>
      <div className="text-center text-gray-600 text-xs">
        Page {pagination.current_page || 1} of {pagination.last_page || 1} |
        Showing {pagination.from || 0}-{pagination.to || 0} of{" "}
        {pagination.total || 0} orders
      </div>
    </div>
  );
};

export default PendingOrder;

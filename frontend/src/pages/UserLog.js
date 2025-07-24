import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import UserService from "../services/userService";

const MAX_PAGES_TO_SHOW = 5;

const ActivityLogs = () => {
  const [logs, setLogs] = useState([]);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0,
    from: 0,
    to: 0,
    first_page_url: "",
  });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const fetchLogs = async (_page = 1, searchTerm = "") => {
    setLoading(true);
    try {
      let response;
      if (searchTerm) {
        response = await UserService.searchLogs(searchTerm, _page);
      } else {
        response = await UserService.log(_page);
      }
      setLogs(Array.isArray(response.data) ? response.data : []);
      setPagination({
        current_page: response.current_page,
        last_page: response.last_page,
        per_page: response.per_page,
        total: response.total,
        from: response.from,
        to: response.to,
        first_page_url: response.first_page_url,
      });
      setPage(_page); // Always sync the page state after fetch
    } catch (err) {
      console.log(err);
      const errorMessage = err.response?.data?.message
        ? err.response.data.message
        : "Error fetching logs";

      // Show the toast with the error message
      toast.error(errorMessage);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLogs(page, isSearching ? search : "");
    // eslint-disable-next-line
  }, [page, isSearching]);

  const handleSearch = (e) => {
    e.preventDefault();
    setIsSearching(true);
    setPage(1);
    fetchLogs(1, search);
  };
  const handleResetSearch = () => {
    setSearch("");
    setIsSearching(false);
    setPage(1);
    fetchLogs(1, "");
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return timestamp;
    return `${date.getHours().toString().padStart(2, "0")}:${date
      .getMinutes()
      .toString()
      .padStart(2, "0")}:${date.getSeconds().toString().padStart(2, "0")} ${date
      .getDate()
      .toString()
      .padStart(2, "0")}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  const renderDetails = (log) => {
    const { details } = log;
    try {
      const parsedDetails = JSON.parse(details);
      if (typeof parsedDetails.changes === "string") {
        return <span>{parsedDetails.changes}</span>;
      }
      if (
        typeof parsedDetails.changes === "object" &&
        parsedDetails.changes !== null &&
        Object.keys(parsedDetails.changes).length > 0
      ) {
        return (
          <div>
            {Object.entries(parsedDetails.changes).map(([field, value]) => {
              if (typeof value === "string") {
                return (
                  <div key={field}>
                    <span>{value}</span>
                  </div>
                );
              }
              return (
                <div key={field}>
                  <span>
                    <strong>
                      {value.product_name ? `${value.product_name} ` : field}:
                    </strong>{" "}
                    <span style={{ color: "#888" }}>
                      {value.old === "" || value.old === null ? (
                        <em>empty</em>
                      ) : (
                        value.old?.toString?.() ?? "-"
                      )}
                    </span>{" "}
                    <span style={{ color: "#555" }}>→</span>{" "}
                    <span style={{ color: "#36a" }}>
                      {value.new === "" || value.new === null ? (
                        <em>empty</em>
                      ) : (
                        value.new?.toString?.() ?? "-"
                      )}
                    </span>
                    {value.changed_amount !== undefined && (
                      <span style={{ color: "#888", marginLeft: 8 }}>
                        (Changed: {value.changed_amount})
                      </span>
                    )}
                  </span>
                </div>
              );
            })}
          </div>
        );
      }
      return <span>No details</span>;
    } catch {
      return (
        <div>
          {details &&
            details
              .toString()
              .split("\n")
              .map((line, idx) => <div key={idx}>{line}</div>)}
        </div>
      );
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.last_page) setPage(newPage);
  };

  // Pagination numbers logic (max MAX_PAGES_TO_SHOW)
  const getPageNumbers = () => {
    const totalPages = pagination.last_page || 1;
    let start = Math.max(1, page - Math.floor(MAX_PAGES_TO_SHOW / 2));
    let end = start + MAX_PAGES_TO_SHOW - 1;
    if (end > totalPages) {
      end = totalPages;
      start = Math.max(1, end - MAX_PAGES_TO_SHOW + 1);
    }
    const pageNumbers = [];
    for (let i = start; i <= end; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  };

  return (
    <div className="container px-6 mx-auto grid">
      <h2 className="text-2xl font-semibold text-gray-700 my-6">
        Activity Logs
      </h2>

      <form
        onSubmit={handleSearch}
        className="flex flex-col sm:flex-row gap-2 w-full md:w-auto mb-4"
      >
        <input
          type="text"
          placeholder="Search by action, user, type, etc."
          className="border px-3 py-2 rounded w-full sm:w-auto"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
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

      <div className="w-full overflow-x-auto shadow-lg rounded-lg border border-blue-200">
        <table className="w-full min-w-[600px] whitespace-nowrap">
          <thead>
            <tr className="text-xs font-semibold tracking-wide text-left text-gray-700 uppercase border-b bg-blue-50">
              <th className="px-4 py-3">Action</th>
              <th className="px-4 py-3">Details</th>
              <th className="px-4 py-3">Time</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">User</th>
            </tr>
          </thead>
          <tbody className="bg-blue-50 divide-y">
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center py-8">
                  Loading...
                </td>
              </tr>
            ) : logs.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-8">
                  No activity logs found.
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id} className="text-gray-800">
                  <td className="px-4 py-3">{log.action}</td>
                  <td className="px-4 py-3">{renderDetails(log)}</td>
                  <td className="px-4 py-3">
                    {formatTimestamp(log.created_at)}
                  </td>
                  <td className="px-4 py-3">
                    {log.loggable_type?.split("\\").pop()}
                  </td>
                  {log.loggable?.name ? (
                    <td className="px-4 py-3">{log.loggable.name}</td>
                  ) : (
                    <td className="px-4 py-3">
                      <em>empty</em>
                    </td>
                  )}
                  <td className="px-4 py-3">{log.user?.username || "-"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-wrap justify-center items-center gap-2 my-4">
        <button
          onClick={() => handlePageChange(pagination.current_page - 1)}
          className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={pagination.current_page <= 1}
        >
          Prev
        </button>
        {getPageNumbers().map((num) => (
          <button
            key={num}
            onClick={() => handlePageChange(num)}
            className={`px-3 py-1 rounded transition ${
              pagination.current_page === num
                ? "bg-blue-500 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {num}
          </button>
        ))}
        <button
          onClick={() => handlePageChange(pagination.current_page + 1)}
          className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={pagination.current_page >= pagination.last_page}
        >
          Next
        </button>
      </div>
      {/* Pagination Info */}
      <div className="text-center text-gray-600 text-xs">
        Page {pagination.current_page} of {pagination.last_page} | Showing{" "}
        {pagination.from}-{pagination.to} of {pagination.total} logs
      </div>
    </div>
  );
};

export default ActivityLogs;

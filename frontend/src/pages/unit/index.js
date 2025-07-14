import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import UnitService from "../../services/unitService";
import { toast } from "react-toastify";

const Unit = () => {
  const [units, setUnits] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // Fetch units with pagination and search
  const fetchUnits = async (_page = 1, searchTerm = "") => {
    setLoading(true);
    try {
      let response;
      if (searchTerm) {
        response = await UnitService.search(searchTerm, _page);
      } else {
        response = await UnitService.index(_page);
      }
      setUnits(response.data);
      setPagination({
        current_page: response.current_page,
        last_page: response.last_page,
        per_page: response.per_page,
        total: response.total,
        from: response.from,
        to: response.to,
      });
      setPage(_page);
    } catch (err) {
      setUnits([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUnits(page, isSearching ? searchInput : "");
    // eslint-disable-next-line
  }, [page, isSearching]);

  // Search handlers
  const handleSearch = async (e) => {
    e.preventDefault();
    setIsSearching(true);
    fetchUnits(1, searchInput);
  };
  const handleResetSearch = async () => {
    setSearchInput("");
    setIsSearching(false);
    fetchUnits(1, "");
  };

  // Pagination controls
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= (pagination.last_page || 1))
      setPage(newPage);
  };

  // Responsive pagination range
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

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this unit?")) return;
    try {
      await UnitService.destroy(id);
      toast.success("Unit deleted successfully!", {
        autoClose: 800,
      });
      fetchUnits(page, isSearching ? searchInput : "");
    } catch (error) {
      console.error("Failed to delete Unit:", error);
      toast.error("Error deleting Unit. Please try again.");
    }
  };

  return (
    <div className="container px-6 mx-auto grid">
      <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center my-6">
        <h2 className="text-2xl font-semibold text-gray-700">Units</h2>
        <form
          onSubmit={handleSearch}
          className="flex flex-col sm:flex-row gap-2 w-full md:w-auto"
        >
          <input
            type="text"
            placeholder="Search by name, slug or short code"
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
          to="/unit/create"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center justify-center w-full md:w-auto"
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
          <span className="ml-2">Create Unit</span>
        </Link>
      </div>
      <div className="w-full overflow-x-auto shadow-lg rounded-lg border border-blue-200">
        <table className="w-full min-w-[600px] whitespace-nowrap">
          <thead>
            <tr className="text-xs font-semibold tracking-wide text-left text-gray-700 uppercase border-b bg-blue-50">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Short Code</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-blue-50 divide-y">
            {loading ? (
              <tr>
                <td colSpan={4} className="text-center py-8">
                  Loading...
                </td>
              </tr>
            ) : units.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-8">
                  No units found.
                </td>
              </tr>
            ) : (
              units.map((unit) => (
                <tr key={unit.id} className="text-gray-800">
                  <td className="px-4 py-3">{unit.name}</td>
                  <td className="px-4 py-3">{unit.slug}</td>
                  <td className="px-4 py-3">{unit.short_code ?? "-"}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-row items-center gap-2">
                      <Link
                        to={`/unit/show/${unit.id}`}
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
                        to={`/unit/edit/${unit.id}`}
                        className="w-9 h-9 bg-yellow-400 hover:bg-yellow-600 text-white rounded-md flex items-center justify-center"
                        title="Edit"
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
                            d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                          />
                        </svg>
                      </Link>
                      <button
                        onClick={() => handleDelete(unit.id)}
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
      {/* Pagination */}
      <div className="flex flex-wrap justify-center items-center gap-2 my-4">
        <button
          onClick={() => handlePageChange((pagination.current_page || 1) - 1)}
          className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={(pagination.current_page || 1) <= 1}
        >
          Prev
        </button>
        {getPageNumbers().map((num) => (
          <button
            key={num}
            onClick={() => handlePageChange(num)}
            className={`px-3 py-1 rounded transition ${
              (pagination.current_page || 1) === num
                ? "bg-blue-500 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {num}
          </button>
        ))}
        <button
          onClick={() => handlePageChange((pagination.current_page || 1) + 1)}
          className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={
            (pagination.current_page || 1) >= (pagination.last_page || 1)
          }
        >
          Next
        </button>
      </div>
      <div className="text-center text-gray-600 text-xs">
        Page {pagination.current_page || 1} of {pagination.last_page || 1} |
        Showing {pagination.from || 0}-{pagination.to || 0} of{" "}
        {pagination.total || 0} units
      </div>
    </div>
  );
};

export default Unit;

import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import PurchaseService from "../../services/purchaseService";
import { toast } from "react-toastify";
import PurchaseImportPreviewModal from "../../components/purchaseImportPreviewModal";

const Purchase = () => {
  const [purchases, setPurchases] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // Import preview states
  const [importFile, setImportFile] = useState(null);
  const [importPreview, setImportPreview] = useState(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const fileInputRef = useRef(null);

  // Fetch purchases (all or search)
  const fetchPurchases = async (_page = 1, searchTerm = "") => {
    setLoading(true);
    try {
      let response;
      if (searchTerm) {
        response = await PurchaseService.search(searchTerm, _page);
      } else {
        response = await PurchaseService.index(_page);
      }
      setPurchases(response.data);
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
      setPurchases([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPurchases(page, isSearching ? searchInput : "");
    // eslint-disable-next-line
  }, [page, isSearching]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= (pagination.last_page || 1)) {
      setPage(newPage);
    }
  };
  const handleSearch = async (e) => {
    e.preventDefault();
    setIsSearching(true);
    fetchPurchases(1, searchInput);
  };

  const handleResetSearch = async () => {
    setSearchInput("");
    setIsSearching(false);
    fetchPurchases(1, "");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this purchase?"))
      return;
    try {
      await PurchaseService.destroy(id);
      setPurchases((prev) => prev.filter((item) => item.id !== id));
      toast.success("Purchase deleted successfully!", {
        autoClose: 800,
      });
    } catch (error) {
      console.error("Failed to delete purchase:", error);
      toast.error("Error deleting purchase. Please try again.");
    }
  };

  // Import: Step 1 - Trigger file input
  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  // Import: Step 2 - Preview
  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImportFile(file);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await PurchaseService.importPreview(formData);
      setImportPreview(response);
      setShowPreviewModal(true);
    } catch (error) {
      toast.error(error?.response?.data?.error || "Failed to preview import.");
    }
  };

  // Import: Step 3 - Confirm
  const handleConfirmImport = async () => {
    if (!importFile) return;
    const formData = new FormData();
    formData.append("file", importFile);

    try {
      const response = await PurchaseService.importConfirm(formData); // POST /purchases/import/confirm
      toast.success(response.message);
      setShowPreviewModal(false);
      setImportPreview(null);
      setImportFile(null);
      fetchPurchases(page, isSearching ? searchInput : "");
    } catch (error) {
      toast.error(
        error?.response?.data?.error || "Failed to import purchases."
      );
    }
  };

  const renderStatus = (status) => {
    switch (status) {
      case 0:
        return (
          <span className="px-2 py-1 rounded text-xs font-semibold bg-yellow-100 text-yellow-800">
            Pending
          </span>
        );
      case 1:
        return (
          <span className="px-2 py-1 rounded text-xs font-semibold bg-green-100 text-green-800">
            Approved
          </span>
        );
      default:
        return "-";
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
      <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center my-6">
        <h2 className="text-2xl font-semibold text-gray-700">Purchases</h2>
        <form
          onSubmit={handleSearch}
          className="flex flex-col sm:flex-row gap-2 w-full md:w-auto"
        >
          <input
            type="text"
            placeholder="Search by purchase no. or supplier"
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
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <button
            onClick={handleImportClick}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded flex items-center justify-center w-full sm:w-auto"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 16v-8m0 8l-4-4m4 4l4-4M4 12v7a2 2 0 002 2h12a2 2 0 002-2v-7M12 4v4"
              />
            </svg>
            <span className="ml-2">Import</span>
            <input
              ref={fileInputRef}
              type="file"
              accept=".xls,.xlsx"
              style={{ display: "none" }}
              onChange={handleImport}
            />
          </button>

          <Link
            to="/purchase/create"
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
            <span className="ml-2">Create Purchase</span>
          </Link>
        </div>
      </div>
      <div className="w-full overflow-x-auto shadow-lg rounded-lg border border-blue-200 bg-blue-100">
        <table className="w-full min-w-[650px] whitespace-nowrap">
          <thead>
            <tr className="text-xs font-semibold tracking-wide text-left text-gray-700 uppercase border-b bg-blue-50">
              <th className="px-4 py-3">Purchase No.</th>
              <th className="px-4 py-3">Supplier</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody className="bg-blue-50 divide-y">
            {loading ? (
              <tr>
                <td colSpan={7} className="text-center py-8">
                  Loading...
                </td>
              </tr>
            ) : purchases.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-8">
                  No purchases found.
                </td>
              </tr>
            ) : (
              purchases.map((purchase, idx) => (
                <tr key={purchase.id} className="text-gray-800">
                  <td className="px-4 py-3 font-semibold">
                    {purchase.purchase_no}
                  </td>
                  <td className="px-4 py-3">
                    {purchase.supplier?.name ?? "-"}
                  </td>
                  <td className="px-4 py-3">
                    {purchase.date
                      ? new Date(purchase.date).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="px-4 py-3">
                    {purchase.total_amount?.toLocaleString(undefined, {
                      style: "currency",
                      currency: "VND",
                    })}
                  </td>
                  <td className="px-4 py-3">{renderStatus(purchase.status)}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-row items-center gap-2">
                      <Link
                        to={`/purchase/show/${purchase.id}`}
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
                        onClick={() => handleDelete(purchase.id)}
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
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
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
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={page >= (pagination.last_page || 1)}
        >
          Next
        </button>
      </div>
      <div className="text-center text-gray-600 text-xs">
        Page {pagination.current_page || 1} of {pagination.last_page || 1} |
        Showing {pagination.from || 0}-{pagination.to || 0} of{" "}
        {pagination.total || 0} purchases
      </div>

      {/* Import Preview Modal */}
      <PurchaseImportPreviewModal
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        onConfirm={handleConfirmImport}
        importPreview={importPreview}
      />
      {/* Hidden file input for import */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".xls,.xlsx"
        style={{ display: "none" }}
        onChange={handleImport}
      />
    </div>
  );
};

export default Purchase;

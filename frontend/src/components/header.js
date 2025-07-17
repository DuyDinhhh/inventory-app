import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { toast } from "react-toastify";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isPagesMenuOpen, setIsPagesMenuOpen] = useState(false);
  const [isSettingMenuOpen, setIsSettingMenuOpen] = useState(false);
  const [isOrderMenuOpen, setIsOrderMenuOpen] = useState(false);
  const [isPurchaseMenuOpen, setIsPurchaseMenuOpen] = useState(false);

  const { user, setUser } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  const orderRef = useRef(null);
  const purchaseRef = useRef(null);
  const playlistsRef = useRef(null);
  const deviceRef = useRef(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        setUser(null);
      }
    }
  }, [setUser]);

  // Close dropdowns if clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        playlistsRef.current &&
        !playlistsRef.current.contains(event.target)
      ) {
        setIsPagesMenuOpen(false);
      }
      if (deviceRef.current && !deviceRef.current.contains(event.target)) {
        setIsSettingMenuOpen(false);
      }
      if (orderRef.current && !orderRef.current.contains(event.target)) {
        setIsOrderMenuOpen(false);
      }
      if (purchaseRef.current && !purchaseRef.current.contains(event.target)) {
        setIsPurchaseMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside, true);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside, true);
    };
  }, []);

  // If switching route, close everything
  useEffect(() => {
    setMobileMenuOpen(false);
    setIsPagesMenuOpen(false);
    setIsSettingMenuOpen(false);
    setIsOrderMenuOpen(false);
    setIsPurchaseMenuOpen(false);
  }, [location.pathname]);

  // If one dropdown opens, close the others
  const handlePlaylistsToggle = () => {
    setIsPagesMenuOpen((open) => {
      if (!open) {
        setIsSettingMenuOpen(false);
        setIsOrderMenuOpen(false);
        setIsPurchaseMenuOpen(false);
      }
      return !open;
    });
  };
  const handleDeviceToggle = () => {
    setIsSettingMenuOpen((open) => {
      if (!open) {
        setIsPagesMenuOpen(false);
        setIsOrderMenuOpen(false);
        setIsPurchaseMenuOpen(false);
      }
      return !open;
    });
  };
  const handleOrderToggle = () => {
    setIsOrderMenuOpen((open) => {
      if (!open) {
        setIsPagesMenuOpen(false);
        setIsSettingMenuOpen(false);
        setIsPurchaseMenuOpen(false);
      }
      return !open;
    });
  };
  const handlePurchaseToggle = () => {
    setIsPurchaseMenuOpen((open) => {
      if (!open) {
        setIsPagesMenuOpen(false);
        setIsSettingMenuOpen(false);
        setIsOrderMenuOpen(false);
      }
      return !open;
    });
  };

  const isActive = (path) =>
    location.pathname.toLowerCase().startsWith(path.toLowerCase());

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logout successfully!", {
      autoClose: 700,
      onClose: () => navigate("/login"),
    });
  };

  return (
    <header className="z-10 pt-2 bg-white shadow-md">
      {/* Brand and Auth, responsive */}
      <div className="container px-6 mx-auto border-b border-gray-200 text-black flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <div className="flex items-center justify-between w-full md:w-auto">
          <Link to="/" className="text-lg font-bold text-black">
            PullLight
          </Link>
        </div>
        <div className="flex items-center justify-end space-x-3 mb-1 w-full md:w-auto">
          {user ? (
            <>
              <span className="text-sm font-semibold text-gray-700">
                Hi, {user.name || user.username || "User"}
              </span>
              <button
                onClick={handleLogout}
                className="px-4 py-1 text-base rounded bg-red-600 text-white font-semibold hover:bg-red-700 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-1 text-lg rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-1 text-base rounded border border-blue-600 text-blue-600 font-semibold hover:bg-blue-50 transition"
              >
                Register
              </Link>
            </>
          )}
          <button
            className="md:hidden p-2 rounded focus:outline-none focus:shadow-outline-blue"
            aria-label="Menu"
            onClick={() => setMobileMenuOpen((v) => !v)}
          >
            <svg
              className="w-6 h-6 text-black"
              aria-hidden="true"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>
      {/* Main nav */}
      <div className="px-6 py-1 text-black">
        {/* Desktop Nav */}
        <nav className="hidden md:flex justify-center items-center space-x-4">
          <Link
            to="/dashboards"
            className={`inline-flex items-center px-3 py-2 rounded text-base font-semibold transition-colors duration-150 ${
              isActive("/dashboards")
                ? "bg-blue-100 text-blue-800"
                : "hover:bg-blue-50 hover:text-blue-900"
            }`}
          >
            {/* Dashboard Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-6 text-black"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
              />
            </svg>
            <span className="ml-1">Dashboard</span>
          </Link>
          <Link
            to="/products"
            className={`inline-flex items-center px-3 py-2 rounded text-base font-semibold transition-colors duration-150 ${
              isActive("/products")
                ? "bg-blue-100 text-blue-800"
                : "hover:bg-blue-50 hover:text-blue-900"
            }`}
          >
            {/* Products Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-6 text-black"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.429 9.75 2.25 12l4.179 2.25m0-4.5 5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0 4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0-5.571 3-5.571-3"
              />
            </svg>
            <span className="ml-1">Products</span>
          </Link>
          {/* Orders Dropdown */}
          <div className="relative" ref={orderRef}>
            <button
              type="button"
              className={`inline-flex items-center px-3 py-2 rounded text-base font-semibold transition-colors duration-150 ${
                isActive("/orders") ||
                isActive("/pendingOrders") ||
                isActive("/completeOrders")
                  ? "bg-blue-100 text-blue-800"
                  : "hover:bg-blue-50 hover:text-blue-900"
              }`}
              onClick={handleOrderToggle}
            >
              {/* Orders Icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-6 text-black"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                />
              </svg>
              <span className="ml-1">Orders</span>
              <svg
                className={`w-4 h-4 ml-1 transition-transform ${
                  isOrderMenuOpen ? "rotate-180" : ""
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </button>
            {isOrderMenuOpen && (
              <div className="absolute left-0 mt-2 w-44 rounded-md shadow-lg bg-white z-50">
                <ul className="py-1">
                  <li>
                    <Link
                      to="/orders"
                      className={`block px-4 py-2 text-base hover:bg-blue-50 hover:text-blue-700 ${
                        isActive("/orders") &&
                        !isActive("/pendingOrders") &&
                        !isActive("/completeOrders")
                          ? "font-semibold text-blue-600"
                          : ""
                      }`}
                    >
                      All
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/completeOrders"
                      className={`block px-4 py-2 text-base hover:bg-blue-50 hover:text-blue-700 ${
                        isActive("/completeOrders")
                          ? "font-semibold text-blue-600"
                          : ""
                      }`}
                    >
                      Completed
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/pendingOrders"
                      className={`block px-4 py-2 text-base hover:bg-blue-50 hover:text-blue-700 ${
                        isActive("/pendingOrders")
                          ? "font-semibold text-blue-600"
                          : ""
                      }`}
                    >
                      Pending
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/returnOrders"
                      className={`block px-4 py-2 text-base hover:bg-blue-50 hover:text-blue-700 ${
                        isActive("/returnOrders")
                          ? "font-semibold text-blue-600"
                          : ""
                      }`}
                    >
                      Return
                    </Link>
                  </li>
                </ul>
              </div>
            )}
          </div>
          {/* Purchases Dropdown */}
          <div className="relative" ref={purchaseRef}>
            <button
              type="button"
              className={`inline-flex items-center px-3 py-2 rounded text-base font-semibold transition-colors duration-150 ${
                isActive("/purchases") ||
                isActive("/pendingPurchases") ||
                isActive("/approvePurchases")
                  ? "bg-blue-100 text-blue-800"
                  : "hover:bg-blue-50 hover:text-blue-900"
              }`}
              onClick={handlePurchaseToggle}
            >
              {/* Purchases Icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-6 text-black"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                />
              </svg>
              <span className="ml-1">Purchases</span>
              <svg
                className={`w-4 h-4 ml-1 transition-transform ${
                  isPurchaseMenuOpen ? "rotate-180" : ""
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </button>
            {isPurchaseMenuOpen && (
              <div className="absolute left-0 mt-2 w-44 rounded-md shadow-lg bg-white z-50">
                <ul className="py-1">
                  <li>
                    <Link
                      to="/purchases"
                      className={`block px-4 py-2 text-base hover:bg-blue-50 hover:text-blue-700 ${
                        isActive("/purchases") &&
                        !isActive("/pendingPurchases") &&
                        !isActive("/approvePurchases")
                          ? "font-semibold text-blue-600"
                          : ""
                      }`}
                    >
                      All
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/approvePurchases"
                      className={`block px-4 py-2 text-base hover:bg-blue-50 hover:text-blue-700 ${
                        isActive("/approvePurchases")
                          ? "font-semibold text-blue-600"
                          : ""
                      }`}
                    >
                      Approved
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/pendingPurchases"
                      className={`block px-4 py-2 text-base hover:bg-blue-50 hover:text-blue-700 ${
                        isActive("/pendingPurchases")
                          ? "font-semibold text-blue-600"
                          : ""
                      }`}
                    >
                      Pending
                    </Link>
                  </li>
                </ul>
              </div>
            )}
          </div>
          {/* Pages Dropdown */}
          <div className="relative" ref={playlistsRef}>
            <button
              type="button"
              className="inline-flex items-center px-3 py-2 rounded text-base font-semibold hover:bg-blue-50 transition focus:outline-none"
              aria-haspopup="true"
              aria-expanded={isPagesMenuOpen ? "true" : "false"}
              onClick={handlePlaylistsToggle}
            >
              <span className="ml-1">Pages</span>
              <svg
                className={`w-4 h-4 ml-1 transition-transform ${
                  isPagesMenuOpen ? "rotate-180" : ""
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </button>
            {isPagesMenuOpen && (
              <div className="absolute left-0 mt-2 w-44 rounded-md shadow-lg bg-white z-50">
                <ul className="py-1">
                  <li>
                    <Link
                      to="/suppliers"
                      className="block px-4 py-2 text-base hover:bg-blue-50 hover:text-blue-700"
                    >
                      Suppliers
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/customers"
                      className="block px-4 py-2 text-base hover:bg-blue-50 hover:text-blue-700"
                    >
                      Customers
                    </Link>
                  </li>
                </ul>
              </div>
            )}
          </div>
          {/* Settings Dropdown */}
          <div className="relative" ref={deviceRef}>
            <button
              type="button"
              className="inline-flex items-center px-3 py-2 rounded text-base font-semibold hover:bg-blue-50 transition focus:outline-none"
              aria-haspopup="true"
              aria-expanded={isSettingMenuOpen ? "true" : "false"}
              onClick={handleDeviceToggle}
            >
              <span className="ml-1">Settings</span>
              <svg
                className={`w-4 h-4 ml-1 transition-transform ${
                  isSettingMenuOpen ? "rotate-180" : ""
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </button>
            {isSettingMenuOpen && (
              <div className="absolute left-0 mt-2 w-52 rounded-md shadow-lg bg-white z-50">
                <ul className="py-1">
                  <li>
                    <Link
                      to="/users"
                      className="block px-4 py-2 text-base hover:bg-blue-50 hover:text-blue-700"
                    >
                      Users
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/categories"
                      className="block px-4 py-2 text-base hover:bg-blue-50 hover:text-blue-700"
                    >
                      Categories
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/units"
                      className="block px-4 py-2 text-base hover:bg-blue-50 hover:text-blue-700"
                    >
                      Units
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/log"
                      className="block px-4 py-2 text-base hover:bg-blue-50 hover:text-blue-700"
                    >
                      Logs
                    </Link>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </nav>
      </div>

      {/* Mobile Nav Dropdown */}
      {mobileMenuOpen && (
        <nav className="md:hidden bg-white px-6 pb-4 space-y-1 text-black">
          <Link
            to="/dashboards"
            className={`block px-3 py-2 rounded text-base font-semibold transition-colors duration-150 ${
              isActive("/dashboards")
                ? "bg-blue-100 text-blue-800"
                : "hover:bg-blue-50 hover:text-blue-900"
            }`}
            onClick={() => setMobileMenuOpen(false)}
          >
            Dashboard
          </Link>
          <Link
            to="/products"
            className={`block px-3 py-2 rounded text-base font-semibold transition-colors duration-150 ${
              isActive("/products")
                ? "bg-blue-100 text-blue-800"
                : "hover:bg-blue-50 hover:text-blue-900"
            }`}
            onClick={() => setMobileMenuOpen(false)}
          >
            Products
          </Link>
          {/* Orders Mobile Dropdown */}
          <div ref={orderRef}>
            <button
              className="flex items-center w-full px-3 py-2 rounded text-base font-semibold transition-colors duration-150 hover:bg-blue-50"
              onClick={handleOrderToggle}
            >
              Orders
              <svg
                className={`w-4 h-4 ml-2 transition-transform duration-200 ${
                  isOrderMenuOpen ? "rotate-180" : ""
                }`}
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </button>
            {isOrderMenuOpen && (
              <ul className="pl-4">
                <li>
                  <Link
                    to="/orders"
                    className={`block px-4 py-2 text-base font-medium hover:bg-blue-50 hover:text-blue-700 ${
                      isActive("/orders") &&
                      !isActive("/pendingOrders") &&
                      !isActive("/completeOrders")
                        ? "font-semibold text-blue-600"
                        : ""
                    }`}
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setIsOrderMenuOpen(false);
                    }}
                  >
                    All
                  </Link>
                </li>
                <li>
                  <Link
                    to="/completeOrders"
                    className={`block px-4 py-2 text-base font-medium hover:bg-blue-50 hover:text-blue-700 ${
                      isActive("/completeOrders")
                        ? "font-semibold text-blue-600"
                        : ""
                    }`}
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setIsOrderMenuOpen(false);
                    }}
                  >
                    Completed
                  </Link>
                </li>
                <li>
                  <Link
                    to="/pendingOrders"
                    className={`block px-4 py-2 text-base font-medium hover:bg-blue-50 hover:text-blue-700 ${
                      isActive("/pendingOrders")
                        ? "font-semibold text-blue-600"
                        : ""
                    }`}
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setIsOrderMenuOpen(false);
                    }}
                  >
                    Pending
                  </Link>
                </li>
                <li>
                  <Link
                    to="/returnOrders"
                    className={`block px-4 py-2 text-base font-medium hover:bg-blue-50 hover:text-blue-700 ${
                      isActive("/returnOrders")
                        ? "font-semibold text-blue-600"
                        : ""
                    }`}
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setIsOrderMenuOpen(false);
                    }}
                  >
                    Return
                  </Link>
                </li>
              </ul>
            )}
          </div>

          {/* Purchases Mobile Dropdown */}
          <div ref={purchaseRef}>
            <button
              className="flex items-center w-full px-3 py-2 rounded text-base font-semibold transition-colors duration-150 hover:bg-blue-50"
              onClick={handlePurchaseToggle}
            >
              Purchases
              <svg
                className={`w-4 h-4 ml-2 transition-transform duration-200 ${
                  isPurchaseMenuOpen ? "rotate-180" : ""
                }`}
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </button>
            {isPurchaseMenuOpen && (
              <ul className="pl-4">
                <li>
                  <Link
                    to="/purchases"
                    className={`block px-4 py-2 text-base font-medium hover:bg-blue-50 hover:text-blue-700 ${
                      isActive("/purchases") &&
                      !isActive("/pendingPurchases") &&
                      !isActive("/approvePurchases")
                        ? "font-semibold text-blue-600"
                        : ""
                    }`}
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setIsPurchaseMenuOpen(false);
                    }}
                  >
                    All
                  </Link>
                </li>
                <li>
                  <Link
                    to="/approvePurchases"
                    className={`block px-4 py-2 text-base font-medium hover:bg-blue-50 hover:text-blue-700 ${
                      isActive("/approvePurchases")
                        ? "font-semibold text-blue-600"
                        : ""
                    }`}
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setIsPurchaseMenuOpen(false);
                    }}
                  >
                    Approved
                  </Link>
                </li>
                <li>
                  <Link
                    to="/pendingPurchases"
                    className={`block px-4 py-2 text-base font-medium hover:bg-blue-50 hover:text-blue-700 ${
                      isActive("/pendingPurchases")
                        ? "font-semibold text-blue-600"
                        : ""
                    }`}
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setIsPurchaseMenuOpen(false);
                    }}
                  >
                    Pending
                  </Link>
                </li>
              </ul>
            )}
          </div>
          {/* <Link
            to="/quotations"
            className={`block px-3 py-2 rounded text-base font-semibold transition-colors duration-150 ${
              isActive("/quotations")
                ? "bg-blue-100 text-blue-800"
                : "hover:bg-blue-50 hover:text-blue-900"
            }`}
            onClick={() => setMobileMenuOpen(false)}
          >
            Quotations
          </Link> */}
          {/* Pages Dropdown */}
          <div ref={playlistsRef}>
            <button
              className="flex items-center w-full px-3 py-2 rounded text-base font-semibold transition-colors duration-150 hover:bg-blue-50"
              onClick={handlePlaylistsToggle}
            >
              Pages
              <svg
                className={`w-4 h-4 ml-2 transition-transform duration-200 ${
                  isPagesMenuOpen ? "rotate-180" : ""
                }`}
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </button>
            {isPagesMenuOpen && (
              <ul className="pl-4">
                <li>
                  <Link
                    to="/suppliers"
                    className="block px-4 py-2 text-base font-medium hover:bg-blue-50 hover:text-blue-700"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setIsPagesMenuOpen(false);
                    }}
                  >
                    Suppliers
                  </Link>
                </li>
                <li>
                  <Link
                    to="/customers"
                    className="block px-4 py-2 text-base font-medium hover:bg-blue-50 hover:text-blue-700"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setIsPagesMenuOpen(false);
                    }}
                  >
                    Customers
                  </Link>
                </li>
              </ul>
            )}
          </div>
          {/* Settings Dropdown */}
          <div ref={deviceRef}>
            <button
              className="flex items-center w-full px-3 py-2 rounded text-base font-semibold transition-colors duration-150 hover:bg-blue-50"
              onClick={handleDeviceToggle}
            >
              Settings
              <svg
                className={`w-4 h-4 ml-2 transition-transform duration-200 ${
                  isSettingMenuOpen ? "rotate-180" : ""
                }`}
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </button>
            {isSettingMenuOpen && (
              <ul className="pl-4">
                <li>
                  <Link
                    to="/users"
                    className="block px-4 py-2 text-base font-medium hover:bg-blue-50 hover:text-blue-700"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setIsSettingMenuOpen(false);
                    }}
                  >
                    Users
                  </Link>
                </li>
                <li>
                  <Link
                    to="/categories"
                    className="block px-4 py-2 text-base font-medium hover:bg-blue-50 hover:text-blue-700"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setIsSettingMenuOpen(false);
                    }}
                  >
                    Categories
                  </Link>
                </li>
                <li>
                  <Link
                    to="/units"
                    className="block px-4 py-2 text-base font-medium hover:bg-blue-50 hover:text-blue-700"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setIsSettingMenuOpen(false);
                    }}
                  >
                    Units
                  </Link>
                </li>
                <li>
                  <Link
                    to="/log"
                    className="block px-4 py-2 text-base font-medium hover:bg-blue-50 hover:text-blue-700"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setIsSettingMenuOpen(false);
                    }}
                  >
                    Logs
                  </Link>
                </li>
              </ul>
            )}
          </div>
        </nav>
      )}
    </header>
  );
};

export default Header;

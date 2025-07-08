import React, { useEffect, useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import SupplierService from "../../services/supplierService";
import ProductService from "../../services/productService";
import PurchaseService from "../../services/purchaseService";
import { toast } from "react-toastify";

const todayStr = () => new Date().toISOString().slice(0, 10);

const PurchaseCreate = () => {
  const navigate = useNavigate();

  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [form, setForm] = useState({
    date: todayStr(),
    supplier_id: "",
    purchase_no: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState("");

  // Product search & dropdown
  const [productSearch, setProductSearch] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const searchRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([SupplierService.index(), ProductService.index()])
      .then(([suppRes, prodRes]) => {
        setSuppliers(suppRes.data || suppRes);
        setProducts(prodRes.data || prodRes);
        setFilteredProducts(prodRes.data || prodRes);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!productSearch) {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(
        products.filter(
          (p) =>
            p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
            (p.code &&
              p.code.toLowerCase().includes(productSearch.toLowerCase()))
        )
      );
    }
  }, [productSearch, products]);

  // Dropdown close on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        searchRef.current &&
        !searchRef.current.contains(event.target)
      ) {
        setDropdownOpen(false);
      }
    };
    if (dropdownOpen) {
      window.addEventListener("mousedown", handleClickOutside);
    }
    return () => window.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen]);

  const handleChange = (e) => {
    setForm((f) => ({
      ...f,
      [e.target.name]: e.target.value,
    }));
  };

  const handleAddProduct = (product) => {
    if (cart.some((item) => item.product.id === product.id)) return;
    setCart((c) => [
      ...c,
      {
        product,
        quantity: 1,
        unitcost: product.buying_price || 0,
        total: product.buying_price || 0,
      },
    ]);
    setAlert("");
    setDropdownOpen(false);
    setProductSearch("");
  };

  const handleCartChange = (idx, field, value) => {
    setCart((cartItems) =>
      cartItems.map((item, i) => {
        if (i !== idx) return item;
        const newVal =
          field === "quantity" ? Math.max(1, Number(value)) : Number(value);
        let subtotal =
          field === "unitcost"
            ? item.quantity * newVal
            : field === "quantity"
            ? newVal * item.unitcost
            : item.quantity * item.unitcost;
        return {
          ...item,
          [field]: newVal,
          total: subtotal,
        };
      })
    );
  };

  const handleRemoveCart = (idx) => {
    setCart((cartItems) => cartItems.filter((_, i) => i !== idx));
  };

  // Totals
  const grandTotal = cart.reduce(
    (acc, item) => acc + item.quantity * item.unitcost,
    0
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrors({});
    if (cart.length === 0) {
      setAlert("Please search & select products!");
      setSaving(false);
      return;
    }
    try {
      const payload = {
        date: form.date,
        supplier_id: form.supplier_id,
        purchase_no: form.purchase_no,
        total_amount: grandTotal,
        products: cart.map((item) => ({
          product_id: item.product.id,
          quantity: item.quantity,
          unitcost: item.unitcost,
          total: item.total,
        })),
      };
      const res = await PurchaseService.store(payload);
      console.log(res);
      if (res && (res.success || res.status === "ok")) {
        toast.success("Purchase created successfully!", {
          autoClose: 700,
          onClose: () => navigate("/purchases"),
        });
      } else {
        setErrors({ general: "Failed to create purchase" });
      }
    } catch (err) {
      setErrors(
        err.response?.data?.errors || { general: "Failed to create purchase" }
      );
    }
    setSaving(false);
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-5xl mx-auto px-6">
        {/* Alert */}
        {alert && (
          <div className="mb-4">
            <div className="bg-yellow-100 border-l-4 border-yellow-400 text-yellow-700 p-4 rounded">
              {alert}
            </div>
          </div>
        )}
        {errors.general && (
          <div className="mb-4">
            <div className="bg-red-100 border-l-4 border-red-400 text-red-700 p-4 rounded">
              {errors.general}
            </div>
          </div>
        )}
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-700">
            Create Purchase
          </h2>
          <nav className="text-sm text-gray-500 mt-2">
            <Link
              to="/purchases"
              className="underline text-blue-600 hover:text-blue-800"
            >
              Purchases
            </Link>{" "}
            &gt; Create
          </nav>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 mb-6">
            <div className="border-b border-gray-200 px-6 py-5 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-700 m-0">
                Purchase Information
              </h3>
              <div>
                <button
                  type="button"
                  onClick={() => navigate("/purchases")}
                  className="bg-transparent border-0 text-2xl text-gray-400 hover:text-gray-700 cursor-pointer"
                  title="Close"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="p-6 flex flex-wrap gap-6">
              <div className="flex-1 min-w-[180px]">
                <label className="font-medium block mb-1 text-gray-700">
                  Purchase Date
                </label>
                <input
                  name="date"
                  type="date"
                  className="w-full border border-blue-200 rounded-md px-3 py-2 bg-blue-50 text-base"
                  value={form.date}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="flex-1 min-w-[180px]">
                <label className="font-medium block mb-1 text-gray-700">
                  Supplier
                </label>
                <select
                  name="supplier_id"
                  className="w-full border border-blue-200 rounded-md px-3 py-2 bg-blue-50 text-base"
                  value={form.supplier_id}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Supplier</option>
                  {suppliers.map((supp) => (
                    <option key={supp.id} value={supp.id}>
                      {supp.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex-1 min-w-[180px]">
                <label className="font-medium block mb-1 text-gray-700">
                  Purchase No.
                </label>
                <input
                  type="text"
                  name="purchase_no"
                  className="w-full border border-blue-200 rounded-md px-3 py-2 bg-blue-50 text-base"
                  value={form.purchase_no}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          {/* Product Add Section */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 mb-6 p-6">
            <div className="flex flex-col md:flex-row md:items-end gap-4 mb-4 relative">
              <div className="flex-1">
                <label className="font-medium block mb-1 text-gray-700">
                  Search/Add Product
                </label>
                <div className="relative" ref={dropdownRef}>
                  <input
                    type="text"
                    className="w-full border border-blue-200 rounded-md px-3 py-2 bg-blue-50 text-base"
                    value={productSearch}
                    onChange={(e) => {
                      setProductSearch(e.target.value);
                      setDropdownOpen(true);
                    }}
                    placeholder="Type product name or code..."
                    autoComplete="off"
                    onFocus={() => setDropdownOpen(true)}
                    ref={searchRef}
                  />
                  {/* Dropdown */}
                  {dropdownOpen && (
                    <div className="absolute mt-1 left-0 w-full bg-white border border-gray-200 rounded shadow z-10 max-h-56 overflow-y-auto">
                      {filteredProducts.length === 0 ? (
                        <div className="px-4 py-2 text-gray-500">
                          No products found
                        </div>
                      ) : (
                        filteredProducts.slice(0, 15).map((prod) => (
                          <div
                            key={prod.id}
                            className="px-4 py-2 hover:bg-blue-100 cursor-pointer flex justify-between items-center"
                            onClick={() => handleAddProduct(prod)}
                          >
                            <span>
                              {prod.name}{" "}
                              <span className="text-xs text-gray-500">
                                ({prod.code})
                              </span>
                            </span>
                            <span className="text-xs text-gray-500">
                              {prod.quantity} {prod.unit?.short_code || ""}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
            {/* Cart Table */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-base">
                <thead className="bg-blue-50">
                  <tr>
                    <th className="py-2 px-3 border-b-2 border-blue-200 text-center font-semibold">
                      Product
                    </th>
                    <th className="py-2 px-3 border-b-2 border-blue-200 text-center font-semibold">
                      Net Unit Cost
                    </th>
                    <th className="py-2 px-3 border-b-2 border-blue-200 text-center font-semibold">
                      Stock
                    </th>
                    <th className="py-2 px-3 border-b-2 border-blue-200 text-center font-semibold">
                      Quantity
                    </th>
                    <th className="py-2 px-3 border-b-2 border-blue-200 text-center font-semibold">
                      Sub Total
                    </th>
                    <th className="py-2 px-3 border-b-2 border-blue-200 text-center font-semibold">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {cart.length > 0 ? (
                    cart.map((item, idx) => (
                      <tr key={item.product.id}>
                        <td className="align-middle">
                          {item.product.name}
                          <br />
                          <span className="inline-block bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs">
                            {item.product.code}
                          </span>
                        </td>
                        <td className="align-middle text-center">
                          <input
                            type="number"
                            className="border border-blue-200 rounded px-2 py-1 w-24 text-center"
                            value={item.unitcost}
                            min={0}
                            onChange={(e) =>
                              handleCartChange(idx, "unitcost", e.target.value)
                            }
                          />
                        </td>
                        <td className="align-middle text-center">
                          <span className="inline-block bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs">
                            {item.product.quantity}{" "}
                            {item.product.unit?.short_code || ""}
                          </span>
                        </td>
                        <td className="align-middle text-center">
                          <input
                            type="number"
                            min={1}
                            className="border border-blue-200 rounded px-2 py-1 w-16 text-center"
                            value={item.quantity}
                            onChange={(e) =>
                              handleCartChange(idx, "quantity", e.target.value)
                            }
                          />
                        </td>
                        <td className="align-middle text-center">
                          {(item.quantity * item.unitcost).toLocaleString(
                            undefined,
                            { minimumFractionDigits: 2 }
                          )}
                        </td>
                        <td className="align-middle text-center">
                          <button
                            type="button"
                            onClick={() => handleRemoveCart(idx)}
                            className="text-red-500 hover:text-red-700 font-bold px-2"
                            title="Remove"
                          >
                            ×
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="text-center py-4">
                        <span className="text-red-600">
                          Please search & select products!
                        </span>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          {/* Totals Section */}
          <div className="flex flex-col md:flex-row justify-end gap-6 mb-6">
            <div className="w-full md:w-1/3">
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4">
                <table className="w-full table-auto text-base">
                  <tbody>
                    <tr>
                      <th className="text-left">Grand Total</th>
                      <th className="text-right">
                        (=){" "}
                        {grandTotal.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                        })}
                      </th>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          {/* Submit */}
          <div className="text-end">
            <button
              type="submit"
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-8 rounded shadow"
            >
              {saving ? "Creating..." : "Create Purchase"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PurchaseCreate;

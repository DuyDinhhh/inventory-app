import React, { useEffect, useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import OrderService from "../../services/orderService";
import CustomerService from "../../services/customerService";
import ProductService from "../../services/productService";
import { toast } from "react-toastify";

const todayStr = () => new Date().toISOString().slice(0, 10);

const OrderCreate = () => {
  const navigate = useNavigate();

  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [form, setForm] = useState({
    date: todayStr(),
    customer_id: "",
    reference: "ORDR",
    tax_percentage: 0,
    discount_percentage: 0,
    shipping_amount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState("");

  // For product search & dropdown
  const [productSearch, setProductSearch] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const searchRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([CustomerService.index(), ProductService.list()])
      .then(([custRes, prodRes]) => {
        setCustomers(custRes.data || custRes);
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
        price: product.selling_price || 0,
        discount: 0,
        tax: 0,
        total: product.selling_price || 0,
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
          (field === "price"
            ? item.quantity * newVal
            : field === "quantity"
            ? newVal * item.price
            : item.quantity * item.price) -
          (field === "discount" ? newVal : item.discount) +
          (field === "tax" ? newVal : item.tax);
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
  const subTotal = cart.reduce(
    (acc, item) => acc + item.quantity * item.price,
    0
  );
  const totalDiscount = cart.reduce(
    (acc, item) => acc + Number(item.discount || 0),
    0
  );
  const totalTax = cart.reduce((acc, item) => acc + Number(item.tax || 0), 0);

  const globalTax = Number(form.tax_percentage) || 0;
  const globalDiscount = Number(form.discount_percentage) || 0;
  const shipping = Number(form.shipping_amount) || 0;

  const taxAmount = ((subTotal - totalDiscount) * globalTax) / 100 + totalTax;
  const discountAmount = (subTotal * globalDiscount) / 100 + totalDiscount;
  const grandTotal = subTotal - discountAmount + taxAmount + shipping;

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
        customer_id: form.customer_id,
        reference: form.reference,
        products: cart.map((item) => ({
          product_id: item.product.id,
          quantity: item.quantity,
          price: item.price,
          discount: item.discount || 0,
          tax: item.tax || 0,
        })),
        tax_percentage: globalTax,
        discount_percentage: globalDiscount,
        shipping_amount: shipping,
        total_amount: grandTotal,
      };
      const res = await OrderService.store(payload);
      if (
        (res && res.success) ||
        (res && res.status && res.status.toLowerCase() === "ok") ||
        res === "ok"
      ) {
        toast.success("Order created successfully!", {
          autoClose: 700,
          onClose: () => navigate("/orders"),
        });
      } else {
        setErrors({ general: "Failed to create order" });
      }
    } catch (err) {
      setErrors(
        err.response?.data?.errors || { general: "Failed to create order" }
      );
    }
    setSaving(false);
  };
  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-6 min-h-[60vh] flex items-center justify-center">
        <div className="text-xl text-center">Loading...</div>
      </div>
    );
  }
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
          <h2 className="text-2xl font-semibold text-gray-700">Create Order</h2>
          <nav className="text-sm text-gray-500 mt-2">
            <Link
              to="/orders"
              className="underline text-blue-600 hover:text-blue-800"
            >
              Orders
            </Link>{" "}
            &gt; Create
          </nav>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 mb-6">
            <div className="border-b border-gray-200 px-6 py-5 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-700 m-0">
                Order Information
              </h3>
              <div>
                <button
                  type="button"
                  onClick={() => navigate("/orders")}
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
                  Order Date
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
                  Customer
                </label>
                <select
                  name="customer_id"
                  className="w-full border border-blue-200 rounded-md px-3 py-2 bg-blue-50 text-base"
                  value={form.customer_id}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Customer</option>
                  {customers.map((cust) => (
                    <option key={cust.id} value={cust.id}>
                      {cust.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex-1 min-w-[180px]">
                <label className="font-medium block mb-1 text-gray-700">
                  Reference
                </label>
                <input
                  type="text"
                  name="reference"
                  className="w-full border border-blue-200 rounded-md px-3 py-2 bg-blue-50 text-base"
                  value={form.reference}
                  readOnly
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
                      Net Unit Price
                    </th>
                    <th className="py-2 px-3 border-b-2 border-blue-200 text-center font-semibold">
                      Stock
                    </th>
                    <th className="py-2 px-3 border-b-2 border-blue-200 text-center font-semibold">
                      Quantity
                    </th>
                    <th className="py-2 px-3 border-b-2 border-blue-200 text-center font-semibold">
                      Discount
                    </th>
                    <th className="py-2 px-3 border-b-2 border-blue-200 text-center font-semibold">
                      Tax
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
                            value={item.price}
                            min={0}
                            onChange={(e) =>
                              handleCartChange(idx, "price", e.target.value)
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
                          <input
                            type="number"
                            min={0}
                            className="border border-blue-200 rounded px-2 py-1 w-16 text-center"
                            value={item.discount}
                            onChange={(e) =>
                              handleCartChange(idx, "discount", e.target.value)
                            }
                          />
                        </td>
                        <td className="align-middle text-center">
                          <input
                            type="number"
                            min={0}
                            className="border border-blue-200 rounded px-2 py-1 w-16 text-center"
                            value={item.tax}
                            onChange={(e) =>
                              handleCartChange(idx, "tax", e.target.value)
                            }
                          />
                        </td>
                        <td className="align-middle text-center">
                          {(
                            item.quantity * item.price -
                            (item.discount || 0) +
                            (item.tax || 0)
                          ).toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                          })}
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
                      <td colSpan={8} className="text-center py-4">
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
          {/* Global Tax, Discount, Shipping */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex-1 min-w-[150px]">
              <label className="block mb-1 text-sm font-semibold text-gray-700">
                Tax (%)
              </label>
              <input
                type="number"
                name="tax_percentage"
                min={0}
                max={100}
                value={form.tax_percentage}
                onChange={handleChange}
                className="form-input w-full rounded-md border border-blue-200 bg-blue-50"
                required
              />
            </div>
            <div className="flex-1 min-w-[150px]">
              <label className="block mb-1 text-sm font-semibold text-gray-700">
                Discount (%)
              </label>
              <input
                type="number"
                name="discount_percentage"
                min={0}
                max={100}
                value={form.discount_percentage}
                onChange={handleChange}
                className="form-input w-full rounded-md border border-blue-200 bg-blue-50"
                required
              />
            </div>
            <div className="flex-1 min-w-[150px]">
              <label className="block mb-1 text-sm font-semibold text-gray-700">
                Shipping
              </label>
              <input
                type="number"
                name="shipping_amount"
                min={0}
                step={0.01}
                value={form.shipping_amount}
                onChange={handleChange}
                className="form-input w-full rounded-md border border-blue-200 bg-blue-50"
                required
              />
            </div>
          </div>
          {/* Totals Section */}
          <div className="flex flex-col md:flex-row justify-end gap-6 mb-6">
            <div className="w-full md:w-1/3">
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4">
                <table className="w-full table-auto text-base">
                  <tbody>
                    <tr>
                      <th className="text-left">Tax ({globalTax}%)</th>
                      <td className="text-right">
                        (+){" "}
                        {taxAmount.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                        })}
                      </td>
                    </tr>
                    <tr>
                      <th className="text-left">
                        Discount ({globalDiscount}%)
                      </th>
                      <td className="text-right">
                        (-){" "}
                        {discountAmount.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                        })}
                      </td>
                    </tr>
                    <tr>
                      <th className="text-left">Shipping</th>
                      <td className="text-right">
                        (+){" "}
                        {shipping.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                        })}
                      </td>
                    </tr>
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
              {saving ? "Creating..." : "Create Invoice"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrderCreate;

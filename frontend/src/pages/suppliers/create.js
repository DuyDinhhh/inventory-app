import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import SupplierService from "../../services/supplierService";
import { toast } from "react-toastify";

const SupplierCreate = () => {
  const navigate = useNavigate();

  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    shopname: "",
    type: "",
    account_holder: "",
    account_number: "",
    bank_name: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(
    "/assets/img/suppliers/default.webp"
  );

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "photo" && files && files[0]) {
      setImageFile(files[0]);
      setImagePreview(URL.createObjectURL(files[0]));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSaving(true);

    try {
      const submitData = new FormData();
      Object.entries(form).forEach(([key, val]) => {
        submitData.append(key, val);
      });
      if (imageFile) {
        submitData.append("photo", imageFile);
      }

      const response = await SupplierService.store(submitData);
      if (
        (response && response.success) ||
        (response &&
          response.status &&
          response.status.toLowerCase() === "ok") ||
        response === "ok"
      ) {
        toast.success("Supplier created successfully!", {
          autoClose: 700,
          onClose: () => navigate("/suppliers"),
        });
      } else {
        setErrors({
          general: "Supplier creation failed.",
        });
      }
    } catch (err) {
      setErrors(
        err.response?.data?.errors || { general: "Failed to create supplier." }
      );
    }
    setSaving(false);
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-5xl mx-auto px-6">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-700">
            Create Supplier
          </h2>
          <nav className="text-sm text-gray-500 mt-2">
            <Link
              to="/suppliers"
              className="underline text-blue-600 hover:text-blue-800"
            >
              Suppliers
            </Link>{" "}
            &gt; Create
          </nav>
        </div>
        <div className="flex flex-col md:flex-row gap-6 flex-wrap">
          {/* Left: Image */}
          <div className="w-full max-w-md md:w-1/3 bg-white rounded-xl shadow-lg border border-gray-200 p-5 flex flex-col">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">
              Supplier Photo
            </h3>
            <div className="w-full flex justify-center items-center">
              <img
                className="rounded object-contain mb-2 border border-blue-200 shadow bg-white max-h-64"
                style={{
                  width: "auto",
                  maxWidth: "100%",
                  height: "auto",
                  maxHeight: "16rem",
                }}
                src={imagePreview}
                alt={form.name}
                id="supplier_photo"
              />
            </div>
            <input
              type="file"
              name="photo"
              accept="image/*"
              className="block mt-2"
              onChange={handleChange}
            />
            {errors.photo && (
              <div className="text-red-500 text-xs mt-1">{errors.photo}</div>
            )}
          </div>
          {/* Right: Details Form */}
          <div className="w-full flex-1 min-w-[320px] bg-white rounded-xl shadow-lg border border-gray-200">
            <form onSubmit={handleSubmit} className="" autoComplete="off">
              <div className="px-6 py-5 border-b border-blue-200">
                <h3 className="text-lg font-semibold text-gray-700 m-0">
                  Supplier Details
                </h3>
              </div>
              <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 font-semibold text-sm">
                    Name
                  </label>
                  <input
                    className="form-input w-full p-1 rounded-md border border-blue-200 bg-blue-50"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                  />
                  {errors.name && (
                    <div className="text-red-500 text-xs">{errors.name}</div>
                  )}
                </div>
                <div>
                  <label className="block mb-1 font-semibold text-sm">
                    Email
                  </label>
                  <input
                    type="email"
                    className="form-input w-full p-1 rounded-md border border-blue-200 bg-blue-50"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                  />
                  {errors.email && (
                    <div className="text-red-500 text-xs">{errors.email}</div>
                  )}
                </div>
                <div>
                  <label className="block mb-1 font-semibold text-sm">
                    Phone
                  </label>
                  <input
                    className="form-input w-full p-1 rounded-md border border-blue-200 bg-blue-50"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                  />
                  {errors.phone && (
                    <div className="text-red-500 text-xs">{errors.phone}</div>
                  )}
                </div>
                <div>
                  <label className="block mb-1 font-semibold text-sm">
                    Shop Name
                  </label>
                  <input
                    className="form-input w-full p-1 rounded-md border border-blue-200 bg-blue-50"
                    name="shopname"
                    value={form.shopname}
                    onChange={handleChange}
                  />
                  {errors.shopname && (
                    <div className="text-red-500 text-xs">
                      {errors.shopname}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block mb-1 font-semibold text-sm">
                    Type
                  </label>
                  <select
                    className="form-input w-full p-1 rounded-md border border-blue-200 bg-blue-50"
                    name="type"
                    value={form.type}
                    onChange={handleChange}
                  >
                    <option value="">Select type</option>
                    <option value="producer">Producer</option>
                    <option value="wholesaler">Wholesaler</option>
                    <option value="retailer">Retailer</option>
                  </select>
                  {errors.type && (
                    <div className="text-red-500 text-xs">{errors.type}</div>
                  )}
                </div>

                <div>
                  <label className="block mb-1 font-semibold text-sm">
                    Account Holder
                  </label>
                  <input
                    className="form-input w-full p-1 rounded-md border border-blue-200 bg-blue-50"
                    name="account_holder"
                    value={form.account_holder}
                    onChange={handleChange}
                  />
                  {errors.account_holder && (
                    <div className="text-red-500 text-xs">
                      {errors.account_holder}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block mb-1 font-semibold text-sm">
                    Account Number
                  </label>
                  <input
                    className="form-input w-full p-1 rounded-md border border-blue-200 bg-blue-50"
                    name="account_number"
                    value={form.account_number}
                    onChange={handleChange}
                  />
                  {errors.account_number && (
                    <div className="text-red-500 text-xs">
                      {errors.account_number}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block mb-1 font-semibold text-sm">
                    Bank Name
                  </label>
                  <input
                    className="form-input w-full p-1 rounded-md border border-blue-200 bg-blue-50"
                    name="bank_name"
                    value={form.bank_name}
                    onChange={handleChange}
                  />
                  {errors.bank_name && (
                    <div className="text-red-500 text-xs">
                      {errors.bank_name}
                    </div>
                  )}
                </div>
                <div className="sm:col-span-2">
                  <label className="block mb-1 font-semibold text-sm">
                    Address
                  </label>
                  <textarea
                    className="form-input w-full p-1 rounded-md border border-blue-200 bg-blue-50"
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    rows={2}
                  />
                  {errors.address && (
                    <div className="text-red-500 text-xs">{errors.address}</div>
                  )}
                </div>
              </div>
              {errors.general && (
                <div className="px-6 text-red-500 text-sm">
                  {errors.general}
                </div>
              )}
              <div className="flex justify-end gap-2 border-t border-blue-200 px-6 py-5">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-yellow-400 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded flex items-center shadow"
                >
                  {saving ? "Saving..." : "Save"}
                </button>
                <Link
                  to="/suppliers"
                  className="bg-blue-200 hover:bg-blue-300 text-gray-700 font-bold py-2 px-4 rounded flex items-center shadow"
                >
                  Cancel
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplierCreate;

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import CategoryService from "../../services/categoryService";
import { toast } from "react-toastify";

const CategoryCreate = () => {
  const navigate = useNavigate();

  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    name: "",
    short_code: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSaving(true);

    try {
      const response = await CategoryService.store(form);
      if (
        (response && response.success) ||
        (response &&
          response.status &&
          response.status.toLowerCase() === "ok") ||
        response === "ok"
      ) {
        toast.success("Category created successfully!", {
          autoClose: 700,
          onClose: () => navigate("/categories"),
        });
      } else {
        setErrors({
          general: "Category creation failed.",
        });
      }
    } catch (err) {
      setErrors(
        err.response?.data?.errors || { general: "Failed to create category." }
      );
    }
    setSaving(false);
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-3xl mx-auto px-6">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-700">
            Create Category
          </h2>
          <nav className="text-sm text-gray-500 mt-2">
            <Link
              to="/categories"
              className="underline text-blue-600 hover:text-blue-800"
            >
              Categories
            </Link>{" "}
            &gt; Create
          </nav>
        </div>
        <div className="bg-white rounded-xl shadow-lg border border-gray-200">
          <form onSubmit={handleSubmit} className="p-6" autoComplete="off">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 font-semibold text-sm">Name</label>
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
                  Short Code
                </label>
                <input
                  className="form-input w-full p-1 rounded-md border border-blue-200 bg-blue-50"
                  name="short_code"
                  value={form.short_code}
                  onChange={handleChange}
                />
                {errors.short_code && (
                  <div className="text-red-500 text-xs">
                    {errors.short_code}
                  </div>
                )}
              </div>
            </div>
            {errors.general && (
              <div className="pt-2 text-red-500 text-sm">{errors.general}</div>
            )}
            <div className="flex justify-end gap-2 border-t border-blue-200 mt-6 pt-5">
              <button
                type="submit"
                disabled={saving}
                className="bg-yellow-400 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded flex items-center shadow"
              >
                {saving ? "Saving..." : "Save"}
              </button>
              <Link
                to="/categories"
                className="bg-blue-200 hover:bg-blue-300 text-gray-700 font-bold py-2 px-4 rounded flex items-center shadow"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CategoryCreate;

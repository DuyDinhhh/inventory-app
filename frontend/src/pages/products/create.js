import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import ProductService from "../../services/productService";
import CategoryService from "../../services/categoryService";
import UnitService from "../../services/unitService";
import { toast } from "react-toastify";

const ProductCreate = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    name: "",
    code: "",
    category_id: "",
    unit_id: "",
    quantity_alert: "",
    buying_price: "",
    selling_price: "",
    tax: "",
    tax_type: 0,
    notes: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(
    "/assets/img/products/default.webp"
  );

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const [cats, uns] = await Promise.all([
          CategoryService.index(),
          UnitService.index(),
        ]);
        setCategories(cats.data || cats);
        setUnits(uns.data || uns);
      } catch (err) {}
      setLoading(false);
    })();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "product_image" && files && files[0]) {
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
        submitData.append("product_image", imageFile);
      }

      const response = await ProductService.store(submitData);
      if (
        (response && response.success) ||
        (response &&
          response.status &&
          response.status.toLowerCase() === "ok") ||
        response === "ok"
      ) {
        toast.success("Product created successfully!", {
          autoClose: 700,
          onClose: () => navigate("/products"),
        });
      } else {
        setErrors({
          general: "Product creation failed.",
        });
      }
    } catch (err) {
      setErrors(
        err.response?.data?.errors || { general: "Failed to create product." }
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
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-700">
            Create Product
          </h2>
          <nav className="text-sm text-gray-500 mt-2">
            <Link
              to="/products"
              className="underline text-blue-600 hover:text-blue-800"
            >
              Products
            </Link>{" "}
            &gt; Create
          </nav>
        </div>
        <div className="flex flex-col md:flex-row gap-6 flex-wrap">
          {/* Left: Image */}
          <div className="w-full max-w-md md:w-1/3 bg-white rounded-xl shadow-lg border border-gray-200 p-5 flex flex-col">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">
              Product Image
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
                id="product_image"
              />
            </div>
            <input
              type="file"
              name="product_image"
              accept="image/*"
              className="block mt-2"
              onChange={handleChange}
            />
            {errors.product_image && (
              <div className="text-red-500 text-xs mt-1">
                {errors.product_image}
              </div>
            )}
          </div>
          {/* Right: Details Form */}
          <div className="w-full flex-1 min-w-[320px] bg-white rounded-xl shadow-lg border border-gray-200">
            <form onSubmit={handleSubmit} className="" autoComplete="off">
              <div className="px-6 py-5 border-b border-blue-200">
                <h3 className="text-lg font-semibold text-gray-700 m-0">
                  Product Details
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
                    Code
                  </label>
                  <input
                    className="form-input p-1 w-full rounded-md border border-blue-200 bg-blue-50"
                    name="code"
                    value={form.code}
                    onChange={handleChange}
                  />
                  {errors.code && (
                    <div className="text-red-500 text-xs">{errors.code}</div>
                  )}
                </div>
                <div>
                  <label className="block mb-1 font-semibold text-sm">
                    Category
                  </label>
                  <select
                    className="form-input w-full p-1 rounded-md border border-blue-200 bg-blue-50"
                    name="category_id"
                    value={form.category_id}
                    onChange={handleChange}
                  >
                    <option value="">Select category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  {errors.category_id && (
                    <div className="text-red-500 text-xs">
                      {errors.category_id}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block mb-1 font-semibold text-sm">
                    Unit
                  </label>
                  <select
                    className="form-input w-full p-1 rounded-md border border-blue-200 bg-blue-50"
                    name="unit_id"
                    value={form.unit_id}
                    onChange={handleChange}
                  >
                    <option value="">Select unit</option>
                    {units.map((unit) => (
                      <option key={unit.id} value={unit.id}>
                        {unit.short_code || unit.name}
                      </option>
                    ))}
                  </select>
                  {errors.unit_id && (
                    <div className="text-red-500 text-xs">{errors.unit_id}</div>
                  )}
                </div>

                <div>
                  <label className="block mb-1 font-semibold text-sm">
                    Quantity Alert
                  </label>
                  <input
                    type="number"
                    className="form-input w-full p-1 rounded-md border border-blue-200 bg-blue-50"
                    name="quantity_alert"
                    value={form.quantity_alert}
                    onChange={handleChange}
                  />
                  {errors.quantity_alert && (
                    <div className="text-red-500 text-xs">
                      {errors.quantity_alert}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block mb-1 font-semibold text-sm">
                    Buying Price
                  </label>
                  <input
                    type="number"
                    className="form-input w-full p-1 rounded-md border border-blue-200 bg-blue-50"
                    name="buying_price"
                    value={form.buying_price}
                    onChange={handleChange}
                  />
                  {errors.buying_price && (
                    <div className="text-red-500 text-xs">
                      {errors.buying_price}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block mb-1 font-semibold text-sm">
                    Selling Price
                  </label>
                  <input
                    type="number"
                    className="form-input w-full p-1 rounded-md border border-blue-200 bg-blue-50"
                    name="selling_price"
                    value={form.selling_price}
                    onChange={handleChange}
                  />
                  {errors.selling_price && (
                    <div className="text-red-500 text-xs">
                      {errors.selling_price}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block mb-1 font-semibold text-sm">
                    Tax (%)
                  </label>
                  <input
                    type="number"
                    className="form-input w-full p-1 rounded-md border border-blue-200 bg-blue-50"
                    name="tax"
                    value={form.tax}
                    onChange={handleChange}
                  />
                  {errors.tax && (
                    <div className="text-red-500 text-xs">{errors.tax}</div>
                  )}
                </div>
                <div>
                  <label className="block mb-1 font-semibold text-sm">
                    Tax Type
                  </label>
                  <select
                    className="form-input w-full p-1 rounded-md border border-blue-200 bg-blue-50"
                    name="tax_type"
                    value={form.tax_type}
                    onChange={handleChange}
                  >
                    <option value={0}>Exclusive</option>
                    <option value={1}>Inclusive</option>
                  </select>
                  {errors.tax_type && (
                    <div className="text-red-500 text-xs">
                      {errors.tax_type}
                    </div>
                  )}
                </div>
                <div className="sm:col-span-2">
                  <label className="block mb-1 font-semibold text-sm">
                    Notes
                  </label>
                  <textarea
                    className="form-input w-full p-1 rounded-md border border-blue-200 bg-blue-50"
                    name="notes"
                    value={form.notes}
                    onChange={handleChange}
                    rows={2}
                  />
                  {errors.notes && (
                    <div className="text-red-500 text-xs">{errors.notes}</div>
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
                  to="/products"
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

export default ProductCreate;

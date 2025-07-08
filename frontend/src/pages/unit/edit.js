import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import UnitService from "../../services/unitService";
import { toast } from "react-toastify";

const UnitEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [unit, setUnit] = useState(null);
  const [form, setForm] = useState({
    name: "",
    short_code: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await UnitService.show(id);
        setUnit(data);
        setForm({
          name: data.name || "",
          short_code: data.short_code || "",
        });
      } catch (err) {
        setUnit(null);
      }
      setLoading(false);
    })();
  }, [id]);

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
      const response = await UnitService.update(id, form);
      if (
        (response && response.success) ||
        (response &&
          response.status &&
          response.status.toLowerCase() === "ok") ||
        response === "ok"
      ) {
        toast.success("Unit updated successfully!", {
          autoClose: 700,
          onClose: () => navigate(`/unit/show/${id}`),
        });
      } else {
        setErrors({ general: "Unit update failed." });
      }
    } catch (err) {
      setErrors(
        err.response?.data?.errors || { general: "Failed to update unit." }
      );
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-6 min-h-[60vh] flex items-center justify-center">
        <div className="text-xl text-center">Loading...</div>
      </div>
    );
  }

  if (!unit) {
    return (
      <div className="max-w-3xl mx-auto px-6 min-h-[60vh] flex items-center justify-center">
        <div>
          <div className="text-xl text-center">Unit not found.</div>
          <div className="flex justify-center mt-4">
            <button
              onClick={() => navigate(-1)}
              className="bg-blue-100 text-gray-700 font-bold py-2 px-4 rounded border border-blue-200 shadow cursor-pointer"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-3xl mx-auto px-6">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-700">Edit Unit</h2>
          <nav className="text-sm text-gray-500 mt-2">
            <Link
              to="/units"
              className="underline text-blue-600 hover:text-blue-800"
            >
              Units
            </Link>{" "}
            &gt;{" "}
            <Link
              to={`/unit/show/${id}`}
              className="underline text-blue-600 hover:text-blue-800"
            >
              {unit.name}
            </Link>{" "}
            &gt; Edit
          </nav>
        </div>
        <div className="bg-white rounded-xl shadow-lg border border-gray-200">
          <form onSubmit={handleSubmit} autoComplete="off">
            <div className="px-6 py-5 border-b border-blue-200">
              <h3 className="text-lg font-semibold text-gray-700 m-0">
                Unit Details
              </h3>
            </div>
            <div className="p-6 grid grid-cols-1 gap-4">
              <div>
                <label className="block mb-1 font-semibold text-sm">Name</label>
                <input
                  className="form-input w-full p-1 rounded-md border border-blue-200 bg-blue-50"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
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
                  required
                />
                {errors.short_code && (
                  <div className="text-red-500 text-xs">
                    {errors.short_code}
                  </div>
                )}
              </div>
            </div>
            {errors.general && (
              <div className="px-6 text-red-500 text-sm">{errors.general}</div>
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
                to={`/unit/show/${id}`}
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

export default UnitEdit;

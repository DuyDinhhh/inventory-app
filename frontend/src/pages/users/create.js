import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import UserService from "../../services/userService";
import { toast } from "react-toastify";

const UserCreate = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(
    "/assets/img/users/default.webp"
  );
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

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

      const response = await UserService.store(submitData);
      if (
        (response && response.success) ||
        (response &&
          response.status &&
          response.status.toLowerCase() === "ok") ||
        response === "ok"
      ) {
        toast.success("User created successfully!", {
          autoClose: 700,
          onClose: () => navigate("/users"),
        });
      } else {
        setErrors({
          general: "User creation failed.",
        });
      }
    } catch (err) {
      setErrors(
        err.response?.data?.errors || { general: "Failed to create user." }
      );
    }
    setSaving(false);
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-3xl mx-auto px-6">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-700">Create User</h2>
          <nav className="text-sm text-gray-500 mt-2">
            <Link
              to="/users"
              className="underline text-blue-600 hover:text-blue-800"
            >
              Users
            </Link>
            {">"}
            Create
          </nav>
        </div>
        <div className="flex flex-col md:flex-row gap-6 flex-wrap">
          {/* Left: Image */}
          <div className="w-full max-w-xs md:w-1/3 bg-white rounded-xl shadow-lg border border-gray-200 p-5 flex flex-col">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">
              User Photo
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
                id="photo"
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
          <div className="w-full flex-1 min-w-[240px] bg-white rounded-xl shadow-lg border border-gray-200">
            <form onSubmit={handleSubmit} autoComplete="off">
              <div className="px-6 py-5 border-b border-blue-200">
                <h3 className="text-lg font-semibold text-gray-700 m-0">
                  User Details
                </h3>
              </div>
              <div className="p-6 grid grid-cols-1 gap-4">
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
                    Username
                  </label>
                  <input
                    className="form-input w-full p-1 rounded-md border border-blue-200 bg-blue-50"
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                  />
                  {errors.username && (
                    <div className="text-red-500 text-xs">
                      {errors.username}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block mb-1 font-semibold text-sm">
                    Email
                  </label>
                  <input
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
                    Password
                  </label>
                  <input
                    type="password"
                    className="form-input w-full p-1 rounded-md border border-blue-200 bg-blue-50"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                  />
                  {errors.password && (
                    <div className="text-red-500 text-xs">
                      {errors.password}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block mb-1 font-semibold text-sm">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    className="form-input w-full p-1 rounded-md border border-blue-200 bg-blue-50"
                    name="password_confirmation"
                    value={form.password_confirmation}
                    onChange={handleChange}
                  />
                  {errors.password_confirmation && (
                    <div className="text-red-500 text-xs">
                      {errors.password_confirmation}
                    </div>
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
                  to="/users"
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

export default UserCreate;

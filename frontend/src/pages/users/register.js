import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import UserService from "../../services/userService";
import { useUser } from "../../context/UserContext";

const Register = () => {
  const navigate = useNavigate();
  const { setUser } = useUser();

  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await UserService.register(form);
      const token = response.token || response.access_token;
      localStorage.setItem("token", token);

      const decoded = jwtDecode(token);
      const userId = decoded.sub;
      const userInfo = await UserService.show(userId);

      localStorage.setItem("user", JSON.stringify(userInfo));
      setUser(userInfo);

      toast.success("Account created successfully!", {
        autoClose: 700,
        onClose: () => navigate("/dashboards"),
      });
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message ||
          "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
      <div className="flex-1 max-w-4xl mx-auto overflow-hidden bg-white rounded-lg shadow-xl dark:bg-gray-800">
        <div className="flex flex-col overflow-y-auto md:flex-row">
          <div className="h-32 md:h-auto md:w-1/2">
            <img
              className="object-cover w-full h-full dark:hidden"
              src="../assets/img/create-account-office.jpeg"
              alt="Office"
            />
            <img
              className="hidden object-cover w-full h-full dark:block"
              src="../assets/img/create-account-office-dark.jpeg"
              alt="Office"
            />
          </div>
          <div className="flex items-center justify-center p-6 sm:p-12 md:w-1/2">
            <form onSubmit={handleSubmit} className="w-full">
              <h1 className="mb-4 text-xl font-semibold text-gray-700 dark:text-gray-200">
                Create account
              </h1>

              {error && (
                <p className="mb-4 p-3 text-sm bg-red-100 border border-red-200 text-red-700 rounded dark:bg-red-900 dark:border-red-700 dark:text-red-300">
                  {error}
                </p>
              )}

              {["name", "username", "email"].map((field) => (
                <label className="block text-sm mt-4" key={field}>
                  <span className="text-gray-700 dark:text-gray-400">
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                  </span>
                  <input
                    type="text"
                    name={field}
                    value={form[field]}
                    onChange={handleChange}
                    className="form-input mt-1 block w-full"
                    required={field !== "username"}
                  />
                </label>
              ))}

              <label className="block mt-4 text-sm">
                <span className="text-gray-700 dark:text-gray-400">
                  Password
                </span>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className="form-input mt-1 block w-full"
                  required
                />
              </label>

              <label className="block mt-4 text-sm">
                <span className="text-gray-700 dark:text-gray-400">
                  Confirm Password
                </span>
                <input
                  type="password"
                  name="password_confirmation"
                  value={form.password_confirmation}
                  onChange={handleChange}
                  className="form-input mt-1 block w-full"
                  required
                />
              </label>

              <button
                type="submit"
                disabled={loading}
                className="block w-full px-4 py-2 mt-6 text-sm font-medium text-white bg-purple-600 rounded hover:bg-purple-700 focus:outline-none disabled:opacity-50"
              >
                {loading ? "Creating account..." : "Create account"}
              </button>

              <p className="mt-4">
                <Link
                  className="text-sm font-medium text-purple-600 dark:text-purple-400 hover:underline"
                  to="/login"
                >
                  Already have an account? Login
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

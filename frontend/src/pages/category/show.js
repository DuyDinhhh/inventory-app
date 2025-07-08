import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import CategoryService from "../../services/categoryService";

const CategoryShow = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    (async () => {
      try {
        const data = await CategoryService.show(id);
        setCategory(data);
      } catch (err) {
        setCategory(null);
      }
      setLoading(false);
    })();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-6 min-h-[60vh] flex items-center justify-center">
        <div className="text-xl text-center">Loading...</div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="max-w-3xl mx-auto px-6 min-h-[60vh] flex items-center justify-center">
        <div>
          <div className="text-xl text-center">Category not found.</div>
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
          <h2 className="text-2xl font-semibold text-gray-700 mb-0">
            Category Details
          </h2>
          <nav className="text-sm text-gray-500 mt-2">
            <Link
              to="/categories"
              className="underline text-blue-600 hover:text-blue-800"
            >
              Categories
            </Link>{" "}
            &gt;{" "}
            <Link
              to={`/category/show/${id}`}
              className="underline text-blue-600 hover:text-blue-800"
            >
              {category.name}
            </Link>
          </nav>
        </div>
        <div className="bg-white rounded-xl shadow-lg border border-gray-200">
          <div className="p-6">
            <table className="w-full table-auto text-sm text-gray-800">
              <tbody>
                <tr>
                  <td className="py-2 px-4 font-medium">Name</td>
                  <td className="py-2 px-4">{category.name}</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 font-medium">Slug</td>
                  <td className="py-2 px-4">{category.slug}</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 font-medium">Short Code</td>
                  <td className="py-2 px-4">{category.short_code ?? "-"}</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 font-medium">Created At</td>
                  <td className="py-2 px-4">
                    {category.created_at
                      ? new Date(category.created_at).toLocaleString()
                      : "-"}
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-4 font-medium">Updated At</td>
                  <td className="py-2 px-4">
                    {category.updated_at
                      ? new Date(category.updated_at).toLocaleString()
                      : "-"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="flex justify-end gap-2 border-t border-blue-200 px-6 py-5">
            <Link
              to={`/category/edit/${category.id}`}
              className="bg-yellow-400 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded flex items-center shadow"
            >
              Edit
            </Link>
            <Link
              to="/categories"
              className="bg-blue-200 hover:bg-blue-300 text-gray-700 font-bold py-2 px-4 rounded flex items-center shadow"
            >
              Cancel
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryShow;

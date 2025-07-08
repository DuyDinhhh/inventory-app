import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import UnitService from "../../services/unitService";

const UnitShow = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [unit, setUnit] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    (async () => {
      try {
        const data = await UnitService.show(id);
        setUnit(data);
      } catch (err) {
        setUnit(null);
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
          <h2 className="text-2xl font-semibold text-gray-700 mb-0">
            Unit Details
          </h2>
          <nav className="text-sm text-gray-500 mt-2">
            <Link
              to="/units"
              className="underline text-blue-600 hover:text-blue-800"
            >
              Units
            </Link>{" "}
            &gt; <span className="text-blue-600">{unit.name}</span>
          </nav>
        </div>
        <div className="bg-white rounded-xl shadow-lg border border-gray-200">
          <div className="px-6 py-5 border-b border-blue-200">
            <h3 className="text-lg font-semibold text-gray-700 m-0">
              Unit Info
            </h3>
          </div>
          <div className="p-6">
            <table className="w-full table-auto text-sm text-gray-800">
              <tbody>
                <tr>
                  <td className="py-2 px-4 font-medium">Name</td>
                  <td className="py-2 px-4">{unit.name}</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 font-medium">Short Code</td>
                  <td className="py-2 px-4">{unit.short_code}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="flex justify-end gap-2 border-t border-blue-200 px-6 py-5">
            <Link
              to={`/unit/edit/${unit.id}`}
              className="bg-yellow-400 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded flex items-center shadow"
            >
              Edit
            </Link>
            <Link
              to="/units"
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

export default UnitShow;

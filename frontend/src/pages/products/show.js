import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import ProductService from "../../services/productService";

const ProductShow = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    (async () => {
      try {
        const data = await ProductService.show(id);
        setProduct(data);
      } catch (err) {
        setProduct(null);
      }
      setLoading(false);
    })();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-6 min-h-[60vh] flex items-center justify-center">
        <div className="text-xl text-center">Loading...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-5xl mx-auto px-6 min-h-[60vh] flex items-center justify-center">
        <div>
          <div className="text-xl text-center">Product not found.</div>
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
      <div className="max-w-5xl mx-auto px-6">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-700 mb-0">
            Product Details
          </h2>
          <nav className="text-sm text-gray-500 mt-2">
            <Link
              to="/products"
              className="underline text-blue-600 hover:text-blue-800"
            >
              Products
            </Link>{" "}
            &gt;{" "}
            <Link
              to={`/product/show/${id}`}
              className="underline text-blue-600 hover:text-blue-800"
            >
              {product.name}
            </Link>
          </nav>
        </div>
        <div className="flex flex-col md:flex-row gap-6 flex-wrap">
          {/* Image Card */}
          <div className="w-full max-w-md md:w-1/3 bg-white rounded-xl shadow-lg border border-gray-200 p-5">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">
              Product Image
            </h3>
            <img
              className="rounded w-full object-cover max-h-64 mb-2 border border-blue-200 shadow bg-white"
              src={product.product_image || "/assets/img/products/default.webp"}
              alt={product.name}
              id="image-preview"
            />
          </div>
          {/* Details Card */}
          <div className="w-full flex-1 min-w-[320px] bg-white rounded-xl shadow-lg border border-gray-200">
            <div className="px-6 py-5 border-b border-blue-200">
              <h3 className="text-lg font-semibold text-gray-700 m-0">
                Product Details
              </h3>
            </div>
            <div className="p-6 overflow-x-auto">
              <table className="w-full table-auto text-sm text-gray-800">
                <tbody>
                  <tr>
                    <td className="py-2 px-4 font-medium">Name</td>
                    <td className="py-2 px-4">{product.name}</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 font-medium">Slug</td>
                    <td className="py-2 px-4">{product.slug}</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 font-medium text-gray-500">
                      Code
                    </td>
                    <td className="py-2 px-4">{product.code}</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 font-medium">Barcode</td>
                    <td className="py-2 px-4">
                      <span
                        dangerouslySetInnerHTML={{
                          __html: product.barcode_html || "",
                        }}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 font-medium">Category</td>
                    <td className="py-2 px-4">
                      {product.category ? (
                        <Link
                          to={`/category/show/${product.category.id}`}
                          className="inline-block bg-blue-200 text-blue-700 px-2 py-0.5 rounded text-xs"
                        >
                          {product.category.name}
                        </Link>
                      ) : (
                        "-"
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 font-medium">Unit</td>
                    <td className="py-2 px-4">
                      {product.unit ? (
                        <Link
                          to={`/unit/show/${product.unit.id}`}
                          className="inline-block bg-blue-200 text-blue-700 px-2 py-0.5 rounded text-xs"
                        >
                          {product.unit.short_code}
                        </Link>
                      ) : (
                        "-"
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 font-medium">Quantity</td>
                    <td className="py-2 px-4">{product.quantity}</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 font-medium">Quantity Alert</td>
                    <td className="py-2 px-4">
                      <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded text-xs">
                        {product.quantity_alert}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 font-medium">Buying Price</td>
                    <td className="py-2 px-4">{product.buying_price}</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 font-medium">Selling Price</td>
                    <td className="py-2 px-4">{product.selling_price}</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 font-medium">Tax</td>
                    <td className="py-2 px-4">
                      <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded text-xs">
                        {product.tax} %
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 font-medium">Tax Type</td>
                    <td className="py-2 px-4">
                      {product.tax_type ? "Inclusive" : "Exclusive"}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 font-medium">Notes</td>
                    <td className="py-2 px-4">{product.notes}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="flex justify-end gap-2 border-t border-blue-200 px-6 py-5">
              <Link
                to={`/product/edit/${product.id}`}
                className="bg-yellow-400 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded flex items-center shadow"
              >
                Edit
              </Link>
              <Link
                to="/products"
                className="bg-blue-200 hover:bg-blue-300 text-gray-700 font-bold py-2 px-4 rounded flex items-center shadow"
              >
                Cancel
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductShow;

// import React, { useEffect, useRef } from "react";
// import { useParams } from "react-router-dom";
// import OrderService from "../../services/orderService";
// import { toast } from "react-toastify";

// const PrintOrder = () => {
//   const { id } = useParams();
//   const [order, setOrder] = React.useState(null);
//   const printRef = useRef(null);

//   useEffect(() => {
//     const fetchOrder = async () => {
//       try {
//         const response = await OrderService.show(id);
//         setOrder(response);
//       } catch (err) {
//         toast.error("Failed to load order data.");
//       }
//     };
//     fetchOrder();
//   }, [id]);

//   const handlePrint = () => {
//     window.print();
//   };

//   if (!order) {
//     return (
//       <div className="container mx-auto text-center py-24 text-lg text-gray-600">
//         Loading...
//       </div>
//     );
//   }

//   return (
//     <div
//       className="invoice-16 invoice-content bg-gray-100 min-h-screen py-8"
//       ref={printRef}
//     >
//       <div className="container max-w-3xl mx-auto bg-white p-6 rounded shadow">
//         <div className="invoice-inner-9" id="invoice_wrapper">
//           <div className="invoice-top mb-6">
//             <div className="flex justify-between items-center">
//               <div className="logo">
//                 <h1 className="font-bold text-2xl">Nam Trung Corp</h1>
//               </div>
//               <div className="invoice">
//                 <h1 className="text-lg font-semibold">
//                   Phiếu Xuất Kho # <span>{order.invoice_no}</span>
//                 </h1>
//               </div>
//             </div>
//           </div>
//           <div className="invoice-info mb-6">
//             <div className="flex justify-between">
//               <div>
//                 <h4 className="font-semibold">Ngày xuất:</h4>
//                 <p>{order.order_date}</p>
//               </div>
//             </div>
//             <div className="flex flex-col md:flex-row justify-between mt-8">
//               <div className="mb-4 md:mb-0">
//                 <h4 className="font-semibold">Khách hàng</h4>
//                 <p>{order.customer?.name ?? "-"}</p>
//                 <p>{order.customer?.phone ?? "-"}</p>
//                 <p>{order.customer?.email ?? "-"}</p>
//                 <p>{order.customer?.address ?? "-"}</p>
//               </div>
//               <div className="md:text-right">
//                 <h4 className="font-semibold">Cửa hàng</h4>
//                 <p>Nam Trung Corp</p>
//                 <p>(+62) 123 123 123</p>
//                 <p>email@example.com</p>
//                 <p>Tân Bình, Hồ Chí Minh</p>
//               </div>
//             </div>
//           </div>
//           <div className="order-summary mb-6">
//             <div className="overflow-x-auto">
//               <table className="min-w-full text-sm border">
//                 <thead className="bg-gray-200">
//                   <tr>
//                     <th className="py-2 px-4 text-left">Tên hàng</th>
//                     <th className="py-2 px-4 text-center">Đơn giá</th>
//                     <th className="py-2 px-4 text-center">Số lượng</th>
//                     <th className="py-2 px-4 text-center">Thành tiền</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {order.details?.map((item, idx) => (
//                     <tr key={idx} className="border-b">
//                       <td className="py-2 px-4">{item.product?.name ?? "-"}</td>
//                       <td className="py-2 px-4 text-center">
//                         {item.unitcost?.toLocaleString(undefined, {
//                           style: "currency",
//                           currency: "VND",
//                         }) ?? "-"}
//                       </td>
//                       <td className="py-2 px-4 text-center">{item.quantity}</td>
//                       <td className="py-2 px-4 text-center">
//                         {item.total?.toLocaleString(undefined, {
//                           style: "currency",
//                           currency: "VND",
//                         }) ?? "-"}
//                       </td>
//                     </tr>
//                   ))}
//                   <tr>
//                     <td
//                       colSpan={3}
//                       className="text-right font-semibold py-2 px-4"
//                     >
//                       Tổng cộng
//                     </td>
//                     <td className="py-2 px-4 text-center font-semibold">
//                       {order.sub_total?.toLocaleString(undefined, {
//                         style: "currency",
//                         currency: "VND",
//                       })}
//                     </td>
//                   </tr>
//                   <tr>
//                     <td
//                       colSpan={3}
//                       className="text-right font-semibold py-2 px-4"
//                     >
//                       Thuế
//                     </td>
//                     <td className="py-2 px-4 text-center font-semibold">
//                       {order.vat?.toLocaleString(undefined, {
//                         style: "currency",
//                         currency: "VND",
//                       })}
//                     </td>
//                   </tr>
//                   <tr>
//                     <td
//                       colSpan={3}
//                       className="text-right font-semibold py-2 px-4"
//                     >
//                       Thành tiền
//                     </td>
//                     <td className="py-2 px-4 text-center font-semibold">
//                       {order.total?.toLocaleString(undefined, {
//                         style: "currency",
//                         currency: "VND",
//                       })}
//                     </td>
//                   </tr>
//                 </tbody>
//               </table>
//             </div>
//           </div>
//           {/* Print & Download buttons - hidden when printing */}
//           <div className="invoice-btn-section flex gap-4 mt-8 d-print-none print:hidden">
//             <button
//               className="btn btn-lg btn-print bg-yellow-500 hover:bg-yellow-700 text-white px-6 py-2 rounded flex items-center gap-2"
//               onClick={handlePrint}
//               type="button"
//             >
//               <i className="fa fa-print" /> In Phiếu
//             </button>
//             {/* Download could be implemented with jsPDF/html2canvas if needed */}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PrintOrder;
import React, { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import OrderService from "../../services/orderService";
import { toast } from "react-toastify";

// Print-only CSS: hides everything except the invoice when printing
const printStyles = `
@media print {
  body * {
    visibility: hidden !important;
  }
  #phieu-xuat-kho-print, #phieu-xuat-kho-print * {
    visibility: visible !important;
  }
  #phieu-xuat-kho-print {
    position: absolute !important;
    left: 0; top: 0; width: 100vw; min-height: 100vh; background: white !important;
    z-index: 9999;
    margin: 0 !important;
    box-shadow: none !important;
    padding: 0 !important;
  }
  .d-print-none, .print\\:hidden {
    display: none !important;
  }
  html, body {
    background: white !important;
    box-shadow: none !important;
    margin: 0 !important;
    padding: 0 !important;
  }
}
`;

const PrintOrder = () => {
  const { id } = useParams();
  const [order, setOrder] = React.useState(null);
  const printRef = useRef(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await OrderService.show(id);
        setOrder(response);
      } catch (err) {
        toast.error("Failed to load order data.");
      }
    };
    fetchOrder();
  }, [id]);

  // Inject print styles only once
  useEffect(() => {
    let styleTag = document.getElementById("phieu-xuat-kho-print-style");
    if (!styleTag) {
      styleTag = document.createElement("style");
      styleTag.id = "phieu-xuat-kho-print-style";
      styleTag.innerHTML = printStyles;
      document.head.appendChild(styleTag);
    }
  }, []);

  const handlePrint = () => {
    window.print();
  };

  if (!order) {
    return (
      <div className="container mx-auto text-center py-24 text-lg text-gray-600">
        Loading...
      </div>
    );
  }

  return (
    <div
      id="phieu-xuat-kho-print"
      className="invoice-16 invoice-content bg-gray-100 min-h-screen py-8"
      ref={printRef}
    >
      <div className="container max-w-3xl mx-auto bg-white p-6 rounded shadow">
        <div className="invoice-inner-9" id="invoice_wrapper">
          <div className="invoice-top mb-6">
            <div className="flex justify-between items-center">
              <div className="logo">
                <h1 className="font-bold text-2xl">Nam Trung Corp</h1>
              </div>
              <div className="invoice">
                <h1 className="text-lg font-semibold">
                  Phiếu Xuất Kho # <span>{order.invoice_no}</span>
                </h1>
              </div>
            </div>
          </div>
          <div className="invoice-info mb-6">
            <div className="flex justify-between">
              <div>
                <h4 className="font-semibold">Ngày xuất:</h4>
                <p>{order.order_date}</p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row justify-between mt-8">
              <div className="mb-4 md:mb-0">
                <h4 className="font-semibold">Khách hàng</h4>
                <p>{order.customer?.name ?? "-"}</p>
                <p>{order.customer?.phone ?? "-"}</p>
                <p>{order.customer?.email ?? "-"}</p>
                <p>{order.customer?.address ?? "-"}</p>
              </div>
              <div className="md:text-right">
                <h4 className="font-semibold">Cửa hàng</h4>
                <p>Nam Trung Corp</p>
                <p>(+62) 123 123 123</p>
                <p>email@example.com</p>
                <p>Tân Bình, Hồ Chí Minh</p>
              </div>
            </div>
          </div>
          <div className="order-summary mb-6">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm border">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="py-2 px-4 text-left">Tên hàng</th>
                    <th className="py-2 px-4 text-center">Đơn giá</th>
                    <th className="py-2 px-4 text-center">Số lượng</th>
                    <th className="py-2 px-4 text-center">Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {order.details?.map((item, idx) => (
                    <tr key={idx} className="border-b">
                      <td className="py-2 px-4">{item.product?.name ?? "-"}</td>
                      <td className="py-2 px-4 text-center">
                        {item.unitcost?.toLocaleString(undefined, {
                          style: "currency",
                          currency: "VND",
                        }) ?? "-"}
                      </td>
                      <td className="py-2 px-4 text-center">{item.quantity}</td>
                      <td className="py-2 px-4 text-center">
                        {item.total?.toLocaleString(undefined, {
                          style: "currency",
                          currency: "VND",
                        }) ?? "-"}
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td
                      colSpan={3}
                      className="text-right font-semibold py-2 px-4"
                    >
                      Tổng cộng
                    </td>
                    <td className="py-2 px-4 text-center font-semibold">
                      {order.sub_total?.toLocaleString(undefined, {
                        style: "currency",
                        currency: "VND",
                      })}
                    </td>
                  </tr>
                  <tr>
                    <td
                      colSpan={3}
                      className="text-right font-semibold py-2 px-4"
                    >
                      Thuế
                    </td>
                    <td className="py-2 px-4 text-center font-semibold">
                      {order.vat?.toLocaleString(undefined, {
                        style: "currency",
                        currency: "VND",
                      })}
                    </td>
                  </tr>
                  <tr>
                    <td
                      colSpan={3}
                      className="text-right font-semibold py-2 px-4"
                    >
                      Thành tiền
                    </td>
                    <td className="py-2 px-4 text-center font-semibold">
                      {order.total?.toLocaleString(undefined, {
                        style: "currency",
                        currency: "VND",
                      })}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          {/* Print button - hidden when printing */}
          <div className="invoice-btn-section flex gap-4 mt-8 d-print-none print:hidden">
            <button
              className="btn btn-lg btn-print bg-yellow-500 hover:bg-yellow-700 text-white px-6 py-2 rounded flex items-center gap-2"
              onClick={handlePrint}
              type="button"
            >
              <i className="fa fa-print" /> In Phiếu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrintOrder;

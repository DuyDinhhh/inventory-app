import React from "react";
import Modal from "react-modal";

const PurchaseImportPreviewModal = ({
  isOpen,
  onClose,
  onConfirm,
  importPreview,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Import Purchase Preview"
      style={{
        overlay: { backgroundColor: "rgba(0, 0, 0, 0.3)" },
        content: {
          maxWidth: 650,
          margin: "auto",
          padding: 24,
          borderRadius: 10,
          top: "10%",
          left: "50%",
          right: "auto",
          bottom: "auto",
          transform: "translateX(-50%)",
        },
      }}
    >
      <h2 className="text-lg font-bold mb-4">Import Preview</h2>
      {importPreview && (
        <div className="max-h-[400px] overflow-auto">
          <div className="mb-2">
            <span className="font-semibold text-green-700">
              Will be imported ({importPreview.success.length}):
            </span>
            <ul className="list-disc ml-6 text-green-800">
              {importPreview.success.map((item, idx) => (
                <li key={idx}>
                  Row {item.row}: Purchase No. <b>{item.purchase_no}</b>
                  {item.product_code && (
                    <>
                      {" "}
                      (Product: <b>{item.product_code}</b>)
                    </>
                  )}
                </li>
              ))}
            </ul>
          </div>
          <div className="mb-2">
            <span className="font-semibold text-orange-700">
              Will skip ({importPreview.skipped.length}):
            </span>
            <ul className="list-disc ml-6 text-orange-800">
              {importPreview.skipped.map((item, idx) => (
                <li key={idx}>
                  Row {item.row}: Purchase No. <b>{item.purchase_no}</b>
                  {item.product_code && (
                    <>
                      {" "}
                      (Product: <b>{item.product_code}</b>)
                    </>
                  )}{" "}
                  - {item.reason}
                </li>
              ))}
            </ul>
          </div>
          <div className="mb-2">
            <span className="font-semibold text-red-700">
              Errors ({importPreview.errors.length}):
            </span>
            <ul className="list-disc ml-6 text-red-800">
              {importPreview.errors.map((item, idx) => (
                <li key={idx}>
                  Row {item.row}: Purchase No. <b>{item.purchase_no}</b>
                  {item.product_code && (
                    <>
                      {" "}
                      (Product: <b>{item.product_code}</b>)
                    </>
                  )}{" "}
                  - {item.error}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
      <div className="mt-4 flex gap-4 justify-end">
        <button
          onClick={onConfirm}
          disabled={!importPreview?.success?.length}
          className={`font-bold py-2 px-4 rounded text-white transition
      ${
        importPreview?.success?.length
          ? "bg-green-600 hover:bg-green-700"
          : "bg-green-300 cursor-not-allowed"
      }`}
        >
          Confirm Import
        </button>
        <button
          onClick={onClose}
          className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded"
        >
          Cancel
        </button>
      </div>
    </Modal>
  );
};

export default PurchaseImportPreviewModal;

import React, { useState, useEffect } from "react";

function Testbarcode() {
  const [barcode, setBarcode] = useState("");

  useEffect(() => {
    // Handles Keydown for Barcode Scanner
    function handleKeyDown(e) {
      // Barcode scanners send data as keypress events followed by an "Enter" key
      if (e.key === "Enter") {
        handleScan(barcode);
        setBarcode(""); // Reset barcode after scan
      } else {
        setBarcode((prev) => prev + e.key); // Add each character scanned to the barcode string
      }
    }

    // Adds event listener to the page for keydown
    document.addEventListener("keydown", handleKeyDown);

    // Clean up event listener
    return function cleanup() {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [barcode]);

  // Function to handle the barcode scan
  const handleScan = (scannedBarcode) => {
    console.log("Scanned Barcode:", scannedBarcode);
    // Handle the scanned barcode (e.g., send it to backend, search for product, etc.)
  };

  return (
    <div className="App">
      <h1>Barcode Scanner Test</h1>
      <div>
        <p>Scanned Barcode: {barcode}</p>
      </div>
    </div>
  );
}

export default Testbarcode;

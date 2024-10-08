import React from "react";

const MerchModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const usStoreLink = "https://frost-children.myshopify.com/";
  const europeUKStoreLink = "https://stores.allotment.pro/frost-children/";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-4 text-black">Choose a Store</h2>
        <div className="flex flex-col space-y-4">
          <a
            href={usStoreLink}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            US Store
          </a>
          <a
            href={europeUKStoreLink}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Europe/UK Store
          </a>
        </div>
        <button
          onClick={onClose}
          className="mt-4 text-gray-600 hover:text-gray-800"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default MerchModal;

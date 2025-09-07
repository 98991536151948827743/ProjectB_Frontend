import React, { useEffect } from "react";

const Pop2 = ({ message, type = "success", onClose, duration = 1500 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  // Background color based on type
  const bgColor = type === "success" ? "bg-green-600" : "bg-red-600";

  return (
    <div className="fixed top-10 left-1/2 transform -translate-x-1/2 z-50">
      <div
        className={`${bgColor} text-white font-semibold px-6 py-3 rounded-lg shadow-lg 
          transition-opacity duration-300 opacity-95`}
      >
        {message}
      </div>
    </div>
  );
};

export default Pop2;

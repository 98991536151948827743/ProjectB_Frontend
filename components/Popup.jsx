import React from 'react';
import { XCircle, CheckCircle2, AlertCircle } from 'lucide-react';

const Popup = ({ message, type, onButtonClick, buttonText, onClose }) => {
  const iconProps = { size: 24, className: 'inline-block mr-2' };

  const getIconAndColor = () => {
    switch (type) {
      case 'success':
        return { icon: <CheckCircle2 {...iconProps} />, color: 'text-green-500' };
      case 'error':
        return { icon: <XCircle {...iconProps} />, color: 'text-red-500' };
      case 'info':
        return { icon: <AlertCircle {...iconProps} />, color: 'text-blue-500' };
      default:
        return { icon: null, color: 'text-gray-500' };
    }
  };

  const { icon, color } = getIconAndColor();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm transform transition-all duration-300 scale-100">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            {icon}
            <h2 className={`text-xl font-bold ${color}`}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            ✕
          </button>
        </div>
        <p className="text-gray-700 mb-4">{message}</p>
        <div className="flex flex-col space-y-2">
          {onButtonClick && buttonText && (
            <button
              onClick={onButtonClick}
              className="bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
            >
              {buttonText}
            </button>
          )}

          <button
            onClick={onClose}
            className="bg-gray-200 text-gray-800 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Popup;

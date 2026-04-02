import React from 'react';
import { FaCopy, FaCheck, FaTimes } from 'react-icons/fa';
import toast from 'react-hot-toast';

const CodeModal = ({ isOpen, onClose, shortId, type }) => {
  if (!isOpen) return null;

  const fullUrl = `${window.location.origin}/${type === 'files' ? 'view' : 'text'}/${shortId}`;

  const copyToClipboard = async (text, message = 'Copied to clipboard!') => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(message);
    } catch (err) {
      toast.error('Failed to copy');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <FaTimes />
        </button>

        <h2 className="text-2xl font-bold mb-4">Share Link Created!</h2>
        <p className="text-gray-600 mb-4">
          Your {type === 'files' ? 'files' : 'text'} are now available.
        </p>

        {/* Short Code Section */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Short Code</label>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-gray-100 rounded-xl p-3 font-mono text-lg font-bold text-center">
              {shortId}
            </div>
            <button
              onClick={() => copyToClipboard(shortId, 'Code copied to clipboard!')}
              className="p-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
              title="Copy code"
            >
              <FaCopy />
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-1">Use this code in the "Quick Access" section to retrieve content.</p>
        </div>

        {/* Full Link Section */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Link</label>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-gray-100 rounded-xl p-3 text-sm font-mono break-all">
              {fullUrl}
            </div>
            <button
              onClick={() => copyToClipboard(fullUrl, 'Link copied to clipboard!')}
              className="p-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
              title="Copy link"
            >
              <FaCopy />
            </button>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => {
              window.open(fullUrl, '_blank');
              onClose();
            }}
            className="flex-1 btn-primary flex items-center justify-center space-x-2"
          >
            <FaCheck />
            <span>View</span>
          </button>
          <button
            onClick={onClose}
            className="flex-1 btn-secondary"
          >
            Close
          </button>
        </div>

        <p className="text-xs text-gray-400 mt-4 text-center">
          Link expires in 24 hours.
        </p>
      </div>
    </div>
  );
};

export default CodeModal;
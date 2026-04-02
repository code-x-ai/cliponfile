import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import FileUpload from '../components/FileUpload';
import TextClipboard from '../components/TextClipboard';
import { FaFileAlt, FaClipboardList, FaSearch, FaArrowRight } from 'react-icons/fa';

const Home = () => {
  const [activeTab, setActiveTab] = useState('clipboard');
  const [accessCode, setAccessCode] = useState('');
  const [accessType, setAccessType] = useState('files');
  const navigate = useNavigate();

  const handleAccess = () => {
    if (!accessCode.trim()) {
      toast.error('Please enter a code');
      return;
    }
    if (accessType === 'files') {
      navigate(`/view/${accessCode.trim().toUpperCase()}`);
    } else {
      navigate(`/text/${accessCode.trim().toUpperCase()}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6">
      <div className="text-center mb-8 sm:mb-12">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2 sm:mb-4">
          Clipboard & File Transfer
        </h1>
        <p className="text-base sm:text-xl text-gray-600">Share files and text securely – auto-delete after 24 hours</p>
      </div>

      {/* Toggle Buttons */}
      <div className="flex justify-center mb-6 sm:mb-8">
        <div className="bg-white/80 backdrop-blur-sm p-1 rounded-full shadow-md inline-flex w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('clipboard')}
            className={`flex-1 sm:flex-initial px-4 sm:px-6 py-2 rounded-full font-medium transition-all flex items-center justify-center space-x-2 ${
              activeTab === 'clipboard'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <FaClipboardList />
            <span>Online Clipboard</span>
          </button>
          <button
            onClick={() => setActiveTab('files')}
            className={`flex-1 sm:flex-initial px-4 sm:px-6 py-2 rounded-full font-medium transition-all flex items-center justify-center space-x-2 ${
              activeTab === 'files'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <FaFileAlt />
            <span>File Transfer</span>
          </button>
        </div>
      </div>

      {/* Content based on active tab */}
      <div className="transition-all duration-300">
        {activeTab === 'clipboard' ? <TextClipboard /> : <FileUpload />}
      </div>

      {/* Quick Access Section */}
      <div className="mt-8 sm:mt-12">
        <div className="glass-card rounded-2xl p-4 sm:p-6">
          <h2 className="text-xl sm:text-2xl font-bold mb-2">Quick Access</h2>
          <p className="text-sm sm:text-base text-gray-600 mb-4">
            Already have a code? Enter it below to retrieve your content.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <input
                type="text"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
                placeholder="Enter code (e.g., ABC123)"
                className="input-field w-full text-sm sm:text-base"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={accessType}
                onChange={(e) => setAccessType(e.target.value)}
                className="input-field bg-white text-sm sm:text-base"
              >
                <option value="files">Files</option>
                <option value="text">Text</option>
              </select>
              <button
                onClick={handleAccess}
                className="btn-primary flex items-center space-x-2 whitespace-nowrap"
              >
                <FaSearch />
                <span>Access</span>
                <FaArrowRight />
              </button>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-3">
            Code is case‑insensitive. Example: for link <code className="bg-gray-100 px-1 rounded">https://yoursite.com/view/XYZ789</code>, enter <strong>XYZ789</strong>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
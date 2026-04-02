import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getText } from '../api';
import { FaArrowLeft, FaCopy, FaCheckCircle, FaCalendarAlt } from 'react-icons/fa';

const ViewText = () => {
  const { shortId } = useParams();
  const [textData, setTextData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchText = async () => {
      try {
        const data = await getText(shortId);
        setTextData(data);
      } catch (error) {
        toast.error(error.response?.data?.error || 'Failed to load text');
      } finally {
        setLoading(false);
      }
    };
    fetchText();
  }, [shortId]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(textData.content);
      setCopied(true);
      toast.success('Copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy');
    }
  };

  const copyLink = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard!');
    } catch (err) {
      toast.error('Failed to copy link');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!textData) {
    return (
      <div className="text-center py-12 sm:py-16">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">Text Not Found</h2>
        <p className="text-gray-600 mb-6">The text may have expired or been deleted.</p>
        <Link to="/" className="btn-primary inline-block">Go Home</Link>
      </div>
    );
  }

  const formatDate = (date) => new Date(date).toLocaleString();

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6">
      <Link to="/" className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-4 sm:mb-6 text-sm sm:text-base">
        <FaArrowLeft />
        <span>Back to Home</span>
      </Link>

      <div className="glass-card rounded-2xl p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-3 mb-4">
          <h1 className="text-2xl sm:text-3xl font-bold">Shared Text</h1>
          <div className="flex space-x-2 w-full sm:w-auto">
            <button
              onClick={copyToClipboard}
              className="flex-1 sm:flex-initial flex items-center justify-center space-x-2 bg-white/80 px-3 py-2 rounded-xl hover:bg-white transition-colors text-sm"
            >
              {copied ? <FaCheckCircle className="text-green-500" /> : <FaCopy />}
              <span>Copy Text</span>
            </button>
            <button
              onClick={copyLink}
              className="flex-1 sm:flex-initial flex items-center justify-center space-x-2 bg-white/80 px-3 py-2 rounded-xl hover:bg-white transition-colors text-sm"
            >
              <FaCopy />
              <span>Copy Link</span>
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6">
          <FaCalendarAlt />
          <span>{formatDate(textData.createdAt)}</span>
        </div>

        <div className="bg-gray-50/80 rounded-xl p-4 sm:p-6 border border-gray-200">
          <pre className="whitespace-pre-wrap font-mono text-xs sm:text-sm leading-relaxed">
            {textData.content}
          </pre>
        </div>

        <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-yellow-50/80 rounded-xl text-xs sm:text-sm text-yellow-800">
          ⚠️ This text will be automatically deleted after 24 hours.
        </div>
      </div>
    </div>
  );
};

export default ViewText;
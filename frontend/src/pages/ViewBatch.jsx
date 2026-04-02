import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getBatch } from '../api';
import FilePreview from '../components/FilePreview';
import { FaArrowLeft, FaCalendarAlt } from 'react-icons/fa';

const ViewBatch = () => {
  const { shortId } = useParams();
  const [batch, setBatch] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBatch = async () => {
      try {
        const data = await getBatch(shortId);
        setBatch(data);
      } catch (error) {
        toast.error(error.response?.data?.error || 'Failed to load files');
      } finally {
        setLoading(false);
      }
    };
    fetchBatch();
  }, [shortId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!batch) {
    return (
      <div className="text-center py-12 sm:py-16">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">Files Not Found</h2>
        <p className="text-gray-600 mb-6">The files may have expired or been deleted.</p>
        <Link to="/" className="btn-primary inline-block">Go Home</Link>
      </div>
    );
  }

  const formatDate = (date) => new Date(date).toLocaleString();
  const totalSize = batch.files.reduce((sum, file) => sum + file.size, 0);
  const formatSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6">
      <Link to="/" className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-4 sm:mb-6 text-sm sm:text-base">
        <FaArrowLeft />
        <span>Back to Home</span>
      </Link>

      <div className="glass-card rounded-2xl p-4 sm:p-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Shared Files</h1>
        <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6">
          <span className="flex items-center space-x-1">
            <FaCalendarAlt />
            <span>{formatDate(batch.createdAt)}</span>
          </span>
          <span>•</span>
          <span>{batch.files.length} files</span>
          <span>•</span>
          <span>{formatSize(totalSize)}</span>
        </div>

        <div className="space-y-3 sm:space-y-4">
          {batch.files.map((file) => (
            <FilePreview key={file.fileId} file={file} />
          ))}
        </div>

        <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-yellow-50/80 rounded-xl text-xs sm:text-sm text-yellow-800">
          ⚠️ These files will be automatically deleted after 24 hours from upload.
        </div>
      </div>
    </div>
  );
};

export default ViewBatch;
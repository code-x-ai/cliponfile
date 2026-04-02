import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { uploadFiles } from '../api';
import { FaUpload, FaFileAlt, FaTrashAlt } from 'react-icons/fa';
import CodeModal from './CodeModal';

const FileUpload = () => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [uploadedShortId, setUploadedShortId] = useState(null);
  const navigate = useNavigate();

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    validateAndSetFiles(droppedFiles);
  }, []);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    validateAndSetFiles(selectedFiles);
  };

  const validateAndSetFiles = (newFiles) => {
    const totalFiles = files.length + newFiles.length;
    if (totalFiles > 5) {
      toast.error('Maximum 5 files allowed');
      return;
    }
    const totalSize = [...files, ...newFiles].reduce((sum, f) => sum + f.size, 0);
    if (totalSize > 50 * 1024 * 1024) {
      toast.error('Total size exceeds 50MB limit');
      return;
    }
    setFiles([...files, ...newFiles]);
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      toast.error('Please select files to upload');
      return;
    }

    setUploading(true);
    try {
      const result = await uploadFiles(files);
      const shortId = result.shortId;
      setUploadedShortId(shortId);
      setShowModal(true);
      setFiles([]);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const formatSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="glass-card rounded-2xl p-4 sm:p-6">
      <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-1 sm:mb-2">
        File Transfer
      </h2>
      <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">Upload up to 5 files (max 50MB total)</p>

      <div
        className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center transition-all ${
          dragActive ? 'border-blue-500 bg-blue-50/50' : 'border-gray-300 bg-gray-50/50'
        }`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
      >
        <FaUpload className="mx-auto text-3xl sm:text-4xl text-gray-400 mb-3 sm:mb-4" />
        <p className="text-gray-600 mb-2 text-sm sm:text-base">Drag and drop files here, or</p>
        <label className="btn-primary inline-block cursor-pointer text-sm sm:text-base">
          Browse Files
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            className="hidden"
            disabled={uploading}
          />
        </label>
      </div>

      {files.length > 0 && (
        <div className="mt-6">
          <h3 className="font-medium mb-3 flex flex-col sm:flex-row justify-between gap-2">
            <span>Selected Files ({files.length}/5)</span>
            <span className="text-sm text-gray-500">
              Total: {formatSize(files.reduce((s, f) => s + f.size, 0))}
            </span>
          </h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {files.map((file, index) => (
              <div key={index} className="flex items-center justify-between bg-white/60 rounded-xl p-3">
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <FaFileAlt className="text-gray-400 flex-shrink-0" />
                  <div className="flex-1 truncate">
                    <span className="text-sm font-medium truncate">{file.name}</span>
                    <span className="text-xs text-gray-500 ml-2">{formatSize(file.size)}</span>
                  </div>
                </div>
                <button
                  onClick={() => removeFile(index)}
                  className="text-red-500 hover:text-red-700 transition-colors p-1 flex-shrink-0"
                  disabled={uploading}
                >
                  <FaTrashAlt />
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={handleUpload}
            disabled={uploading}
            className="btn-primary mt-4 w-full flex items-center justify-center space-x-2 text-sm sm:text-base"
          >
            {uploading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <FaUpload />
                <span>Upload & Get Link</span>
              </>
            )}
          </button>
        </div>
      )}

      {showModal && (
        <CodeModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          shortId={uploadedShortId}
          type="files"
        />
      )}
    </div>
  );
};

export default FileUpload;
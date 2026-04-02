import React from 'react';
import { getFileUrl } from '../api';
import FileIcon from './FileIcon';
import { FaDownload } from 'react-icons/fa';

const FilePreview = ({ file }) => {
  const { fileId, originalName, mimetype, size } = file;
  const fileUrl = getFileUrl(fileId);

  const formatSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const isImage = mimetype.startsWith('image/');
  const isVideo = mimetype.startsWith('video/');

  return (
    <div className="file-preview-card p-3 sm:p-4">
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <div className="flex justify-center sm:justify-start">
          <FileIcon filename={originalName} mimetype={mimetype} className="w-10 h-10 sm:w-12 sm:h-12" />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-gray-900 truncate text-sm sm:text-base" title={originalName}>
            {originalName}
          </h3>
          <p className="text-xs sm:text-sm text-gray-500">{formatSize(size)}</p>

          {isImage && (
            <div className="mt-2 sm:mt-3 max-w-full">
              <img
                src={fileUrl}
                alt={originalName}
                className="max-h-40 sm:max-h-48 rounded-lg object-contain border"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
              <div className="hidden text-red-500 text-xs sm:text-sm">Failed to load preview</div>
            </div>
          )}

          {isVideo && (
            <div className="mt-2 sm:mt-3">
              <video controls className="max-h-40 sm:max-h-48 rounded-lg border" src={fileUrl}>
                Your browser does not support video playback.
              </video>
            </div>
          )}
        </div>

        <div className="flex justify-center sm:justify-end mt-2 sm:mt-0">
          <a
            href={fileUrl}
            download={originalName}
            className="bg-blue-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm"
          >
            <FaDownload />
            <span>Download</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default FilePreview;
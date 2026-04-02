import React from 'react';
import {
  FaFilePdf,
  FaFileWord,
  FaFileExcel,
  FaFilePowerpoint,
  FaFileImage,
  FaFileVideo,
  FaFileAudio,
  FaFileArchive,
  FaFileCode,
  FaFileAlt,
  FaFile
} from 'react-icons/fa';

const FileIcon = ({ filename, mimetype, className = "w-12 h-12" }) => {
  const getIcon = () => {
    const ext = filename.split('.').pop()?.toLowerCase();
    
    // PDF
    if (mimetype === 'application/pdf' || ext === 'pdf') {
      return <FaFilePdf className={`${className} text-red-600`} />;
    }
    // Word
    if (mimetype.includes('word') || ext === 'doc' || ext === 'docx') {
      return <FaFileWord className={`${className} text-blue-600`} />;
    }
    // Excel
    if (mimetype.includes('excel') || mimetype.includes('spreadsheet') || ext === 'xls' || ext === 'xlsx') {
      return <FaFileExcel className={`${className} text-green-600`} />;
    }
    // PowerPoint
    if (mimetype.includes('powerpoint') || ext === 'ppt' || ext === 'pptx') {
      return <FaFilePowerpoint className={`${className} text-orange-600`} />;
    }
    // Images
    if (mimetype.startsWith('image/')) {
      return <FaFileImage className={`${className} text-purple-600`} />;
    }
    // Videos
    if (mimetype.startsWith('video/')) {
      return <FaFileVideo className={`${className} text-pink-600`} />;
    }
    // Audio
    if (mimetype.startsWith('audio/')) {
      return <FaFileAudio className={`${className} text-yellow-600`} />;
    }
    // Archives
    if (ext === 'zip' || ext === 'rar' || ext === '7z' || ext === 'tar' || ext === 'gz') {
      return <FaFileArchive className={`${className} text-gray-600`} />;
    }
    // Code files
    if (ext === 'js' || ext === 'py' || ext === 'java' || ext === 'html' || ext === 'css' || ext === 'json') {
      return <FaFileCode className={`${className} text-indigo-600`} />;
    }
    // Text files
    if (mimetype === 'text/plain' || ext === 'txt') {
      return <FaFileAlt className={`${className} text-gray-600`} />;
    }
    
    return <FaFile className={`${className} text-gray-400`} />;
  };
  
  return (
    <div className="flex flex-col items-center">
      {getIcon()}
      <span className="text-xs text-gray-600 mt-1 text-center max-w-[80px] truncate">
        {filename}
      </span>
    </div>
  );
};

export default FileIcon;
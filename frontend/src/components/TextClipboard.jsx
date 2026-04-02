import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { saveText } from '../api';
import { FaCopy } from 'react-icons/fa';
import CodeModal from './CodeModal';

const TextClipboard = () => {
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [savedShortId, setSavedShortId] = useState(null);

  const handleSave = async () => {
    if (!content.trim()) {
      toast.error('Please enter some text');
      return;
    }

    setSaving(true);
    try {
      const result = await saveText(content);
      const shortId = result.shortId;
      setSavedShortId(shortId);
      setShowModal(true);
      setContent('');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to save text');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="glass-card rounded-2xl p-4 sm:p-6">
      <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-1 sm:mb-2">
        Online Clipboard
      </h2>
      <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">Share text instantly – auto-delete after 24h</p>
      
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Paste or type your text here..."
        rows="6"
        className="input-field resize-none text-sm sm:text-base"
      />
      
      <button
        onClick={handleSave}
        disabled={saving}
        className="btn-primary mt-4 w-full flex items-center justify-center space-x-2 text-sm sm:text-base"
      >
        {saving ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            <span>Saving...</span>
          </>
        ) : (
          <>
            <FaCopy />
            <span>Save & Get Link</span>
          </>
        )}
      </button>
      
      {showModal && (
        <CodeModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          shortId={savedShortId}
          type="text"
        />
      )}
    </div>
  );
};

export default TextClipboard;
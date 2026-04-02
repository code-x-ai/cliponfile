import axios from 'axios';

// Use environment variable for API base URL, fallback to '/api' for local dev
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const uploadFiles = async (files) => {
  const formData = new FormData();
  files.forEach(file => formData.append('files', file));
  const response = await axios.post(`${API_BASE_URL}/upload`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const saveText = async (content) => {
  const response = await api.post('/clipboard', { content });
  return response.data;
};

export const getText = async (shortId) => {
  const response = await api.get(`/clipboard/${shortId}`);
  return response.data;
};

export const getBatch = async (shortId) => {
  const response = await api.get(`/file/batch/${shortId}`);
  return response.data;
};

export const getFileUrl = (fileId) => `${API_BASE_URL}/file/${fileId}`;

export const getAnalytics = async (password) => {
  const response = await api.post('/admin/analytics', { password });
  return response.data;
};
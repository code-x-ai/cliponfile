import React, { useState } from 'react';
import { getAnalytics } from '../api';
import toast from 'react-hot-toast';
import { FaChartLine, FaFile, FaDatabase, FaCalendarDay, FaCalendarWeek, FaLock } from 'react-icons/fa';

const Admin = () => {
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await getAnalytics(password);
      setAnalytics(data);
      setAuthenticated(true);
      toast.success('Welcome to Admin Panel');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Invalid password');
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, subValue, icon, color }) => (
    <div className="glass-card rounded-2xl p-4 sm:p-6 hover:shadow-lg transition-all">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h3 className="text-base sm:text-lg font-semibold text-gray-700">{title}</h3>
        <div className={`text-2xl sm:text-3xl ${color}`}>{icon}</div>
      </div>
      <div className="text-2xl sm:text-4xl font-bold text-gray-900 mb-1 sm:mb-2">{value}</div>
      {subValue && <div className="text-xs sm:text-sm text-gray-500">{subValue}</div>}
    </div>
  );

  if (!authenticated) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] px-4">
        <div className="glass-card rounded-2xl p-6 sm:p-8 max-w-md w-full">
          <div className="text-center mb-6">
            <FaLock className="mx-auto text-3xl sm:text-4xl text-blue-600 mb-4" />
            <h1 className="text-xl sm:text-2xl font-bold">Admin Panel</h1>
            <p className="text-gray-600 mt-2 text-sm sm:text-base">Enter password to access analytics</p>
          </div>
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field text-sm sm:text-base"
                placeholder="Password"
                autoFocus
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex justify-center items-center space-x-2 text-sm sm:text-base"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <FaLock />
                  <span>Access Analytics</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Admin Dashboard
        </h1>
        <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">Analytics & Statistics</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <StatCard
          title="Total Files"
          value={analytics.total.files}
          subValue={`${analytics.total.sizeMB} MB total`}
          icon={<FaFile />}
          color="text-blue-600"
        />
        <StatCard
          title="Total Text Clips"
          value={analytics.total.textClips}
          icon={<FaDatabase />}
          color="text-green-600"
        />
        <StatCard
          title="Total Transfers"
          value={analytics.total.files + analytics.total.textClips}
          subValue="Files + Text clips"
          icon={<FaChartLine />}
          color="text-purple-600"
        />
      </div>

      {/* Today's Stats */}
      <div className="glass-card rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8">
        <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 flex items-center space-x-2">
          <FaCalendarDay className="text-blue-600" />
          <span>Today's Activity</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="bg-white/60 rounded-xl p-3 sm:p-4">
            <div className="text-xs sm:text-sm text-gray-500 mb-1">Files Uploaded</div>
            <div className="text-2xl sm:text-3xl font-bold">{analytics.today.files}</div>
            <div className="text-xs sm:text-sm text-gray-500">{analytics.today.sizeMB} MB</div>
          </div>
          <div className="bg-white/60 rounded-xl p-3 sm:p-4">
            <div className="text-xs sm:text-sm text-gray-500 mb-1">Text Clips Created</div>
            <div className="text-2xl sm:text-3xl font-bold">{analytics.today.textClips}</div>
          </div>
        </div>
      </div>

      {/* Last 7 Days */}
      <div className="glass-card rounded-2xl p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 flex items-center space-x-2">
          <FaCalendarWeek className="text-blue-600" />
          <span>Last 7 Days</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="bg-white/60 rounded-xl p-3 sm:p-4">
            <div className="text-xs sm:text-sm text-gray-500 mb-1">Files Uploaded</div>
            <div className="text-2xl sm:text-3xl font-bold">{analytics.last7Days.files}</div>
            <div className="text-xs sm:text-sm text-gray-500">{analytics.last7Days.sizeMB} MB</div>
          </div>
          <div className="bg-white/60 rounded-xl p-3 sm:p-4">
            <div className="text-xs sm:text-sm text-gray-500 mb-1">Text Clips Created</div>
            <div className="text-2xl sm:text-3xl font-bold">{analytics.last7Days.textClips}</div>
          </div>
        </div>
      </div>

      <div className="mt-6 text-center text-gray-400 text-xs sm:text-sm">
        Last updated: {new Date(analytics.timestamp).toLocaleString()}
      </div>
    </div>
  );
};

export default Admin;
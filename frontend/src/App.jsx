import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Home from './pages/Home';
import ViewBatch from './pages/ViewBatch';
import ViewText from './pages/ViewText';
import Admin from './pages/Admin';
import { FaGithub, FaShieldAlt } from 'react-icons/fa';

function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>
      <footer className="py-6 text-gray-500 text-sm border-t border-white/20">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center items-center gap-x-3 gap-y-1">
            <span className="flex items-center space-x-1">
              <FaShieldAlt />
              <span>Auto-delete after 24h</span>
            </span>
            <span className="hidden sm:inline text-gray-400">•</span>
            <span>Max 5 files, 50MB total</span>
            <span className="hidden sm:inline text-gray-400">•</span>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-600 transition-colors flex items-center space-x-1"
            >
              <FaGithub />
              <span>GitHub</span>
            </a>
          </div>
        </div>
      </footer>
      <Toaster position="bottom-right" toastOptions={{
        style: { background: '#333', color: '#fff' },
        success: { duration: 3000 },
        error: { duration: 4000 },
      }} />
    </div>
  );
}

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/view/:shortId" element={<ViewBatch />} />
          <Route path="/text/:shortId" element={<ViewText />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
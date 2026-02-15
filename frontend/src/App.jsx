import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Result from './pages/Result';
import History from './pages/History';
import Status from './pages/Status';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/result" element={<Result />} />
          <Route path="/history" element={<History />} />
          <Route path="/status" element={<Status />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Page Not Found
        </h2>
        <p className="text-gray-600 mb-8">
          The page you're looking for doesn't exist.
        </p>
        <a
          href="/"
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Go Home
        </a>
      </div>
    </div>
  );
}

export default App;
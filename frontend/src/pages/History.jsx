
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAllSpecs, deleteSpec } from '../services/api';

function History() {
  const navigate = useNavigate();
  
  // State
  const [specs, setSpecs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Load specs on component mount
  useEffect(() => {
    loadSpecs();
  }, []);

  // Fetch specs from API
  const loadSpecs = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getAllSpecs();
      setSpecs(data);
    } catch (err) {
      setError('Failed to load specs. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this spec?')) {
      return;
    }

    try {
      await deleteSpec(id);
      // Remove from state
      setSpecs(prev => prev.filter(s => s.id !== id));
    } catch (err) {
      alert('Failed to delete spec');
      console.error(err);
    }
  };

  // Handle view spec
  const handleView = (spec) => {
    navigate('/result', { state: { spec } });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Specification History
          </h1>
          <p className="text-gray-600">
            View your last 5 generated specs
          </p>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            <p className="mt-4 text-gray-600">Loading specs...</p>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Empty state */}
        {!loading && specs.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <div className="text-6xl mb-4">📋</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              No specs yet
            </h2>
            <p className="text-gray-600 mb-6">
              Generate your first specification to see it here
            </p>
            <Link
              to="/"
              className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Create New Spec
            </Link>
          </div>
        )}

        {/* Specs list */}
        {!loading && specs.length > 0 && (
          <div className="space-y-4">
            {specs.map(spec => (
              <SpecCard
                key={spec.id}
                spec={spec}
                onView={handleView}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

        {/* Action button */}
        {!loading && specs.length > 0 && (
          <div className="mt-8">
            <Link
              to="/"
              className="block w-full py-3 px-6 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-center"
            >
              + Create New Spec
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

// Spec card component
function SpecCard({ spec, onView, onDelete }) {
  // Calculate summary stats
  const storiesCount = spec.generated.userStories?.length || 0;
  const tasksCount = spec.generated.engineeringTasks?.length || 0;
  const risksCount = spec.generated.risks?.length || 0;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
        {/* Left side - content */}
        <div className="flex-1 mb-4 sm:mb-0">
          <div className="flex items-center mb-2">
            <span className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded mr-3">
              {spec.id}
            </span>
            <span className="text-sm text-gray-600">
              {new Date(spec.timestamp).toLocaleString()}
            </span>
          </div>
          
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {spec.feature.goal.substring(0, 80)}
            {spec.feature.goal.length > 80 ? '...' : ''}
          </h3>
          
          <p className="text-sm text-gray-600 mb-3">
            <strong>Template:</strong> {spec.feature.template}
          </p>

          {/* Stats */}
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center text-gray-700">
              <span className="mr-1">📖</span>
              <span>{storiesCount} stories</span>
            </div>
            <div className="flex items-center text-gray-700">
              <span className="mr-1">⚙️</span>
              <span>{tasksCount} tasks</span>
            </div>
            <div className="flex items-center text-gray-700">
              <span className="mr-1">⚠️</span>
              <span>{risksCount} risks</span>
            </div>
          </div>
        </div>

        {/* Right side - actions */}
        <div className="flex sm:flex-col gap-2">
          <button
            onClick={() => onView(spec)}
            className="flex-1 sm:flex-none px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm"
          >
            View
          </button>
          <button
            onClick={() => onDelete(spec.id)}
            className="flex-1 sm:flex-none px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default History;
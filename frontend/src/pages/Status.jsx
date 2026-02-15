

import { useState, useEffect } from 'react';
import { getHealthStatus } from '../services/api';

function Status() {
  // State
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastChecked, setLastChecked] = useState(null);

  // Load status on mount and set up auto-refresh
  useEffect(() => {
    loadStatus();
    
    // Refresh every 30 seconds
    const interval = setInterval(() => {
      loadStatus();
    }, 30000);

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, []);

  // Fetch health status
  const loadStatus = async () => {
    try {
      setLoading(true);
      const data = await getHealthStatus();
      setStatus(data);
      setLastChecked(new Date());
    } catch (err) {
      console.error('Failed to load status:', err);
    } finally {
      setLoading(false);
    }
  };

  // Get overall status color
  const getStatusColor = (statusValue) => {
    switch (statusValue) {
      case 'healthy':
        return 'green';
      case 'degraded':
        return 'yellow';
      case 'unhealthy':
        return 'red';
      default:
        return 'gray';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            System Status
          </h1>
          <div className="flex items-center text-gray-600">
            <span>Last checked: </span>
            <span className="ml-2 font-medium">
              {lastChecked ? lastChecked.toLocaleTimeString() : 'Loading...'}
            </span>
            <button
              onClick={loadStatus}
              disabled={loading}
              className="ml-4 text-primary-600 hover:text-primary-700 disabled:opacity-50"
            >
              🔄 Refresh
            </button>
          </div>
        </div>

        {/* Loading state */}
        {loading && !status && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            <p className="mt-4 text-gray-600">Checking system health...</p>
          </div>
        )}

        {/* Status cards */}
        {status && (
          <>
            {/* Overall status */}
            <div className={`bg-${getStatusColor(status.overall)}-50 border-2 border-${getStatusColor(status.overall)}-200 rounded-lg p-6 mb-6`}>
              <div className="flex items-center">
                <StatusIcon status={status.overall} size="large" />
                <div className="ml-4">
                  <h2 className="text-2xl font-bold text-gray-900 capitalize">
                    {status.overall}
                  </h2>
                  <p className="text-gray-600">
                    Overall system status
                  </p>
                </div>
              </div>
            </div>

            {/* Individual checks */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Backend */}
              <StatusCard
                title="Backend Server"
                status={status.checks.backend?.status}
                icon="🖥️"
              >
                <div className="space-y-2 text-sm">
                  <InfoRow label="Message" value={status.checks.backend?.message} />
                  {status.checks.backend?.uptime && (
                    <InfoRow 
                      label="Uptime" 
                      value={`${Math.floor(status.checks.backend.uptime / 60)} min`} 
                    />
                  )}
                  {status.checks.backend?.nodeVersion && (
                    <InfoRow label="Node" value={status.checks.backend.nodeVersion} />
                  )}
                </div>
              </StatusCard>

              {/* Storage */}
              <StatusCard
                title="Storage"
                status={status.checks.storage?.status}
                icon="💾"
              >
                <div className="space-y-2 text-sm">
                  <InfoRow label="Message" value={status.checks.storage?.message} />
                  {status.checks.storage?.specsCount !== undefined && (
                    <InfoRow label="Stored Specs" value={status.checks.storage.specsCount} />
                  )}
                </div>
              </StatusCard>

              {/* LLM API */}
              <StatusCard
                title="Gemini API"
                status={status.checks.llm?.status}
                icon="🤖"
              >
                <div className="space-y-2 text-sm">
                  <InfoRow label="Message" value={status.checks.llm?.message} />
                  {status.checks.llm?.model && (
                    <InfoRow label="Model" value={status.checks.llm.model} />
                  )}
                </div>
              </StatusCard>
            </div>

            {/* Timestamp */}
            <div className="mt-6 text-center text-sm text-gray-500">
              Status as of {new Date(status.timestamp).toLocaleString()}
            </div>

            {/* Info box */}
            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="font-semibold text-blue-900 mb-2">ℹ️ What this means:</h3>
              <ul className="space-y-2 text-blue-800 text-sm">
                <li>• <strong>Healthy:</strong> All systems operational</li>
                <li>• <strong>Degraded:</strong> Some features may be limited</li>
                <li>• <strong>Unhealthy:</strong> Service unavailable</li>
                <li>• Status auto-refreshes every 30 seconds</li>
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// Status icon component
function StatusIcon({ status, size = 'normal' }) {
  const sizeClass = size === 'large' ? 'text-5xl' : 'text-3xl';
  
  if (status === 'healthy') {
    return <div className={`${sizeClass}`}>✅</div>;
  } else if (status === 'degraded') {
    return <div className={`${sizeClass}`}>⚠️</div>;
  } else {
    return <div className={`${sizeClass}`}>❌</div>;
  }
}

// Status card component
function StatusCard({ title, status, icon, children }) {
  const color = status === 'healthy' ? 'green' : status === 'degraded' ? 'yellow' : 'red';
  
  return (
    <div className={`bg-white border-2 border-${color}-200 rounded-lg p-6 hover:shadow-md transition-shadow`}>
      <div className="flex items-center mb-4">
        <span className="text-3xl mr-3">{icon}</span>
        <div>
          <h3 className="font-semibold text-gray-900">{title}</h3>
          <div className="flex items-center mt-1">
            <StatusBadge status={status} />
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}

// Status badge
function StatusBadge({ status }) {
  const colors = {
    healthy: 'bg-green-100 text-green-800',
    degraded: 'bg-yellow-100 text-yellow-800',
    unhealthy: 'bg-red-100 text-red-800'
  };

  return (
    <span className={`text-xs px-2 py-1 rounded-full font-medium ${colors[status] || 'bg-gray-100 text-gray-800'}`}>
      {status || 'unknown'}
    </span>
  );
}

// Info row component
function InfoRow({ label, value }) {
  return (
    <div className="flex justify-between">
      <span className="text-gray-600">{label}:</span>
      <span className="font-medium text-gray-900">{value || 'N/A'}</span>
    </div>
  );
}

export default Status;
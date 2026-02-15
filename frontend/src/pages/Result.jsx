
import { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';

function Result() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get spec from navigation state
  const spec = location.state?.spec;

  // If no spec, redirect to home
  if (!spec) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No results found</h2>
          <Link to="/" className="text-primary-600 hover:text-primary-700">
            Go back to home
          </Link>
        </div>
      </div>
    );
  }

  // State for editing
  const [editableData, setEditableData] = useState(spec.generated);
  const [showExport, setShowExport] = useState(false);

  // Handle export
  const handleExport = (format) => {
    const content = format === 'markdown' 
      ? formatAsMarkdown(spec, editableData)
      : formatAsText(spec, editableData);

    // Create blob and download
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tasks-${Date.now()}.${format === 'markdown' ? 'md' : 'txt'}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Copy to clipboard
  const handleCopy = () => {
    const content = formatAsMarkdown(spec, editableData);
    navigator.clipboard.writeText(content);
    alert('Copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Generated Tasks
              </h1>
              <p className="text-gray-600">
                {new Date(spec.timestamp).toLocaleString()}
              </p>
            </div>
            <div className="mt-4 sm:mt-0 space-x-3">
              <button
                onClick={handleCopy}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                📋 Copy
              </button>
              <button
                onClick={() => setShowExport(!showExport)}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                📥 Export
              </button>
            </div>
          </div>

          {/* Export options */}
          {showExport && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-700 mb-3">Export as:</p>
              <div className="space-x-3">
                <button
                  onClick={() => handleExport('markdown')}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Markdown (.md)
                </button>
                <button
                  onClick={() => handleExport('text')}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Plain Text (.txt)
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Feature Details */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Feature Details</h2>
          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium text-gray-600">Goal:</p>
              <p className="text-gray-900">{spec.feature.goal}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Target Users:</p>
              <p className="text-gray-900">{spec.feature.users}</p>
            </div>
            {spec.feature.constraints && (
              <div>
                <p className="text-sm font-medium text-gray-600">Constraints:</p>
                <p className="text-gray-900">{spec.feature.constraints}</p>
              </div>
            )}
            <div>
              <p className="text-sm font-medium text-gray-600">Template:</p>
              <p className="text-gray-900">{spec.feature.template}</p>
            </div>
          </div>
        </div>

        {/* User Stories */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">📖 User Stories</h2>
          <div className="space-y-4">
            {editableData.userStories?.map((story, index) => (
              <div key={story.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start">
                  <span className="font-mono text-sm text-primary-600 mr-3">{story.id}</span>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2">{story.title}</h3>
                    <p className="text-gray-700 mb-3">{story.description}</p>
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-2">Acceptance Criteria:</p>
                      <ul className="list-disc list-inside space-y-1">
                        {story.acceptanceCriteria?.map((criteria, i) => (
                          <li key={i} className="text-sm text-gray-700">{criteria}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Engineering Tasks */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">⚙️ Engineering Tasks</h2>
          {['Frontend', 'Backend', 'Testing', 'DevOps'].map(category => {
            const tasks = editableData.engineeringTasks?.filter(t => t.category === category);
            if (!tasks || tasks.length === 0) return null;

            return (
              <div key={category} className="mb-6 last:mb-0">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <span className="w-2 h-2 bg-primary-500 rounded-full mr-2"></span>
                  {category}
                </h3>
                <div className="space-y-3">
                  {tasks.map(task => (
                    <div key={task.id} className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 transition-colors">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-start flex-1">
                          <span className="font-mono text-xs text-gray-500 mr-3">{task.id}</span>
                          <h4 className="font-semibold text-gray-900">{task.title}</h4>
                        </div>
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {task.estimatedHours}h
                        </span>
                      </div>
                      <p className="text-gray-700 text-sm mb-3 ml-12">{task.description}</p>
                      <div className="ml-12">
                        <p className="text-xs font-medium text-gray-600 mb-1">Acceptance Criteria:</p>
                        <ul className="list-disc list-inside space-y-1">
                          {task.acceptanceCriteria?.map((criteria, i) => (
                            <li key={i} className="text-xs text-gray-600">{criteria}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Risks */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">⚠️ Risks & Unknowns</h2>
          <div className="space-y-3">
            {editableData.risks?.map(risk => (
              <div key={risk.id} className="border-l-4 border-yellow-500 bg-yellow-50 p-4 rounded-r-lg">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">{risk.title}</h4>
                  <span className={`text-xs px-2 py-1 rounded ${
                    risk.severity === 'High' ? 'bg-red-100 text-red-700' :
                    risk.severity === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {risk.severity}
                  </span>
                </div>
                <p className="text-gray-700 text-sm mb-2">{risk.description}</p>
                <div className="bg-white p-3 rounded mt-2">
                  <p className="text-xs font-medium text-gray-600 mb-1">Mitigation:</p>
                  <p className="text-sm text-gray-700">{risk.mitigation}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => navigate('/')}
            className="flex-1 py-3 px-6 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            ← Create New Spec
          </button>
          <Link
            to="/history"
            className="flex-1 py-3 px-6 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-center"
          >
            View History →
          </Link>
        </div>
      </div>
    </div>
  );
}

// Format as markdown
function formatAsMarkdown(spec, data) {
  let md = `# Tasks Specification\n\n`;
  md += `**Generated:** ${new Date(spec.timestamp).toLocaleString()}\n\n`;
  md += `## Feature Details\n\n`;
  md += `**Goal:** ${spec.feature.goal}\n\n`;
  md += `**Target Users:** ${spec.feature.users}\n\n`;
  if (spec.feature.constraints) md += `**Constraints:** ${spec.feature.constraints}\n\n`;
  
  md += `## User Stories\n\n`;
  data.userStories?.forEach(story => {
    md += `### ${story.id}: ${story.title}\n\n`;
    md += `${story.description}\n\n`;
    md += `**Acceptance Criteria:**\n`;
    story.acceptanceCriteria?.forEach(c => md += `- ${c}\n`);
    md += `\n`;
  });

  md += `## Engineering Tasks\n\n`;
  ['Frontend', 'Backend', 'Testing', 'DevOps'].forEach(category => {
    const tasks = data.engineeringTasks?.filter(t => t.category === category);
    if (tasks && tasks.length > 0) {
      md += `### ${category}\n\n`;
      tasks.forEach(task => {
        md += `#### ${task.id}: ${task.title} (${task.estimatedHours}h)\n\n`;
        md += `${task.description}\n\n`;
        md += `**Acceptance Criteria:**\n`;
        task.acceptanceCriteria?.forEach(c => md += `- ${c}\n`);
        md += `\n`;
      });
    }
  });

  md += `## Risks & Unknowns\n\n`;
  data.risks?.forEach(risk => {
    md += `### ${risk.title} [${risk.severity}]\n\n`;
    md += `${risk.description}\n\n`;
    md += `**Mitigation:** ${risk.mitigation}\n\n`;
  });

  return md;
}

// Format as plain text
function formatAsText(spec, data) {
  return formatAsMarkdown(spec, data).replace(/[#*]/g, '');
}

export default Result;
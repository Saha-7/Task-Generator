
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateTasks } from '../services/Api.js';

function Home() {
  const navigate = useNavigate();

  // Form state - stores user input
  const [formData, setFormData] = useState({
    goal: '',
    users: '',
    constraints: '',
    template: 'web' // Default template
  });

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Available templates
  const templates = [
    { value: 'web', label: 'Web Application', icon: '🌐' },
    { value: 'mobile', label: 'Mobile App', icon: '📱' },
    { value: 'internal', label: 'Internal Tool', icon: '🔧' }
  ];

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user types
    if (error) setError('');
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload
    
    // Validate input
    if (!formData.goal || formData.goal.trim().length < 10) {
      setError('Goal must be at least 10 characters');
      return;
    }

    if (!formData.users || formData.users.trim().length === 0) {
      setError('Please specify target users');
      return;
    }

    try {
      setLoading(true);
      setError('');

      // Call API to generate tasks
      const spec = await generateTasks(formData);

      // Navigate to results page with the generated spec
      navigate('/result', { state: { spec } });

    } catch (err) {
      setError(err.message || 'Failed to generate tasks. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Tasks Generator
          </h1>
          <p className="text-xl text-gray-600">
            Transform your feature ideas into actionable user stories and engineering tasks
          </p>
        </div>

        {/* Steps Guide */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            How it works:
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StepCard number="1" title="Fill Form" icon="📝">
              Describe your feature idea
            </StepCard>
            <StepCard number="2" title="Generate" icon="✨">
              AI creates user stories & tasks
            </StepCard>
            <StepCard number="3" title="Edit" icon="✏️">
              Customize and organize
            </StepCard>
            <StepCard number="4" title="Export" icon="📄">
              Download as text or markdown
            </StepCard>
          </div>
        </div>

        {/* Main Form */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6 ">
            {/* Template Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Project Template
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {templates.map(template => (
                  <button
                    key={template.value}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, template: template.value }))}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      formData.template === template.value
                        ? 'border-primary-500 bg-primary-50 ring-2 ring-primary-200'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-3xl mb-2">{template.icon}</div>
                    <div className="font-medium text-gray-900">{template.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Goal Input */}
            <div>
              <label htmlFor="goal" className="block text-sm font-medium text-gray-700 mb-2">
                Feature Goal <span className="text-red-500">*</span>
              </label>
              <textarea
                id="goal"
                name="goal"
                value={formData.goal}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                placeholder="E.g., Build a user authentication system that allows users to sign up, log in, and manage their profiles securely"
                required
              />
              <p className="mt-1 text-sm text-gray-500">
                What should this feature accomplish? (Min 10 characters)
              </p>
            </div>

            {/* Target Users Input */}
            <div>
              <label htmlFor="users" className="block text-sm font-medium text-gray-700 mb-2">
                Target Users <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="users"
                name="users"
                value={formData.users}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                placeholder="E.g., End users who want to create accounts and access personalized features"
                required
              />
              <p className="mt-1 text-sm text-gray-500">
                Who will use this feature?
              </p>
            </div>

            {/* Constraints Input */}
            <div>
              <label htmlFor="constraints" className="block text-sm font-medium text-gray-700 mb-2">
                Constraints (Optional)
              </label>
              <textarea
                id="constraints"
                name="constraints"
                value={formData.constraints}
                onChange={handleChange}
                rows="2"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                placeholder="E.g., Must integrate with existing database, needs to support OAuth, should work on mobile devices"
              />
              <p className="mt-1 text-sm text-gray-500">
                Any technical or business constraints?
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <div className='flex justify-center'>
              <button
              type="submit"
              disabled={loading}
              className={`w-1/2 bg-blue-500 py-3 px-6 rounded-lg font-medium text-black transition-all ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-primary-600 hover:bg-primary-700 shadow-lg hover:shadow-xl'
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Generating Tasks...
                </span>
              ) : (
                '✨ Generate User Stories & Tasks'
              )}
            </button>
            </div>
          </form>
        </div>

        {/* Info Box */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-2">💡 What you'll get:</h3>
          <ul className="space-y-2 text-blue-800">
            <li>• User stories with acceptance criteria</li>
            <li>• Detailed engineering tasks organized by category</li>
            <li>• Risk assessment and potential unknowns</li>
            <li>• Ability to edit, reorder, and export</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// Step card component for the guide
function StepCard({ number, title, icon, children }) {
  return (
    <div className="text-center p-4 bg-gray-50 rounded-lg">
      <div className="text-2xl mb-2">{icon}</div>
      <div className="font-semibold text-gray-900 mb-1">
        {number}. {title}
      </div>
      <div className="text-sm text-gray-600">{children}</div>
    </div>
  );
}

export default Home;
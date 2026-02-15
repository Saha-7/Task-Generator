// Gemini AI Service - FREE API!
// Using direct REST API for better compatibility

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';
// Generate tasks using Gemini (FREE!)
export async function generateTasks(featureData) {
  try {
    const { goal, users, constraints, template } = featureData;

    // Validate
    if (!goal || goal.length < 10) {
      throw new Error('Goal must be at least 10 characters');
    }
    if (!users) {
      throw new Error('Users are required');
    }

    // Build prompt
    const prompt = `You are a product manager. Generate a project breakdown in JSON format.

FEATURE:
Goal: ${goal}
Users: ${users}
Template: ${template}
${constraints ? `Constraints: ${constraints}` : ''}

Generate ONLY valid JSON with this structure (no markdown, no explanation):
{
  "userStories": [
    {
      "id": "US-1",
      "title": "Story title",
      "description": "As a [user], I want [goal], so that [benefit]",
      "acceptanceCriteria": ["criterion 1", "criterion 2"]
    }
  ],
  "engineeringTasks": [
    {
      "id": "TASK-1",
      "title": "Task title",
      "description": "Details",
      "category": "Frontend",
      "estimatedHours": 4,
      "acceptanceCriteria": ["criterion 1"]
    }
  ],
  "risks": [
    {
      "id": "RISK-1",
      "title": "Risk title",
      "description": "Details",
      "severity": "Medium",
      "mitigation": "How to handle"
    }
  ]
}

Generate 3-5 user stories, 5-10 tasks (mix of Frontend, Backend, Testing, DevOps), and 2-4 risks.`;

    // Call Gemini REST API directly
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2048,
        }
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Gemini API error: ${error.error?.message || response.statusText}`);
    }

    const data = await response.json();
    const text = data.candidates[0].content.parts[0].text;

    // Parse JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to parse response');
    }

    const result = JSON.parse(jsonMatch[0]);
    
    if (!result.userStories || !result.engineeringTasks) {
      throw new Error('Invalid response format');
    }

    return result;

  } catch (error) {
    console.error('Gemini error:', error);
    throw new Error(`Failed to generate: ${error.message}`);
  }
}

// Check API health
export async function checkApiHealth() {
  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: 'Hello'
          }]
        }]
      })
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        status: 'unhealthy',
        message: error.error?.message || 'API check failed'
      };
    }
    
    return {
      status: 'healthy',
      message: 'Gemini API is accessible',
      model: 'gemini-2.5-flash'
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      message: error.message
    };
  }
}
// Gemini AI Service - FREE API!
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

export async function generateTasks(featureData) {
  try {
    const { goal, users, constraints, template } = featureData;

    if (!goal || goal.length < 10) {
      throw new Error('Goal must be at least 10 characters');
    }
    if (!users) {
      throw new Error('Users are required');
    }

    console.log('🤖 Calling Gemini...');

    const prompt = `You are a product manager. Generate a project breakdown in VALID JSON format.

FEATURE:
Goal: ${goal}
Users: ${users}
Template: ${template}
${constraints ? `Constraints: ${constraints}` : ''}

CRITICAL: Return ONLY valid JSON. No markdown, no code fences, no explanation.

Required JSON structure:
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
      "mitigation": "Solution"
    }
  ]
}

Generate 3-5 user stories, 5-10 tasks (categories: Frontend, Backend, Testing, DevOps), and 2-4 risks.
Return ONLY the JSON object above, nothing else.`;

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { 
          temperature: 0.3,
          maxOutputTokens: 4096
        }
      })
    });

    if (!response.ok) {
      const err = await response.json();
      console.error('❌ API Error:', err);
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    const text = data.candidates[0].content.parts[0].text;
    console.log('✅ Got response from Gemini');

    // Clean response - remove markdown
    let cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    // Extract JSON
    const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('❌ No JSON in response');
      throw new Error('No JSON in response');
    }

    let result;
    try {
      result = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.error('❌ Parse error:', parseError.message);
      // Try fixing common issues
      let fixed = jsonMatch[0].replace(/,(\s*[}\]])/g, '$1');
      result = JSON.parse(fixed);
      console.log('✅ Fixed and parsed');
    }
    
    if (!result.userStories || !result.engineeringTasks) {
      throw new Error('Invalid format');
    }

    console.log('✅ Success! Stories:', result.userStories?.length, 'Tasks:', result.engineeringTasks?.length);
    return result;

  } catch (error) {
    console.error('❌ Error:', error.message);
    throw error;
  }
}

export async function checkApiHealth() {
  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: 'Hello' }] }]
      })
    });

    if (!response.ok) {
      return { status: 'unhealthy', message: 'API check failed' };
    }
    
    return {
      status: 'healthy',
      message: 'Gemini API accessible',
      model: 'gemini-2.5-flash'
    };
  } catch (error) {
    return { status: 'unhealthy', message: error.message };
  }
}
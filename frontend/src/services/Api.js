

// The base URL for our API
// In development, this uses the proxy defined in package.json
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Generate tasks from feature idea
 * 
 * @param {Object} featureData - Feature information
 * @returns {Promise<Object>} Generated spec
 */
export async function generateTasks(featureData) {
  try {
    const response = await fetch(`${API_BASE}/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(featureData),
    });

    // Check if request was successful
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to generate tasks');
    }

    const data = await response.json();
    return data.spec; // Return the generated spec
  } catch (error) {
    console.error('Error generating tasks:', error);
    throw error;
  }
}

/**
 * Get all saved specs (last 5)
 * 
 * @returns {Promise<Array>} Array of specs
 */
export async function getAllSpecs() {
  try {
    const response = await fetch(`${API_BASE}/specs`);

    if (!response.ok) {
      throw new Error('Failed to fetch specs');
    }

    const data = await response.json();
    return data.specs; // Return array of specs
  } catch (error) {
    console.error('Error fetching specs:', error);
    throw error;
  }
}

/**
 * Get a single spec by ID
 * 
 * @param {string} id - Spec ID
 * @returns {Promise<Object>} Single spec
 */
export async function getSpecById(id) {
  try {
    const response = await fetch(`${API_BASE}/specs/${id}`);

    if (!response.ok) {
      throw new Error('Spec not found');
    }

    const data = await response.json();
    return data.spec; // Return the spec
  } catch (error) {
    console.error('Error fetching spec:', error);
    throw error;
  }
}

/**
 * Delete a spec by ID
 * 
 * @param {string} id - Spec ID to delete
 * @returns {Promise<boolean>} Success status
 */
export async function deleteSpec(id) {
  try {
    const response = await fetch(`${API_BASE}/specs/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete spec');
    }

    return true;
  } catch (error) {
    console.error('Error deleting spec:', error);
    throw error;
  }
}

/**
 * Get system health status
 * 
 * @returns {Promise<Object>} Health status
 */
export async function getHealthStatus() {
  try {
    const response = await fetch(`${API_BASE}/status`);
    const data = await response.json();
    return data; // Return full health status
  } catch (error) {
    console.error('Error fetching health status:', error);
    // Return unhealthy status if request fails
    return {
      overall: 'unhealthy',
      error: error.message,
      checks: {
        backend: { status: 'unhealthy', message: 'Cannot connect to server' }
      }
    };
  }
}
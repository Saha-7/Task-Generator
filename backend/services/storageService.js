// Simple file storage
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const SPECS_FILE = join(__dirname, '../data/specs.json');
const MAX_SPECS = 5;

// Read all specs
export function getAllSpecs() {
  try {
    const data = fs.readFileSync(SPECS_FILE, 'utf8');
    const specs = JSON.parse(data);
    return specs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  } catch (error) {
    return [];
  }
}

// Save new spec
export function saveSpec(specData) {
  try {
    let specs = getAllSpecs();
    
    const newSpec = {
      id: `spec_${Date.now()}`,
      timestamp: new Date().toISOString(),
      ...specData
    };

    specs.unshift(newSpec);
    
    if (specs.length > MAX_SPECS) {
      specs = specs.slice(0, MAX_SPECS);
    }

    fs.writeFileSync(SPECS_FILE, JSON.stringify(specs, null, 2));
    return newSpec;
  } catch (error) {
    throw new Error('Failed to save spec');
  }
}

// Get spec by ID
export function getSpecById(id) {
  const specs = getAllSpecs();
  return specs.find(s => s.id === id) || null;
}

// Delete spec
export function deleteSpec(id) {
  try {
    const specs = getAllSpecs();
    const filtered = specs.filter(s => s.id !== id);
    
    if (filtered.length === specs.length) {
      return false;
    }
    
    fs.writeFileSync(SPECS_FILE, JSON.stringify(filtered, null, 2));
    return true;
  } catch (error) {
    return false;
  }
}

// Health check
export function checkStorageHealth() {
  try {
    getAllSpecs();
    return {
      status: 'healthy',
      message: 'Storage working',
      specsCount: getAllSpecs().length
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      message: error.message
    };
  }
}
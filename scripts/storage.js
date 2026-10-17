const KEY = 'app:campus_life_data';

export const loadRecords = () => {
  try {
    const data = localStorage.getItem(KEY);
    const parsed = data ? JSON.parse(data): [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error('Failed to load records from localStorage', e);
    return [];
  }
};

export const saveRecords = (data) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save records to localStorage', e);
  }
};

export const validateJSONStructure = (jsonString) => {
  try {
    const parsed = JSON.parse(jsonString);
    if (!Array.isArray(parsed)) return { valid: false, error: 'Root Json structure must be an array.'};

    for (const item of parsed) {
      if (!item || typeof item !== 'object') {
        return {valid: false, error: 'Each item must be an object' };
      }

      if (!item.id || !item.title || typeof item.duration !== 'number' || !item.tag || !item.dueDate) {
        return { valid: false, error: `Invalid planner record structure detected for record ID: ${item.id || 'unknown'}` };
      }
    }

    return { valid: true, data: parsed };
  } catch (e) {
    return { valid: false, error: 'Malformed JSON syntax.' };
  }
};
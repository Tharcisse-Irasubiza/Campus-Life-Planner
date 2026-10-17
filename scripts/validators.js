export const rules = {
  title: /^\S(?:.*\S)?$/,
  duration: /^(0|[1-9]\d*)(\.\d{1,2})?$/,
  dueDate: /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/,
  tag: /^[A-Za-z]+(?:[ -][A-Za-z]+)*$/,
  duplicateWords: /\b(\w+)\s+\1\b/i
};

export const validateField = (fieldName, value) => {
  const safeValue = String(value ?? '').trim();

  if (fieldName === 'title') {
    if (!rules.title.test(safeValue)) return 'Title cannot start or end with whitespace.';
    if (rules.duplicateWords.test(safeValue)) return 'Warning: Title contains consecutive duplicate words.';
    return '';
  }

  if (fieldName === 'duration') {
    return rules.duration.test(safeValue) ? '' : 'Duration must be a positive number of minutes.';
  }

  if (fieldName === 'dueDate') {
    return rules.dueDate.test(safeValue) ? '' : 'Date must be in YYYY-MM-DD format.';
  }

  if (fieldName === 'tag') {
    return rules.tag.test(safeValue) ? '' : 'Tag may only contain letters, spaces, and hyphens.';
  }

  if (rules[fieldName]) {
    return rules[fieldName].test(safeValue) ? '' : 'Invalid format for ${fieldName}.';
  }

  return '';
};
// validate.js - Name validation and sanitization rules

import { isBlocklisted } from './blocklist.js';

/**
 * Counts user-perceived grapheme clusters.
 * Uses Intl.Segmenter if available, falling back to spread operator.
 * @param {string} str
 * @returns {number}
 */
export function countGraphemes(str) {
  if (!str) return 0;
  if (typeof Intl !== 'undefined' && Intl.Segmenter) {
    const segmenter = new Intl.Segmenter(undefined, { granularity: 'grapheme' });
    let count = 0;
    for (const _ of segmenter.segment(str)) {
      count++;
    }
    return count;
  }
  return [...str].length;
}

/**
 * Normalizes input name: trims ends and collapses repeated whitespace.
 * @param {string} str
 * @returns {string}
 */
export function normalizeName(str) {
  if (typeof str !== 'string') return '';
  return str.trim().replace(/\s+/g, ' ');
}

// Regex allowing letters in any language, combining marks, spaces, dot, apostrophe, hyphen
const ALLOWED_NAME_REGEX = /^[\p{L}\p{M} .'-]+$/u;

/**
 * Validates a name according to Section 6 rules.
 * @param {string} name
 * @param {object} options
 * @param {boolean} [options.isRequired=true]
 * @param {number} [options.maxLength=16]
 * @returns {{ valid: boolean, error: string | null, cleanName: string }}
 */
export function validateName(name, options = {}) {
  const isRequired = options.isRequired !== false;
  const maxLength = options.maxLength || 16;
  const clean = normalizeName(name);

  // 1. Check empty
  if (clean.length === 0) {
    if (isRequired) {
      return {
        valid: false,
        error: 'Please type a name.',
        cleanName: ''
      };
    }
    return {
      valid: true,
      error: null,
      cleanName: ''
    };
  }

  // 2. Allowed characters check (letters, combining marks, spaces, dot, apostrophe, hyphen)
  if (!ALLOWED_NAME_REGEX.test(clean)) {
    return {
      valid: false,
      error: 'Names can only have letters and spaces.',
      cleanName: clean
    };
  }

  // 3. Length check using grapheme clusters
  const length = countGraphemes(clean);
  if (length > maxLength) {
    const errorMsg = maxLength === 16
      ? 'Please keep it under 16 letters.'
      : `Please keep it under ${maxLength} letters.`;
    return {
      valid: false,
      error: errorMsg,
      cleanName: clean
    };
  }

  // 4. Blocklist check
  if (isBlocklisted(clean)) {
    return {
      valid: false,
      error: 'Please choose a different name.',
      cleanName: clean
    };
  }

  return {
    valid: true,
    error: null,
    cleanName: clean
  };
}

/**
 * Validates recipient name (required, 1 to 16 characters).
 * @param {string} name
 * @returns {{ valid: boolean, error: string | null, cleanName: string }}
 */
export function validateRecipient(name) {
  return validateName(name, { isRequired: true, maxLength: 16 });
}

/**
 * Validates sender name (optional, 0 to 20 characters).
 * @param {string} name
 * @returns {{ valid: boolean, error: string | null, cleanName: string }}
 */
export function validateSender(name) {
  return validateName(name, { isRequired: false, maxLength: 20 });
}

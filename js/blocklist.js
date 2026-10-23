// blocklist.js - List of blocked words
// You can add more words to this list.
// Comparisons are made in lowercase, ignoring spaces, dots, and hyphens.

export const BLOCKLIST = [
  // Common English profanity and abusive terms
  'abuse',
  'ass',
  'asshole',
  'bastard',
  'bitch',
  'bloody',
  'bullshit',
  'crap',
  'cunt',
  'damn',
  'dick',
  'douche',
  'fag',
  'faggot',
  'fuck',
  'fucker',
  'fucking',
  'hate',
  'hell',
  'idiot',
  'kill',
  'moron',
  'motherfucker',
  'nazi',
  'nigger',
  'nigga',
  'piss',
  'prick',
  'pussy',
  'retard',
  'shit',
  'slut',
  'stupid',
  'suck',
  'terrorist',
  'twat',
  'ugly',
  'whore',

  // Common Hindi abusive terms (romanized)
  'bhenchod',
  'behenchod',
  'madarchod',
  'chutiya',
  'bhosdike',
  'gandu',
  'harami',
  'kamina',
  'kameena',
  'randi',
  'saala',
  'sala',
  'bhadwa',
  'choot',
  'lauda',
  'loda',

  // Common Tamil abusive terms (romanized)
  'thevidiya',
  'thevidya',
  'otha',
  'othaa',
  'omala',
  'punda',
  'punde',
  'sunni',
  'kena',
  'kenapunda',
  'mayiru',
  'koothi',
  'porambokku'
];

/**
 * Checks whether a given name contains any blocked words.
 * Comparison strips spaces, dots, and hyphens and checks in lowercase.
 * @param {string} text - Input name to verify.
 * @returns {boolean} True if text matches blocklist.
 */
export function isBlocklisted(text) {
  if (!text) return false;
  // Strip spaces, dots, and hyphens, convert to lower case
  const normalized = text.toLowerCase().replace(/[\s.\-']/g, '');
  if (!normalized) return false;

  for (let i = 0; i < BLOCKLIST.length; i++) {
    const word = BLOCKLIST[i];
    if (normalized.includes(word)) {
      return true;
    }
  }
  return false;
}

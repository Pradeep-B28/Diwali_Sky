// link.js - Builds and reads private share links via URL hash

import { validateRecipient, validateSender } from './validate.js';

/**
 * Encodes a Uint8Array into a base64url string.
 * @param {Uint8Array} bytes
 * @returns {string}
 */
export function bytesToBase64Url(bytes) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  const base64 = btoa(binary);
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/**
 * Decodes a base64url string into a Uint8Array.
 * @param {string} base64url
 * @returns {Uint8Array}
 */
export function base64UrlToBytes(base64url) {
  let base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4 !== 0) {
    base64 += '=';
  }
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

/**
 * Encodes payload object into base64url string using TextEncoder.
 * @param {object} payload
 * @returns {string}
 */
export function encodePayload(payload) {
  const jsonStr = JSON.stringify(payload);
  const utf8Bytes = new TextEncoder().encode(jsonStr);
  return bytesToBase64Url(utf8Bytes);
}

/**
 * Decodes base64url string into object using TextDecoder.
 * @param {string} encoded
 * @returns {object}
 */
export function decodePayload(encoded) {
  const bytes = base64UrlToBytes(encoded);
  const jsonStr = new TextDecoder().decode(bytes);
  return JSON.parse(jsonStr);
}

/**
 * Builds a complete shareable URL with show data in the hash.
 * @param {string} recipient - Their name
 * @param {string} [sender=''] - Your name
 * @param {string} [greeting='diwali'] - 'diwali' or 'deepavali'
 * @param {string} [baseUrl] - Optional custom base URL
 * @returns {string}
 */
export function buildShareLink(recipient, sender = '', greeting = 'diwali', baseUrl = null) {
  const cleanRecipient = recipient ? recipient.trim() : '';
  const cleanSender = sender ? sender.trim() : '';
  const cleanGreeting = greeting === 'deepavali' ? 'deepavali' : 'diwali';

  const payload = {
    v: 1,
    t: cleanRecipient,
    f: cleanSender,
    g: cleanGreeting
  };

  const encoded = encodePayload(payload);
  const base = baseUrl || (window.location.origin + window.location.pathname);
  return `${base}#s=${encoded}`;
}

/**
 * Parses and validates hash payload from a URL or current window hash.
 * @param {string} [hashString]
 * @returns {{ hasShowData: boolean, valid: boolean, data?: { recipient: string, sender: string, greeting: string }, error?: string }}
 */
export function parseShareHash(hashString = null) {
  const hash = hashString !== null ? hashString : window.location.hash;

  if (!hash || !hash.includes('#s=')) {
    return { hasShowData: false, valid: false };
  }

  const rawPayload = hash.split('#s=')[1];
  if (!rawPayload) {
    return { hasShowData: true, valid: false, error: 'Empty payload' };
  }

  try {
    const data = decodePayload(rawPayload);

    // Version check
    if (!data || data.v !== 1) {
      return { hasShowData: true, valid: false, error: 'Unsupported version' };
    }

    // Validate recipient
    const recipientResult = validateRecipient(data.t);
    if (!recipientResult.valid) {
      return { hasShowData: true, valid: false, error: recipientResult.error };
    }

    // Validate sender
    const senderResult = validateSender(data.f || '');
    if (!senderResult.valid) {
      return { hasShowData: true, valid: false, error: senderResult.error };
    }

    // Validate greeting
    const greeting = data.g === 'deepavali' ? 'deepavali' : 'diwali';

    return {
      hasShowData: true,
      valid: true,
      data: {
        recipient: recipientResult.cleanName,
        sender: senderResult.cleanName,
        greeting: greeting
      }
    };
  } catch (err) {
    return {
      hasShowData: true,
      valid: false,
      error: 'Corrupted link format'
    };
  }
}

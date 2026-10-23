// share.js - Sharing helpers for WhatsApp, native Web Share, and clipboard copy

/**
 * Creates the formatted share message.
 * @param {string} linkUrl
 * @param {string} [greeting='diwali']
 * @returns {string}
 */
export function getShareMessage(linkUrl, greeting = 'diwali') {
  const festival = greeting === 'deepavali' ? 'Deepavali' : 'Diwali';
  return `I made a ${festival} surprise for you. Open it with sound on: ${linkUrl}`;
}

/**
 * Opens WhatsApp with the pre-filled share message.
 * @param {string} linkUrl
 * @param {string} [greeting='diwali']
 */
export function shareToWhatsApp(linkUrl, greeting = 'diwali') {
  const message = getShareMessage(linkUrl, greeting);
  const waUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
  window.open(waUrl, '_blank', 'noopener,noreferrer');
}

/**
 * Checks whether native Web Share API is supported.
 * @returns {boolean}
 */
export function canNativeShare() {
  return typeof navigator !== 'undefined' && typeof navigator.share === 'function';
}

/**
 * Shares via device native share sheet if supported.
 * @param {string} linkUrl
 * @param {string} [greeting='diwali']
 * @returns {Promise<boolean>} True if shared or user handled, false if unsupported.
 */
export async function shareNative(linkUrl, greeting = 'diwali') {
  if (!canNativeShare()) return false;

  const festival = greeting === 'deepavali' ? 'Deepavali' : 'Diwali';
  const message = `I made a ${festival} surprise for you. Open it with sound on:`;

  try {
    await navigator.share({
      title: 'Diwali Sky',
      text: message,
      url: linkUrl
    });
    return true;
  } catch (err) {
    // User cancelled or aborted sharing; ignore quietly
    return false;
  }
}

/**
 * Copies the link URL to the user clipboard.
 * Uses navigator.clipboard with hidden textarea fallback for older browsers.
 * @param {string} textToCopy
 * @returns {Promise<boolean>}
 */
export async function copyToClipboard(textToCopy) {
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(textToCopy);
      return true;
    } catch (err) {
      // Fallback below
    }
  }

  // Fallback using temporary textarea
  try {
    const textArea = document.createElement('textarea');
    textArea.value = textToCopy;
    textArea.style.position = 'fixed';
    textArea.style.top = '-9999px';
    textArea.style.left = '-9999px';
    textArea.setAttribute('readonly', '');
    document.body.appendChild(textArea);
    textArea.select();
    const success = document.execCommand('copy');
    document.body.removeChild(textArea);
    return success;
  } catch (err) {
    return false;
  }
}

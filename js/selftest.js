// selftest.js - Automated verification suite run with ?test=1

import { validateRecipient, validateSender } from './validate.js';
import { encodePayload, decodePayload, parseShareHash, buildShareLink } from './link.js';
import { sampleNamePoints } from './nameText.js';

export async function runSelfTests() {
  console.log('%c[Diwali Sky] Running Self-Test Suite...', 'color:#059669;font-weight:bold;font-size:14px;');

  const results = [];
  let totalTests = 0;
  let passedTests = 0;

  function record(category, testName, passed, details = '') {
    totalTests++;
    if (passed) passedTests++;
    results.push({
      Category: category,
      Test: testName,
      Status: passed ? 'PASS' : 'FAIL',
      Details: details
    });
  }

  // ==========================================
  // Suite 1: Link round trip with 20 sample names
  // ==========================================
  const sampleNames = [
    'Priya',
    'Vivek',
    'A',
    'Vijayalakshmi',
    'Sri Devi',
    "D'Souza",
    'Mary-Jane',
    '\u0B85\u0BA9\u0BCD\u0BAA\u0BC1', // அன்பு (Tamil)
    '\u092A\u094D\u0930\u093F\u092F\u093E', // प्रिया (Hindi)
    'Kavitha',
    'Jean-Luc',
    "O'Connor",
    'Van Der Beek',
    'Ananya',
    'Rajesh',
    'Meenakshi',
    'Suresh',
    'Amit',
    'Nisha',
    '\u0BA4\u0BC0\u0BAA\u0BA9\u0BCD' // தீபன் (Tamil)
  ];

  sampleNames.forEach((name, idx) => {
    try {
      const link = buildShareLink(name, 'Vivek', 'diwali', 'https://wrench-wise.com/');
      const hashPart = link.substring(link.indexOf('#'));
      const parsed = parseShareHash(hashPart);

      const matches = parsed.valid && parsed.data.recipient === name && parsed.data.sender === 'Vivek';
      record('1. Link Round Trip', `Sample ${idx + 1}: "${name}"`, matches, matches ? 'Exact round-trip match' : `Mismatch or invalid: ${JSON.stringify(parsed)}`);
    } catch (err) {
      record('1. Link Round Trip', `Sample ${idx + 1}: "${name}"`, false, err.message);
    }
  });

  // ==========================================
  // Suite 2: Rejections
  // ==========================================
  // 1. Empty string
  const rEmpty = validateRecipient('');
  record('2. Rejections', 'Empty recipient rejected', !rEmpty.valid && rEmpty.error === 'Please type a name.', rEmpty.error);

  // 2. 17 or more letters
  const rLong = validateRecipient('Supercalifragilistic');
  record('2. Rejections', '17+ letters rejected', !rLong.valid && rLong.error === 'Please keep it under 16 letters.', rLong.error);

  // 3. Digits
  const rDigits = validateRecipient('Rahul123');
  record('2. Rejections', 'Digits rejected', !rDigits.valid && rDigits.error === 'Names can only have letters and spaces.', rDigits.error);

  // 4. <script> tag
  const rScript = validateRecipient('<script>alert(1)</script>');
  record('2. Rejections', 'Script tags rejected', !rScript.valid && rScript.error === 'Names can only have letters and spaces.', rScript.error);

  // 5. Web address
  const rUrl = validateRecipient('https://wrench-wise.com');
  record('2. Rejections', 'Web URL rejected', !rUrl.valid && rUrl.error === 'Names can only have letters and spaces.', rUrl.error);

  // 6. Emoji
  const rEmoji = validateRecipient('Diwali \uD83C\uDF89');
  record('2. Rejections', 'Emoji rejected', !rEmoji.valid && rEmoji.error === 'Names can only have letters and spaces.', rEmoji.error);

  // 7. Blocklisted word
  const rBlock = validateRecipient('abuse');
  record('2. Rejections', 'Blocklisted word rejected', !rBlock.valid && rBlock.error === 'Please choose a different name.', rBlock.error);

  // 8. Obfuscated blocklisted word
  const rBlockObf = validateRecipient('f-u.c k');
  record('2. Rejections', 'Obfuscated blocklist rejected', !rBlockObf.valid && rBlockObf.error === 'Please choose a different name.', rBlockObf.error);

  // ==========================================
  // Suite 3: Name Points & Bounds Check
  // ==========================================
  const testNames = ['A', 'Priya', 'Vijayalakshmi', 'Sri Devi', '\u0B85\u0BA9\u0BCD\u0BAA\u0BC1'];
  const viewports = [
    { name: 'Phone (390x844)', width: 390, height: 844, minPts: 600, maxPts: 1800 },
    { name: 'Laptop (1440x900)', width: 1440, height: 900, minPts: 600, maxPts: 3000 }
  ];

  viewports.forEach((vp) => {
    testNames.forEach((name) => {
      try {
        const points = sampleNamePoints(name, vp.width, vp.height);
        const count = points.length;
        const countValid = count >= vp.minPts && count <= vp.maxPts;

        // Check bounds
        let allOnScreen = true;
        for (let i = 0; i < points.length; i++) {
          const pt = points[i];
          if (pt.x < 0 || pt.x > vp.width || pt.y < 0 || pt.y > vp.height) {
            allOnScreen = false;
            break;
          }
        }

        const passed = countValid && allOnScreen;
        record('3. Name Points', `${vp.name}: "${name}"`, passed, `${count} pts, in bounds: ${allOnScreen}`);
      } catch (err) {
        record('3. Name Points', `${vp.name}: "${name}"`, false, err.message);
      }
    });
  });

  // ==========================================
  // Suite 4: Broken links handling
  // ==========================================
  // 1. Random text
  const bRandom = parseShareHash('#s=not_valid_base64!@#$');
  record('4. Broken Links', 'Random text treated as broken', bRandom.hasShowData && !bRandom.valid, bRandom.error);

  // 2. Cut-off payload
  const bCutoff = parseShareHash('#s=ey');
  record('4. Broken Links', 'Cut-off payload treated as broken', bCutoff.hasShowData && !bCutoff.valid, bCutoff.error);

  // 3. Wrong version
  const badVersionPayload = encodePayload({ v: 2, t: 'Priya', f: 'Vivek', g: 'diwali' });
  const bVersion = parseShareHash('#s=' + badVersionPayload);
  record('4. Broken Links', 'Wrong version treated as broken', bVersion.hasShowData && !bVersion.valid, bVersion.error);

  // 4. Empty payload
  const bEmpty = parseShareHash('#s=');
  record('4. Broken Links', 'Empty payload treated as broken', bEmpty.hasShowData && !bEmpty.valid, bEmpty.error);

  // 5. Payload with invalid name
  const badNamePayload = encodePayload({ v: 1, t: 'Rahul123', f: '', g: 'diwali' });
  const bBadName = parseShareHash('#s=' + badNamePayload);
  record('4. Broken Links', 'Invalid name in payload treated as broken', bBadName.hasShowData && !bBadName.valid, bBadName.error);

  // ==========================================
  // Summary & Table Output
  // ==========================================
  console.table(results);
  const allPassed = passedTests === totalTests;
  if (allPassed) {
    console.log(`%c[Diwali Sky] SELF-TEST PASS: All ${totalTests} tests passed cleanly!`, 'color:#059669;font-weight:bold;font-size:14px;');
  } else {
    console.error(`[Diwali Sky] SELF-TEST FAIL: ${passedTests}/${totalTests} tests passed.`);
  }

  // Store for automated runners
  window.__SELFTEST_RESULTS__ = {
    allPassed,
    passedTests,
    totalTests,
    results
  };

  return window.__SELFTEST_RESULTS__;
}

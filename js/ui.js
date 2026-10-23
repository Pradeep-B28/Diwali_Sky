// ui.js - Manages sender card, receiver card, share panel, and mute button

import { validateRecipient, validateSender } from './validate.js';
import { buildShareLink } from './link.js';
import { shareToWhatsApp, shareNative, canNativeShare, copyToClipboard } from './share.js';

export class UIManager {
  constructor(app, soundManager) {
    this.app = app;
    this.sound = soundManager;

    this.container = document.getElementById('ui-container');
    this.muteBtn = document.getElementById('mute-btn');

    // UI state
    this.currentMode = null; // 'sender' | 'receiver' | 'share' | 'end'
    this.currentData = null; // { recipient, sender, greeting }
    this.selectedGreeting = 'diwali';

    this.initMuteButton();
  }

  initMuteButton() {
    if (!this.muteBtn) return;
    this.updateMuteIcon();

    this.muteBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.sound.unlock();
      const isMuted = this.sound.toggleMute();
      this.updateMuteIcon();
    });
  }

  updateMuteIcon() {
    if (!this.muteBtn) return;
    const isMuted = this.sound.isMuted;
    this.muteBtn.setAttribute('aria-label', isMuted ? 'Unmute sound' : 'Mute sound');
    this.muteBtn.setAttribute('title', isMuted ? 'Unmute sound' : 'Mute sound');

    if (isMuted) {
      this.muteBtn.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
          <line x1="23" y1="9" x2="17" y2="15"></line>
          <line x1="17" y1="9" x2="23" y2="15"></line>
        </svg>
      `;
    } else {
      this.muteBtn.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
        </svg>
      `;
    }
  }

  /**
   * Clears active cards in ui-container.
   */
  clear() {
    if (!this.container) return;
    this.container.innerHTML = '';
  }

  /**
   * Displays the Sender Flow (Home card).
   * @param {object} [initialValues]
   * @param {boolean} [showBrokenNotice=false]
   */
  showSenderFlow(initialValues = {}, showBrokenNotice = false) {
    this.currentMode = 'sender';
    this.clear();

    const card = document.createElement('div');
    card.className = 'ww-card home-card animate-in';

    if (showBrokenNotice) {
      const brokenBanner = document.createElement('div');
      brokenBanner.className = 'broken-notice';
      brokenBanner.textContent = "This link didn't work. Make a new one below.";
      card.appendChild(brokenBanner);
    }

    const title = document.createElement('h1');
    title.className = 'app-title';
    title.textContent = 'Diwali Sky';
    card.appendChild(title);

    const subtitle = document.createElement('p');
    subtitle.className = 'app-subtitle';
    subtitle.textContent = 'Write a name in fireworks.';
    card.appendChild(subtitle);

    const form = document.createElement('form');
    form.className = 'card-form';
    form.noValidate = true;

    // Recipient input
    const recipientGroup = document.createElement('div');
    recipientGroup.className = 'form-group';
    const recipientLabel = document.createElement('label');
    recipientLabel.textContent = 'Their name';
    recipientLabel.htmlFor = 'input-recipient';
    const recipientInput = document.createElement('input');
    recipientInput.id = 'input-recipient';
    recipientInput.className = 'ww-input';
    recipientInput.type = 'text';
    recipientInput.maxLength = 16;
    recipientInput.placeholder = "Friend's name";
    recipientInput.value = initialValues.recipient || '';
    const recipientError = document.createElement('div');
    recipientError.className = 'field-error';
    recipientGroup.appendChild(recipientLabel);
    recipientGroup.appendChild(recipientInput);
    recipientGroup.appendChild(recipientError);
    form.appendChild(recipientGroup);

    // Sender input
    const senderGroup = document.createElement('div');
    senderGroup.className = 'form-group';
    const senderLabel = document.createElement('label');
    senderLabel.textContent = 'Your name (optional)';
    senderLabel.htmlFor = 'input-sender';
    const senderInput = document.createElement('input');
    senderInput.id = 'input-sender';
    senderInput.className = 'ww-input';
    senderInput.type = 'text';
    senderInput.maxLength = 20;
    senderInput.placeholder = 'Your name';
    senderInput.value = initialValues.sender || '';
    const senderError = document.createElement('div');
    senderError.className = 'field-error';
    senderGroup.appendChild(senderLabel);
    senderGroup.appendChild(senderInput);
    senderGroup.appendChild(senderError);
    form.appendChild(senderGroup);

    // Greeting toggle pills
    const greetingGroup = document.createElement('div');
    greetingGroup.className = 'pill-group';
    this.selectedGreeting = initialValues.greeting || 'diwali';

    const pillDiwali = document.createElement('button');
    pillDiwali.type = 'button';
    pillDiwali.className = `ww-pill ${this.selectedGreeting === 'diwali' ? 'active' : ''}`;
    pillDiwali.textContent = 'Happy Diwali';

    const pillDeepavali = document.createElement('button');
    pillDeepavali.type = 'button';
    pillDeepavali.className = `ww-pill ${this.selectedGreeting === 'deepavali' ? 'active' : ''}`;
    pillDeepavali.textContent = 'Happy Deepavali';

    pillDiwali.addEventListener('click', () => {
      this.selectedGreeting = 'diwali';
      pillDiwali.classList.add('active');
      pillDeepavali.classList.remove('active');
    });

    pillDeepavali.addEventListener('click', () => {
      this.selectedGreeting = 'deepavali';
      pillDeepavali.classList.add('active');
      pillDiwali.classList.remove('active');
    });

    greetingGroup.appendChild(pillDiwali);
    greetingGroup.appendChild(pillDeepavali);
    form.appendChild(greetingGroup);

    // Submit button
    const submitBtn = document.createElement('button');
    submitBtn.type = 'submit';
    submitBtn.className = 'ww-btn-primary';
    submitBtn.textContent = 'Light it up';
    form.appendChild(submitBtn);

    // Privacy note
    const privacy = document.createElement('p');
    privacy.className = 'privacy-note';
    privacy.textContent = 'Names stay inside your link. We never store them.';
    form.appendChild(privacy);

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      recipientError.textContent = '';
      senderError.textContent = '';

      const rVal = recipientInput.value;
      const sVal = senderInput.value;

      const rCheck = validateRecipient(rVal);
      if (!rCheck.valid) {
        recipientError.textContent = rCheck.error;
        recipientInput.focus();
        return;
      }

      const sCheck = validateSender(sVal);
      if (!sCheck.valid) {
        senderError.textContent = sCheck.error;
        senderInput.focus();
        return;
      }

      this.currentData = {
        recipient: rCheck.cleanName,
        sender: sCheck.cleanName,
        greeting: this.selectedGreeting
      };

      // Fade out card and start show
      card.classList.add('animate-out');
      this.sound.unlock();
      setTimeout(() => {
        this.clear();
        this.app.playShow(this.currentData.recipient, this.currentData.sender, this.currentData.greeting);
      }, 250);
    });

    card.appendChild(form);
    this.container.appendChild(card);
  }

  /**
   * Displays the Receiver Flow (Invitation card).
   * @param {{ recipient: string, sender: string, greeting: string }} data
   */
  showReceiverFlow(data) {
    this.currentMode = 'receiver';
    this.currentData = data;
    this.clear();

    const card = document.createElement('div');
    card.className = 'ww-card receiver-card animate-in';

    const heading = document.createElement('h1');
    heading.className = 'receiver-heading';
    if (data.sender) {
      heading.textContent = `${data.sender} sent you a Diwali surprise`;
    } else {
      heading.textContent = 'Someone sent you a Diwali surprise';
    }
    card.appendChild(heading);

    const openBtn = document.createElement('button');
    openBtn.type = 'button';
    openBtn.className = 'ww-btn-primary';
    openBtn.textContent = 'Tap to open';
    card.appendChild(openBtn);

    const hint = document.createElement('p');
    hint.className = 'sound-hint';
    hint.textContent = 'Turn sound on for the full effect.';
    card.appendChild(hint);

    openBtn.addEventListener('click', () => {
      card.classList.add('animate-out');
      this.sound.unlock();
      setTimeout(() => {
        this.clear();
        this.app.playShow(data.recipient, data.sender, data.greeting);
      }, 250);
    });

    this.container.appendChild(card);
  }

  /**
   * Displays the Share Card (Sender flow end panel).
   */
  showSharePanel() {
    this.currentMode = 'share';
    this.clear();

    if (!this.currentData) return;

    const shareUrl = buildShareLink(
      this.currentData.recipient,
      this.currentData.sender,
      this.currentData.greeting
    );

    const card = document.createElement('div');
    card.className = 'ww-card share-card animate-in';

    const title = document.createElement('h2');
    title.className = 'share-title';
    title.textContent = 'Share this Diwali sky';
    card.appendChild(title);

    // WhatsApp button
    const waBtn = document.createElement('button');
    waBtn.type = 'button';
    waBtn.className = 'ww-btn-primary';
    waBtn.textContent = 'Send on WhatsApp';
    waBtn.addEventListener('click', () => {
      shareToWhatsApp(shareUrl, this.currentData.greeting);
    });
    card.appendChild(waBtn);

    // Native share button
    if (canNativeShare()) {
      const nativeBtn = document.createElement('button');
      nativeBtn.type = 'button';
      nativeBtn.className = 'ww-btn-secondary';
      nativeBtn.textContent = 'Share';
      nativeBtn.addEventListener('click', () => {
        shareNative(shareUrl, this.currentData.greeting);
      });
      card.appendChild(nativeBtn);
    }

    // Copy link button
    const copyBtn = document.createElement('button');
    copyBtn.type = 'button';
    copyBtn.className = 'ww-btn-secondary';
    copyBtn.textContent = 'Copy link';
    copyBtn.addEventListener('click', async () => {
      await copyToClipboard(shareUrl);
      copyBtn.textContent = 'Copied';
      setTimeout(() => {
        copyBtn.textContent = 'Copy link';
      }, 2000);
    });
    card.appendChild(copyBtn);

    // Navigation text buttons
    const textActions = document.createElement('div');
    textActions.className = 'text-actions';

    const watchAgainBtn = document.createElement('button');
    watchAgainBtn.type = 'button';
    watchAgainBtn.className = 'ww-btn-text';
    watchAgainBtn.textContent = 'Watch again';
    watchAgainBtn.addEventListener('click', () => {
      card.classList.add('animate-out');
      setTimeout(() => {
        this.clear();
        this.app.playShow(this.currentData.recipient, this.currentData.sender, this.currentData.greeting);
      }, 200);
    });
    textActions.appendChild(watchAgainBtn);

    const editBtn = document.createElement('button');
    editBtn.type = 'button';
    editBtn.className = 'ww-btn-text';
    editBtn.textContent = 'Edit names';
    editBtn.addEventListener('click', () => {
      this.showSenderFlow(this.currentData);
    });
    textActions.appendChild(editBtn);

    card.appendChild(textActions);

    // Branding section
    card.appendChild(this.createBrandFooter());

    this.container.appendChild(card);
  }

  /**
   * Displays the End Card (Receiver flow end panel).
   */
  showEndCard() {
    this.currentMode = 'end';
    this.clear();

    if (!this.currentData) return;

    const card = document.createElement('div');
    card.className = 'ww-card share-card animate-in';

    // Action button: Send one back or Make one for someone
    const primaryBtn = document.createElement('button');
    primaryBtn.type = 'button';
    primaryBtn.className = 'ww-btn-primary';

    if (this.currentData.sender) {
      primaryBtn.textContent = `Send one back to ${this.currentData.sender}`;
      primaryBtn.addEventListener('click', () => {
        this.showSenderFlow({
          recipient: this.currentData.sender,
          sender: this.currentData.recipient,
          greeting: this.currentData.greeting
        });
      });
    } else {
      primaryBtn.textContent = 'Make one for someone';
      primaryBtn.addEventListener('click', () => {
        this.showSenderFlow();
      });
    }
    card.appendChild(primaryBtn);

    // Watch again button
    const watchAgainBtn = document.createElement('button');
    watchAgainBtn.type = 'button';
    watchAgainBtn.className = 'ww-btn-secondary';
    watchAgainBtn.textContent = 'Watch again';
    watchAgainBtn.addEventListener('click', () => {
      card.classList.add('animate-out');
      setTimeout(() => {
        this.clear();
        this.app.playShow(this.currentData.recipient, this.currentData.sender, this.currentData.greeting);
      }, 200);
    });
    card.appendChild(watchAgainBtn);

    // Branding section
    card.appendChild(this.createBrandFooter());

    this.container.appendChild(card);
  }

  /**
   * Builds the quiet Wrench Wise brand footer.
   * @returns {HTMLElement}
   */
  createBrandFooter() {
    const footer = document.createElement('div');
    footer.className = 'card-brand-footer';

    const brandLine = document.createElement('p');
    brandLine.className = 'brand-line';
    brandLine.textContent = 'Built with code by Wrench Wise';
    footer.appendChild(brandLine);

    const ctaLink = document.createElement('a');
    ctaLink.className = 'brand-link';
    ctaLink.href = 'https://wrench-wise.com/?utm_source=diwali-sky&utm_medium=web-app&utm_campaign=diwali-2026';
    ctaLink.target = '_blank';
    ctaLink.rel = 'noopener noreferrer';
    ctaLink.textContent = 'Learn to build apps like this';
    footer.appendChild(ctaLink);

    return footer;
  }
}

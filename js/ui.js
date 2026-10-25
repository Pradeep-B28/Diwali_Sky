// ui.js - Manages sender card, receiver card, share panel, thumbnails, and mute button

import { validateRecipient, validateSender } from './validate.js';
import { buildShareLink } from './link.js';
import { shareToWhatsApp, shareNative, canNativeShare, copyToClipboard } from './share.js';

function createField(id, labelText, placeholder, val, maxLen) {
  const group = document.createElement('div');
  group.className = 'form-group';
  const label = document.createElement('label');
  label.textContent = labelText;
  label.htmlFor = id;
  const input = document.createElement('input');
  input.id = id;
  input.className = 'ww-input';
  input.type = 'text';
  input.maxLength = maxLen;
  input.placeholder = placeholder;
  input.value = val || '';
  const error = document.createElement('div');
  error.className = 'field-error';
  group.append(label, input, error);
  return { group, input, error };
}

function createTextBtn(text, onClick) {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'ww-btn-text';
  btn.textContent = text;
  btn.addEventListener('click', onClick);
  return btn;
}

export class UIManager {
  constructor(app, soundManager) {
    this.app = app;
    this.sound = soundManager;

    this.container = document.getElementById('ui-container');
    this.muteBtn = document.getElementById('mute-btn');

    this.currentMode = null;
    this.currentData = null;
    this.selectedGreeting = 'diwali';

    this.initMuteButton();
  }

  initMuteButton() {
    if (!this.muteBtn) return;
    this.updateMuteIcon();

    this.muteBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.sound.unlock();
      this.sound.toggleMute();
      this.updateMuteIcon();
    });
  }

  updateMuteIcon() {
    if (!this.muteBtn) return;
    const isMuted = this.sound.isMuted;
    this.muteBtn.setAttribute('aria-label', isMuted ? 'Unmute sound' : 'Mute sound');
    this.muteBtn.setAttribute('title', isMuted ? 'Unmute sound' : 'Mute sound');

    this.muteBtn.innerHTML = isMuted
      ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>'
      : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>';
  }

  clear() {
    if (!this.container) return;
    this.container.innerHTML = '';
    this.container.classList.remove('home-active');
  }

  showSenderFlow(initialValues = {}, showBrokenNotice = false) {
    this.currentMode = 'sender';
    this.clear();
    this.container.classList.add('home-active');

    const homeLayout = document.createElement('div');
    homeLayout.className = 'home-layout animate-in';

    // Sky headline above the card
    const headline = document.createElement('div');
    headline.className = 'sky-headline';
    headline.innerHTML = `
      <h1 class="headline-title">Write their name in the <span class="gold-text">Diwali sky</span></h1>
      <p class="headline-subtitle">A fireworks greeting you can send on WhatsApp.</p>
    `;
    homeLayout.appendChild(headline);

    const card = document.createElement('div');
    card.className = 'ww-card home-card';

    if (showBrokenNotice) {
      const brokenBanner = document.createElement('div');
      brokenBanner.className = 'broken-notice';
      brokenBanner.textContent = "This link didn't work. Make a new one below.";
      card.appendChild(brokenBanner);
    }

    const form = document.createElement('form');
    form.className = 'card-form';
    form.noValidate = true;

    // Side-by-side on laptop
    const namesRow = document.createElement('div');
    namesRow.className = 'form-row-names';

    const rField = createField('input-recipient', 'Their name', "Friend's name", initialValues.recipient, 16);
    const sField = createField('input-sender', 'Your name (optional)', 'Your name', initialValues.sender, 20);
    namesRow.append(rField.group, sField.group);
    form.appendChild(namesRow);

    // Live preview in sky while typing
    rField.input.addEventListener('input', () => {
      this.app.setLivePreviewName(rField.input.value);
    });
    if (initialValues.recipient) {
      this.app.setLivePreviewName(initialValues.recipient);
    }

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

    const selectGreeting = (g) => {
      this.selectedGreeting = g;
      pillDiwali.classList.toggle('active', g === 'diwali');
      pillDeepavali.classList.toggle('active', g === 'deepavali');
    };
    pillDiwali.addEventListener('click', () => selectGreeting('diwali'));
    pillDeepavali.addEventListener('click', () => selectGreeting('deepavali'));

    greetingGroup.append(pillDiwali, pillDeepavali);
    form.appendChild(greetingGroup);

    // Primary button with soft light sweep and spark icon
    const submitBtn = document.createElement('button');
    submitBtn.type = 'submit';
    submitBtn.className = 'ww-btn-primary btn-sweep';
    submitBtn.innerHTML = '<svg class="btn-spark-icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z"/></svg><span>Light it up</span>';
    form.appendChild(submitBtn);

    const privacy = document.createElement('p');
    privacy.className = 'privacy-note';
    privacy.textContent = 'Names stay inside your link. We never store them.';
    form.appendChild(privacy);

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      rField.error.textContent = '';
      sField.error.textContent = '';

      const rCheck = validateRecipient(rField.input.value);
      if (!rCheck.valid) {
        rField.error.textContent = rCheck.error;
        rField.input.focus();
        return;
      }

      const sCheck = validateSender(sField.input.value);
      if (!sCheck.valid) {
        sField.error.textContent = sCheck.error;
        sField.input.focus();
        return;
      }

      this.currentData = {
        recipient: rCheck.cleanName,
        sender: sCheck.cleanName,
        greeting: this.selectedGreeting
      };

      const btnRect = submitBtn.getBoundingClientRect();
      const btnOrigin = {
        x: btnRect.left + btnRect.width / 2,
        y: btnRect.top + btnRect.height / 2
      };

      homeLayout.classList.add('animate-out');
      this.sound.unlock();
      this.app.setLivePreviewName(null);

      // Launch rocket directly from button
      this.app.fireworks.launch(
        this.app.skyManager.width * 0.22,
        this.app.skyManager.height * 0.28,
        'peony',
        null,
        btnOrigin
      );

      setTimeout(() => {
        this.clear();
        this.app.playShow(this.currentData.recipient, this.currentData.sender, this.currentData.greeting, true);
      }, 250);
    });

    card.appendChild(form);
    homeLayout.appendChild(card);
    this.container.appendChild(homeLayout);
  }

  showReceiverFlow(data) {
    this.currentMode = 'receiver';
    this.currentData = data;
    this.clear();
    this.app.setReceiverDimmed(true);

    const card = document.createElement('div');
    card.className = 'ww-card receiver-card animate-in';

    const heading = document.createElement('h1');
    heading.className = 'receiver-heading';
    heading.textContent = data.sender
      ? `${data.sender} sent you a Diwali surprise`
      : 'Someone sent you a Diwali surprise';
    card.appendChild(heading);

    const openBtn = document.createElement('button');
    openBtn.type = 'button';
    openBtn.className = 'ww-btn-primary btn-sweep';
    openBtn.innerHTML = '<svg class="btn-spark-icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z"/></svg><span>Tap to open</span>';
    card.appendChild(openBtn);

    const hint = document.createElement('p');
    hint.className = 'sound-hint';
    hint.textContent = 'Turn sound on for the full effect.';
    card.appendChild(hint);

    openBtn.addEventListener('click', () => {
      card.classList.add('animate-out');
      this.sound.unlock();
      this.sound.playTempleBell();

      this.app.startReceiverLightUp(() => {
        this.clear();
        this.app.playShow(data.recipient, data.sender, data.greeting);
      });
    });

    this.container.appendChild(card);
  }

  showSharePanel(thumbnailUrl = null) {
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

    if (thumbnailUrl) {
      const thumb = document.createElement('img');
      thumb.className = 'card-thumbnail';
      thumb.src = thumbnailUrl;
      thumb.alt = 'Diwali Sky moment';
      card.appendChild(thumb);
    }

    const title = document.createElement('h2');
    title.className = 'share-title';
    title.textContent = 'Share this Diwali sky';
    card.appendChild(title);

    const waBtn = document.createElement('button');
    waBtn.type = 'button';
    waBtn.className = 'ww-btn-primary';
    waBtn.textContent = 'Send on WhatsApp';
    waBtn.addEventListener('click', () => {
      shareToWhatsApp(shareUrl, this.currentData.greeting);
    });
    card.appendChild(waBtn);

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

    const textActions = document.createElement('div');
    textActions.className = 'text-actions';
    const watchAgainBtn = createTextBtn('Watch again', () => {
      card.classList.add('animate-out');
      setTimeout(() => {
        this.clear();
        this.app.playShow(this.currentData.recipient, this.currentData.sender, this.currentData.greeting);
      }, 200);
    });
    const editBtn = createTextBtn('Edit names', () => this.showSenderFlow(this.currentData));
    textActions.append(watchAgainBtn, editBtn);
    card.append(textActions, this.createBrandFooter());
    this.container.appendChild(card);
  }

  showEndCard(thumbnailUrl = null) {
    this.currentMode = 'end';
    this.clear();

    if (!this.currentData) return;

    const card = document.createElement('div');
    card.className = 'ww-card share-card animate-in';

    if (thumbnailUrl) {
      const thumb = document.createElement('img');
      thumb.className = 'card-thumbnail';
      thumb.src = thumbnailUrl;
      thumb.alt = 'Diwali Sky moment';
      card.appendChild(thumb);
    }

    const primaryBtn = document.createElement('button');
    primaryBtn.type = 'button';
    primaryBtn.className = 'ww-btn-primary';
    if (this.currentData.sender) {
      primaryBtn.textContent = `Send one back to ${this.currentData.sender}`;
      primaryBtn.addEventListener('click', () => {
        this.showSenderFlow({ recipient: this.currentData.sender, sender: this.currentData.recipient, greeting: this.currentData.greeting });
      });
    } else {
      primaryBtn.textContent = 'Make one for someone';
      primaryBtn.addEventListener('click', () => this.showSenderFlow());
    }
    card.appendChild(primaryBtn);

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
    card.append(watchAgainBtn, this.createBrandFooter());
    this.container.appendChild(card);
  }

  createBrandFooter() {
    const footer = document.createElement('div');
    footer.className = 'card-brand-footer';
    footer.innerHTML = `
      <p class="brand-line">Built with code by Wrench Wise</p>
      <a class="brand-link" href="https://wrench-wise.com/?utm_source=diwali-sky&utm_medium=web-app&utm_campaign=diwali-2026" target="_blank" rel="noopener noreferrer">Learn to build apps like this</a>
    `;
    return footer;
  }
}

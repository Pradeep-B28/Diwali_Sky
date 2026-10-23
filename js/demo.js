// demo.js - Automated demo loop for recording reels

import { validateRecipient } from './validate.js';

export class DemoManager {
  constructor(app, ui, sound) {
    this.app = app;
    this.ui = ui;
    this.sound = sound;

    this.demoName = 'Priya';
    this.isRunning = false;
    this.timeoutIds = [];
    this.tapDot = null;
    this.soundHint = null;
  }

  start(customName = null) {
    if (this.isRunning) return;
    this.isRunning = true;

    // Validate demo name
    if (customName) {
      const check = validateRecipient(customName);
      this.demoName = check.valid ? check.cleanName : 'Priya';
    } else {
      this.demoName = 'Priya';
    }

    this.createTapDot();
    this.initSoundHint();
    this.runLoopCycle();
  }

  stop() {
    this.isRunning = false;
    this.timeoutIds.forEach(id => clearTimeout(id));
    this.timeoutIds = [];

    if (this.tapDot && this.tapDot.parentNode) {
      this.tapDot.parentNode.removeChild(this.tapDot);
      this.tapDot = null;
    }
    if (this.soundHint && this.soundHint.parentNode) {
      this.soundHint.parentNode.removeChild(this.soundHint);
      this.soundHint = null;
    }
  }

  setTimeout(fn, delay) {
    if (!this.isRunning) return null;
    const id = setTimeout(() => {
      if (!this.isRunning) return;
      fn();
    }, delay);
    this.timeoutIds.push(id);
    return id;
  }

  createTapDot() {
    if (document.getElementById('demo-tap-dot')) {
      this.tapDot = document.getElementById('demo-tap-dot');
      return;
    }
    this.tapDot = document.createElement('div');
    this.tapDot.id = 'demo-tap-dot';
    this.tapDot.className = 'demo-tap-dot';
    document.body.appendChild(this.tapDot);
  }

  initSoundHint() {
    if (document.getElementById('demo-sound-hint')) return;

    this.soundHint = document.createElement('div');
    this.soundHint.id = 'demo-sound-hint';
    this.soundHint.className = 'demo-sound-hint';
    this.soundHint.textContent = 'Tap once to enable sound';

    const dismiss = () => {
      this.sound.unlock();
      if (this.soundHint && this.soundHint.parentNode) {
        this.soundHint.style.opacity = '0';
        setTimeout(() => {
          if (this.soundHint && this.soundHint.parentNode) {
            this.soundHint.parentNode.removeChild(this.soundHint);
            this.soundHint = null;
          }
        }, 300);
      }
      window.removeEventListener('pointerdown', dismiss);
    };

    window.addEventListener('pointerdown', dismiss, { once: true });
    document.body.appendChild(this.soundHint);
  }

  moveDotTo(element, onLanded) {
    if (!this.tapDot || !element) return;
    const rect = element.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    this.tapDot.style.opacity = '1';
    this.tapDot.style.transform = `translate(${x}px, ${y}px)`;

    this.setTimeout(() => {
      this.tapDot.classList.add('demo-pulse');
      this.setTimeout(() => {
        this.tapDot.classList.remove('demo-pulse');
      }, 300);
      if (onLanded) onLanded();
    }, 380);
  }

  runLoopCycle() {
    if (!this.isRunning) return;

    // 1. Show home card
    this.ui.showSenderFlow({}, false);

    // Initial position for tap dot: bottom off-screen
    if (this.tapDot) {
      this.tapDot.style.opacity = '0';
      this.tapDot.style.transform = `translate(${window.innerWidth * 0.5}px, ${window.innerHeight + 50}px)`;
    }

    // 2. Wait 700ms, then land tap dot on "Their name"
    this.setTimeout(() => {
      const recipientInput = document.getElementById('input-recipient');
      if (!recipientInput) return;

      this.moveDotTo(recipientInput, () => {
        recipientInput.focus();
        recipientInput.value = '';

        // 3. Type out the name letter by letter (~150ms per character)
        const text = this.demoName;
        let index = 0;

        const typeNextChar = () => {
          if (index < text.length) {
            recipientInput.value = text.slice(0, index + 1);
            index++;
            this.setTimeout(typeNextChar, 145);
          } else {
            // Typing finished. Move tap dot to "Light it up" button
            this.setTimeout(() => {
              const submitBtn = document.querySelector('.ww-btn-primary');
              if (!submitBtn) return;

              this.moveDotTo(submitBtn, () => {
                // Tap button and fade out dot
                submitBtn.click();
                this.tapDot.style.opacity = '0';

                // 4. Wait for the show and 3s of share panel, then restart loop
                // Timeline: 12.0s show + 3.0s share panel display = 15.0s
                this.setTimeout(() => {
                  this.runLoopCycle();
                }, 15200);
              });
            }, 400);
          }
        };

        this.setTimeout(typeNextChar, 200);
      });
    }, 700);
  }
}

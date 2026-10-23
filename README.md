# Diwali Sky

A festive web application that writes any name in fireworks across a night sky.

Built by Wrench Wise.

Live link: https://diwalisky.vercel.app

---

## How to use it

1. Type your friend's name and your name.
2. Tap "Light it up" to watch the rockets rise, explode, and form the name in sparks.
3. Share the link on WhatsApp so they can open their personalized surprise with sound.

---

## How to run it locally

1. Open your terminal in this directory.
2. Start a local static file server:
   ```bash
   npx serve . -p 8000
   ```
3. Open your browser and visit:
   ```
   http://localhost:8000/
   ```

To run the automated self-test suite, visit:
```
http://localhost:8000/?test=1
```

To run demo mode for recording video reels, visit:
```
http://localhost:8000/?demo=1&name=Priya
```

---

## How it works

1. **Particles:** All sparks use pre-allocated typed arrays (Float32Array) in a reusable pool. No objects are allocated during animation frames. This keeps the animation smooth on mobile phones.
2. **Gravity:** Physics equations calculate gravity, velocity drag, and life fade on every frame. Front canvas alpha blending creates glowing trailing sparks.
3. **Turning text into points:** A hidden canvas renders the name in the brand typography. An adaptive sampler measures density to generate 600 to 1,800 points on phones and up to 3,000 points on laptops.
4. **Web Audio:** Every sound effect is generated entirely in code using the Web Audio API without audio files. Sine oscillators produce rocket whistles, low-pass filtered noise generates deep booms, and bandpass impulses create crackle bursts.
5. **How the name travels inside the link:** The show data is serialized into UTF-8 JSON and encoded into a base64url string placed in the URL hash (#s=PAYLOAD). Because URL hashes are never transmitted to servers, names stay entirely private on the device.

---

## Privacy

Names stay inside your link. We never store them.

---

## Project Structure

```
diwali-sky/
  index.html        App container, canvas stack, branding, and meta tags
  styles.css        Design tokens, responsive layouts, and animations
  manifest.json     PWA configuration and icons
  assets/           Brand logo, favicon, and Open Graph preview image
  tools/
    og.html         Open Graph preview canvas builder
  js/
    main.js         Application bootstrap, routing, and main loop
    sky.js          Stacked canvases, stars, skyline, and diyas
    particles.js    Pre-allocated typed array pool and physics
    fireworks.js    Rocket ascents and 4 burst types
    nameText.js     Transforms names into target spark coordinates
    show.js         12-second choreographed sequence and hold moment
    audio.js        Web Audio synthesizers and mute controls
    validate.js     Name rules and Unicode grapheme cluster counting
    blocklist.js    Abuse filter list
    link.js         Private URL hash encoder and parser
    share.js        WhatsApp and Web Share integration
    ui.js           Cards, forms, pills, and navigation
    demo.js         Automated typing loop for recording reels
    selftest.js     Automated 43-test verification suite
  README.md         Project overview and instructions
  REEL_SCRIPT.md    Short video recording scripts
```

---

## License

Built with code by Wrench Wise.
Learn to build apps like this at https://wrench-wise.com

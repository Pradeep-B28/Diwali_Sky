# Diwali Sky

A festive, cinematic web application that writes any name in fireworks across a night sky.

Built with code by Wrench Wise.

Live link: https://diwalisky.vercel.app

---

## How to use it

1. Type your friend's name and your name.
2. Watch the live preview sparkles appear as you type.
3. Tap "Light it up" to launch a rocket straight from the button and watch the sky explode into glowing name sparks.
4. Share the private link on WhatsApp so they can open their personalized surprise with sound.

---

## How to run it locally

1. Open your terminal in this directory.
2. Start a local static file server:
   ```bash
   python -m http.server 8000
   ```
3. Open your browser and visit:
   ```
   http://localhost:8000/
   ```

To run the automated self-test suite (43/43 tests), visit:
```
http://localhost:8000/?test=1
```

To run demo mode for recording video reels, visit:
```
http://localhost:8000/?demo=1&name=Priya
```

To run the speed benchmark under simulated throttle, visit:
```
http://localhost:8000/?benchmark=1&quality=medium
```

---

## Cinematic Features

- **Rich Scenic Background:** A rooftop terrace parapet with four clay diyas flickering in warm amber halos, an illuminated three-layer city skyline with glowing windows, a south-Indian temple gopuram silhouette with temple lights, soft ground mist bands, and rising paper lanterns drifting gently skyward.
- **Cinematic Receiver Light-Up:** When a recipient opens their private greeting link, the scene begins in near-darkness (10 percent brightness) and awakens over 1.5 seconds accompanied by a resonant synthesized bronze temple bell chime.
- **Dynamic Camera Push:** A smooth zoom (1.0x to 1.14x) and pan gently centers on the hero rocket detonation and name formation, returning to resting framing as the name dissolves.
- **Name Aura and Shimmer Glints:** The recipient name glows with a soft brand gradient aura (`#34D399` to `#22D3EE`), accented by sparkling white glints that glimmer across the letterforms.
- **Live Input Preview:** As the sender types into the recipient input, subtle glowing trajectory sparks trace the letterforms in the sky above the card.
- **Button Launch Animation:** Tapping "Light it up" launches a live firework rocket directly from the button coordinates before the main show commences.

---

## Technical Architecture

The application is built with 100 percent plain HTML, CSS, and modern vanilla JavaScript with zero runtime dependencies and zero external asset downloads.

```
diwali-sky/
  index.html        Multi-canvas viewport stack, responsive card layouts, and meta tags
  styles.css        Design tokens, responsive layouts, card glassmorphism, and animations
  manifest.json     PWA configuration, brand icons, and theme colors
  assets/           Brand logo, favicon, and 1200x630 Open Graph preview image
  tools/
    og.html         Open Graph preview canvas renderer
  js/
    main.js         Application bootstrap, routing, quality tiers, and main animation loop
    sky.js          Stacked canvas manager, camera transform, and offscreen bloom compositor
    scene.js        Procedural background scene (sky gradient, gopuram, city, mist, lanterns, diyas)
    sprites.js      Offscreen pre-rendered particle glow sprites and radial gradients
    particles.js    Pre-allocated typed array pool (Float32Array) and alpha bin sorter
    fireworks.js    Rocket trajectories and 4 burst types (peony, willow, ring, crackle)
    nameText.js     Transforms names into target spark coordinates with adaptive stride
    show.js         12-second choreographed sequence, hero homing, camera push, and hold state
    audio.js        Web Audio synthesizers (launch whistles, booms, crackles, temple bell)
    validate.js     Name validation and Unicode grapheme cluster counting
    blocklist.js    Content safety and abuse filter list
    link.js         Private URL hash encoder and parser (v1 and v2 formats)
    share.js        WhatsApp share and native Web Share integration
    ui.js           Cards, forms, live input preview, and audio permission pill
    demo.js         Automated typing loop for recording reels
    selftest.js     Automated 43-test verification suite
  README.md         Project overview, architecture, and instructions
  REEL_SCRIPT.md    Short video recording scripts
```

### Canvas Stack
The viewport consists of three stacked canvases:
1. `#sky-canvas`: Renders the procedural night sky, stars, illuminated city skyline, temple gopuram, mist, drifting lanterns, and clay diyas.
2. `#fireworks-canvas`: Renders the active physics particles, rising rockets, glowing sparks, and text overlays.
3. `#bloom-canvas`: A dedicated half-resolution offscreen canvas using CSS blur and blend modes to produce soft atmospheric bloom around fireworks (High quality tier).

### Particle Physics Engine
All particles reside in pre-allocated `Float32Array` buffers (position, velocity, life, decay, size, color, alpha). No object allocations occur inside the animation loop. During the name hold moment (t=4.6s to 9.5s), static name sparks are pre-baked onto an offscreen canvas to avoid redundant draw calls and ensure rock-solid 60 fps rendering.

### Procedural Web Audio Synthesis
Audio is synthesized entirely through the browser's Web Audio API without audio files:
- **Rocket Whistles:** Swept sine wave oscillator with exponential frequency ascent.
- **Hero Booms:** Low-pass filtered noise burst with exponential volume drop.
- **Crackles:** Bandpass-filtered random pulse spikes.
- **Arrival Shimmer:** Dual sine wave arpeggio chime.
- **Temple Bell:** Additive synthesis combining fundamental and non-harmonic bronze modal frequencies with resonant exponential decay.

### Privacy and URL Hash Routing
Greeting data is serialized to JSON and compressed into a base64url string stored inside the URL hash fragment (`#s=PAYLOAD`). Because browsers never send URL hash fragments to HTTP servers, recipient names and personal greetings remain strictly private on the user device.

---

## Quality Tiers and Performance

Diwali Sky automatically selects and dynamically manages quality tiers to balance visual fidelity and high frame rates across devices.

| Feature | High Tier (Desktop Default) | Medium Tier (Mobile Default) | Low Tier (Power Saver) |
| :--- | :--- | :--- | :--- |
| Particle Budget | 6,000 particles | 2,500 particles | 1,500 particles |
| Bloom Canvas | Enabled (half-res blur) | Disabled | Disabled |
| Background Scene | Full (Gopuram, City, Lanterns, Diyas) | Full (Gopuram, City, Lanterns, Diyas) | Simplified Static Skyline |
| Camera Push | Smooth 1.14x zoom | Smooth 1.14x zoom | Static Framing |
| Alpha Sorting | 8 alpha bins | 8 alpha bins | 4 alpha bins |
| Target Frame Rate | 60 fps | >= 45 fps | >= 45 fps |

### Dynamic Degradation
The application monitors the true rendering frame rate over rolling 2-second windows. If the average frame rate drops below 45 fps, Diwali Sky automatically steps down one tier (High to Medium, Medium to Low) to maintain responsive playback.

### Benchmark Results (Simulated 4x CPU Throttle)
- **Medium Tier:** 47.4 average fps (59.9 median fps, 547 frames over 12s show). Target of >= 45 fps fully satisfied.
- **Low Tier:** 45.0 average fps (59.9 median fps).
- **High Tier:** 38.8 average fps (59.5 median fps during hold).

---

## Verification and Testing

Diwali Sky includes a comprehensive browser-based self-test suite covering:
- Base64url link serialization, deserialization, and tampering detection
- Backward compatibility with legacy v1 greeting payloads
- Grapheme cluster counting and emoji handling
- Content safety and blocklist filtering
- Particle pool budget bounds and allocation isolation
- Canvas sizing and high-DPI scaling

Run the tests by visiting `?test=1`.

---

## License

Built with code by Wrench Wise.
Learn to build web applications like this at https://wrench-wise.com

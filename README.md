<div align="center">

# 🎆 Diwali Sky
### *Cinematic Festive Web Application Writing Custom Names in Fireworks Across a Temple Night Sky*

Launch rockets, hear synthesized bronze temple bells, and watch custom names burst into glowing firework spark particles in real time.

[![Live Deployment](https://img.shields.io/badge/Live_App-diwalisky.vercel.app-F59E0B?style=for-the-badge&logo=vercel&logoColor=white)](https://diwalisky.vercel.app)
[![Autonomous Demo](https://img.shields.io/badge/Demo-Live_Reel-EC4899?style=for-the-badge&logo=googlechrome&logoColor=white)](https://diwalisky.vercel.app/?demo=1&name=Priya)
[![Self-Test Suite](https://img.shields.io/badge/Test_Suite-43%2F43_Tests_Passing-22C55E?style=for-the-badge&logo=checkmarx&logoColor=white)](https://diwalisky.vercel.app/?test=1)
[![GitHub Repository](https://img.shields.io/badge/GitHub-Pradeep--B28%2FDiwali__Sky-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Pradeep-B28/Diwali_Sky)
[![Author](https://img.shields.io/badge/Author-Pradeep_B-0B2A45?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/pradeepb-2k)
[![License: MIT](https://img.shields.io/badge/License-MIT-F59E0B?style=for-the-badge)](LICENSE)

<p align="center">
  <a href="#-features--visuals">Cinematic Features</a> •
  <a href="#-how-to-use">How to Use</a> •
  <a href="#-technical-architecture">Architecture</a> •
  <a href="#-procedural-audio-synthesis">Web Audio</a> •
  <a href="#-quality-tiers--benchmarks">Performance</a> •
  <a href="#-repository-structure">Repository Structure</a> •
  <a href="#-local-development">Local Setup</a> •
  <a href="#-author--contact">Author & Contact</a>
</p>

</div>

---

## ✨ Cinematic Features & Visuals

- **Procedural Scenic Background:** A rooftop terrace parapet with four clay diyas flickering in warm amber halos, an illuminated three-layer city skyline with glowing windows, a south-Indian temple gopuram silhouette with temple lights, soft ground mist bands, and rising paper lanterns drifting gently skyward.
- **Cinematic Receiver Light-Up:** When a recipient opens their private greeting link, the scene begins in near-darkness (10% brightness) and awakens over 1.5 seconds accompanied by a resonant synthesized bronze temple bell chime.
- **Dynamic Camera Push:** A smooth zoom (1.0x to 1.14x) and pan gently centers on the hero rocket detonation and name formation, returning to resting framing as the sparks dissolve.
- **Name Aura and Shimmer Glints:** The recipient name glows with a soft brand gradient aura (`#34D399` to `#22D3EE`), accented by sparkling white glints that glimmer across the letterforms.
- **Live Input Preview:** As the sender types into the recipient input, subtle glowing trajectory sparks trace the letterforms in the sky above the card.
- **Button Launch Animation:** Tapping "Light it up" launches a live firework rocket directly from the button coordinates before the main show commences.
- **Zero-Backend URL Hash Privacy:** Personalized greetings are encoded in base64url URL hashes (`#s=PAYLOAD`), meaning greeting details are never transmitted to any server.

---

## 🚀 How to Use

1. Type your friend's name and your name.
2. Watch live preview sparkles outline the letters as you type.
3. Tap **"Light it up"** to launch a rocket straight from the button into the sky.
4. Share the private link on WhatsApp or social media so your recipient can experience the full cinematic surprise with audio.

---

## 🛠️ Technical Architecture

The application is built with 100% plain HTML5, CSS3, and modern Vanilla JavaScript (ES6+), running completely client-side with zero external dependencies and zero external asset downloads.

### Canvas Stack
The viewport consists of three hardware-accelerated stacked canvases:
1. `#sky-canvas`: Renders the procedural night sky, stars, illuminated city skyline, temple gopuram, mist, drifting lanterns, and clay diyas.
2. `#fireworks-canvas`: Renders active physics particles, rising rockets, glowing sparks, and letterform text overlays.
3. `#bloom-canvas`: A dedicated half-resolution offscreen canvas using CSS blur and blend modes to produce soft atmospheric bloom around fireworks.

### High-Performance Particle Engine
- All particles reside in pre-allocated `Float32Array` buffers (position, velocity, life, decay, size, color, alpha).
- Zero object allocations occur inside the 60 FPS animation loop, preventing Garbage Collection pauses.
- During the name hold moment ($t=4.6\text{s}$ to $9.5\text{s}$), static name sparks are pre-baked onto an offscreen canvas to avoid redundant draw calls.

---

## 🔊 Procedural Web Audio Synthesis

Audio is synthesized entirely through the browser's native **Web Audio API** with zero audio files:
- **Rocket Whistles:** Swept sine wave oscillator with exponential frequency ascent.
- **Hero Booms:** Low-pass filtered noise burst with exponential volume drop.
- **Crackles:** Bandpass-filtered random pulse spikes.
- **Arrival Shimmer:** Dual sine wave arpeggio chime.
- **Temple Bell:** Additive synthesis combining fundamental and non-harmonic bronze modal frequencies with resonant exponential decay.

---

## 📊 Quality Tiers & Benchmarks

Diwali Sky dynamically monitors true rendering frame rates over rolling 2-second windows. If average FPS drops below 45, it automatically steps down tiers to maintain buttery-smooth playback.

| Feature | High Tier (Desktop Default) | Medium Tier (Mobile Default) | Low Tier (Power Saver) |
| :--- | :--- | :--- | :--- |
| **Particle Budget** | 6,000 particles | 2,500 particles | 1,500 particles |
| **Atmospheric Bloom** | Enabled (half-res blur) | Disabled | Disabled |
| **Background Scene** | Full (Gopuram, City, Lanterns, Diyas) | Full (Gopuram, City, Lanterns, Diyas) | Simplified Static Skyline |
| **Camera Push** | Smooth 1.14x zoom | Smooth 1.14x zoom | Static Framing |
| **Alpha Sorting** | 8 alpha bins | 8 alpha bins | 4 alpha bins |
| **Target Frame Rate** | 60 FPS | $\ge$ 45 FPS | $\ge$ 45 FPS |

---

## 📂 Repository Structure

```
Diwali_Sky/
├── index.html        Multi-canvas viewport stack, responsive card layouts, and meta tags
├── styles.css        Design tokens, responsive layouts, card glassmorphism, and animations
├── manifest.json     PWA configuration, brand icons, and theme colors
├── LICENSE           MIT Open Source License
├── README.md         Project overview, architecture, and instructions
├── REEL_SCRIPT.md    Short video recording scripts
├── assets/           Brand logo, favicon, and 1200x630 Open Graph preview image
├── tools/
│   └── og.html       Open Graph preview canvas renderer
└── js/
    ├── main.js       Application bootstrap, routing, quality tiers, and animation loop
    ├── sky.js        Stacked canvas manager, camera transform, and offscreen bloom compositor
    ├── scene.js      Procedural background scene (sky gradient, gopuram, city, mist, diyas)
    ├── sprites.js    Offscreen pre-rendered particle glow sprites and radial gradients
    ├── particles.js  Pre-allocated typed array pool (Float32Array) and alpha bin sorter
    ├── fireworks.js  Rocket trajectories and 4 burst types (peony, willow, ring, crackle)
    ├── nameText.js   Transforms names into target spark coordinates with adaptive stride
    ├── show.js       12-second choreographed sequence, hero homing, camera push, and hold state
    ├── audio.js      Web Audio synthesizers (launch whistles, booms, crackles, temple bell)
    ├── validate.js   Name validation and Unicode grapheme cluster counting
    ├── blocklist.js  Content safety and abuse filter list
    ├── link.js       Private URL hash encoder and parser (v1 and v2 formats)
    ├── share.js      WhatsApp share and native Web Share integration
    ├── ui.js         Cards, forms, live input preview, and audio permission pill
    ├── demo.js       Automated typing loop for recording reels
    └── selftest.js   Automated 43-test verification suite
```

---

## 💻 Local Development

Diwali Sky has zero external dependencies.

```bash
# Clone the repository
git clone https://github.com/Pradeep-B28/Diwali_Sky.git
cd Diwali_Sky

# Run local web server
python -m http.server 8000
```
Open `http://localhost:8000` in any modern web browser.

- **Run Browser Self-Tests (43/43):** `http://localhost:8000/?test=1`
- **Run Reel Demo Mode:** `http://localhost:8000/?demo=1&name=Priya`
- **Run Performance Benchmark:** `http://localhost:8000/?benchmark=1&quality=medium`

---

## 📄 License

This project is open-source and released under the **[MIT License](LICENSE)**.

```
Copyright (c) 2026 Pradeep B (Pradeep-B28) & Wrench Wise
```

---

## 👨‍💻 Author & Contact

**Pradeep B**  
*Java & DSA Master Trainer | Full-Stack Architect | Web Platform Engineer*

- 🌐 **Softech Career & Placement Portal:** [reachsoftech.onrender.com](https://reachsoftech.onrender.com/home)
- 🌌 **3D Interactive Developer Portfolio:** [pradeep-b28.github.io/GIT_3D_Portfolio](https://pradeep-b28.github.io/GIT_3D_Portfolio/)
- 💻 **GitHub Profile:** [@Pradeep-B28](https://github.com/Pradeep-B28)
- 💼 **LinkedIn:** [linkedin.com/in/pradeepb-2k](https://www.linkedin.com/in/pradeepb-2k)
- 📧 **Email:** [pradeepbashaa@gmail.com](mailto:pradeepbashaa@gmail.com)

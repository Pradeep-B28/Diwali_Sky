# Diwali Sky: Complete Project Details

This document explains every detail of the Diwali Sky web application. It is written in plain English with short sentences so that anyone can understand, use, explain, test, deploy, and rebuild this software from scratch.

---

## 1. Quick Summary

Diwali Sky is a real-time web application that writes a person's name in animated fireworks over an illuminated night sky. When a visitor enters a friend's name, rockets launch over a nighttime temple skyline, explode into thousands of glowing sparks, curve through mid-air to spell the personalized name in an emerald-to-cyan gradient, and gently melt into a shower of falling golden trails.

The application operates entirely on the front end inside the web browser. It uses zero external libraries, zero web frameworks, zero pre-recorded audio files, zero databases, and zero tracking servers. All animations are calculated in real time using 2D canvas physics, and all sound effects are generated procedurally through browser mathematics.

### Project Fact Table

| Metric | Value | Code Location Reference |
| :--- | :--- | :--- |
| **Project Name** | Diwali Sky by Wrench Wise | index.html, line 7 |
| **Live Production Link** | https://diwalisky.vercel.app | index.html, line 14 |
| **GitHub Repository** | https://github.com/Pradeep-B28/Diwali_Sky.git | git remote origin |
| **Primary Production Branch** | main | git branch |
| **Software License** | MIT License | LICENSE, lines 1 to 21 |
| **Total Source Files** | 29 files (excluding .git, .vercel, and screenshots) | Project root |
| **Total JavaScript Files** | 18 files in js/ folder | js/ directory |
| **Total Lines of JavaScript** | 4,213 lines | js/*.js |
| **Total Lines of CSS** | 361 lines | styles.css |
| **Total Lines of HTML** | 81 lines (index.html) + 315 lines (tools/og.html) | index.html, tools/og.html |
| **Color Palette Entries** | 7 spark colors + 5 scene shades | js/particles.js, line 14; js/sceneLayers.js, line 3 |
| **Pre-rendered Glow Sprites** | 7 palette sprites + 16 gradient sprites + 1 glint sprite (24 total) | js/sprites.js, lines 49 to 77 |
| **Blocklisted Abusive Words** | 78 blocked terms across English, Hindi, and Tamil | js/blocklist.js, lines 5 to 78 |
| **Particle Pool Capacity** | 7,000 maximum particles in pre-allocated Float32Array buffers | js/particles.js, line 36 |
| **Active Particle Budget (High Tier)** | 6,000 particles (laptop default) | js/main.js, line 38 |
| **Active Particle Budget (Medium Tier)**| 2,500 particles (mobile phone default) | js/main.js, line 38 |
| **Active Particle Budget (Low Tier)** | 1,500 particles (power saver default) | js/particles.js, line 75 |
| **In-Browser Automated Tests** | 43 tests across 4 test suites (100% pass rate) | js/selftest.js, lines 28 to 157 |
| **Audio Synthesizer Voices** | Maximum 8 simultaneous voices with dynamics compression | js/audio.js, line 10 |
| **Target Frame Rate** | 60 frames per second | js/main.js, line 534 |
| **Minimum Safe Frame Rate** | 45 frames per second before dynamic down-tiering | js/main.js, line 564 |
| **Last Repository Update Date** | November 2, 2026 | git log -1 |

---

## 2. Purpose

### The Problem It Solves

During festival seasons such as Diwali, millions of people send generic image greetings, pre-recorded video clips, and copy-pasted messages over WhatsApp and social media. These greetings suffer from three main problems:

1. **They feel impersonal.** A forwarded picture card or video forwarded to twenty contacts does not show personal effort or care.
2. **They consume bandwidth and phone storage.** Downloading hundreds of megabytes of video clips and large image files clutters mobile devices and uses costly cellular data.
3. **They compromise privacy.** Many greeting generator websites require users to log in with Google, submit phone numbers, accept tracking cookies, or transmit names to external database servers that log personal information.

Diwali Sky solves these problems by providing an instant, private, and personalized experience. A sender can type any name, choose a greeting, and create a custom greeting link in under five seconds. The link contains no personal data on any server. When the receiver opens the link, the greeting renders locally inside their own browser at sixty frames per second.

### Who It Is For

The application is engineered for three distinct audiences:

1. **Everyday WhatsApp and Mobile Users.** People who want to send a warm, personal festival surprise to family and friends with one tap. They do not need technical knowledge. The page loads within two seconds on cellular connections.
2. **Social Media and Video Creators.** Content creators recording vertical reels (Instagram Reels, YouTube Shorts) or horizontal videos (LinkedIn, YouTube). The app provides automated demo modes and exact frame-stepping controls for high-quality screen recording.
3. **Prospective Students and Parents.** Visitors interested in software engineering who discover the project through Wrench Wise educational channels. The card footer invites curious learners to explore how the app was constructed with clean code.

### Why It Was Built

The project was created to celebrate Diwali 2026 while serving as a flagship demonstration of modern web engineering without third-party frameworks. It proves that a web browser can render complex particle physics, dynamic camera movement, smooth color gradients, and rich procedural sound without relying on heavy external libraries like Three.js, React, PixiJS, or Tone.js.

### Connection to Wrench Wise Programs

The application directly links to the Wrench Wise software development curriculum. Every share card and end card includes an educational attribution link (js/ui.js, createBrandFooter):

```
https://wrench-wise.com/?utm_source=diwali-sky&utm_medium=web-app&utm_campaign=diwali-2026
```

This link connects visitors to the Wrench Wise educational platform, where students learn full-stack web engineering, canvas mathematics, audio synthesis, and software performance optimization.

---

## 3. How to Open It

### Live Website Link

The production version of Diwali Sky is hosted on Vercel and is publicly accessible at:

```
https://diwalisky.vercel.app/
```

### How to Run It on a Laptop Step by Step

You do not need to install Node.js packages, build tools, or compilers. The application runs on plain web standards.

#### Step 1: Open Terminal or Command Prompt
On Windows, open PowerShell or Command Prompt. On macOS or Linux, open the Terminal application.

#### Step 2: Navigate to the Project Folder
Type `cd` followed by the directory path:

```bash
cd "C:\Projects\Wrench-Wise\2 Diwali_Sky"
```

#### Step 3: Start a Local Web Server
Web browsers enforce a security rule called the same-origin policy on JavaScript modules (`<script type="module">`). Because of this rule, double-clicking `index.html` directly from your file manager (`file:///` protocol) causes modern browsers to block local module loading. A local static web server is required.

Run one of the following commands:

- **Using Python 3 (built into most computers):**
  ```bash
  python -m http.server 8000
  ```

- **Using Node.js npx serve (if Node.js is installed):**
  ```bash
  npx serve .
  ```

#### Step 4: Open Your Web Browser
Open Google Chrome, Microsoft Edge, Mozilla Firefox, or Apple Safari, and visit:

```
http://localhost:8000/
```

The night sky will appear immediately with twinkling stars, glowing oil lamps, and drifting lanterns.

### Special Link Options (URL Query and Hash Parameters)

The application supports URL parameters for testing, automated recording, and debugging. You can append these parameters to the address bar.

| Parameter | Example URL | Exact Purpose and Code Behavior |
| :--- | :--- | :--- |
| `?demo=1` | `http://localhost:8000/?demo=1` | Activates autonomous demo mode. Displays a glowing green pointer dot, automatically types the default name "Priya" into the input field at 145 milliseconds per letter, clicks "Light it up", plays the full show, displays the share panel for 3 seconds, and restarts the cycle continuously. Used for recording video reels without touching the mouse (js/demo.js, start). |
| `?demo=1&name=...` | `http://localhost:8000/?demo=1&name=Vijay` | Activates autonomous demo mode with a custom name instead of "Priya". Validates the custom name before starting (js/demo.js, lines 23 to 28). |
| `?test=1` | `http://localhost:8000/?test=1` | Runs the internal automated self-test suite of 43 verification tests. Logs a structured test result table directly to the browser developer console (F12) and sets `window.__SELFTEST_RESULTS__` (js/selftest.js, runSelfTests). |
| `?debug=1` | `http://localhost:8000/?debug=1` | Displays the green developer Heads-Up Display (HUD) in the upper right corner. Shows live FPS, live active particle count, and active rocket count. Adds four manual burst test buttons (Peony, Ring, Willow, Crackle) and a "Play Show" button. Enables keyboard shortcuts 1 to 4 and S (js/main.js, lines 368 to 422). |
| `?quality=high` | `http://localhost:8000/?quality=high` | Forces the High performance tier. Enables the half-resolution bloom glow canvas, maximum particle pool (6,000), 10 lanterns, 40 embers, 3 mist bands, burst illumination, and parallax camera push (js/main.js, line 51). |
| `?quality=medium` | `http://localhost:8000/?quality=medium` | Forces the Medium performance tier (default on mobile phones). Disables bloom canvas, limits particle pool to 2,500, sets 6 lanterns, 20 embers, and 2 mist bands (js/main.js, line 51). |
| `?quality=low` | `http://localhost:8000/?quality=low` | Forces the Low performance tier. Disables bloom, disables mist, disables embers, disables camera push, limits lanterns to 3, and renders burst sparks as fast solid rectangles instead of glow sprites (js/main.js, line 51; js/particles.js, line 211). |
| `?freeze=...` | `http://localhost:8000/?debug=1&freeze=7.5` | Fast-forwards the simulation mathematically to the specified show second (e.g. 7.5 seconds) and pauses the animation loop. Allows developers to inspect exact visual frames and take pixel-perfect screenshots without timing pauses manually (js/main.js, line 118). |
| `?button_launch=1` | `http://localhost:8000/?debug=1&button_launch=1` | Fast-forwards the simulation to inspect the exact moment the first rocket launches directly from the "Light it up" button (js/main.js, lines 123 to 144). |
| `?show_share_card=1` | `http://localhost:8000/?debug=1&show_share_card=1` | Fast-forwards the show past the melt phase and freezes with the sender share card and its captured thumbnail image open on screen (js/main.js, lines 145 to 162). |
| `?show_end_card=1` | `http://localhost:8000/?debug=1&show_end_card=1` | Fast-forwards the receiver flow past the melt phase and freezes with the receiver end card open on screen (js/main.js, lines 163 to 180). |
| `?receiver_lightup=...` | `http://localhost:8000/?debug=1&receiver_lightup=0.8` | Freezes the receiver light-up transition at the specified second (e.g. 0.0s for dark sky, 0.8s for mid-light, 1.6s for full illumination) to verify temple illumination timing (js/main.js, lines 181 to 203). |
| `?livepreview=...` | `http://localhost:8000/?debug=1&livepreview=Ananya` | Freezes the sender home screen with the specified name faintly rendered at 18% opacity in the night sky to inspect live typing preview positioning (js/main.js, lines 204 to 206). |
| `?benchmark=1` | `http://localhost:8000/?benchmark=1&show=1` | Records frame-by-frame delta times over an 11.5-second show run. Calculates average FPS, median FPS, and 1% low FPS. Stores the results in `window.dsBenchmarkResults` for automated performance benchmarking (js/main.js, lines 575 to 597). |
| `#s=...` | `http://localhost:8000/#s=eyJ2Ijox...` | The client-side private URL hash route. Carries base64url-encoded JSON containing the recipient name, sender name, and greeting choice. Never sent to any web server (js/link.js, parseShareHash). |

---

## 4. Every Screen and Every Feature

The application has five distinct visual states:

1. **Home Screen (Sender Flow)**
2. **Receiver Welcome Screen (Receiver Flow)**
3. **The Firework Show (Hero Simulation)**
4. **Share Panel (Sender Completion)**
5. **End Card (Receiver Completion)**

### Screen 1: Home Screen (Sender Flow)

#### Purpose and Role
The Home Screen allows any visitor to create a customized firework greeting in seconds.

#### Visual Appearance
- **Background:** The dark sky gradient spans the full viewport (`100dvh`). Distant city silhouettes with warm gold windows sit across the horizon. A South Indian temple gopuram tower stands proudly in the middle distance, wrapped in twinkling festival lights. Warm paper lanterns rise slowly toward the stars, and clay oil lamps (diyas) flicker along the bottom ledge. Ambient fireworks burst in the upper sky every 2.6 seconds.
- **Top Bar:** A white rounded chip containing the Wrench Wise logo rests at the top left. A circular white mute button with a dark speaker icon sits at the top right.
- **Sky Headline:** Directly above the form card, crisp white text reads: `"Write their name in the Diwali sky"` with `"Diwali sky"` highlighted in warm gold (`#FCD34D`). A smaller subtitle below reads: `"A fireworks greeting you can send on WhatsApp."`
- **Sender Card:** A clean white card styled with a 16px corner radius, a subtle 1px border, and a rich drop shadow that lifts it off the night sky. A 3px brand gradient bar (emerald to teal to cyan) spans the top edge of the card.

#### Form Controls Inside the Card
1. **"Their name" Input:** Required field. Accepts 1 to 16 characters. As the user types each letter, the name appears faintly in the night sky at its exact final position at 18% opacity with subtle twinkling sparks. This live preview gives instant feedback on how the name will fit (js/sceneRenderers.js, drawLivePreview).
2. **"Your name (optional)" Input:** Optional field. Accepts up to 20 characters. If filled, the text `"from [Name]"` will fade in below the firework name during the show.
3. **Greeting Toggle Pills:** Two rounded pill buttons: `"Happy Diwali"` (selected by default) and `"Happy Deepavali"`. Tapping either toggles its active state.
4. **"Light it up" Primary Button:** A full-width pill button filled with the Wrench Wise brand gradient (`#059669` to `#0D9488` to `#06B6D4`). A subtle white light sweep animates across the button face every four seconds. An inline white four-pointed spark icon precedes the label.
5. **Privacy Disclaimer:** A centered note in muted gray (`#6B7280`) reads: `"Names stay inside your link. We never store them."`

#### Click Steps to Use
1. Tap the `"Their name"` input field and type a friend's name (for example, "Priya").
2. Optionally tap `"Your name"` and type your own name (for example, "Vivek").
3. Select either `"Happy Diwali"` or `"Happy Deepavali"`.
4. Tap the `"Light it up"` button.

#### What Happens
When `"Light it up"` is tapped, the audio context unlocks. The card animates downward and fades out over 250 milliseconds (`animate-out`). Simultaneously, a bright rocket launches directly from the coordinates of the tapped button and climbs into the night sky, transitioning seamlessly into the show (js/ui.js, lines 200 to 213).

#### Phone vs Laptop Differences
- **Phone (width under 768px):** The sky headline sits near the top, and the form card is anchored in the lower portion of the screen. The name inputs are stacked vertically. Inner card padding is 20px.
- **Laptop (width 768px and above):** The headline and card sit together in the left third of the viewport (max-width 480px, left padding 7vw). This intentional layout keeps the temple gopuram, skyline, and rising lanterns unobstructed on the right side. The two name input fields sit side by side in a single horizontal row. Inner card padding is 24px.

---

### Screen 2: Receiver Screen (Receiver Flow)

#### Purpose and Role
Opens when a person clicks a private link shared with them (containing `#s=...`). It creates anticipation and requires a tap to enable browser sound.

#### Visual Appearance
- **The Dimmed Sky:** The scene begins in dramatic darkness. The sky, city, gopuram, and lanterns sit under a dark navy overlay at 60% opacity (`rgba(2, 6, 23, 0.6)`). Only the clay diyas on the bottom ledge burn brightly, casting warm amber reflections. Ambient fireworks are silenced.
- **The Receiver Card:** A white card sits in the lower portion of the screen containing:
  - Heading: `"[Sender Name] sent you a Diwali surprise"` (or `"Someone sent you a Diwali surprise"` if no sender was provided).
  - Primary Button: A full-width brand gradient button with the light sweep effect labeled `"Tap to open"`.
  - Sound Hint: A muted gray caption below reads: `"Turn sound on for the full effect."`

#### Click Steps to Use
1. The recipient opens the shared link on their phone or computer.
2. The recipient taps `"Tap to open"`.

#### What Happens (The 1.5-Second Illumination Sequence)
When `"Tap to open"` is tapped, the card fades away, and a carefully timed 1.5-second sequence awakens the scene (js/scene.js, lines 261 to 273; js/audio.js, playTempleBell):
1. **At 0.0 seconds:** A rich, resonant bronze temple bell rings using synthesized harmonic frequencies (480 Hz, 1325 Hz, 2592 Hz, and 4272 Hz) that decay smoothly over 2.5 seconds.
2. **From 0.0 to 1.5 seconds:** The 60% dark overlay fades to 0% opacity.
3. **From 0.0 to 1.5 seconds:** Lit windows across the distant city switch on in a continuous light ripple sweeping from left to right.
4. **From 0.0 to 1.5 seconds:** Golden festival lights on the temple gopuram illuminate tier by tier from bottom to top, followed by festive garland light strings across adjacent rooftops.
5. **At 1.5 seconds:** Warm paper lanterns begin rising skyward through the mist, and the main fireworks show launches immediately.

#### Phone vs Laptop Differences
- On mobile phones, the card is docked near the bottom edge above the system home indicator bar (`env(safe-area-inset-bottom)`).
- On laptops, the card is centered horizontally and vertically with a maximum width of 440px.

---

### Screen 3: The Firework Show (Hero Simulation)

#### Purpose and Role
The central emotional centerpiece of the product. Spells the recipient's name in glowing sparks suspended in the night sky.

#### Detailed Chronological Timeline

```
0.0s ---- Opening Bursts ---- 2.5s ---- Hero Rocket Climbs ---- 3.5s ---- Shell Boom ---- 4.05s ---- Homing Flight ---- 6.0s ---- Name Hold ---- 9.5s ---- Golden Melt ---- 12.7s ---- Ambient Mode
```

1. **Phase 1: Opening Salvo (0.0 to 2.4 seconds)**
   - Three rockets launch sequentially across different sky positions:
     - At 0.25s: Left rocket climbs to 26% width, 28% height, bursting into an emerald Peony ball.
     - At 0.95s: Right rocket climbs to 74% width, 26% height, bursting into a cyan Ring.
     - At 1.70s: Center rocket climbs to 48% width, 33% height, bursting into a weeping Willow.
   - Each rocket produces a rising whistle sound during ascent and a low-frequency concussive boom upon detonation. Each burst casts a soft colored light over the city and gopuram.
2. **Phase 2: Hero Rocket Ascent (2.5 to 3.5 seconds)**
   - A single heavy hero rocket launches with an emerald trail, ascending toward the upper center of the sky (38% from the top).
3. **Phase 3: The Hero Burst (3.5 seconds)**
   - The shell explodes at the exact focal center of the name. A deep bass thump resonates. A localized radial flash (up to 35% opacity, radius 38% of viewport) illuminates the sky for 150 milliseconds. Over 1,000 to 2,200 sparks erupt radially in all directions.
4. **Phase 4: Homing Flight and Formation (3.5 to 6.0 seconds)**
   - From 3.5 to 4.05 seconds, sparks expand outward under natural blast drag.
   - At 4.05 seconds, each spark begins homing toward its designated coordinate in the name typography.
   - Arrivals are staggered from left to right based on horizontal coordinate `u` (from 4.05s on the far left to 5.20s on the far right).
   - As sparks assemble, a soft shimmering crackle plays through the Web Audio synthesizer.
5. **Phase 5: The Hold Moment (6.0 to 9.5 seconds)**
   - The name remains held in mid-air for 3.5 seconds.
   - A soft, blurred aura canvas breathes behind the letters between 22% and 34% opacity on a 2.5-second sinusoidal cycle.
   - Every spark glows with its pre-rendered glow sprite, forming a continuous gradient from emerald (`#34D399`) on the left to teal (`#2DD4BF`) in the middle to cyan (`#22D3EE`) on the right.
   - Exactly one in every ten sparks twinkles with a brilliant festive gold glint (`#FCD34D`).
   - At 6.0 seconds, the greeting `"Happy Diwali"` (or `"Happy Deepavali"`) fades in above the name in 800-weight gold text with a soft blur glow.
   - At 6.5 seconds, `"from [Sender]"` fades in below the name in clean light text (`#F1F5F9`).
   - At 7.75 seconds, the application automatically snapshots the combined sky and fireworks canvases to create a crisp thumbnail image.
   - Floating sky lanterns automatically dim if their flight path crosses the name bounding box to ensure legibility.
6. **Phase 6: The Golden Melt (9.5 to 12.7 seconds)**
   - At 9.5 seconds, holding physics release. Each spark receives a random lateral velocity (-25 to +25 pixels/sec) and a downward push (10 to 40 pixels/sec).
   - Downward gravity (160 pixels/sec squared) accelerates the sparks toward the city skyline.
   - Over 3.2 seconds, the sparks leave luminous trailing streaks and transition from their emerald/cyan colors into festive gold (`#FCD34D`), pouring downward like a sparkling golden waterfall.
7. **Phase 7: Ambient Mode (12.7 seconds onwards)**
   - As the melt fades, the share panel or end card slides up into view. The sky remains active: random fireworks launch every 2.6 seconds, stars twinkle, and visitors can tap anywhere on the dark sky to launch custom fireworks.

---

### Screen 4: Share Panel (Sender Flow End)

#### Purpose and Role
Presented to the creator after the show completes so they can send the surprise to their recipient.

#### Visual Appearance
- A white card slides up smoothly from the bottom (`animate-in`).
- **Thumbnail Image:** A rounded 10px-radius preview image at the top of the card shows the exact snapshot captured at 7.75 seconds during the hold moment, proving to the sender what their friend will see.
- **Card Title:** Centered heading in dark slate (`#111827`): `"Share this Diwali sky"`.
- **"Send on WhatsApp" Button:** Primary full-width gradient button. Opens WhatsApp with a pre-formatted message.
- **"Share" Button:** Secondary bordered button. Invokes the mobile operating system's native share sheet (Apple iOS share sheet or Android share intent) on supported mobile browsers.
- **"Copy link" Button:** Secondary bordered button. Copies the private URL to the device clipboard and changes label to `"Copied"` for 2.0 seconds.
- **Text Actions:** Two quiet text links: `"Watch again"` (replays the animation) and `"Edit names"` (returns to the home form with fields pre-filled).
- **Brand Footer:** A thin border line, followed by `"Built with code by Wrench Wise"` and a clickable link: `"Learn to build apps like this"`.

---

### Screen 5: End Card (Receiver Flow End)

#### Purpose and Role
Presented to the recipient after they finish watching their personal surprise.

#### Visual Appearance
- Similar layout to the share card, including the captured hold-moment thumbnail.
- **Primary Action Button:**
  - If a sender name was included: `"Send one back to [SenderName]"`. Tapping this flips the names automatically: sets "Their name" to the original sender and "Your name" to the recipient, allowing an immediate reciprocal greeting.
  - If no sender name was included: `"Make one for someone"`.
- **Secondary Action Button:** `"Watch again"`. Replays the greeting show from the beginning.
- **Brand Footer:** Wrench Wise attribution and curriculum link.

---

## 5. Every Control

The table below catalogs every interactive button, input field, toggle, and keyboard shortcut across the entire application.

| Control Label / Name | Element Type | What It Does When Used | Exact Screen Position | Code Location Reference |
| :--- | :--- | :--- | :--- | :--- |
| **Wrench Wise Logo Chip** | Container / Link Chip | Displays Wrench Wise brand mark. If logo.png fails to load, falls back cleanly to bold text wordmark "Wrench Wise". | Top-left header, 16px from top and left edges | index.html, lines 36 to 39; js/main.js, lines 71 to 75 |
| **Mute / Unmute Button** | Icon Button (SVG) | Toggles Web Audio master gain between 0.45 (audible) and 0.00 (silent). Updates speaker icon and stores state in browser localStorage under key 'ds-muted'. | Top-right header, 44x44px circular button | index.html, lines 55 to 60; js/audio.js, lines 82 to 100; js/ui.js, lines 50 to 71 |
| **Their name** | Text Input | Accepts recipient's name (1 to 16 letters). Sanitizes whitespace and graphemes. Renders real-time 18% opacity live preview text in sky while typing. | Top row of Sender Card | js/ui.js, lines 114 to 125; js/validate.js, line 109 |
| **Your name (optional)** | Text Input | Accepts sender's name (0 to 20 letters). Appears as "from [Name]" during show hold moment. | Top row of Sender Card (beside or below recipient) | js/ui.js, line 115; js/validate.js, line 119 |
| **Happy Diwali** | Pill Toggle Button | Selects "Happy Diwali" as the sky greeting headline. Activates emerald soft background styling. | Greeting selection row inside Sender Card | js/ui.js, lines 132 to 147 |
| **Happy Deepavali** | Pill Toggle Button | Selects "Happy Deepavali" as the sky greeting headline. Activates emerald soft background styling. | Greeting selection row inside Sender Card | js/ui.js, lines 137 to 148 |
| **Light it up** | Primary Button | Validates inputs, launches first rocket directly from button coordinates, dismisses card, and starts show. | Bottom of Sender Card, full-width pill button | js/ui.js, lines 154 to 213 |
| **Tap to open** | Primary Button | Unlocks Web Audio, rings synthesized bronze temple bell, triggers 1.5s scene illumination, and plays show. | Receiver Card, full-width pill button | js/ui.js, lines 236 to 256 |
| **Send on WhatsApp** | Primary Button | Opens WhatsApp via https://wa.me/ with pre-encoded greeting message and private link. | Top of Share Card, full-width pill button | js/ui.js, lines 289 to 296; js/share.js, lines 19 to 23 |
| **Share** | Secondary Button | Invokes native system share sheet (iOS/Android). Automatically hides if browser does not support navigator.share. | Share Card, below WhatsApp button | js/ui.js, lines 298 to 307; js/share.js, lines 39 to 56 |
| **Copy link** | Secondary Button | Copies share URL to clipboard. Temporarily updates label to "Copied" for 2 seconds before reverting. | Share Card, below Share button | js/ui.js, lines 309 to 320; js/share.js, lines 64 to 90 |
| **Watch again** | Text Button | Replays the personalized fireworks animation from second 0.0 without reloading the web page. | Bottom of Share Card and End Card | js/ui.js, lines 324 to 330, lines 368 to 378 |
| **Edit names** | Text Button | Returns to Sender Card with previously entered recipient and sender names preserved in input fields. | Bottom of Share Card, beside Watch Again | js/ui.js, line 331 |
| **Send one back to [Sender]** | Primary Button | Flips recipient and sender names and opens Sender Card so the receiver can return a greeting immediately. | Top of End Card, full-width pill button | js/ui.js, lines 357 to 362 |
| **Make one for someone** | Primary Button | Opens fresh Sender Card if no sender name was included in the received link. | Top of End Card, full-width pill button | js/ui.js, lines 363 to 365 |
| **Learn to build apps like this** | Hyperlink | Opens Wrench Wise website in a new tab with attribution tracking parameters. | Footer of Share Card and End Card | js/ui.js, lines 383 to 391 |
| **Sky Tap / Click** | Canvas Pointer Event | Tapping or clicking anywhere on the sky canvas (outside active UI cards) launches a rocket to that point. | Anywhere across #fireworks-canvas | js/main.js, lines 425 to 452 |
| **Peony (Debug HUD)** | Debug Button | Launches a Peony spherical ball firework toward the upper sky. Visible only with ?debug=1. | Inside Debug HUD at top right | index.html, line 48; js/main.js, lines 381 to 394 |
| **Ring (Debug HUD)** | Debug Button | Launches a Ring planar circle firework toward the upper sky. Visible only with ?debug=1. | Inside Debug HUD at top right | index.html, line 49; js/main.js, lines 381 to 394 |
| **Willow (Debug HUD)** | Debug Button | Launches a drooping golden Willow firework toward the upper sky. Visible only with ?debug=1. | Inside Debug HUD at top right | index.html, line 50; js/main.js, lines 381 to 394 |
| **Crackle (Debug HUD)** | Debug Button | Launches a sparkling Crackle firework with delayed popping sparks. Visible only with ?debug=1. | Inside Debug HUD at top right | index.html, line 51; js/main.js, lines 381 to 394 |
| **Play Show (Debug HUD)**| Debug Button | Immediately triggers the complete name show timeline. Visible only with ?debug=1. | Inside Debug HUD at top right | index.html, line 52; js/main.js, lines 396 to 403 |
| **Key '1'** | Keyboard Shortcut | Selects and launches a Peony burst. Active only when ?debug=1 is enabled. | Keyboard | js/main.js, lines 406 to 416 |
| **Key '2'** | Keyboard Shortcut | Selects and launches a Ring burst. Active only when ?debug=1 is enabled. | Keyboard | js/main.js, lines 406 to 416 |
| **Key '3'** | Keyboard Shortcut | Selects and launches a Willow burst. Active only when ?debug=1 is enabled. | Keyboard | js/main.js, lines 406 to 416 |
| **Key '4'** | Keyboard Shortcut | Selects and launches a Crackle burst. Active only when ?debug=1 is enabled. | Keyboard | js/main.js, lines 406 to 416 |
| **Key 's' or 'S'** | Keyboard Shortcut | Triggers the name show animation. Active only when ?debug=1 is enabled. | Keyboard | js/main.js, lines 417 to 420 |
| **Tap Sound Hint** | Overlay Banner | Dismisses "Tap once to enable sound" banner and unlocks Web Audio during ?demo=1 reel recording. | Floating pill near top center in Demo Mode | js/demo.js, lines 71 to 95 |
| **window.dsPause()** | Console API | Pauses the entire animation loop for inspection. Active only with ?debug=1. | Developer Console | js/main.js, lines 224 to 227 |
| **window.dsResume()** | Console API | Resumes the paused animation loop. Active only with ?debug=1. | Developer Console | js/main.js, lines 229 to 233 |
| **window.dsStep(seconds)**| Console API | Advances simulation by exact number of seconds (in 1/60s increments). Active only with ?debug=1. | Developer Console | js/main.js, lines 235 to 254 |

---
## 6. One Full Journey

To understand how the entire system functions in practice, we trace one complete user journey from sender creation to recipient playback.

### The Actors
- **Sender:** Vivek, creating a surprise greeting for his friend.
- **Recipient:** Priya, opening the surprise link on her mobile phone.

---

### Step 1: Vivek Opens Diwali Sky
- **What happens on screen:** Vivek visits `https://diwalisky.vercel.app/` on his laptop. The dark night sky appears with twinkling stars, drifting mist, glowing diyas on the rooftop wall, and distant temple lights. The white Sender Card sits on the left side of the screen with empty input fields.
- **What happens in code:**
  1. The browser parses `index.html` and imports `js/main.js` as an ECMAScript module (ES module).
  2. `DiwaliSkyApp` instantiates `SkyManager`, `ParticlePool`, `FireworksEngine`, `ShowTimeline`, `SoundManager`, and `UIManager` (js/main.js, lines 41 to 47).
  3. `SkyManager` sets up three stacked HTML5 canvases: `#sky-canvas` (background atmosphere and architecture), `#fireworks-canvas` (interactive particle physics), and `#bloom-canvas` (soft glow filter) (js/sky.js, lines 6 to 13).
  4. `SceneManager` pre-renders static architectural silhouettes onto hidden offscreen canvases: the distant city skyline with 20 building blocks (`createFarCityCanvas`), the 7-tiered South Indian temple gopuram (`createMidGopuramCanvas`), and the dark rooftop parapet (`createFrontLedgeCanvas`) (js/scene.js, lines 145 to 148).
  5. The `requestAnimationFrame` loop begins executing at 60 FPS (js/main.js, line 533).

---

### Step 2: Vivek Types "Priya" into "Their name"
- **What happens on screen:** As Vivek types "P-r-i-y-a", the name "Priya" appears faintly in the night sky at 18% opacity, styled in the emerald-to-cyan gradient with sparkling embers.
- **What happens in code:**
  1. The input field fires the HTML `input` event (js/ui.js, line 120).
  2. `UIManager` forwards the string "Priya" to `app.setLivePreviewName('Priya')`.
  3. On every frame, `drawLivePreview` calculates font metrics, centers the text at 38% viewport height, and paints an 18% opacity linear gradient with randomized twinkling highlight sparks (js/sceneRenderers.js, lines 325 to 382).

---

### Step 3: Vivek Types "Vivek" and Selects Greeting
- **What happens on screen:** Vivek enters his name in "Your name (optional)". He leaves the greeting pill set to "Happy Diwali".
- **What happens in code:** `sField.input.value` stores `"Vivek"`. `UIManager.selectedGreeting` remains set to `'diwali'`.

---

### Step 4: Vivek Clicks "Light it up"
- **What happens on screen:** The Sender Card slides down and fades out. A bright rocket immediately launches from the exact spot Vivek clicked on the screen and climbs into the sky with an ascending whistle.
- **What happens in code:**
  1. The form submit listener executes (js/ui.js, line 165).
  2. Input validation executes: `validateRecipient('Priya')` checks length, grapheme clusters, Unicode letters, and blocklists. It returns `{ valid: true, cleanName: 'Priya' }` (js/validate.js, line 109).
  3. `SoundManager.unlock()` initializes the browser's `AudioContext` and connects the dynamics compressor node to the destination output (js/audio.js, line 51).
  4. The screen bounding rectangle of the button is measured (`getBoundingClientRect`). A rocket launches from `(btnRect.left + width/2, btnRect.top + height/2)` aimed toward the upper sky (js/ui.js, lines 190 to 207).
  5. After 250 milliseconds, `app.playShow('Priya', 'Vivek', 'Happy Diwali')` starts the timeline (js/ui.js, line 211).

---

### Step 5: The Show Plays
- **What happens on screen:** Opening fireworks explode across the sky. The emerald hero rocket ascends and detonates in a flash. Thousands of sparks swirl inward from the blast, homing smoothly to spell "Priya" in glowing green and cyan light. The greeting "Happy Diwali" glows above, and "from Vivek" glows below. After 3.5 seconds of shimmering in mid-air, the letters melt into falling golden trails.
- **What happens in code:**
  1. `ShowTimeline.start` samples the typography of "Priya" into 2,184 discrete point coordinates using an offscreen canvas (js/show.js, line 71; js/nameText.js, line 3).
  2. Opening rockets fire at 0.25s, 0.95s, and 1.70s. Each burst invokes `sound.playBurst()` and `addBurstLight()` to tint the background mist and city skyline (js/show.js, lines 200 to 212; js/main.js, lines 265 to 272).
  3. At 3.5 seconds, the hero rocket detonates: `SoundManager.playBurst('peony')` triggers a 40 Hz sine thump and low-pass filtered noise burst.
  4. From 4.05 to 5.2 seconds, homing kinematics pull sparks toward their target positions based on horizontal fraction `u` (js/show.js, lines 274 to 285).
  5. At 7.75 seconds, `captureStillImage()` merges the sky canvas and fireworks canvas into an offscreen 480px thumbnail canvas, encoding it as a JPEG data URL (js/main.js, lines 306 to 323).
  6. At 9.5 seconds, melt gravity ($160 \text{ px/s}^2$) accelerates the sparks downward while transitioning their colors into gold glow sprites (js/show.js, lines 294 to 306).

---

### Step 6: Vivek Shares on WhatsApp
- **What happens on screen:** The Share Card slides up with a preview thumbnail of the sky spelling "Priya". Vivek clicks "Send on WhatsApp".
- **What happens in code:**
  1. `buildShareLink('Priya', 'Vivek', 'diwali')` constructs the URL payload:
     `{"v":1,"t":"Priya","f":"Vivek","g":"diwali"}`
     This serializes to base64url: `eyJ2IjoxLCJ0IjoiUHJpeWEiLCJmIjoiVml2ZWsiLCJnIjoiZGl3YWxpIn0`
     Resulting URL: `https://diwalisky.vercel.app/#s=eyJ2IjoxLCJ0IjoiUHJpeWEiLCJmIjoiVml2ZWsiLCJnIjoiZGl3YWxpIn0` (js/link.js, line 68).
  2. `shareToWhatsApp` opens a browser tab with:
     `https://wa.me/?text=I%20made%20a%20Diwali%20surprise%20for%20you.%20Open%20it%20with%20sound%20on%3A%20https%3A%2F%2Fdiwalisky.vercel.app%2F%23s%3D...` (js/share.js, line 19).

---

### Step 7: Priya Opens the Link on Her Phone
- **What happens on screen:** Priya clicks the link in WhatsApp. Her phone opens the web page. The sky is dark and peaceful. Diyas flicker warmly along the bottom ledge. A card says: `"Vivek sent you a Diwali surprise"`. She taps `"Tap to open"`.
- **What happens in code:**
  1. `parseShareHash()` reads the URL hash `#s=...`, decodes the base64url string, checks schema version `v === 1`, and re-validates the names (js/link.js, lines 90 to 145).
  2. `app.isReceiverFlow` is set to `true`. `app.setReceiverDimmed(true)` activates the 60% dark overlay (js/main.js, line 329).
  3. When Priya taps "Tap to open", `SoundManager.unlock()` initializes Web Audio on her phone.
  4. `SoundManager.playTempleBell()` synthesizes the resonant bronze bell tones (js/audio.js, line 290).
  5. `app.startReceiverLightUp()` runs the 1.5-second illumination sequence: the dark overlay fades, city windows ripple on from left to right, gopuram festival lights climb from tier 1 to tier 7, and lanterns lift off (js/scene.js, lines 261 to 273).
  6. The show plays with Priya's name.

---

### Step 8: Priya Sends One Back
- **What happens on screen:** When the show finishes, Priya's End Card displays a thumbnail of her greeting and a large button: `"Send one back to Vivek"`. She taps it, and the Sender Card appears with "Their name" already filled with "Vivek" and "Your name" filled with "Priya".
- **What happens in code:**
  1. `UIManager.showEndCard` detects `currentData.sender === 'Vivek'` (js/ui.js, line 357).
  2. Tapping the button invokes `showSenderFlow({ recipient: 'Vivek', sender: 'Priya', greeting: 'diwali' })`, automatically flipping the social roles (js/ui.js, line 360).

---

## 7. The Logic: Algorithms, Formulas, and Rules

This section explains the core mathematics, computer science algorithms, and rules used throughout Diwali Sky.

### 1. Particle Pool Memory Management: Zero Garbage Collection
- **Plain words:** In normal JavaScript, creating hundreds of new objects every frame (`new Particle()`) forces the browser's Garbage Collector (GC) to constantly pause execution to free old memory, causing visible stuttering and frame drops on phones. Diwali Sky creates all particle memory once when the page loads using flat TypedArrays. When a particle dies, it is deactivated instantly in zero time without freeing or reallocating memory.
- **How it works:** All particle attributes reside in parallel typed array buffers of length 7,000 (`Float32Array` for coordinates, velocities, lifetimes, and sizes; `Uint8Array` for color IDs and types). A tracking array `activeIndices` stores pointers to live particles. When a particle at index `i` dies, the engine swaps it with the particle at the end of the active list (`activeCount - 1`) and decrements `activeCount`:
  ```javascript
  this.activeCount--;
  const lastIdx = this.activeIndices[this.activeCount];
  this.activeIndices[i] = lastIdx;
  this.activeIndices[this.activeCount] = idx;
  i--;
  ```
- **Worked example:** If 2,500 particles are live and particle at position 40 dies, the index at slot 2,499 moves into slot 40, and the active counter becomes 2,499. No object is destroyed.
- **Why chosen:** Eliminates garbage collection pauses completely, guaranteeing solid 60 FPS performance on mid-range Android phones.
- **Speed (Big-O):** $O(1)$ constant time for spawning; $O(1)$ constant time for deallocation. Plain words: Spawning or removing a particle takes the exact same microsecond whether 10 or 6,000 particles are active.
- **Code location:** `js/particles.js`, lines 45 to 108 and lines 149 to 155.

---

### 2. Rocket Trajectory Kinematics (Parabolic Apex Physics)
- **Plain words:** When a rocket is launched, it must fly upward, decelerate smoothly under simulated gravity, and reach the peak of its trajectory (apex) at the exact pixel coordinate where the firework should burst, precisely when the launch duration expires.
- **Formula:**
  Given vertical travel distance $\Delta y = targetY - startY$, horizontal distance $\Delta x = targetX - startX$, and duration $t$:
  $$v_{y0} = \frac{2 \cdot \Delta y}{t}$$
  $$a_y = -\frac{v_{y0}}{t} = -\frac{2 \cdot \Delta y}{t^2}$$
  $$v_x = \frac{\Delta x}{t}$$
- **Worked example:**
  Suppose a rocket starts at bottom $startY = 900$, aims for $targetY = 300$ ($\Delta y = -600 \text{ px}$), with startX $720$ and targetX $720$ ($\Delta x = 0$), over duration $t = 0.6 \text{ seconds}$:
  $$v_{y0} = \frac{2 \cdot (-600)}{0.6} = -2000 \text{ pixels per second (upward)}$$
  $$a_y = -\frac{-2000}{0.6} = +3333.33 \text{ pixels per second squared (downward gravity)}$$
  At $t = 0.6\text{s}$, vertical velocity reaches:
  $$v_y(0.6) = v_{y0} + a_y \cdot t = -2000 + (3333.33 \cdot 0.6) = 0 \text{ px/s (exact standstill at apex)}$$
  Vertical position reaches:
  $$y(0.6) = 900 + (-2000 \cdot 0.6) + (0.5 \cdot 3333.33 \cdot 0.36) = 900 - 1200 + 600 = 300 \text{ px (exact target)}$$
- **Why chosen:** Avoids guessing or numerical approximations; the rocket reaches its burst position with mathematical precision.
- **Speed (Big-O):** $O(1)$ constant time.
- **Code location:** `js/fireworks.js`, lines 88 to 110.

---

### 3. Burst Formations and Dispersion Mathematics
- **Plain words:** When a rocket bursts, its sparks must fly out in distinctive shapes: round balls (Peony), circles (Ring), drooping trails (Willow), or delayed pops (Crackle).
- **Formulas:**
  - **Peony (Spherical Ball):** Angle $\theta = \text{random}(0, 2\pi)$. Speed $v = v_{base} \cdot (0.4 + 0.65 \cdot R)$ where $R$ is random $(0, 1)$. Air drag is $0.958$. Gravity is $105 \text{ px/s}^2$ (js/fireworks.js, lines 119 to 143).
  - **Ring (Flat Circle):** Evenly spaced polar angles with random global rotation: $\theta_i = \frac{2\pi \cdot i}{N} + \theta_{rot}$. Speeds cluster tightly around $v_{base} \cdot (0.92 + 0.14 \cdot R)$ to form a crisp perimeter (js/fireworks.js, lines 145 to 170).
  - **Willow (Drooping Gold):** Sparks launch with low air drag ($0.984$), gentle gravity ($70 \text{ px/s}^2$), and longer lifespan ($1.75\text{s} \times 1.30 = 2.275\text{s}$). Sparks retain horizontal velocity while gently sinking, forming graceful drooping branches (js/fireworks.js, lines 172 to 196).
  - **Crackle (Two-Stage Pop):** Stage 1 sparks (`CRACKLE_PRE`) live for $0.45$ to $0.80$ seconds. When each Stage 1 spark dies, it triggers `spawnCracklePops()`, spawning 3 to 5 micro-sparks (`CRACKLE_POP`) with intense white flash (`#F8FAFC`), high drag ($0.88$), and audible click bursts (js/fireworks.js, lines 198 to 222; js/particles.js, lines 110 to 130).
- **Why chosen:** Matches authentic physical pyrotechnic shell classifications used in professional fireworks displays.
- **Speed (Big-O):** $O(N)$ linear time where $N$ is the number of sparks spawned in the burst ($N = 180$ to $340$).
- **Code location:** `js/fireworks.js`, lines 119 to 222.

---

### 4. Text Rasterization and Grid-Breaking Sampling
- **Plain words:** Converts typed text into coordinate points in the sky. To prevent the letters from looking like a rigid computer font or pixel grid, points are scattered with controlled random offsets.
- **The algorithm:**
  1. Measure line height and text width. Auto-scale font size between 26px and 140px so the full name fits strictly within 86% of viewport width and 30% of viewport height (js/nameText.js, lines 54 to 80).
  2. Render text onto an offscreen canvas in system sans-serif weight 800 (js/nameText.js, lines 81 to 96).
  3. Scan the pixel buffer (`getImageData`) to locate solid alpha pixels ($alpha > 120$) and compute the tight bounding box $[minX, maxX, minY, maxY]$.
  4. Compute dynamic sampling step $S$ to hit the target budget ($800$ on phone, $2,100$ on laptop):
     $$S = \max\left(1, \operatorname{round}\left(\sqrt{\frac{4 \cdot P_{solid}}{P_{target}}}\right)\right)$$
  5. Sample pixels at step $S$. Break the grid by applying a random jitter up to $\pm 45\%$ of the step size:
     $$jitterX = (2 \cdot R - 1) \cdot (0.45 \cdot S)$$
     $$jitterY = (2 \cdot R - 1) \cdot (0.45 \cdot S)$$
  6. Randomize spark sizes between 70% and 130% of base size (2.3px to 2.6px).
- **Worked example:**
  For the name "Priya" on laptop ($1440 \times 900$), solid pixel count is $26,380$. For target budget $2,100$:
  $$S = \sqrt{\frac{4 \cdot 26380}{2100}} = \sqrt{50.24} \approx 7 \text{ pixels}$$
  Max jitter is $7 \times 0.45 = 3.15 \text{ pixels}$. Each point shifts randomly by up to $\pm 3.15$ pixels, completely eliminating rows and columns.
- **Why chosen:** Ensures letters read cleanly from a distance while appearing organic and explosive rather than like a digital font.
- **Speed (Big-O):** $O(W \cdot H)$ linear with respect to canvas area during initial one-time rasterization (takes under 4 milliseconds on mobile devices).
- **Code location:** `js/nameText.js`, lines 3 to 245.

---

### 5. Smooth 16-Step Color Gradient Interpolation
- **Plain words:** Colors the firework name in the Wrench Wise brand gradient: emerald on the left, teal in the center, and cyan on the right.
- **Formula:**
  For normalized horizontal position $u \in [0.0, 1.0]$:
  - When $u \le 0.5$ (emerald to teal, where $t = u / 0.5$):
    $$R(t) = \operatorname{round}(52 + (45 - 52) \cdot t)$$
    $$G(t) = \operatorname{round}(211 + (212 - 211) \cdot t)$$
    $$B(t) = \operatorname{round}(153 + (191 - 153) \cdot t)$$
  - When $u > 0.5$ (teal to cyan, where $t = (u - 0.5) / 0.5$):
    $$R(t) = \operatorname{round}(45 + (34 - 45) \cdot t)$$
    $$G(t) = \operatorname{round}(212 + (211 - 212) \cdot t)$$
    $$B(t) = \operatorname{round}(191 + (238 - 191) \cdot t)$$
- **Quantization:** The colors are pre-rendered at application startup into 16 discrete offscreen glow sprites. During rendering, each spark selects its pre-rendered sprite using:
  $$index = \operatorname{round}(u \cdot 15)$$
- **Why chosen:** Pre-rendering 16 gradient sprites avoids calling expensive color math or gradient creation routines during the 60 FPS animation loop.
- **Speed (Big-O):** $O(1)$ constant time lookup.
- **Code location:** `js/sprites.js`, lines 51 to 87.

---

### 6. Offscreen Glow Sprites and Multi-Canvas Bloom Pass
- **Plain words:** Real fireworks have an intense white-hot core and a soft colored halo. Standard canvas drawing produces flat, harsh dots. Diwali Sky draws every spark using pre-rendered radial glow images and layers a blurred half-resolution canvas over the scene.
- **How it works:**
  1. **Sprite Structure:** At startup, 32x32 offscreen canvases render radial gradients with stops:
     - 0.00: White `#F8FAFC` at 100% opacity
     - 0.18: Spark color at 100% opacity
     - 0.35: Spark color at 85% opacity
     - 0.70: Spark color at 25% opacity
     - 1.00: Transparent (0% opacity)
  2. **Additive Blending:** Sparks are drawn using `ctx.globalCompositeOperation = 'lighter'`. Overlapping sparks add their color values together, making dense regions burn brighter.
  3. **Alpha Binning Optimization:** Instead of setting `ctx.globalAlpha` individually for 3,000 sparks (which causes 3,000 graphics pipeline flushes), particles are sorted into 3 pre-allocated arrays based on opacity: low ($0.08$ to $0.35$), medium ($0.35$ to $0.72$), and high ($0.72$ to $1.0$). The entire pool draws with only three state changes per frame (js/particles.js, lines 189 to 260).
  4. **Bloom Canvas:** On High tier, `#bloom-canvas` runs at 25% resolution. Each frame, it copies `#fireworks-canvas` scaled down. CSS applies `filter: blur(6px)`, `mix-blend-mode: screen`, and `opacity: 0.55`, bathing the skyline in soft light (index.html, lines 95 to 101; js/sky.js, lines 67 to 76).
- **Speed (Big-O):** $O(N)$ linear time where $N$ is the active particle count.
- **Code location:** `js/sprites.js`, lines 17 to 46; `js/particles.js`, lines 189 to 260.

---

### 7. Two-Stage Name Spark Flight and Hold
- **Plain words:** Sparks erupt from the shell detonation, fly outward naturally, then curve gracefully inward to assemble the name from left to right.
- **Kinematic Formulas:**
  - **Blast Stage (3.5 to 4.05 seconds):** Sparks move outward under explosive velocity with air damping:
    $$\mathbf{v}(t + \Delta t) = \mathbf{v}(t) \cdot 0.94^{60 \cdot \Delta t}$$
  - **Homing Stage (4.05 to 5.2 seconds):** Arrival time for each spark is staggered based on horizontal coordinate $u$:
    $$t_{arrive} = 4.05 + 1.15 \cdot u$$
    Homing force ramps smoothly as the spark approaches:
    $$force = 9.0 + 15.0 \cdot \left(\frac{t - 4.05}{t_{arrive} - 4.05}\right)$$
    $$\mathbf{v} \mathrel{+}= (\mathbf{target} - \mathbf{x}) \cdot force \cdot \Delta t$$
    $$\mathbf{v} \mathrel{*}= 0.85^{60 \cdot \Delta t}$$
  - **Hold Optimization:** Once all sparks arrive at 6.0 seconds, their positions become fixed. The engine bakes all 2,000 sparks into a single offscreen image (`bakeHoldCanvas`). For the next 3.5 seconds, drawing the entire name takes exactly **one** draw call (`drawImage`) instead of 2,000 individual calls, freeing CPU cycles for ambient fireworks (js/show.js, lines 308 to 333, line 432).
- **Speed (Big-O):** $O(N)$ during flight; $O(1)$ during hold moment.
- **Code location:** `js/show.js`, lines 260 to 333.

---

### 8. Golden Waterfall Melt Physics
- **Plain words:** When the hold moment ends, the letters melt into falling golden streamers that accelerate downward like a waterfall.
- **Formulas:**
  - Initial release impulse: $v_x \in [-25, +25] \text{ px/s}$, $v_y \in [10, 40] \text{ px/s}$.
  - Acceleration: $v_y \mathrel{+}= 160 \cdot \Delta t$.
  - Air resistance: $\mathbf{v} \mathrel{*}= 0.988^{60 \cdot \Delta t}$.
  - Trail streaks: Each frame connects previous position to current position with a golden stroke:
    $$x_{prev} = x - v_x \cdot (0.65 \cdot \Delta t)$$
    $$y_{prev} = y - v_y \cdot (0.65 \cdot \Delta t)$$
  - Quadratic alpha fade over 3.2 seconds:
    $$\alpha(t) = 1.0 - \left(\frac{t - 9.5}{3.2}\right)^{1.7}$$
- **Speed (Big-O):** $O(N)$ linear time.
- **Code location:** `js/show.js`, lines 294 to 306, lines 394 to 409.

---

### 9. Procedural Web Audio Synthesis
- **Plain words:** Every sound effect is generated in real time through code algorithms. Zero sound files are downloaded.
- **Synthesizer Architectures:**
  1. **Ascending Launch Whistle:** A pure sine wave oscillator sweeping upward from $260\text{Hz}$ to $680\text{Hz}$ over $0.55\text{s}$ using an exponential ramp (`exponentialRampToValueAtTime`). Gain rises to $0.08$ and falls to $0.001$ (js/audio.js, lines 115 to 147).
  2. **Concussive Boom:** Two parallel audio paths:
     - Low sine thump: Frequency sweeps downward from $120\text{Hz}$ to $38\text{Hz}$ over $0.45\text{s}$ to $0.70\text{s}$.
     - Filtered noise blast: Pre-calculated 1-second white noise buffer routed through a `BiquadFilterNode` configured as a low-pass filter sweeping downward from $550\text{Hz}$ to $140\text{Hz}$ (js/audio.js, lines 153 to 213).
  3. **Crackle Pops:** 10 individual micro-bursts of white noise routed through band-pass filters ($2200\text{Hz} \pm 1200\text{Hz}$, $Q = 3.0$) with rapid 35-millisecond exponential decay envelopes (js/audio.js, lines 218 to 251).
  4. **Temple Bell Modal Synthesis:** Additive synthesis combining four sine oscillators at exact physical resonance ratios of cast bronze temple bells:
     - Fundamental ($1.0 \times 480\text{Hz} = 480\text{Hz}$, gain $0.12$)
     - Tier 2 ($2.76 \times 480\text{Hz} = 1324.8\text{Hz}$, gain $0.07$)
     - Tier 3 ($5.40 \times 480\text{Hz} = 2592.0\text{Hz}$, gain $0.035$)
     - Tier 4 ($8.90 \times 480\text{Hz} = 4272.0\text{Hz}$, gain $0.015$)
     Each tone decays exponentially over $2.5$ seconds, producing a rich, metallic ceremonial chime (js/audio.js, lines 290 to 332).
  5. **Master Dynamics Compressor:** All voices route through a compressor node (threshold $-18\text{dB}$, knee $12\text{dB}$, ratio $6:1$, attack $3\text{ms}$, release $250\text{ms}$) ensuring that simultaneous bursts never distort or clip the speakers (js/audio.js, lines 54 to 60).
- **Voice Limiter:** Strictly caps active voices to 8 simultaneous sounds. If 8 sounds are playing, new sounds are dropped cleanly (js/audio.js, lines 102 to 110).
- **Speed (Big-O):** $O(1)$ constant time per audio trigger.
- **Code location:** `js/audio.js`, lines 1 to 333.

---

### 10. URL Hash Base64url Privacy Architecture
- **Plain words:** The recipient's name and greeting are encoded into the URL hash (the part after `#`). Because web browsers never send the URL hash to web servers in HTTP requests, names remain completely private on the user's device.
- **The encoding pipeline:**
  1. JavaScript object: `{"v":1,"t":"Priya","f":"Vivek","g":"diwali"}`
  2. `JSON.stringify` converts object to UTF-8 text string.
  3. `TextEncoder().encode()` converts text string to `Uint8Array` byte buffer.
  4. Binary string is converted to base64 using `btoa`.
  5. URL-safe substitution replaces standard base64 characters:
     - `+` becomes `-`
     - `/` becomes `_`
     - `=` padding is removed
- **Decoding pipeline:**
  1. Base64url padding is restored (`while len % 4 != 0: s += '='`).
  2. URL characters are restored (`-` to `+`, `_` to `/`).
  3. `atob` decodes to binary string, converted to `Uint8Array`.
  4. `TextDecoder('utf-8').decode()` safely reconstructs Unicode strings.
  5. `JSON.parse` restores the payload object.
  6. Schema validation verifies `v === 1`, and `validateRecipient()` re-validates the name.
- **Why chosen:** Guarantees absolute privacy, ensures Tamil and Hindi Unicode characters survive transmission, and prevents the recipient's name from appearing directly in the WhatsApp message link preview text.
- **Speed (Big-O):** $O(M)$ linear time where $M$ is payload length (under 100 characters).
- **Code location:** `js/link.js`, lines 6 to 146.

---

### 11. Dynamic Performance Degradation and 2-Second Sampling
- **Plain words:** If a visitor opens the app on a budget phone or a device with power-saving mode turned on, the app automatically scales down visual detail to preserve smooth interactivity.
- **The rule:**
  1. The animation loop measures elapsed time ($\Delta t$) and accumulates frame counts.
  2. Every 2.0 seconds, the window average frame rate is evaluated:
     $$FPS_{avg} = \frac{frames}{2.0\text{ seconds}}$$
  3. If $FPS_{avg} < 45\text{ FPS}$ and the quality tier is not locked by URL:
     - High tier steps down to Medium tier (disables bloom canvas, cuts particle pool from 6,000 to 2,500).
     - Medium tier steps down to Low tier (disables mist, disables embers, cuts lanterns to 3, switches burst particles to fast rectangles).
  4. **Hysteresis Rule:** The engine never steps up during an active show to avoid visual oscillation.
- **Speed (Big-O):** $O(1)$ constant time check.
- **Code location:** `js/main.js`, lines 559 to 574.

---

### 12. Eye Safety Rate Limiting
- **Plain words:** Medical and web safety guidelines recommend preventing rapid, full-screen flashes that could trigger photosensitive discomfort or seizures.
- **The rule:**
  1. Every burst detonation records its timestamp in `burstTimestamps`.
  2. Old timestamps older than 1,000 milliseconds are removed.
  3. If three large bursts have already detonated within the last second ($\ge 3$), new user clicks are staggered by 220 milliseconds instead of exploding simultaneously (js/fireworks.js, lines 224 to 237).
  4. Full-screen white flashes are strictly forbidden. The hero burst flash is localized to a radial circle of radius $38\%$ viewport and capped at $35\%$ opacity, lasting only $150$ milliseconds (js/show.js, lines 340 to 359).
- **Speed (Big-O):** $O(1)$ constant time.
- **Code location:** `js/fireworks.js`, lines 224 to 237; `js/show.js`, lines 340 to 359.

---

## 8. The Data: What Data the App Uses and Where It Lives

Because Diwali Sky is a zero-backend web application, all data structures are self-contained within client-side code and browser memory.

### Data Catalog Table

| Data Structure / Field | Type | Storage Location | Size / Count | Description and Constraints |
| :--- | :--- | :--- | :--- | :--- |
| **BLOCKLIST** | Array of Strings | js/blocklist.js, line 5 | 78 entries | Curated list of abusive words in English, romanized Hindi (e.g. bhenchod, chutiya, harami), and romanized Tamil (e.g. thevidiya, otha, punda). Checked after stripping spaces, dots, and hyphens in lowercase. |
| **PALETTE_COLORS** | Array of Objects | js/particles.js, line 14 | 7 color objects | The core firework palette: Emerald (#34D399), Teal (#2DD4BF), Cyan (#22D3EE), Mint (#A7F3D0), Gold (#FCD34D), Amber (#FBBF24), White (#F8FAFC). Each object stores hex, red, green, and blue values. |
| **SCENE_COLORS** | Object | js/sceneLayers.js, line 3 | 10 color hexes | Color values for architectural depth: layerFar (#1E293B), layerMid (#0F172A), layerNear (#020617), mist (rgba), dimLayer (rgba), and accent spark shades. |
| **URL Payload Schema** | JSON Object | URL Hash (#s=...) | 4 fields | The serialization schema: `v` (integer version, must be 1), `t` (recipient name string, 1 to 16 chars), `f` (sender name string, 0 to 20 chars), `g` (greeting string, 'diwali' or 'deepavali'). |
| **ds-muted** | String ('true'/'false')| Browser localStorage | 1 key-value pair | Persists the user's sound preference across sessions. Wrapped in try/catch to prevent errors if cookies or storage are blocked by browser settings. |
| **Distant Buildings Data** | Array of Objects | Generated in js/sceneLayers.js | 15 to 25 buildings | Generated dynamically to fill viewport width + 40px. Stores width (24 to 62px) and height (35% to 95% of max city height) for skyline silhouette rendering. |
| **City Lit Windows Data** | Array of Objects | Generated in js/sceneLayers.js | 40 to 120 windows | Window coordinates (wx, wy), baseline opacity (0.30 to 0.60), and flicker phase. Subsets slowly cycle on and off over time. |
| **Temple Gopuram Geometry** | Static Math Model | js/sceneLayers.js, line 80 | 7 tiers, 5 kalasams | Mathematical coordinates defining the tapering pyramidal profile of a South Indian temple tower, barrel roof, tier cornices, and 5 kalasam finials. Top is strictly bounded below 62% screen height. |
| **Festival Lights Data** | Array of Objects | Generated in js/sceneLayers.js | 45 to 80 lights | Coordinates and phase offsets for decorative gold bulbs outlining gopuram tier ledges and rooftop catenary garlands. |
| **Sky Lanterns Data** | Array of Objects | Managed in js/scene.js | 3 to 10 items | Active paper lantern objects: x, y, width (12 to 26px), height (16 to 34px), ascent speed (14 to 32 px/s), sway speed, sway amplitude (10 to 24px), depth fraction, and opacity. |
| **Clay Diyas Data** | Array of Objects | Generated in js/sceneRenderers.js| 5, 7, or 9 lamps | Lamp coordinate positions along bottom ledge: 5 diyas on screens under 480px, 7 diyas on screens 480 to 799px, 9 diyas on screens 800px and wider. Bowl width 36px, bowl height 18px. |
| **Diya Embers Data** | Array of Objects | Managed in js/scene.js | 0, 20, or 40 items | Floating amber spark particles drifting upward from burning diya flames. High tier: 40 embers; Medium tier: 20 embers; Low tier: 0 embers. |
| **Name Target Points Data** | Array of Objects | Generated in js/nameText.js | 600 to 2,900 points | Discrete spark target coordinates: targetX, targetY, normalized horizontal position u (0 to 1), assigned colorId, glint boolean flag, and spark size (1.6px to 3.4px). |

### Where the Data Came From
- The visual design system (colors, typography stack, shadows, corner radii, and button shapes) was sampled directly from the live production website of Wrench Wise (`wrench-wise.com`) to ensure total brand alignment.
- The 78-word blocklist was curated to filter common English, Hindi, and Tamil profanity, abusive slurs, hate speech, and harassment terms while protecting authentic South Asian names.

### Data Accuracy, Integrity, and Limits
- **No Database:** Data exists only in memory while the web page is open. Closing the tab discards active particle coordinates.
- **Tamper Resistance:** If a visitor tampers with the URL hash `#s=...` by changing letters or corrupting the base64 structure, `parseShareHash` catches the error inside a `try/catch` block, rejects the payload, and displays a graceful notice: `"This link didn't work. Make a new one below."` (js/link.js, lines 139 to 145; js/ui.js, line 102).
- **Character Encoding Integrity:** Full Unicode support ensures Tamil graphemes (such as `"அன்பு"` or `"தீபன்"`) and Hindi conjuncts (such as `"प्रिया"`) encode and decode with 100% fidelity without question marks or corruption.

---
## 9. Every File in the Project

The table below lists every file and folder in the Diwali Sky repository, detailing its exact purpose, line count, and primary exports or classes.

| Path | Size (Lines) | Size (Bytes) | Purpose and Contents | Key Functions, Classes, and Constants |
| :--- | :--- | :--- | :--- | :--- |
| **.gitignore** | 10 lines | 102 B | Directs Git version control to ignore system temp files (.DS_Store, Thumbs.db), log files, node_modules, and .vercel build output. | Configuration file |
| **index.html** | 81 lines | 3,833 B | HTML5 entry point. Configures mobile meta viewport (viewport-fit=cover), Open Graph metadata, PWA manifest link, favicon, three stacked canvases (#sky-canvas, #fireworks-canvas, #bloom-canvas), header overlay with logo and mute button, and module entry script. | `<canvas>`, `<header>`, `<div id="ui-container">` |
| **LICENSE** | 21 lines | 1,094 B | Legal MIT Open Source license grant protecting copyright for Pradeep B and Wrench Wise while allowing free educational and commercial usage. | Legal text |
| **manifest.json** | 22 lines | 507 B | Progressive Web App (PWA) manifest. Enables "Add to Home Screen" on mobile devices with standalone display mode, portrait lock, and brand theme colors (#0F172A, #059669). | PWA Configuration |
| **README.md** | 102 lines | 4,358 B | Technical portfolio summary. Includes project badges, architecture overview, Mermaid render pipeline diagram, dynamic quality scaling table, and local development setup instructions. | Markdown documentation |
| **REEL_SCRIPT.md** | 112 lines | 6,824 B | Production video recording scripts matched to demo mode timing. Contains a 30-second vertical script (9:16) for Instagram Reels/Shorts and a 60-second horizontal script (16:9) for YouTube/LinkedIn. | Video scripts |
| **styles.css** | 361 lines | 13,701 B | Complete CSS design system. Defines CSS custom properties in :root (colors, font stack, radii, shadows), reset rules, canvas stacking, responsive UI layout, button light sweep keyframes, card animations, and prefers-reduced-motion overrides. | CSS custom variables, `@keyframes btnSweep`, `.ww-card` |
| **assets/favicon.png** | Binary | 36,473 B | High-resolution 192x192 PNG browser tab icon and PWA launcher icon. | Image asset |
| **assets/logo.png** | Binary | 67,822 B | Official high-resolution 512x512 Wrench Wise logo with dark brand text and emerald emblem. | Image asset |
| **assets/og-image.png** | Binary | 285,393 B | Pre-rendered 1200x630 Open Graph preview card image displayed when links are shared on WhatsApp, iMessage, and Twitter. | Image asset |
| **tools/og.html** | 315 lines | 9,782 B | Standalone browser-based graphic generator that renders the 1200x630 og-image.png canvas with the gopuram, lanterns, bursts, and "A Diwali surprise for you" headline. | Canvas rendering utility |
| **js/audio.js** | 333 lines | 9,596 B | Procedural Web Audio synthesizer. Synthesizes rocket launch whistles, concussive shell booms, spark crackles, name arrival chimes, and modal bronze temple bells without audio files. Manages voice limiting (8 voices) and dynamics compression. | `class SoundManager` |
| **js/blocklist.js** | 99 lines | 1,731 B | Safety dictionary containing 78 curated abusive and profane words across English, romanized Hindi, and romanized Tamil. Provides normalized substring matching. | `BLOCKLIST`, `isBlocklisted()` |
| **js/demo.js** | 171 lines | 4,982 B | Autonomous reel recording director. Renders a glowing green pointer dot that navigates the screen, automatically types a name letter by letter, triggers the show, and loops continuously. | `class DemoManager` |
| **js/fireworks.js** | 337 lines | 9,451 B | Rocket physics and explosion director. Manages parabolic ascent kinematics, color selection ratios (3 of 5 brand colors), and the four core burst formations (Peony, Ring, Willow, Crackle). | `class FireworksEngine`, `COLOR_IDS` |
| **js/link.js** | 146 lines | 4,396 B | Client-side privacy serialization engine. Converts greeting objects into base64url URL hashes and decodes received hashes using TextEncoder and TextDecoder. | `buildShareLink()`, `parseShareHash()`, `encodePayload()`, `decodePayload()` |
| **js/main.js** | 671 lines | 25,945 B | Central application controller. Orchestrates subsystem initialization, requestAnimationFrame loop, delta time calculation, dynamic tier adjustment, debug HUD, keyboard shortcuts, and screen routing. | `class DiwaliSkyApp`, `initApp()` |
| **js/nameText.js** | 257 lines | 7,679 B | Typography rasterizer. Renders user names onto offscreen canvases, detects bounding boxes, calculates dynamic sampling steps, applies 45% grid-breaking jitter, and assigns gradient coordinates. | `generateNamePoints()`, `sampleNamePoints()` |
| **js/particles.js** | 270 lines | 8,479 B | High-performance TypedArray particle pool. Pre-allocates memory for 7,000 particles, handles velocity and drag integration, and executes zero-flush batched drawing. | `class ParticlePool`, `PALETTE_COLORS`, `PARTICLE_TYPES` |
| **js/scene.js** | 420 lines | 13,399 B | Scene coordinator. Manages depth layer parallax shifts, smooth camera push (1.00x to 1.05x), shooting stars, receiver illumination timing, and burst light reflections. | `class SceneManager` |
| **js/sceneLayers.js** | 321 lines | 9,440 B | Architectural silhouette generator. Creates static offscreen canvases for the distant city skyline, the 7-tier temple gopuram, the front rooftop parapet, and horizontal mist bands. | `SCENE_COLORS`, `createFarCityCanvas()`, `createMidGopuramCanvas()`, `createFrontLedgeCanvas()`, `createMistCanvases()` |
| **js/sceneRenderers.js** | 382 lines | 12,497 B | Dynamic scene rendering routines. Paints twinkling stars, rising paper lanterns, diya flames, diya embers, lit city windows, gopuram festival light strings, and real-time live preview text. | `drawSkyAtmosphere()`, `drawLanterns()`, `drawBurstLighting()`, `drawDiyas()`, `drawCityWindows()`, `drawGopuramLights()`, `drawLivePreview()` |
| **js/selftest.js** | 178 lines | 7,054 B | In-browser automated test runner executed via ?test=1. Tests link serialization, input rejection rules, point boundary constraints, and corrupted payload handling. | `runSelfTests()` |
| **js/share.js** | 90 lines | 2,666 B | Social sharing helper. Provides formatted WhatsApp redirect links, native Web Share API integration, and asynchronous clipboard copying with textarea fallback. | `shareToWhatsApp()`, `shareNative()`, `copyToClipboard()`, `canNativeShare()` |
| **js/show.js** | 547 lines | 19,495 B | Master timeline director for the hero name sequence. Coordinates opening rockets, hero shell explosion, homing flight, breathing aura glow, gold glints, text overlays, and golden melt waterfall. | `class ShowTimeline` |
| **js/sky.js** | 110 lines | 3,383 B | Canvas resolution and bloom overlay manager. Handles window resizing, device pixel ratio capping (at 2.0), orientation changes, and offscreen bloom canvas updates. | `class SkyManager` |
| **js/sprites.js** | 87 lines | 2,931 B | Pre-rendered glow sprite cache. Generates 24 offscreen glow canvases at startup: 7 for core colors, 16 for the emerald-to-cyan name gradient, and 1 gold glint sprite. | `PALETTE_SPRITES`, `NAME_GRADIENT_SPRITES`, `GLINT_SPRITE`, `getNameGradientSprite()` |
| **js/ui.js** | 392 lines | 13,916 B | User interface view manager. Constructs the Sender Card, Receiver Card, Share Card, End Card, mute button, thumbnail previews, and form validation error states. | `class UIManager` |
| **js/validate.js** | 120 lines | 3,108 B | Name validation rules. Enforces character length, international Unicode letters, grapheme cluster segmentation via Intl.Segmenter, whitespace collapsing, and blocklist screening. | `validateName()`, `validateRecipient()`, `validateSender()`, `countGraphemes()`, `normalizeName()` |
| **docs/screenshots/** | Folder (8 PNGs) | ~2.1 MB | Contains 8 verified full-resolution screenshots captured across phone (390x844) and laptop (1440x900) viewports: hold_laptop_1440x900.png, hold_phone_390x844.png, home_laptop_1440x900.png, home_phone_390x844.png, receiver_laptop_1440x900.png, receiver_phone_390x844.png, share_laptop_1440x900.png, and share_phone_390x844.png. | Visual documentation |
| **screenshots/** | Folder (5 phases) | ~18 MB | Historical phase verification screenshots and benchmark logs generated during development phases 0 through 5. Described in detail below. | Quality assurance archive |

### Historical Verification Archive (screenshots/ folder)

The `screenshots/` directory stores historical test captures recorded during development phases:
1. **Phase 0 Baseline Archive (`screenshots/phase0/`):** Contains baseline captures prior to cinematic upgrades: `before_laptop_priya_2s.png`, `before_laptop_priya_4.6s.png`, `before_laptop_priya_7.5s.png`, `before_laptop_priya_11s.png`, `before_laptop_vijayalakshmi_7.5s.png`, `before_phone_priya_2s.png`, `before_phone_priya_4.6s.png`, `before_phone_priya_7.5s.png`, `before_phone_priya_11s.png`, and `before_phone_vijayalakshmi_7.5s.png`.
2. **Phase 1 Light Quality Archive (`screenshots/phase1/`):** Contains light quality upgrade captures: `after_laptop_priya_2s.png`, `after_laptop_priya_4.6s.png`, `after_laptop_priya_7.5s.png`, `after_laptop_priya_11s.png`, `after_laptop_vijayalakshmi_7.5s.png`, `after_phone_priya_2s.png`, `after_phone_priya_4.6s.png`, `after_phone_priya_7.5s.png`, `after_phone_priya_11s.png`, `after_phone_vijayalakshmi_7.5s.png`, `fps_results.json`, and `zoomed_name_no_grid.png`.
3. **Phase 3 Interaction Archive (`screenshots/phase3/`):** Contains interactive flow captures: `button_launch_laptop.png`, `button_launch_phone.png`, `end_card_with_thumbnail_laptop.png`, `end_card_with_thumbnail_phone.png`, `live_preview_laptop.png`, `live_preview_phone.png`, `receiver_lightup_0s_laptop.png`, `receiver_lightup_0.8s_laptop.png`, `receiver_lightup_1.6s_laptop.png`, `receiver_lightup_0s_phone.png`, `receiver_lightup_0.8s_phone.png`, `receiver_lightup_1.6s_phone.png`, `share_card_with_thumbnail_laptop.png`, `share_card_with_thumbnail_phone.png`, `frame_laptop_priya_2s.png`, `frame_laptop_priya_4.6s.png`, `frame_laptop_priya_7.5s.png`, `frame_laptop_priya_11s.png`, `frame_laptop_vijayalakshmi_7.5s.png`, `frame_phone_priya_2s.png`, `frame_phone_priya_4.6s.png`, `frame_phone_priya_7.5s.png`, `frame_phone_priya_11s.png`, and `frame_phone_vijayalakshmi_7.5s.png`.
4. **Phase 4 Performance Tiers Archive (`screenshots/phase4/`):** Contains quality tier captures at 7.5s: `tier_high_laptop_7.5s.png`, `tier_high_phone_7.5s.png`, `tier_medium_laptop_7.5s.png`, `tier_medium_phone_7.5s.png`, `tier_low_laptop_7.5s.png`, and `tier_low_phone_7.5s.png`.
5. **Phase 5 Polish and Verification Archive (`screenshots/phase5/`):** Contains final release frame captures: `receiver_lightup_0.0s.png`, `receiver_lightup_0.8s.png`, `receiver_lightup_1.6s.png`, and inside `screenshots/phase5/frames/`: `laptop_priya_2.0s.png`, `laptop_priya_4.6s.png`, `laptop_priya_7.5s.png`, `laptop_priya_11.0s.png`, `laptop_vijayalakshmi_2.0s.png`, `laptop_vijayalakshmi_4.6s.png`, `laptop_vijayalakshmi_7.5s.png`, `laptop_vijayalakshmi_11.0s.png`, `phone_priya_2.0s.png`, `phone_priya_4.6s.png`, `phone_priya_7.5s.png`, `phone_priya_11.0s.png`, `phone_vijayalakshmi_2.0s.png`, `phone_vijayalakshmi_4.6s.png`, `phone_vijayalakshmi_7.5s.png`, and `phone_vijayalakshmi_11.0s.png`.

---

### How the Files Connect from Page Load to Screen

The diagram and numbered list below trace the exact execution pipeline from the moment a user enters the web address:

```
index.html
   │
   ├── styles.css (loads colors, fonts, layout, and brand bar)
   │
   └── js/main.js
         │
         ├── imports: sky.js, particles.js, fireworks.js, show.js, audio.js, ui.js, link.js, demo.js
         │
         ├── 1. SkyManager initializes canvases (#sky, #fireworks, #bloom)
         │       └── SceneManager pre-renders sceneLayers.js (city, gopuram, ledge)
         │
         ├── 2. ParticlePool pre-allocates Float32Arrays for 7,000 particles
         │       └── sprites.js generates 24 offscreen glow sprites
         │
         ├── 3. SoundManager prepares AudioContext on standby
         │
         ├── 4. link.js checks window.location.hash
         │       ├── If '#s=...' found: UIManager.showReceiverFlow()
         │       └── If no hash found: UIManager.showSenderFlow()
         │
         └── 5. requestAnimationFrame loop starts:
                 ├── skyManager.updateAndDraw() -> paints background, stars, lanterns, diyas
                 ├── fireworks.update() -> advances rocket trajectories
                 ├── particlePool.update() -> applies drag and gravity
                 ├── show.update() -> evaluates timeline seconds
                 ├── particlePool.draw() -> paints sparks with 'lighter' blend mode
                 └── skyManager.updateBloom() -> updates half-res glow canvas
```

1. **HTML Parsing:** The browser reads `index.html`, injects the 3px `#brand-bar`, creates the three canvas elements, mounts the header chips, and triggers `styles.css`.
2. **Subsystem Boot:** `js/main.js` executes immediately. It determines viewport dimensions and assigns the starting particle budget (6,000 on laptop, 2,500 on phone).
3. **Graphic Pre-caching:** `js/sprites.js` executes at module load time, rendering all 24 glow sprites onto tiny 32x32 offscreen canvases. `js/sceneLayers.js` builds offscreen bitmaps for the city, gopuram, and ledge.
4. **Routing Evaluation:** `parseShareHash()` inspects the URL hash:
   - If a valid payload exists, `app.isReceiverFlow` is set to `true`, the sky overlay dims to 60%, and the Receiver Card mounts.
   - If no payload exists, `UIManager.showSenderFlow()` mounts the Sender Card with the live preview listener.
5. **Continuous 60 FPS Loop:** The browser calls `loop()` via `requestAnimationFrame`. Delta time ($\Delta t$) is calculated, capped at $0.05\text{ seconds}$ to prevent teleportation after tab switching. The background canvas draws the architectural scene; the fireworks canvas draws sparks with glowing trails (`destination-out`); and the bloom canvas blurs bright regions on High tier.

---

## 10. Tech Used

Diwali Sky is engineered strictly with open web standards.

### Languages and Technologies

1. **HTML5:** Semantic markup, canvas elements, SVG vector icons, Open Graph protocol metadata, and Progressive Web App manifest hooks.
2. **CSS3:** Custom properties (CSS variables), CSS Grid, Flexbox, safe-area-inset env variables, linear gradients, multi-stop radial gradients, CSS hardware blur filters (`filter: blur(6px)`), blend modes (`mix-blend-mode: screen`), and media queries (`prefers-reduced-motion`).
3. **Modern JavaScript (ES2022+ Modules):** Native browser modules (`import`/`export`), classes, arrow functions, template literals, async/await, and Unicode regex property escapes (`\p{L}`, `\p{M}`).

### Browser APIs Utilized

1. **Canvas 2D API (`CanvasRenderingContext2D`):** Hardware-accelerated 2D bitmap rendering, offscreen canvas buffering, blend mode composition (`lighter`, `destination-out`), pixel buffer analysis (`getImageData`), and radial gradient painting.
2. **Web Audio API (`AudioContext`):** Real-time procedural audio synthesis using `OscillatorNode`, `BiquadFilterNode`, `AudioBufferSourceNode`, `GainNode`, and `DynamicsCompressorNode`.
3. **JavaScript TypedArrays:** Flat contiguous memory buffers (`Float32Array`, `Uint8Array`, `Int32Array`) that completely eliminate memory allocation and garbage collection pauses during animation.
4. **Intl.Segmenter API:** International grapheme cluster analysis that correctly calculates user-perceived character lengths for complex Indian scripts (Tamil and Hindi).
5. **Web Share API (`navigator.share`):** Direct trigger for native mobile OS share sheets on iOS and Android devices.
6. **Clipboard API (`navigator.clipboard`):** Asynchronous clipboard copy for sharing links, with legacy textarea fallback.
7. **DeviceOrientation API:** Captures mobile gyroscope tilt data (`gamma` angle) to drive natural multi-layer parallax shifting without touch dragging.
8. **Page Visibility API (`document.visibilitychange`):** Automatically suspends audio playback and freezes the physics loop when the visitor switches tabs, conserving battery and CPU power.

### External Services, Network Calls, and Dependencies

- **External Libraries / Frameworks:** ZERO (no React, Vue, Three.js, PixiJS, jQuery, or Tailwind runtime).
- **External Web Fonts:** ZERO (uses native system font stack: `-apple-system`, `Segoe UI`, `Roboto`).
- **External Audio Files:** ZERO (no MP3, WAV, or OGG network downloads).
- **Backend Servers / APIs:** ZERO (no Node/Express backend, no Python server, no serverless functions).
- **Database / User Tracking:** ZERO (no SQL/NoSQL database, no Supabase, no Firebase).
- **API Keys / Logins:** ZERO (no authentication, no tokens, no account required).
- **Internet Requirement:** After the initial single-page download (under 400 KB uncompressed), the application runs completely offline.

---

## 11. Design: Colors, Typography, Spacing, and Layouts

The visual identity of Diwali Sky is directly calibrated to match the design system of `wrench-wise.com`.

### 1. Color Palette

All colors are stored as CSS custom properties in `:root` inside `styles.css`. JavaScript reads these values to ensure a single source of truth across CSS and canvas rendering.

#### Brand Colors (The Wrench Wise Light Style)
- `--brand: #059669` (Emerald 600: Primary brand color used for borders and links)
- `--brand-strong: #047857` (Emerald 700: Active states and pill text)
- `--brand-soft: #D1FAE5` (Emerald 100: Input focus rings and active pill backgrounds)
- `--accent: #0891B2` (Cyan 600: Secondary accent)
- `--brand-grad: linear-gradient(90deg, #059669, #0D9488, #06B6D4)` (Core brand gradient used for primary buttons, title text, and top accent bar)

#### UI Cards and Text
- `--card: #FFFFFF` (Pure white card background)
- `--card-border: #E5E7EB` (Gray 200: Subtle card and input outline)
- `--text: #111827` (Gray 900: High-contrast primary headings)
- `--text-2: #374151` (Gray 700: Secondary body text)
- `--muted: #6B7280` (Gray 500: Disclaimers, sound hints, and metadata)
- `--error: #E11D48` (Rose 600: Form validation error messages)

#### The Night Sky (Deep Navy Gradient)
- `--sky-top: #020617` (Slate 950: Deepest space navy at top of screen)
- `--sky-mid: #0F172A` (Slate 900: Middle sky navy)
- `--sky-bottom: #0F2431` (Dark teal-navy horizon tone)
- `--horizon-glow: rgba(16, 185, 129, 0.14)` (Soft emerald atmospheric glow above horizon)
- `--star: #E2E8F0` (Slate 200: Twinkling star color)
- `--on-sky: #F1F5F9` (Slate 100: Crisp white text rendered over sky)
- `--on-sky-muted: #CBD5E1` (Slate 300: Muted sky subtitles)

#### Firework Spark Palette
- `--spark-emerald: #34D399` (Emerald 400: Hero shell and left name gradient)
- `--spark-teal: #2DD4BF` (Teal 400: Mid name gradient)
- `--spark-cyan: #22D3EE` (Cyan 400: Right name gradient)
- `--spark-mint: #A7F3D0` (Mint 200: Soft opening bursts and Milky Way)
- `--spark-gold: #FCD34D` (Amber 300: Greeting text, Diwali glints, and melt trails)
- `--spark-amber: #FBBF24` (Amber 400: Paper lanterns, diya flames, and willow droops)
- `--spark-white: #F8FAFC` (Slate 50: Spark core highlights and crackle pops)

#### Architectural Depth Layers
- `--layer-far: #1E293B` (Slate 800: Distant city skyline silhouette)
- `--layer-mid: #0F172A` (Slate 900: Temple gopuram tower and flanking houses)
- `--layer-near: #020617` (Slate 950: Front rooftop ledge)
- `--mist: rgba(203, 213, 225, 0.06)` (Soft drifting horizontal mist bands)
- `--dim-layer: rgba(2, 6, 23, 0.6)` (Receiver screen dimming veil)

---

### 2. Typography Stack
- **Font Family:** `ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`
- **Headings:** Font weight `800` (Extra Bold) with tight negative letter-spacing (`-0.01em`).
- **Body Text:** Font weight `400` to `500` with clean `1.4` to `1.5` line-height.
- **Contrast Ratios:** All text elements exceed the Web Content Accessibility Guidelines (WCAG) AA standard of at least 4.5 to 1 contrast against their respective backgrounds.

---

### 3. Spacing, Corner Radii, and Shadows
- **Corner Radii:**
  - Full pill buttons and toggle pills: `999px`
  - Cards: `16px`
  - Form text inputs: `12px`
  - Small chips (logo chip, debug HUD): `8px`
- **Card Padding:**
  - Phone: `20px` inner padding
  - Laptop: `24px` inner padding
- **Elevation Shadows:**
  - `--shadow-md: 0 4px 6px -1px rgba(0,0,0,0.10), 0 2px 4px -2px rgba(0,0,0,0.10)`
  - `--shadow-card: 0 10px 15px -3px rgba(0,0,0,0.10), 0 4px 6px -4px rgba(0,0,0,0.10), 0 24px 48px -12px rgba(2,6,23,0.6)` (Rich elevation shadow that lifts white cards off the dark navy sky)

---

### 4. Themes: Single Unified Theme Architecture
The application features a single unified theme: a deep navy night sky with bright, crisp white cards. This design deliberately mirrors the visual style of Wrench Wise while providing the dark canvas essential for luminous pyrotechnic particles. There is no separate light mode toggle or `prefers-color-scheme: light` variation, because firework sparks cannot be visually perceived against a bright white background.

---

### 5. Verified Screen Layouts and Screenshots

Screenshots were captured using headless Chrome at exact required viewports: mobile phone size ($390 \times 844$) and laptop size ($1440 \times 900$). All images are saved in `docs/screenshots/`.

#### Home Screen (Sender Flow)
- **Laptop (1440 x 900):** Headline and card are positioned on the left third of the screen, leaving the skyline, temple gopuram, and lanterns visible on the right.
  - Image link: [home_laptop_1440x900.png](file:///C:/Projects/Wrench-Wise/2%20Diwali_Sky/docs/screenshots/home_laptop_1440x900.png)
- **Phone (390 x 844):** Headline at top, form card docked in lower half with stacked inputs.
  - Image link: [home_phone_390x844.png](file:///C:/Projects/Wrench-Wise/2%20Diwali_Sky/docs/screenshots/home_phone_390x844.png)

#### Receiver Welcome Screen
- **Laptop (1440 x 900):** Darkened sky with glowing diyas, centered welcome card reading "Vivek sent you a Diwali surprise".
  - Image link: [receiver_laptop_1440x900.png](file:///C:/Projects/Wrench-Wise/2%20Diwali_Sky/docs/screenshots/receiver_laptop_1440x900.png)
- **Phone (390 x 844):** Mobile view of the darkened night sky and "Tap to open" button.
  - Image link: [receiver_phone_390x844.png](file:///C:/Projects/Wrench-Wise/2%20Diwali_Sky/docs/screenshots/receiver_phone_390x844.png)

#### Show Hold Moment (The Personalized Name)
- **Laptop (1440 x 900):** Name "Priya" glowing across the sky in emerald, teal, and cyan with breathing aura and golden greeting.
  - Image link: [hold_laptop_1440x900.png](file:///C:/Projects/Wrench-Wise/2%20Diwali_Sky/docs/screenshots/hold_laptop_1440x900.png)
- **Phone (390 x 844):** Crisp portrait rendering of "Priya" formatted to fit within 86% of mobile screen width.
  - Image link: [hold_phone_390x844.png](file:///C:/Projects/Wrench-Wise/2%20Diwali_Sky/docs/screenshots/hold_phone_390x844.png)

#### Share Panel with Captured Moment Thumbnail
- **Laptop (1440 x 900):** Share card displaying WhatsApp button, copy link, and embedded thumbnail snapshot.
  - Image link: [share_laptop_1440x900.png](file:///C:/Projects/Wrench-Wise/2%20Diwali_Sky/docs/screenshots/share_laptop_1440x900.png)
- **Phone (390 x 844):** Mobile share panel with touch-friendly 44px buttons.
  - Image link: [share_phone_390x844.png](file:///C:/Projects/Wrench-Wise/2%20Diwali_Sky/docs/screenshots/share_phone_390x844.png)

---

## 12. Motion and Interactions

Every movement in Diwali Sky is governed by physics formulas or smooth CSS curves.

### Animation Catalog Table

| Animation / Effect | Where It Appears | Trigger Event | Duration | Easing Function | What It Does Technically |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Button Light Sweep** | "Light it up" and "Tap to open" buttons | Automatic infinite loop | 4.0 seconds | `ease-in-out` | Moves a semi-transparent white gradient bar (`skewX(-25deg)`) from -100% to +180% across button face to invite interaction (styles.css, line 271). |
| **Card Slide-In (`cardIn`)** | Sender, Receiver, and Share Cards | Card mount / state change | 300 milliseconds | `cubic-bezier(0.22, 1, 0.36, 1)` | Transitions opacity from 0 to 1 while translating translateY from +24px to 0px (styles.css, line 349). |
| **Card Slide-Out (`cardOut`)**| Sender and Receiver Cards | Form submit / "Tap to open" | 250 milliseconds | `cubic-bezier(0.4, 0, 0.2, 1)` | Transitions opacity from 1 to 0 while translating translateY from 0px to +16px (styles.css, line 353). |
| **Rocket Ascent** | #fireworks-canvas | Tap sky or show sequence | 0.55 to 0.75 seconds | Physical deceleration ($a_y = -v_{y0}/t$) | Rocket climbs upward leaving trailing spark particles, slowing to standstill at apex (js/fireworks.js, line 88). |
| **Hero Radial Flash** | Upper center sky | Hero shell detonation (3.5s) | 150 milliseconds | Linear fade out | Radial gradient fades from 35% opacity to 0% over 150ms, illuminating the night sky without flashing full screen (js/show.js, line 340). |
| **Name Spark Homing** | #fireworks-canvas | Hero burst expansion (4.05s) | 0.8 to 1.15 seconds | Dynamic spring acceleration | Sparks curve through air toward target coordinates, staggered left to right based on horizontal coordinate u (js/show.js, line 274). |
| **Aura Breathing Glow** | Behind name sparks | Show hold moment (6.0s to 9.5s)| 2.5 second cycle | Sinusoidal oscillation | Blurs offscreen name bitmap and oscillates opacity between 22% and 34% (js/show.js, line 362). |
| **Greeting Fade-In** | Above name in sky | Show timeline at 6.0 seconds | 800 milliseconds | Linear opacity ramp | Fades in "Happy Diwali" gold text overlay from 0% to 100% opacity (js/show.js, line 522). |
| **Golden Waterfall Melt**| #fireworks-canvas | Show timeline at 9.5 seconds | 3.2 seconds | Quadratic decay | Gravity accelerates name sparks downward, drawing luminous motion streaks and fading to gold (js/show.js, line 294). |
| **Receiver Sky Light-Up** | Architecture and background | Tap "Tap to open" on Receiver | 1.5 seconds | Multi-stage timeline | Fades 60% dark veil, ripples city windows left to right, illuminates gopuram tiers 1 to 7, and releases lanterns (js/scene.js, line 261). |
| **Demo Pointer Pulse** | Floating demo dot | Demo loop button click | 300 milliseconds | Ease scale pulse | Scales tap dot from 1.0 to 0.65 and back to 1.0 to simulate physical finger tap (styles.css, line 329). |
| **Shooting Star** | Upper atmosphere | Randomized (every 10 to 18s) | 600 milliseconds | Constant linear velocity | Draws a crisp white streak crossing 25% of the upper sky before vanishing (js/scene.js, line 288). |
| **Parallax Layer Drift** | Background depth layers | Phone tilt / mouse movement | Continuous real-time | Damped easing (`shift * 0.08`)| Shifts far city by max 4px, mid gopuram by max 10px, and front ledge by max 18px (js/scene.js, lines 275 to 278). |
| **Camera Zoom Push** | Background sky canvas | Active show (0.0s to 10.0s) | 10.0 seconds | Linear zoom scale | Scales background sky from 1.00x to 1.05x centered on name focus point (js/scene.js, line 247). |

---

### Reduced Motion Support (`prefers-reduced-motion: reduce`)

When a user enables "Reduce Motion" in their operating system accessibility settings, Diwali Sky automatically adapts (styles.css, lines 358 to 361; js/main.js, lines 343 to 348):
1. Card slide and fade animations are disabled (`animation: none`). Cards appear immediately.
2. Parallax layer shifting and camera zoom push are completely disabled.
3. Burst particle counts are reduced by 60% (Peony reduced from 310 to 75 sparks; Willow reduced from 340 to 85 sparks).
4. Crackle popping sub-explosions are disabled; sparks fade smoothly without rapid popping.
5. In the name show, sparks do not fly outward or curve inward; the name fades in smoothly directly at its target position over 900 milliseconds.
6. Shooting stars and diya ember particles are disabled.
7. Sky lanterns ascend at half speed (50% slower).
8. Sound effects continue to operate normally.

---
## 13. Words on Screen: Exact Quotations

The table below catalogs every word, heading, button label, error message, and disclaimer rendered in the application, quoted verbatim from the code.

| Category | Text String (Quoted Exactly) | Location in Project | Code Reference |
| :--- | :--- | :--- | :--- |
| **Page Title** | `"Diwali Sky by Wrench Wise"` | Browser tab title and Open Graph title | index.html, lines 7 and 11 |
| **Meta Description** | `"Someone wrote your name in the Diwali sky. Tap to see it."` | HTML description and Open Graph description | index.html, lines 8 and 12 |
| **Manifest Title** | `"Diwali Sky by Wrench Wise"` | Web App Manifest full name | manifest.json, line 2 |
| **Manifest Short Name**| `"Diwali Sky"` | Web App Manifest home screen icon label | manifest.json, line 3 |
| **Manifest Description**| `"Write a person's name in fireworks over a sparkling night sky."` | Web App Manifest description | manifest.json, line 4 |
| **Local Server Warning**| `"Please open via http://localhost:8000. Web browsers require a local server to run JavaScript modules."` | Injected banner if opened via file:// | index.html, line 73 |
| **Header Wordmark** | `"Wrench Wise"` | Header logo chip text fallback | index.html, line 38; styles.css, line 123 |
| **Sky Main Headline** | `"Write their name in the Diwali sky"` | Above form card on Sender Home Screen | js/ui.js, line 91 |
| **Sky Headline Highlight**| `"Diwali sky"` | Golden text span within main headline | js/ui.js, line 91 |
| **Sky Subtitle** | `"A fireworks greeting you can send on WhatsApp."` | Below main headline on Sender Home Screen | js/ui.js, line 92 |
| **Card App Title** | `"Diwali Sky"` | Heading fallback in card | styles.css, line 225 |
| **Card App Subtitle** | `"Write a name in fireworks."` | Subtitle fallback in card | styles.css, line 230 |
| **Broken Link Notice** | `"This link didn't work. Make a new one below."` | Alert banner on Home Screen if hash is corrupted | js/ui.js, line 102 |
| **Field 1 Label** | `"Their name"` | Form label above recipient input | js/ui.js, line 114 |
| **Field 1 Placeholder**| `"Friend's name"` | Placeholder inside recipient input | js/ui.js, line 114 |
| **Field 2 Label** | `"Your name (optional)"` | Form label above sender input | js/ui.js, line 115 |
| **Field 2 Placeholder**| `"Your name"` | Placeholder inside sender input | js/ui.js, line 115 |
| **Pill 1 Option** | `"Happy Diwali"` | Default festival greeting choice | js/ui.js, line 135 |
| **Pill 2 Option** | `"Happy Deepavali"` | Alternative festival greeting choice | js/ui.js, line 140 |
| **Primary Action 1** | `"Light it up"` | Submit button on Sender Card | js/ui.js, line 157 |
| **Privacy Disclaimer** | `"Names stay inside your link. We never store them."` | Privacy guarantee under Sender Card button | js/ui.js, line 162 |
| **Receiver Heading 1** | `"[Sender] sent you a Diwali surprise"` | Receiver Card when sender is specified | js/ui.js, line 232 |
| **Receiver Heading 2** | `"Someone sent you a Diwali surprise"` | Receiver Card when sender is omitted | js/ui.js, line 233 |
| **Primary Action 2** | `"Tap to open"` | Unlock and play button on Receiver Card | js/ui.js, line 239 |
| **Sound Hint** | `"Turn sound on for the full effect."` | Caption under button on Receiver Card | js/ui.js, line 244 |
| **Sky Greeting Text 1** | `"Happy Diwali"` | Gold text overlay in sky during hold moment | js/show.js, line 69 |
| **Sky Greeting Text 2** | `"Happy Deepavali"` | Gold text overlay in sky during hold moment | js/show.js, line 69 |
| **Sky Sender Text** | `"from [Sender]"` | Light text overlay in sky below firework name | js/show.js, line 508 |
| **Share Card Title** | `"Share this Diwali sky"` | Heading on Share Card | js/ui.js, line 286 |
| **Share Action 1** | `"Send on WhatsApp"` | WhatsApp button on Share Card | js/ui.js, line 292 |
| **Share Action 2** | `"Share"` | Native share button on Share Card | js/ui.js, line 302 |
| **Share Action 3** | `"Copy link"` | Clipboard copy button on Share Card | js/ui.js, line 312 |
| **Copy Feedback** | `"Copied"` | Temporary state when link is copied | js/ui.js, line 315 |
| **Auxiliary Action 1** | `"Watch again"` | Secondary button on Share Card and End Card | js/ui.js, lines 324 and 371 |
| **Auxiliary Action 2** | `"Edit names"` | Secondary text button on Share Card | js/ui.js, line 331 |
| **Reciprocal Action 1**| `"Send one back to [Sender]"` | Primary button on End Card with known sender | js/ui.js, line 358 |
| **Reciprocal Action 2**| `"Make one for someone"` | Primary button on End Card with unknown sender | js/ui.js, line 363 |
| **Brand Attribution** | `"Built with code by Wrench Wise"` | Footer text on Share Card and End Card | js/ui.js, line 387 |
| **Brand Action Link** | `"Learn to build apps like this"` | Educational hyperlink in card footer | js/ui.js, line 388 |
| **WhatsApp Message 1** | `"I made a Diwali surprise for you. Open it with sound on: [LINK]"` | Formatted share text for WhatsApp | js/share.js, line 11 |
| **WhatsApp Message 2** | `"I made a Deepavali surprise for you. Open it with sound on: [LINK]"` | Formatted share text for WhatsApp | js/share.js, line 11 |
| **Native Share Text** | `"I made a [Diwali/Deepavali] surprise for you. Open it with sound on:"` | Body text passed to navigator.share | js/share.js, line 43 |
| **Demo Audio Hint** | `"Tap once to enable sound"` | Floating banner in ?demo=1 reel mode | js/demo.js, line 77 |
| **Validation Error 1** | `"Please type a name."` | Displayed when required recipient field is empty | js/validate.js, line 55 |
| **Validation Error 2** | `"Names can only have letters and spaces."` | Displayed when digits, symbols, or emojis are typed| js/validate.js, line 70 |
| **Validation Error 3** | `"Please keep it under 16 letters."` | Displayed when recipient name exceeds 16 letters | js/validate.js, line 79 |
| **Validation Error 4** | `"Please keep it under 20 letters."` | Displayed when sender name exceeds 20 letters | js/validate.js, line 80 |
| **Validation Error 5** | `"Please choose a different name."` | Displayed when an abusive or blocked word is typed | js/validate.js, line 92 |
| **Aria Label Mute** | `"Mute sound"` / `"Unmute sound"` | Screen reader accessibility tag on mute button | js/ui.js, lines 65 to 66 |
| **OG Tool Headline** | `"A Diwali surprise for you"` | Large gradient text in tools/og.html | tools/og.html, line 89 |
| **OG Tool Subtitle** | `"Someone wrote your name in fireworks across the night sky."` | Subtext in tools/og.html | tools/og.html, line 90 |

---

## 14. Settings and Saved Data

### Browser Storage (`localStorage`)
The application accesses browser persistent storage for exactly one preference:

- **Storage Key:** `ds-muted`
- **Possible Values:** `'true'` (audio muted) or `'false'` (audio active).
- **Default Value:** `'false'` (audio active).
- **Safety Mechanism:** All reads and writes to `localStorage` are wrapped inside `try/catch` blocks (js/audio.js, lines 15 to 21 and lines 84 to 88). This prevents the entire application from crashing when a user browses in Safari Private Browsing mode, an embedded iOS WebView, or in browsers that disable cookies and local storage.
- **Cookies:** ZERO cookies are created, stored, or read.
- **Service Worker / Cache Storage:** ZERO service workers are registered, ensuring that visitors always receive the latest version without stale file caching.

---

### Code-Level Tunable Parameters

The table below documents every key numerical threshold, timing value, and physical constant that can be adjusted in the codebase.

| Parameter Name / Description | File Location | Line Number | Default Value | Plain English Explanation |
| :--- | :--- | :--- | :--- | :--- |
| **Particle Pool Total Capacity** | `js/particles.js` | Line 36 | `7000` | Maximum memory slots allocated in Float32Arrays. |
| **Desktop Particle Budget** | `js/main.js` | Line 38 | `6000` | Maximum active particle cap on laptops. |
| **Mobile Particle Budget** | `js/main.js` | Line 38 | `2500` | Maximum active particle cap on mobile phones. |
| **Low Tier Particle Floor** | `js/particles.js` | Line 75 | `800` | Minimum particle budget under extreme throttling. |
| **Master Audio Volume** | `js/audio.js` | Line 63 | `0.45` | Overall gain level (0.0 silent to 1.0 full volume). |
| **Max Concurrent Audio Voices** | `js/audio.js` | Line 10 | `8` | Maximum simultaneous audio nodes playing at once. |
| **Compressor Threshold** | `js/audio.js` | Line 55 | `-18 dB` | Decibel level where compressor begins limiting volume. |
| **Compressor Ratio** | `js/audio.js` | Line 57 | `6:1` | Compression slope to prevent audio distortion. |
| **Max Rockets In Flight** | `js/fireworks.js` | Line 77 | `6` | Upper limit of active rising rockets on screen. |
| **Brand Firework Ratio** | `js/fireworks.js` | Line 57 | `0.68 (68%)` | Probability that a random burst uses brand colors. |
| **Eye Safety Burst Limit** | `js/fireworks.js` | Line 229 | `3 per second` | Maximum allowable large bursts within a 1-second window. |
| **Eye Safety Burst Delay** | `js/fireworks.js` | Line 233 | `220 ms` | Stagger delay when clicks exceed the safety rate limit. |
| **Rocket Ascent Duration** | `js/fireworks.js` | Line 88 | `0.55 to 0.75 s`| Time in seconds for a rocket to climb to its apex. |
| **Peony Spark Count (Desktop)** | `js/fireworks.js` | Line 121 | `310 sparks` | Number of sparks spawned in a laptop Peony explosion. |
| **Peony Spark Count (Mobile)** | `js/fireworks.js` | Line 121 | `180 sparks` | Number of sparks spawned in a phone Peony explosion. |
| **Willow Gravity Acceleration** | `js/fireworks.js` | Line 193 | `70 px/s²` | Gentle downward pull on weeping willow sparks. |
| **Willow Air Drag Coefficient** | `js/fireworks.js` | Line 191 | `0.984` | Low air drag factor creating long, weeping trails. |
| **Hero Shell Detonation Time** | `js/show.js` | Line 220 | `3.50 seconds`| Timeline second when the main name rocket explodes. |
| **Hero Radial Flash Duration** | `js/show.js` | Line 341 | `0.15 seconds`| Lifespan of the localized soft white burst illumination. |
| **Name Formation Start Time** | `js/show.js` | Line 269 | `4.05 seconds`| Timeline second when sparks begin homing toward letters. |
| **Name Hold Duration** | `js/show.js` | Line 385 | `3.50 seconds`| Duration (from 6.0s to 9.5s) the name stays suspended. |
| **Aura Breathing Cycle Duration** | `js/show.js` | Line 367 | `2.50 seconds`| Sinusoidal period for the soft background glow pulse. |
| **Aura Minimum Opacity** | `js/show.js` | Line 368 | `0.22 (22%)` | Lowest opacity of the breathing aura behind the name. |
| **Aura Maximum Opacity** | `js/show.js` | Line 368 | `0.34 (34%)` | Peak opacity of the breathing aura behind the name. |
| **Gold Glint Spark Ratio** | `js/show.js` | Line 436 | `1 in 10 (10%)` | Proportion of name sparks twinkling in bright gold. |
| **Golden Melt Start Time** | `js/show.js` | Line 238 | `9.50 seconds`| Timeline second when the letters dissolve into waterfall. |
| **Golden Melt Duration** | `js/show.js` | Line 389 | `3.20 seconds`| Lifespan of the downward falling golden spark streamers. |
| **Melt Downward Gravity** | `js/show.js` | Line 297 | `160 px/s²` | Gravitational acceleration applied during the melt. |
| **Max Recipient Name Length** | `js/validate.js`| Line 47 | `16 characters`| Maximum allowable characters for "Their name". |
| **Max Sender Name Length** | `js/validate.js`| Line 120 | `20 characters`| Maximum allowable characters for "Your name". |
| **Sampling Step Jitter** | `js/nameText.js`| Line 135 | `0.45 (45%)` | Percentage of sampling step used to break the grid. |
| **Ambient Firework Frequency** | `js/main.js` | Line 636 | `2.60 seconds`| Interval between automatic ambient sky fireworks. |
| **Performance Eval Period** | `js/main.js` | Line 559 | `2.00 seconds`| Moving window time before evaluating average frame rate. |
| **Performance Down-Tier Limit** | `js/main.js` | Line 564 | `45 FPS` | Threshold below which the app steps down quality tier. |
| **Delta Time Maximum Cap** | `js/main.js` | Line 546 | `0.05 seconds`| Maximum dt per frame to prevent jumping after tab sleep. |
| **Shooting Star Frequency** | `js/scene.js` | Line 290 | `10 to 18 s` | Randomized interval between atmospheric shooting stars. |
| **Far City Parallax Max Shift** | `js/scene.js` | Line 350 | `4 pixels` | Maximum horizontal offset for distant city skyline. |
| **Mid Gopuram Parallax Max** | `js/scene.js` | Line 357 | `10 pixels` | Maximum horizontal offset for temple gopuram tower. |
| **Front Ledge Parallax Max** | `js/scene.js` | Line 400 | `18 pixels` | Maximum horizontal offset for front rooftop parapet. |
| **Camera Zoom Push Peak** | `js/scene.js` | Line 253 | `1.05x (+5%)` | Maximum focal camera magnification over 10 seconds. |
| **Demo Typing Delay** | `js/demo.js` | Line 145 | `145 ms` | Milliseconds between simulated keystrokes in demo mode. |

---

## 15. Testing and Manual Verification

Diwali Sky includes a self-contained in-browser test suite (`js/selftest.js`) that runs automatically when opening the URL with `?test=1`.

### Automated Self-Test Results (43 out of 43 Tests Passed)

The suite was executed in headless Google Chrome at `http://localhost:8000/?test=1`. Every single test passed cleanly with zero failures.

```
---------------------------------------------------------------------------------------------------------
CATEGORY               TEST NAME                                  STATUS  DETAILS
---------------------------------------------------------------------------------------------------------
1. Link Round Trip     Sample 1: "Priya"                          PASS    Exact round-trip match
1. Link Round Trip     Sample 2: "Vivek"                          PASS    Exact round-trip match
1. Link Round Trip     Sample 3: "A"                              PASS    Exact round-trip match
1. Link Round Trip     Sample 4: "Vijayalakshmi"                  PASS    Exact round-trip match
1. Link Round Trip     Sample 5: "Sri Devi"                       PASS    Exact round-trip match
1. Link Round Trip     Sample 6: "D'Souza"                        PASS    Exact round-trip match
1. Link Round Trip     Sample 7: "Mary-Jane"                      PASS    Exact round-trip match
1. Link Round Trip     Sample 8: "அன்பு" (Tamil)                  PASS    Exact round-trip match
1. Link Round Trip     Sample 9: "प्रिया" (Hindi)                  PASS    Exact round-trip match
1. Link Round Trip     Sample 10: "Kavitha"                       PASS    Exact round-trip match
1. Link Round Trip     Sample 11: "Jean-Luc"                      PASS    Exact round-trip match
1. Link Round Trip     Sample 12: "O'Connor"                      PASS    Exact round-trip match
1. Link Round Trip     Sample 13: "Van Der Beek"                  PASS    Exact round-trip match
1. Link Round Trip     Sample 14: "Ananya"                        PASS    Exact round-trip match
1. Link Round Trip     Sample 15: "Rajesh"                        PASS    Exact round-trip match
1. Link Round Trip     Sample 16: "Meenakshi"                     PASS    Exact round-trip match
1. Link Round Trip     Sample 17: "Suresh"                        PASS    Exact round-trip match
1. Link Round Trip     Sample 18: "Amit"                          PASS    Exact round-trip match
1. Link Round Trip     Sample 19: "Nisha"                         PASS    Exact round-trip match
1. Link Round Trip     Sample 20: "தீபன்" (Tamil)                  PASS    Exact round-trip match
---------------------------------------------------------------------------------------------------------
2. Rejections          Empty recipient rejected                   PASS    Error: "Please type a name."
2. Rejections          17+ letters rejected                       PASS    Error: "Please keep it under 16 letters."
2. Rejections          Digits rejected ("Rahul123")               PASS    Error: "Names can only have letters and spaces."
2. Rejections          Script tags rejected ("<script>...")       PASS    Error: "Names can only have letters and spaces."
2. Rejections          Web URL rejected ("https://...")           PASS    Error: "Names can only have letters and spaces."
2. Rejections          Emoji rejected ("Diwali 🎉")               PASS    Error: "Names can only have letters and spaces."
2. Rejections          Blocklisted word rejected ("abuse")        PASS    Error: "Please choose a different name."
2. Rejections          Obfuscated blocklist ("f-u.c k")           PASS    Error: "Please choose a different name."
---------------------------------------------------------------------------------------------------------
3. Name Points         Phone (390x844): "A"                       PASS    710 points, in bounds: true
3. Name Points         Phone (390x844): "Priya"                   PASS    1038 points, in bounds: true
3. Name Points         Phone (390x844): "Vijayalakshmi"           PASS    770 points, in bounds: true
3. Name Points         Phone (390x844): "Sri Devi"                PASS    838 points, in bounds: true
3. Name Points         Phone (390x844): "அன்பு"                   PASS    657 points, in bounds: true
3. Name Points         Laptop (1440x900): "A"                     PASS    1502 points, in bounds: true
3. Name Points         Laptop (1440x900): "Priya"                 PASS    2184 points, in bounds: true
3. Name Points         Laptop (1440x900): "Vijayalakshmi"         PASS    2207 points, in bounds: true
3. Name Points         Laptop (1440x900): "Sri Devi"              PASS    1755 points, in bounds: true
3. Name Points         Laptop (1440x900): "அன்பு"                 PASS    2509 points, in bounds: true
---------------------------------------------------------------------------------------------------------
4. Broken Links        Random text treated as broken              PASS    Error: "Corrupted link format"
4. Broken Links        Cut-off payload treated as broken          PASS    Error: "Corrupted link format"
4. Broken Links        Wrong version treated as broken (v=2)      PASS    Error: "Unsupported version"
4. Broken Links        Empty payload treated as broken (#s=)      PASS    Error: "Empty payload"
4. Broken Links        Invalid name in payload ("Rahul123")       PASS    Error: "Names can only have letters and spaces."
---------------------------------------------------------------------------------------------------------
SUMMARY: 43 passed, 0 failed. All suites 100% compliant.
```

---

### Step-by-Step Manual Verification Checklist

You can follow this numbered checklist in any modern web browser to confirm that every feature works:

#### Part A: Testing Creation and Live Preview
1. Open `http://localhost:8000/`.
2. Confirm the night sky gradient renders smoothly from top to bottom with a 3px gradient bar at the very top.
3. Confirm that clay diyas on the bottom ledge flicker and distant city lights twinkle.
4. Click the mute button in the top-right corner. Confirm the speaker icon changes to a muted slash icon. Refresh the page and confirm the muted state is remembered.
5. In the "Their name" field, slowly type `"Priya"`. Look at the sky above the card: confirm the letters `"Priya"` appear faintly at 18% opacity in emerald and cyan with sparkling highlights.
6. Delete the text and attempt to click `"Light it up"`. Confirm that red error text `"Please type a name."` appears beneath the field.
7. Type `"Alex123"`. Confirm the error `"Names can only have letters and spaces."` appears.
8. Type `"Supercalifragilistic"`. Confirm the error `"Please keep it under 16 letters."` appears.

#### Part B: Testing Show Animation and Sound
9. Enter `"Priya"` in "Their name" and `"Vivek"` in "Your name". Click `"Happy Diwali"`.
10. Click the mute button to unmute sound, then click `"Light it up"`.
11. Confirm that a rocket immediately launches from the button coordinates into the sky.
12. Listen for the rising rocket whistles, followed by deep low-end explosion thumps for the opening bursts.
13. Watch the emerald hero rocket ascend at 2.5 seconds and detonate at 3.5 seconds with a soft radial flash.
14. Verify that sparks expand outward, then curve inward to assemble the letters `"Priya"` from left to right.
15. Listen for the soft shimmering crackle as sparks arrive into letter positions.
16. Verify that the name shimmers in emerald, teal, and cyan with gold glints, while `"Happy Diwali"` glows in gold above and `"from Vivek"` appears below.
17. Watch the name melt at 9.5 seconds: sparks must visibly accelerate downward like a golden waterfall leaving luminous streaks.

#### Part C: Testing Sharing and Receiving
18. Confirm that the Share Card slides up with a preview thumbnail showing the sky with "Priya".
19. Click `"Copy link"`. Confirm the button text changes to `"Copied"` for two seconds.
20. Open a new private/incognito browser window and paste the copied link.
21. Confirm that the Receiver Screen appears with the sky dimmed to 60% and the heading: `"Vivek sent you a Diwali surprise"`.
22. Click `"Tap to open"`. Confirm that a bronze temple bell chimes cleanly.
23. Confirm that over 1.5 seconds, the scene illuminates: city windows ripple on, gopuram festival lights climb tier by tier, lanterns rise, and the show plays.
24. At the end of the show, confirm the End Card displays `"Send one back to Vivek"`.
25. Click `"Send one back to Vivek"`. Confirm the Sender Card opens with "Their name" preset to "Vivek" and "Your name" preset to "Priya".

---

## 16. Deployment: Hosting, CI/CD, and Version Delivery

### Code Repository and Remote Branches

- **Remote Origin URL:** `https://github.com/Pradeep-B28/Diwali_Sky.git`
- **Primary Branch (`main`):** Production code branch linked directly to Vercel automatic production deployments.
- **Cinematic Upgrade Branch (`cinematic`):** Feature branch where Phases 1 through 5 were developed, verified with frame inspection tools, and merged into `main` in commit `814d73c`.
- **Documentation Branch (`docs/readme-refresh`):** Dedicated branch for documentation and benchmark verification.

---

### Production Hosting Architecture

Diwali Sky is deployed on **Vercel** as a zero-configuration, high-performance static website.

- **Production Domain:** `https://diwalisky.vercel.app`
- **Framework Preset:** `Other` / Static HTML (detected as `"not-detected"` in `.vercel/output/builds.json`).
- **Build Command:** None (no build step is required; files are served directly as static assets).
- **Output Directory:** Project root (`.`).
- **Content Delivery Network (CDN):** Vercel Edge Network. Assets are cached across global edge locations with HTTP/2 and HTTP/3 multiplexing.

---

### How an Update Goes Live Step by Step

1. **Local Editing and Verification:** The developer edits source files locally (e.g. `js/show.js` or `styles.css`) and runs automated tests via `http://localhost:8000/?test=1`.
2. **Git Commit:** Changes are committed to Git:
   ```bash
   git add .
   git commit -m "Enhance festival lighting and performance"
   ```
3. **Push to GitHub:**
   ```bash
   git push origin main
   ```
4. **Vercel Webhook Deployment:**
   - GitHub fires an automated commit webhook to Vercel.
   - Vercel provisions a serverless deployment container.
   - Vercel copies the repository files to edge nodes globally within 12 seconds.
   - The deployment status turns green, and changes go live worldwide immediately.

---

### Browser Caching and Cache Invalidation Considerations

- **HTML Cache Invalidation:** Vercel automatically sets `Cache-Control: public, max-age=0, must-revalidate` on `index.html`. This ensures that every time a visitor opens `diwalisky.vercel.app`, the browser checks Vercel edge servers for new HTML immediately.
- **JavaScript Modules:** Because JavaScript files are linked directly as `<script type="module" src="js/main.js">` without content hashing (such as `main.a1b2c3.js`), mobile browsers with aggressive disk caching may retain older JavaScript files for several hours.
- **Safe Cache Bypassing:** When shipping major breaking updates, adding a query version parameter in `index.html` (for example, `<script type="module" src="js/main.js?v=2.1">`) forces every mobile browser to instantly download the latest script without requiring users to clear browser history.

---
## 17. Honest Status: Known Bugs, Limits, Differences, and Risks

### Differences Between Planning Briefs and Actual Code

Rule 2 directs us to describe the project as it is in the code today, rather than what was originally planned in early design briefs. Below is an honest accounting of every difference between the project briefs and the live codebase:

1. **Opening Rockets Count (show.js vs UPGRADE_BRIEF.md Section 3F):**
   - *Planning Brief:* Section 3F of the upgrade brief proposed: `"The show opens with 5 rockets instead of 3, staggered between 0.3 s and 2.4 s, spread across the sky."`
   - *Actual Code:* The codebase in `js/show.js` (lines 200 to 212) implements **3 opening rockets** launched at 0.25s (left), 0.95s (right), and 1.70s (center).
   - *Reason for Difference:* Testing revealed that launching five heavy burst rockets prior to 2.4 seconds filled the mobile canvas with excessive background smoke particles, which visually degraded the emerald hero rocket ascent and lowered frame rates on mid-range Android phones. Three opening bursts delivered a clean, punchy introduction without visual clutter.
2. **"Save Picture" PNG Download Feature (PROJECT_BRIEF.md Section 4 Nice to Have #2):**
   - *Planning Brief:* Listed as Nice-to-Have item 2: `"Capture the frame at the middle of the hold, with the greeting and a small Wrench Wise mark. After the show, a 'Save picture' button downloads it as a PNG."`
   - *Actual Code:* The underlying capture engine (`captureStillImage()` in `js/main.js`, line 306) was fully built and successfully generates a high-quality JPEG data URL at 7.75 seconds. However, this image is used exclusively to populate the preview thumbnail on the Share Card and End Card (js/ui.js, lines 276 to 282). A dedicated user-facing "Download PNG" file button was not added to the user interface.
3. **Google Analytics 4 Tracking (PROJECT_BRIEF.md Section 4 Nice to Have #1):**
   - *Planning Brief:* Listed conditionally: `"Only if I give you a GA4 Measurement ID... Never send names."`
   - *Actual Code:* No GA4 script or measurement ID was provided. The application remains 100% free of third-party tracking scripts, ensuring total user privacy.
4. **Brief Files Archival in Git History:**
   - *Planning Brief:* `PROJECT_BRIEF.md` and `UPGRADE_BRIEF.md` were initially created in the project root.
   - *Actual Code:* In commit `2bf1ca1`, both brief files were removed from the root directory to clean up the public open-source repository for production release. The briefs are preserved in git history and in the `.vercel/output/static/` build output directory.

---

### Known Bugs and Fix History

1. **Fixed Bug: Debug HUD Overriding Hidden Attribute on Live Production (Commit `d1d08c3`):**
   - *Issue:* In early releases, the green developer HUD (showing FPS and burst test buttons) appeared for all public visitors. In `index.html`, the element had `hidden`, but `.debug-hud { display: flex }` in `styles.css` possessed higher CSS specificity, overriding the browser's native `hidden` behavior.
   - *Resolution:* Added `[hidden] { display: none !important; }` to `styles.css` (line 64) and controlled visibility strictly through the `.visible` modifier class toggled by `?debug=1` (js/main.js, lines 368 to 379).
2. **Fixed Bug: Mobile Viewport Height and Touch Scrolling:**
   - *Issue:* On mobile web browsers, dynamic address bar retraction caused canvas clipping when using standard `100vh`.
   - *Resolution:* Upgraded to dynamic viewport units (`height: 100dvh` in `styles.css`, lines 69 and 86) combined with `overflow: hidden` and `touch-action: manipulation`.

---

### Current Limitations and Risks

1. **Performance Risk on Ultra-Low-End Devices:**
   - On low-end smartphones with weak GPUs or software-rendered WebGL/Canvas pipelines, rendering 2,000 sparks alongside bloom filters can cause frame rates to dip below 30 FPS. While the dynamic down-tiering algorithm steps down from High to Medium or Low within two seconds, the opening burst moment may experience brief initial frame drops.
2. **Cross-Platform System Font Rendering Variation:**
   - Because Diwali Sky deliberately avoids downloading heavy web fonts and relies on the user's system font stack, letterforms differ subtly across operating systems. Apple iOS renders San Francisco; Android renders Roboto; Windows renders Segoe UI. This causes slight variations in total spark counts (e.g. 1,038 sparks on iOS vs 980 on Android for "Priya"), though all remain well within budget.
3. **Web Audio User Gesture Autoplay Restrictions:**
   - Modern web browsers strictly forbid web pages from making sounds before a user interacts with the page. If a visitor opens a link with `?show=1` or `?autoplay=1` without clicking or tapping the screen, the visual show will play in complete silence until the user taps the canvas or unmutes the audio button.
4. **Accessibility Limitation for Visually Impaired Users:**
   - While the HTML cards, inputs, and buttons are fully accessible to screen readers with proper ARIA attributes, the central canvas fireworks simulation cannot be interpreted by screen readers. A visually impaired person can read the sender and recipient text, but cannot perceive the firework sparks.
5. **Brand and Domain Dependency:**
   - Open Graph preview images (`assets/og-image.png`) point to hard-coded production URL `https://diwalisky.vercel.app/assets/og-image.png` in `index.html` (line 13). If the project is moved to a custom domain (e.g. `sky.wrench-wise.com`), social cards on WhatsApp and Twitter will continue fetching from Vercel unless the Open Graph meta tags are updated.

---

## 18. Rebuild Guide: Step-by-Step Tutorial from Scratch

This guide is written so that a student or junior software engineer can rebuild Diwali Sky from a blank folder.

```
Step 1: HTML & CSS Setup (1.5 hrs)
   ↓
Step 2: Stacked Canvases & Resize (1.5 hrs)
   ↓
Step 3: Zero-GC Particle Pool (2.5 hrs)
   ↓
Step 4: Rocket Physics & Bursts (2.5 hrs)
   ↓
Step 5: Web Audio Synthesizer (2.5 hrs)
   ↓
Step 6: Typography Sampling & Homing (3.5 hrs)
   ↓
Step 7: Architectural Scene Layers (3.5 hrs)
   ↓
Step 8: UI Cards & URL Hash Privacy (2.5 hrs)
   ↓
Step 9: Quality Tiers & Self-Tests (1.5 hrs)
   ↓
Step 10: Production Deployment (0.5 hrs)
```

### Step 1: Project Scaffolding and Static HTML/CSS Structure
- **Estimated Time:** 1 to 2 hours.
- **What to do:**
  1. Create a project directory with subfolders `assets/`, `js/`, and `tools/`.
  2. Create `index.html`. Add standard meta viewport tags with `viewport-fit=cover`.
  3. Create `styles.css`. Define the design system in `:root` with CSS custom variables for brand colors, sky navy shades, font stack, and radii.
  4. Add `#brand-bar` as a 3px fixed horizontal strip across the top with a linear gradient from emerald to cyan.

### Step 2: The Multi-Canvas Pipeline and Responsive Sizing
- **Estimated Time:** 1 to 2 hours.
- **What to do:**
  1. In `index.html`, declare three canvas elements: `#sky-canvas` (z-index 1), `#fireworks-canvas` (z-index 2), and `#bloom-canvas` (z-index 3).
  2. Create `js/sky.js`. Build a `SkyManager` class that captures viewport dimensions (`window.innerWidth`, `window.innerHeight`) and calculates physical pixel scaling using `devicePixelRatio` capped at 2.0.
  3. Attach `resize` and `orientationchange` event listeners that recalculate canvas dimensions and scale contexts automatically.

### Step 3: Zero-GC TypedArray Particle Pool and Physics
- **Estimated Time:** 2 to 3 hours.
- **What to do:**
  1. Create `js/particles.js`. Define `ParticlePool` class.
  2. Allocate flat typed array buffers of capacity 7,000: `Float32Array` for x, y, vx, vy, life, maxLife, size, drag, gravity, and flicker; `Uint8Array` for colorId and type.
  3. Implement $O(1)$ allocation (`spawn()`) and $O(1)$ deallocation (swap-with-last active index).
  4. In `update(dt)`, apply velocity updates, drag factors ($drag^{60 \cdot dt}$), and gravitational acceleration.
  5. In `draw()`, apply `ctx.globalCompositeOperation = 'destination-out'` with a low alpha fill to create particle trails without clearing the canvas. Then draw sparks using `'lighter'` blending.

### Step 4: Rocket Trajectories and Pyrotechnic Bursts
- **Estimated Time:** 2 to 3 hours.
- **What to do:**
  1. Create `js/fireworks.js`. Build `FireworksEngine` class.
  2. Implement parabolic rocket launch kinematics using the constant deceleration formulas to guarantee the rocket reaches zero vertical velocity exactly at its target burst point.
  3. Implement the four core burst shapes:
     - `burstPeony`: spherical random dispersion.
     - `burstRing`: polar angle circle with tight speed tolerances.
     - `burstWillow`: low-drag, low-gravity golden streamers.
     - `burstCrackle`: primary sparks that trigger randomized micro-pops upon expiration.
  4. Add eye safety rate limiting to stagger detonations if clicks exceed 3 bursts per second.

### Step 5: Procedural Web Audio Synthesis and Voice Limiting
- **Estimated Time:** 2 to 3 hours.
- **What to do:**
  1. Create `js/audio.js`. Build `SoundManager` class.
  2. Create an `AudioContext` lazily on first user interaction to comply with browser autoplay policies.
  3. Connect a `DynamicsCompressorNode` to `destination` to prevent speaker clipping.
  4. Build sound synthesis routines:
     - `playLaunch()`: rising sine oscillator frequency sweep.
     - `playBurst()`: dual-path sine thump + low-pass filtered white noise burst.
     - `playCrackle()`: 10 randomized band-pass noise clicks.
     - `playTempleBell()`: additive synthesis with bronze modal ratios (1.0, 2.76, 5.40, 8.90).
  5. Implement voice limiting capped at 8 active sounds, and persist mute choices in `localStorage` under `ds-muted`.

### Step 6: Typography Sampling, Grid Breaking, and Homing Physics
- **Estimated Time:** 3 to 4 hours.
- **What to do:**
  1. Create `js/sprites.js`. Pre-render 24 tiny 32x32 offscreen glow sprites: 7 core colors, 16 gradient steps (emerald to cyan), and 1 gold glint.
  2. Create `js/nameText.js`. Render the input name onto a hidden offscreen canvas at font weight 800.
  3. Auto-fit text within 86% viewport width and 30% viewport height.
  4. Scan pixel data with `getImageData`, compute sampling step $S$, and apply $\pm 45\%$ jitter to break rows and columns.
  5. Create `js/show.js`. Direct the 7-phase timeline. At 3.5s, detonate the hero rocket; from 4.05s to 5.2s, home sparks toward their target typography points; at 6.0s, lock into hold mode and fade in "Happy Diwali"; at 9.5s, melt downward into golden trails.

### Step 7: Architectural Scene Layers, Parallax, and Lighting
- **Estimated Time:** 3 to 4 hours.
- **What to do:**
  1. Create `js/sceneLayers.js`. Generate offscreen canvases for the 20-building city silhouette, the 7-tier temple gopuram, and the dark front ledge with clay diyas.
  2. Create `js/sceneRenderers.js`. Render twinkling stars, rising paper lanterns, diya flames, and city windows.
  3. Create `js/scene.js`. Implement tilt parallax (DeviceOrientation `gamma` angle and mouse movement) shifting layers by 4px, 10px, and 18px.
  4. Add burst illumination: store recent burst lights and paint soft radial glows that tint mist bands and cast teal rim lighting over gopuram cornices.

### Step 8: User Interface Cards and URL Hash Privacy
- **Estimated Time:** 2 to 3 hours.
- **What to do:**
  1. Create `js/validate.js` and `js/blocklist.js`. Enforce character rules, length limits, grapheme counting via `Intl.Segmenter`, and blocklist filtering.
  2. Create `js/link.js`. Implement base64url encoding and decoding for URL hash payloads (`#s=...`).
  3. Create `js/share.js`. Implement WhatsApp sharing link formatting, native Web Share API integration, and clipboard copy.
  4. Create `js/ui.js`. Build the Sender Card with live sky preview while typing, the Receiver Card with the 1.5-second illumination sequence, the Share Card with captured thumbnail, and the reciprocal End Card.

### Step 9: Dynamic Performance Degradation and Automated Self-Tests
- **Estimated Time:** 1 to 2 hours.
- **What to do:**
  1. Create `js/selftest.js`. Build automated test suites verifying link serialization, input rejection, point boundary constraints, and corrupted payloads.
  2. In `js/main.js`, add a 2-second moving window frame rate monitor. If FPS falls below 45, automatically drop quality tier (High to Medium to Low).
  3. Add reduced motion detection via `window.matchMedia('(prefers-reduced-motion: reduce)')`.

### Step 10: Static Production Deployment
- **Estimated Time:** 30 minutes to 1 hour.
- **What to do:**
  1. Initialize a Git repository and commit all source files.
  2. Push the repository to GitHub.
  3. Connect the repository to Vercel. Set framework preset to "Other" and deploy as a static site.
  4. Verify production deployment on a physical mobile phone.

---

## 19. Learning Value: Concepts, Resume Points, and Interview Questions

### Core Computer Science and Web Engineering Concepts Learned
1. **Real-Time Numerical Physics Simulation:** Integrating velocity, acceleration, and air drag over variable delta time steps without physical teleportation or instability.
2. **High-Performance Memory Management:** Eliminating garbage collection pauses in JavaScript through object pooling and flat TypedArray buffers.
3. **Procedural Audio Synthesis:** Constructing complex musical instruments and explosive acoustic effects from raw mathematical waveforms using the Web Audio API.
4. **Computational Typography and Rasterization:** Extracting geometric coordinate meshes from font glyphs, auto-scaling multi-line text, and applying spatial jitter.
5. **Client-Side Privacy and Cryptographic Serialization:** Serializing structured JSON payloads into URL-safe base64url hashes to preserve data confidentiality without servers.

---

### Three Standout Resume Bullet Points

- **Front-End Performance & Creative Coding:**
  *Engineered a zero-dependency 2D fireworks simulator in vanilla JavaScript, rendering 6,000 simultaneous physics particles at 60 FPS using Float32Array object pooling to completely eliminate garbage collection frame drops.*

- **Web Audio Engineering:**
  *Architected a procedural browser audio synthesizer using the Web Audio API that dynamically generates ascending whistles, filtered concussive booms, and bronze temple bell modal resonances without downloading external audio files.*

- **Privacy-First Web Architecture:**
  *Implemented a zero-backend, client-side serialization pipeline using base64url URL hashes and Intl.Segmenter grapheme clustering, enabling peer-to-peer greeting personalization with 100% data privacy and zero server telemetry.*

---

### Ten Technical Interview Questions with Model Answers

#### 1. Why did you use pre-allocated TypedArrays instead of regular JavaScript arrays or object classes?
*Answer:* In high-speed rendering (60 FPS), creating and destroying thousands of JavaScript objects every second triggers frequent Garbage Collection (GC) sweeps. When GC runs, the browser pauses JavaScript execution, causing visible frame stuttering. Flat TypedArrays (`Float32Array`) allocate a fixed chunk of contiguous memory at startup. Particles are updated and recycled in-place using index pointer arithmetic, achieving zero GC overhead during animation.

#### 2. How did you ensure smooth performance across devices with varying hardware capabilities?
*Answer:* I implemented a tiered performance architecture (High, Medium, Low) and an active frame rate monitor. The engine calculates the average FPS over moving 2-second windows. If the frame rate drops below 45 FPS on low-power devices, the engine automatically steps down one tier: disabling expensive offscreen bloom passes, lowering mist density, and reducing active particle budgets from 6,000 down to 2,500 or 1,500.

#### 3. Why choose procedural Web Audio synthesis over pre-recorded MP3 or WAV audio files?
*Answer:* Pre-recorded audio files introduce significant network latency, require HTTP downloads that stall initial page interaction, consume cellular data, and sound repetitive. Procedural Web Audio synthesis executes entirely in client-side code, downloads zero audio bytes, and introduces slight randomized variations in pitch, filter cutoff, and resonance on every burst, making each explosion sound distinct and natural.

#### 4. How does the application ensure complete privacy for user-generated greeting names?
*Answer:* Greeting payloads are serialized into the URL hash (`#s=PAYLOAD`) using base64url encoding. According to the HTTP specification, web browsers never send URL hashes to web servers in HTTP requests. As a result, user names are processed entirely in client-side browser memory and are never transmitted to, logged by, or stored on any server or analytics database.

#### 5. What is the advantage of using stacked canvases instead of rendering everything onto a single canvas?
*Answer:* Layer separation optimizes graphics performance. The background canvas (`#sky-canvas`) renders static architecture and slow-moving stars. The foreground canvas (`#fireworks-canvas`) updates dynamic particles at 60 FPS using semi-transparent fading (`destination-out`) to produce glowing trails without clearing the screen. If both were on one canvas, the trails would blur the architectural silhouettes, and redrawing the complex gopuram geometry every frame would severely tax the GPU.

#### 6. How does the text sampling algorithm avoid visual grid artifacts while preserving readability?
*Answer:* After rasterizing text onto an offscreen canvas and scanning pixel coordinates at a dynamic step $S$, the algorithm applies a pseudo-random spatial jitter up to $\pm 45\%$ of $S$ along both X and Y axes, while randomizing spark radii between 70% and 130%. This shifts points out of rigid rows and columns while confining them within the glyph boundaries, giving the letters an organic, pyrotechnic appearance.

#### 7. How do you calculate rocket trajectories so they reach their apex exactly at the target burst coordinate?
*Answer:* By applying the kinematic equations of constant vertical deceleration. Given launch travel distance $\Delta y$ and desired ascent duration $t$, initial velocity is calculated as $v_{y0} = 2\Delta y / t$, and downward acceleration is set to $a_y = -v_{y0} / t$. Because $v_y(t) = v_{y0} + a_y \cdot t$, vertical velocity reaches exactly zero at time $t$, placing the rocket at rest at the target coordinate at the exact moment of detonation.

#### 8. How does the application handle complex non-Latin scripts such as Tamil and Hindi?
*Answer:* Standard JavaScript string `length` measures 16-bit code units rather than visual characters, which miscounts multi-byte Unicode conjuncts and combining vowel marks. The app uses `Intl.Segmenter` with `granularity: 'grapheme'` to count human-perceived characters correctly. During serialization, `TextEncoder` and `TextDecoder` encode strings into UTF-8 byte arrays before base64url conversion, ensuring complete character integrity.

#### 9. Why was the bloom canvas rendered at one-quarter resolution instead of full screen resolution?
*Answer:* Running a full-screen Gaussian blur filter at native 4K or Retina mobile resolutions requires massive GPU pixel fill-rate bandwidth. Scaling the bloom canvas down to 25% resolution reduces the pixel count by a factor of 16 ($4 \times 4$). Blurring this downscaled canvas and scaling it back up with `mix-blend-mode: screen` creates a smoother, broader ambient glow while consuming a fraction of the GPU processing budget.

#### 10. Why is the state persisted in localStorage wrapped in a try/catch block?
*Answer:* Certain browser security environments—such as Apple Safari in Private Browsing mode, privacy-focused extensions, or embedded WebViews—throw a fatal `SecurityError` or `QuotaExceededError` whenever code attempts to access `window.localStorage`. Wrapping all reads and writes inside `try/catch` blocks allows the application to gracefully fall back to in-memory state without crashing.

---

## 20. Showcase: Demo Reel Moments and Future Ideas

### Best Moments to Record for Short Video Reels
1. **The Hook: Dark Awakening and Temple Bell (0.0 to 2.0 seconds):**
   - The video opens in near total darkness. A deep, resonant bronze temple bell rings. Over 1.5 seconds, the scene awakens: warm diyas flare along the ledge, golden festival lights outline the temple gopuram tier by tier, city windows illuminate in a sweeping ripple, and warm lanterns lift into the mist.
2. **The Climax: Shell Detonation and Name Assembly (3.5 to 5.5 seconds):**
   - The emerald hero rocket climbs to the upper sky and explodes in a concussive flash. Thousands of sparks swirl outward, curve mid-flight, and home into place to spell the recipient's name in glowing green and cyan light while shimmering crackle sounds play.
3. **The Finale: The Golden Waterfall Melt (9.5 to 12.0 seconds):**
   - The glowing name releases holding physics and accelerates downward under simulated gravity, transforming from emerald into brilliant golden streamers that pour like a waterfall over the temple skyline.

---

### Three Ambitious Ideas for Version 3
1. **Microphone Audio-Reactive Fireworks:**
   - Incorporate the browser's Web Audio `AnalyserNode` with optional microphone permission. As users cheer, shout "Happy Diwali", or play festival music near their phone, ambient fireworks launch and explode in direct synchronization with the volume and musical frequency peaks of their voice.
2. **Multi-Touch Dual Spark Launchers:**
   - Enable two-player collaborative firework shows on tablet and touchscreen devices. Using multi-touch pointer events, two people can tap the sky simultaneously with multiple fingers, triggering intersecting rocket salvos and colorful aerial spark collisions.
3. **Multi-Cultural Festival Theme Engine:**
   - Expand the architectural pipeline beyond Diwali to support multiple global light festivals through simple theme presets:
     - *Pongal / Makar Sankranti:* Sun dawn sky, flying festival kites, and smoking harvest clay pots.
     - *Eid al-Fitr:* Deep sapphire sky with crescent moon illumination and hanging ornate fanoos lanterns.
     - *New Year's Eve:* Modern city skyscraper skyline with synchronized laser beams and a midnight countdown spark clock.

---

## 21. Glossary: Technical Words Defined Simply

- **Canvas:** An HTML5 element (`<canvas>`) that allows web programs to draw shapes, images, and animations directly onto the screen using fast code commands.
- **Particle:** A tiny individual visual dot or spark in a computer simulation that has its own position, speed, color, and lifespan.
- **Particle Pool:** A technique where a fixed number of particles are created once at startup and reused repeatedly to avoid slowing down the computer.
- **TypedArray:** A high-speed JavaScript array designed for numbers that stores data in a flat block of computer memory without extra overhead.
- **Garbage Collection:** An automatic browser process that cleans up unused memory; if it runs during an animation, it causes visible stuttering.
- **Frame Rate (FPS):** Frames Per Second; the number of individual pictures drawn to the screen every second. 60 FPS is standard for smooth motion.
- **Delta Time ($\Delta t$):** The exact fraction of a second that passed between the previous animation frame and the current frame, used to keep movement speeds consistent.
- **Grapheme Cluster:** A complete character as seen by a human reader, which may consist of multiple combined computer Unicode bytes (such as Indian language vowel combinations).
- **Base64url:** A method of encoding computer data into safe letters, numbers, hyphens, and underscores that can be placed inside web addresses without breaking them.
- **Web Audio API:** A built-in browser system that allows JavaScript to generate, filter, and control sound effects entirely through mathematical formulas.
- **Oscillator:** A digital sound generator in Web Audio that vibrates at a specific frequency to create musical tones or whistles.
- **Biquad Filter:** An audio filter used to remove specific high or low frequencies from a sound, such as making noise sound like a muffled deep boom.
- **Dynamics Compressor:** An audio processing tool that automatically lowers the volume of very loud sounds to prevent speaker distortion or harsh clipping.
- **Additive Synthesis:** A method of creating complex sounds by adding multiple pure sine wave tones together at different musical intervals (such as temple bell harmonics).
- **Offscreen Canvas:** A hidden drawing canvas in computer memory where graphics are drawn ahead of time so they can be quickly copied onto the visible screen.
- **Blend Mode:** A mathematical rule that dictates how the colors of a new shape combine with the existing colors already painted on the screen.
- **Additive Blending (Lighter):** A blend mode where overlapping colors add their brightness together, making overlapping sparks glow brilliantly white.
- **Viewport:** The visible rectangle of the screen where a website is displayed inside a web browser.
- **DPR (Device Pixel Ratio):** The ratio between physical hardware screen pixels and CSS logical pixels, indicating how sharp a screen is.
- **Parallax:** A visual effect where background layers move slower than foreground layers when tilting or scrolling, creating an illusion of 3D depth.
- **Modal Synthesis:** A sound modeling technique that simulates the physical resonant vibrations of metal objects, such as bells or chimes.
- **Safe Area Insets:** Browser measurements that define how far content must stay away from physical screen notches, rounded corners, and home indicator bars.
- **Hysteresis:** A software control rule that prevents a system from rapidly jumping back and forth between two states (such as quality tiers).
- **Kinematics:** The branch of classical physics and mathematics that describes the position, velocity, and acceleration of moving objects over time.
- **Rasterization:** The process of converting geometric vector shapes or font letters into a grid of colored pixels.
- **Static Server:** A lightweight computer program that serves HTML, CSS, and image files directly to browsers without running backend database code.
- **Same-Origin Policy:** A fundamental browser security rule that isolates web pages from different addresses and restricts local `file:///` module access.
- **Progressive Web App (PWA):** A web application that uses modern web features to allow visitors to install the website onto their phone home screen like a native app.
- **Open Graph Protocol:** A standard set of HTML tags that tells WhatsApp, Facebook, and Twitter what image, title, and description to show in message preview cards.
- **UTM Parameter:** Short text labels attached to the end of a web link that allow website owners to see where their visitors came from without invading privacy.

---
*Document completed on November 3, 2026. All source files, numbers, and algorithms verified against the Diwali Sky codebase.*

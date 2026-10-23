# Diwali Sky: Project Brief

You are building a small web app in this folder. Read this whole file before writing any code. Follow the phases in Section 9 in order, and stop at the end of each phase.

---

## 1. What we are building

Diwali Sky writes a person's name in fireworks.

Someone types a friend's name and taps "Light it up". Rockets rise over a night sky and burst. Then one big emerald shell explodes, and its sparks swirl into place to spell the friend's name in the Wrench Wise emerald-to-cyan gradient, with crackle and pop sounds. "Happy Diwali" fades in above it. The name then melts into falling sparks that turn gold as they fall, and the show keeps going. Tapping anywhere launches more fireworks.

**It must look like it belongs to wrench-wise.com.** Same colours, font, button shapes and white cards as the site (Section 5). The only difference is the sky, which uses the brand's deep navy because fireworks need a dark background. Someone who knows the Wrench Wise site should recognise the brand from a single screenshot.

The sender gets a link to share on WhatsApp. When the friend opens it, they see "Vivek sent you a Diwali surprise. Tap to open." Then the show plays with their own name in it. At the end, they can send one back.

The headline moment is thousands of sparks flying into place to form the name. Spend the most care here.

Who it is for:
- **WhatsApp and Instagram viewers with no tech background.** It must look magical within 3 seconds and work with one tap.
- **Reel viewers.** It must look great in screen recordings, both vertical and horizontal.
- **Prospects and parents.** Every screen looks and feels like Wrench Wise, and the end card invites them to learn how it was built.

When there is a trade-off, follow this order:
1. The name moment looks stunning.
2. It runs smoothly on a mid-range Android phone.
3. Sharing works in one tap.
4. Everything else.

---

## 2. Hard rules

1. **Code.** Use plain HTML, CSS and JavaScript only. No frameworks, libraries, CDNs, npm packages, web fonts or image files inside the app. The only images allowed are the logo and the link preview image (Section 7). Draw everything else in code: fireworks, stars, diyas and icons.
2. **Front-end only.** No backend, database, API keys, AI calls or accounts.
3. **User text.** Names are typed by users. Never put them into the page with `innerHTML`. Use `textContent`, or draw them on the canvas. Validate every name using the rules in Section 6.
4. **Writing style.** All UI text and docs are in plain English with short sentences. No emojis. No em dashes (the long dash).
5. **Eye safety.** No full screen white flashes. No more than 3 large bright bursts per second. Respect `prefers-reduced-motion` (Section 5).
6. **File size.** Keep each file focused, under about 400 lines.
7. **Phases.** At the end of every phase, stop and give a Phase Report (Section 10). Do not start the next phase until I say so.
8. **Stubborn bugs.** If the same bug survives two fix attempts, stop. Explain the problem in plain words and give me options. Do not keep looping.
9. **My actions.** I am not from a tech background. When you need me to do something (click, log in, approve), give numbered click-by-click steps.
10. **Commands.** Before running a terminal command, tell me in one line what it does.
11. **Branding.** The look must match wrench-wise.com. Use only the colours, font, shapes and shadows in Section 5. Do not invent new colours. No other company names, logos or brand colours. No real celebrity names in the demo or docs.

---

## 3. Tech setup

- Run locally with a simple static server: `npx serve .`
  - If that fails, use `python -m http.server 8000`.
  - Test in the browser at the address it prints.
- Use ES modules (`<script type="module">`).
- Folder structure:

```
diwali-sky/
  index.html
  styles.css
  manifest.json
  assets/          logo.png (I provide), og-image.png, app icons
  tools/
    og.html        draws the link preview image (Section 7)
  js/
    main.js        starts the app, picks the right screen
    sky.js         canvases, resize, night sky, stars, diyas
    particles.js   particle pool and physics
    fireworks.js   rockets and burst types
    nameText.js    turns a name into target points
    show.js        the show timeline (Section 4C)
    audio.js       Web Audio sound effects and mute
    validate.js    name rules
    blocklist.js   list of blocked words
    link.js        builds and reads share links
    share.js       WhatsApp, share sheet, copy link
    ui.js          screens, forms, buttons, demo mode
    selftest.js    runs with ?test=1
  README.md
  REEL_SCRIPT.md
```

- **Two canvases, stacked.**
  - Back canvas: sky gradient, stars and diyas.
  - Front canvas: fireworks. Each frame, fade it slightly instead of clearing it (`destination-out` with a low alpha fill), so sparks leave short glowing trails. Draw sparks with `lighter` blending so overlaps glow.
- **One loop.** A single `requestAnimationFrame` loop drives everything. Use delta time (seconds since the last frame, capped at 0.05) so the speed is the same on 60Hz and 120Hz screens.
- **Particle pool.** Preallocate particles in typed arrays (`Float32Array` for x, y, speed, life and so on) and reuse them. Never create new objects every frame. This is what keeps phones smooth.
- **Sharp on every screen.** Size canvases to the window times `devicePixelRatio`, capped at 2. Handle resize and phone rotation.
- **Hidden tab.** Pause the loop and sound when the tab is hidden (`visibilitychange`).

---

## 4. Features

### Must have

**A. The night sky**
- A full screen sky behind everything, with a gradient from `--sky-top` through `--sky-mid` to `--sky-bottom`, and a soft emerald glow (`--horizon-glow`) near the horizon.
- A 3px brand gradient bar across the very top of the screen, like the accents on the site.
- 150 to 250 small stars that twinkle slowly. Use fewer on phone.
- A row of 5 to 9 diyas (oil lamps) along the bottom, drawn in code, in the diya colours from Section 5. The flames flicker gently. The count depends on screen width.

**B. Fireworks engine**
- **Rockets** launch from near the bottom with a faint trail, slow down, and burst near the top of their arc.
- **Burst types** (all four required):
  - Peony: a round ball of coloured sparks.
  - Ring: a flat circle of sparks.
  - Willow: golden sparks that droop and fall slowly with long trails.
  - Crackle: small white pops that go off just after the main burst.
- **Physics.** Gravity, air drag, fade over life and a slight random flicker. Sparks shrink and dim as they die.
- **Colours.** From the firework palette in Section 5. Each burst uses one or two palette colours. At least 3 of every 5 bursts use the brand colours (emerald, teal, cyan, mint). The rest use gold and amber.
- **Tap to launch.** Tapping or clicking the sky (not a button) launches a rocket that bursts at that point. Allow at most 6 rockets in the air at once.
- **Particle budget.**
  - Phone: up to about 2,500 live particles. Laptop: up to about 6,000.
  - Measure the frame rate during the first 2 seconds of each show. If it is under 45 fps, cut the budget by 30% and lower the name point density.
  - With `?debug=1`, show the fps and live particle count in a corner.

**C. The name show (the hero feature)**

Keep the timeline in `show.js` as a simple list of steps with times, so it is easy to tune.

1. **0.0 to 2.5 s.** Three rockets launch with whistles and burst, each a different type.
2. **2.5 to 3.5 s.** One large rocket with an emerald trail rises to the upper middle of the sky.
3. **3.5 s.** It bursts with a deep boom.
4. **3.5 to 6.0 s.** Its sparks fly outward for about 0.6 seconds, then curve and fly into place to spell the name.
   - Each spark has its own target point.
   - Stagger the arrivals so the name builds from left to right.
   - A soft shimmering crackle plays as sparks arrive.
5. **6.0 to 9.5 s.** Hold.
   - Name sparks shimmer with a small random twinkle and a tiny jitter.
   - The greeting ("Happy Diwali" or "Happy Deepavali") fades in above the name in the site's heading style (weight 800, letter spacing -0.01em), in `--spark-gold` with a soft glow.
   - "from Vivek" fades in below in smaller text in `--on-sky`, only if a sender name was given.
6. **9.5 to 12.0 s.** Melt. The name sparks get gravity and fall like a willow. Each spark fades from its brand colour to gold as it falls, leaving soft trails.
7. **12.0 s onwards.** Ambient mode. A random firework every 1.5 to 3 seconds. The share panel or end card slides up. Tapping still launches more.

**Turning the name into points**
- Draw the name on a hidden canvas in the site's font stack at weight 800 (Section 5), so it matches the site's headings.
- Auto-size it to fit within 86% of the screen width and 30% of the screen height.
- Read the pixels and sample every N pixels to get target points. Choose N so the count stays between 600 and 1,800 on phone, and up to 3,000 on laptop.
- On a portrait screen, if the name has a space and does not fit on one line, split it into two lines at the space nearest the middle.
- Place the name in the upper middle (about 38% from the top), clear of the share panel and the diyas.
- **Name colour is the Wrench Wise gradient.** Colour each spark by its position across the name: `--name-from` (emerald) on the left, `--name-mid` (teal) in the middle, `--name-to` (cyan) on the right. This is the same direction as the gradient on the site.
- About 1 in 10 name sparks twinkles in `--name-glint` (gold), so it still feels like Diwali.
- Name sparks are a little larger (2 to 3 px) than normal sparks, so the name reads clearly.
- The name must be readable in a 1080 x 1920 screen recording.

**D. Sender flow (home screen)**
- Opens when the link has no show data.
- Ambient fireworks play behind a white card styled exactly like the cards on wrench-wise.com (Section 5). On phone, the card sits in the lower half so the fireworks show above it.
- Card contents:
  - Title "Diwali Sky" in the brand gradient (gradient text, weight 800), and subtitle "Write a name in fireworks." in `--text-2`.
  - Input "Their name" (required).
  - Input "Your name (optional)".
  - Greeting choice as two pill buttons: "Happy Diwali" (default) and "Happy Deepavali". Use the selected and unselected pill styles from Section 5.
  - Primary button "Light it up", a full-width pill in the brand gradient with white text.
  - Small line in `--muted`: "Names stay inside your link. We never store them."
- If a name fails the rules, show plain error text under that input (Section 6).
- **On "Light it up":** the card fades away and the show plays. This tap also starts sound.
- **Share panel** (a white card like the home card, slides up once the melt begins):
  - "Send on WhatsApp" (primary button)
  - "Share" (phone share sheet, hidden if the browser does not support it)
  - "Copy link" (changes to "Copied" for 2 seconds)
  - "Watch again" and "Edit names" as smaller text buttons
- **Shared message:** "I made a Diwali surprise for you. Open it with sound on: LINK"

**E. Receiver flow**
- Opens when the link has valid show data.
- **First screen:**
  - Night sky, stars, diyas and a few small, quiet fireworks far away.
  - A white card in the lower half, same style as the home card, with:
    - "Vivek sent you a Diwali surprise", or "Someone sent you a Diwali surprise" if there is no sender name, in `--text` at weight 800.
    - Button: "Tap to open", a full-width brand gradient pill.
    - Small hint in `--muted`: "Turn sound on for the full effect."
- **On tap:** the show plays with their name. This tap also starts sound.
- **End card:**
  - If there is a sender name: "Send one back to Vivek". It opens the sender flow with "Their name" set to Vivek and "Your name" set to the receiver's name.
  - If not: "Make one for someone".
  - Also "Watch again".
- **Broken link:** if the data is missing, damaged or fails the name rules, open the home screen with a gentle line on top: "This link didn't work. Make a new one below."

**F. Branding on the end card**
- Small and quiet, at the bottom of the share card, above a thin `--card-border` line:
  - The logo and "Built with code by Wrench Wise" in `--muted`.
  - A link "Learn to build apps like this" that opens in a new tab: `https://wrench-wise.com/?utm_source=diwali-sky&utm_medium=web-app&utm_campaign=diwali-2026`
- No UI may cover the name during the hold. Panels appear only once the melt begins.

**G. Sound (Web Audio, made in code, no audio files)**
- **Launch:** a short, quiet rising whistle.
- **Burst:** a boom made from a short noise burst through a low pass filter, plus a low sine thump. Vary pitch and volume randomly.
- **Crackle:** many tiny noise clicks spread over 0.5 to 1 second.
- **Name arrival:** a soft shimmering crackle, quieter than the boom.
- **Master:** moderate volume, through a compressor so many bursts together never distort.
- **Voices:** at most 8 sounds playing at once.
- **Unlock:** browsers only allow sound after a tap. Create the AudioContext on the first tap.
- **Mute:** a speaker button in the top right, drawn as inline SVG. Remember the choice in `localStorage` under `ds-muted`. Wrap every `localStorage` read and write in try and catch.

**H. Layout**
- **Phone portrait first.** The sky fills the screen. Logo chip at top left, mute button at top right as a white round chip (same style as the logo chip) with a `--text` icon.
- **Laptop.** Same layout, with the card centred and at most 420px wide.
- **Cards** get 20px inner padding on phone and 24px on laptop, like the site's cards.
- **General:**
  - Use `100dvh` for full height so mobile browser bars do not cut the sky.
  - Respect notches and the home bar with `env(safe-area-inset-*)`.
  - Touch targets at least 44px.
  - No scrolling on any screen.

**I. Demo mode (for recording reels)**
- Opens with `?demo=1` in the URL. `?demo=1&name=Chennai` uses a custom name (still validated). The default demo name is "Priya".
- It loops:
  1. The home card shows. A visible tap dot lands on "Their name".
  2. The name types itself, one letter about every 150 ms.
  3. A tap dot lands on "Light it up".
  4. The full show plays.
  5. The share panel shows for 3 seconds, then the loop restarts.
- Sound cannot start on its own. In demo mode, show a small hint "Tap once to enable sound" that disappears after the first tap. Sound then stays on for every loop.
- It must look clean in both vertical (9:16 phone) and horizontal (16:9 laptop).

### Nice to have (only if time allows, in this order)
1. **GA4 events.** Only if I give you a GA4 Measurement ID.
   - Events: `show_created`, `show_opened`, `share_whatsapp`, `share_other`, `copy_link`, `cta_click`.
   - Never send names. Set `page_location` to the page address without the query and the hash.
   - This is the only external script allowed, and only in this case.
2. **Save picture.** Capture the frame at the middle of the hold, with the greeting and a small Wrench Wise mark. After the show, a "Save picture" button downloads it as a PNG.
3. **Vibration.** A short buzz on big bursts where supported (Android). Skip silently where not supported.
4. **Skyline.** A dark silhouette of made-up buildings and one temple tower shape along the bottom, behind the diyas.
5. **Installable app.** `manifest.json` with app icons, so it can be added to the home screen.

---

## 5. Visual style: matched to wrench-wise.com

These values were measured from the live wrench-wise.com site. It uses Tailwind colours: emerald as the main brand colour, teal and cyan as accents, gray text, white cards and emerald-to-cyan gradients.

The one difference is the sky. Fireworks need a dark background, so the sky uses the brand's deep navy. Everything on top of the sky (cards, buttons, text, logo) uses the site's own light style.

Put every colour in CSS variables in `:root`. JavaScript reads them with `getComputedStyle`, so there is one source of truth. Do not use any colour that is not in this section.

**Font**
- The site's own system font stack: `ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`.
- Headings weight 800 with letter spacing -0.01em. Body weight 400 to 500.
- The name in the sky uses the same stack at weight 800.

**Shapes**
- Buttons and pills fully rounded (999px). Cards 16px. Inputs 12px. Small chips 8px.

**Shadows**
- `--shadow-md: 0 4px 6px -1px rgba(0,0,0,0.10), 0 2px 4px -2px rgba(0,0,0,0.10);`
- `--shadow-lg: 0 10px 15px -3px rgba(0,0,0,0.10), 0 4px 6px -4px rgba(0,0,0,0.10);`
- On the dark sky, cards use `--shadow-lg` plus `0 24px 48px -12px rgba(2,6,23,0.6)`, so they lift off the sky.

**Brand gradient**
- `--brand-grad: linear-gradient(90deg, #059669, #0D9488, #06B6D4);`
- Use it for: primary buttons, the 3px bar at the top of the screen, the "Diwali Sky" title, and the link preview image.

**Cards and UI (the site's light style)**
- `--card: #FFFFFF;`
- `--card-border: #E5E7EB;`
- `--text: #111827;` (headings)
- `--text-2: #374151;` (body)
- `--muted: #6B7280;`
- `--brand: #059669;`
- `--brand-strong: #047857;`
- `--brand-soft: #D1FAE5;`
- `--accent: #0891B2;`
- `--error: #E11D48;`
- **Inputs:** white, 1px `--card-border`, 12px corners. On focus: 1px `--brand` border with a 3px `--brand-soft` ring.
- **Greeting pills:** selected is `--brand-soft` background, `--brand-strong` text and 1px `--brand` border. Unselected is white with 1px `--card-border` and `--text-2` text.
- **Text buttons** ("Watch again", "Edit names"): `--brand` text, no background.
- **Text placed directly on the sky:** `--on-sky: #F1F5F9;` and `--on-sky-muted: #CBD5E1;`.
- All text must reach at least 4.5 to 1 contrast against its background.

**Sky (the brand's deep navy)**
- `--sky-top: #020617;`
- `--sky-mid: #0F172A;`
- `--sky-bottom: #0F2431;`
- `--horizon-glow: rgba(16, 185, 129, 0.14);`
- `--star: #E2E8F0;`

**Firework palette (brand first, gold for the festival)**
- Brand: `--spark-emerald: #34D399;` `--spark-teal: #2DD4BF;` `--spark-cyan: #22D3EE;` `--spark-mint: #A7F3D0;`
- Festive: `--spark-gold: #FCD34D;` `--spark-amber: #FBBF24;`
- Highlights: `--spark-white: #F8FAFC;` only for crackle pops and spark highlights.

**The name**
- `--name-from: #34D399;` (emerald, left side)
- `--name-mid: #2DD4BF;` (teal, middle)
- `--name-to: #22D3EE;` (cyan, right side)
- `--name-glint: #FCD34D;` (gold twinkle)

**Diyas**
- Bowls `#1E293B` with a thin `#10B981` rim. Flames from `#FBBF24` to `#FCD34D` with a soft glow.

**Logo**
- Use `assets/logo.png` on a small white chip (8px radius, 4px 8px padding, `--shadow-md`), top left. This mirrors the white header on the site and keeps the logo's dark tagline readable.
- If the file is missing, use a text wordmark "Wrench Wise" in `--text`, weight 800, on the same chip.

**Browser colours**
- `<meta name="theme-color" content="#0F172A">`
- `manifest.json`: `theme_color` `#059669`, `background_color` `#0F172A`.

**UI motion**
- Animate only `transform` and `opacity`.
- Easing: `--ease: cubic-bezier(0.4, 0, 0.2, 1)` (the site's own curve) and `--ease-out: cubic-bezier(0.22, 1, 0.36, 1)`. Durations 150, 200, 300 and 500 ms.
- Calm and professional, like the site. Nothing bounces more than once.

**Reduced motion**
- If `prefers-reduced-motion: reduce` is set: fewer and slower bursts, no crackle pops, shorter trails, and the name fades in place instead of flying in. Sound still works.

---

## 6. Names, links and sharing

### Name rules (`validate.js`)
- Trim spaces at both ends and collapse repeated spaces into one.
- **Their name:** 1 to 16 characters. **Your name:** 0 to 20 characters.
- Count characters as people see them. Use `Intl.Segmenter` (graphemes) where available, otherwise `[...text].length`. This keeps Tamil and Hindi names counted fairly.
- **Allowed:** letters in any language (Unicode `\p{L}` plus combining marks `\p{M}`), spaces, dot, apostrophe and hyphen. Nothing else: no digits, links, symbols or emojis.
- **Blocklist:** `blocklist.js` holds an array of common abusive words in English, and in Tamil and Hindi written in English letters. Compare in lowercase, ignoring spaces, dots and hyphens. Add a comment at the top saying I can add more words.
- **Error messages:**
  - "Please type a name."
  - "Names can only have letters and spaces."
  - "Please keep it under 16 letters."
  - "Please choose a different name." (blocklist match)

### Link format (`link.js`)
- Put the show data in the hash, not the query: `https://SITE/#s=PAYLOAD`. The hash is never sent to any server, so names stay private.
- `PAYLOAD` is base64url of UTF-8 JSON, for example `{"v":1,"t":"Priya","f":"Vivek","g":"diwali"}`.
  - `t` is their name, `f` is the sender name (may be empty), `g` is `diwali` or `deepavali`.
  - Use `TextEncoder` and `TextDecoder` so Tamil and Hindi names survive the round trip.
  - Encoding hides the name in the link, so the surprise is not spoiled in the WhatsApp chat.
- **Reading a link:** decode inside try and catch, check `v` is 1, then run every name rule again. If anything fails, treat it as a broken link (Section 4E).
- Listen for `hashchange`, so pasting a new link into the same tab works.

### Sharing (`share.js`)
- **WhatsApp:** open `https://wa.me/?text=` plus the encoded message and link.
- **Share:** `navigator.share({ title: "Diwali Sky", text, url })` when available. If the person cancels, ignore the error quietly.
- **Copy:** `navigator.clipboard.writeText`, with a hidden textarea fallback for older browsers.

---

## 7. Link preview (the WhatsApp card)

- **In `index.html`:**
  - Title: "Diwali Sky by Wrench Wise"
  - Description: "Someone wrote your name in the Diwali sky. Tap to see it."
  - Open Graph tags: `og:title`, `og:description`, `og:image`, `og:url`, `og:type` (website), plus `twitter:card` set to `summary_large_image`.
- **`og:image` and `og:url`** must be full addresses. Use a placeholder until Phase 5, then set the real live address.
- **The preview image:**
  - If I have put my own `assets/og-image.png` in the folder, use it.
  - Otherwise, build `tools/og.html` at 1200 x 630: the navy sky, a few emerald, cyan and gold bursts, the words "A Diwali surprise for you" in the brand gradient at weight 800, and the logo chip.
  - Open it in Chrome at exactly that size, save a screenshot as `assets/og-image.png`, and keep it under 300 KB.

---

## 8. Correctness checks (must pass)

1. **Self-test.** When the URL has `?test=1`, run `selftest.js` and log a clear PASS or FAIL table to the console:
   - **Link round trip.** 20 sample names encode and decode exactly. Include spaces, an apostrophe ("D'Souza"), a hyphen, Tamil ("அன்பு") and Hindi ("प्रिया").
   - **Rejections.** Empty, 17 or more letters, digits, `<script>`, a web address, an emoji and a blocklisted word are all rejected.
   - **Name points.** For "A", "Priya", "Vijayalakshmi", "Sri Devi" and "அன்பு", at both 390 x 844 and 1440 x 900: the point count is within budget, and every point is on screen.
   - **Broken links.** Random text, a cut-off payload and a wrong version all open the home screen with the broken link message.
2. **Console.** No console errors on any screen.
3. **Speed.** In Chrome DevTools at 390 x 844 with CPU throttling set to 4x, the full show averages above 45 fps. Report the number.
4. **Readability.** Screenshot the hold moment for the five names above, at both screen sizes. Every name must be clearly readable.
5. **Sound.** No clicks or distortion when 6 rockets burst together. Mute works and is remembered after reload.
6. **Rotation.** Resizing from portrait to landscape mid-show causes no crash. The show continues or restarts cleanly.
7. **Safety.** Search the code for `innerHTML`. It must never be used with user text.
8. **Brand match.**
   - Open wrench-wise.com in the browser and take a screenshot at 390 x 844 and at 1440 x 900.
   - Put them next to screenshots of the Diwali Sky home screen and share card at the same sizes.
   - The buttons, cards, inputs, font and colours must look like the same company. List anything that differs and fix it.
   - Search the CSS and JS for hex colours. Every one must come from Section 5.

---

## 9. Phases

### Phase 1: Sky and fireworks (target 60 min)
- **Build:** `index.html`, `styles.css` with all colour variables, `sky.js`, `particles.js`, `fireworks.js`, the main loop, tap to launch, and `?debug=1`.
- **Report:**
  - Screenshots of each burst type
  - fps at 390 x 844 with 4x CPU throttling

### Phase 2: The name in the sky (target 60 min)
- **Build:** `nameText.js`, `show.js` with the full timeline, the greeting and sender text, and the reduced motion version.
- **Report:**
  - Hold-moment screenshots for the five test names at both sizes
  - Point counts and fps during the formation

### Phase 3: Sound, links and sharing (target 50 min)
- **Build:** `audio.js` with mute, `validate.js`, `blocklist.js`, `link.js`, `share.js`, the sender flow, the receiver flow, broken link handling, and `selftest.js`.
- **Report:**
  - The self-test table
  - A working sample link for "Priya" from "Vivek"
  - Click steps for me to test both flows in Chrome

### Phase 4: Polish, branding and demo (target 40 min)
- **Build:**
  - Phone and laptop layouts with safe areas
  - Logo chip and end card with the UTM link
  - Link preview tags and `og-image.png`
  - Demo mode
  - Tune the particle budget against the speed check
- **Then,** only if time allows, the Nice to Have items in order.
- **Report:**
  - Phone and laptop screenshots
  - The brand match screenshots from Section 8, side by side with wrench-wise.com
  - Confirmation that demo mode loops cleanly

### Phase 5: Docs and deploy (target 30 min)

- **README.md:**
  - What the app is and the live link
  - How to use it in 3 steps
  - How to run it locally
  - "How it works" in 5 short points: particles, gravity, turning text into points, Web Audio, and how the name travels inside the link
  - The privacy line from Section 4D
  - "Built by Wrench Wise"
- **REEL_SCRIPT.md:** Two versions, one vertical (30 seconds) and one horizontal (60 seconds). Each has:
  - A hook as on-screen text in the first 2 seconds
  - A shot list matched to demo mode timing
  - On-screen captions
  - Optional voiceover lines
  - A closing line with Wrench Wise
  - No emojis and no em dashes
- **Deploy:**
  1. Help me push the folder to GitHub. I will give you my empty repository URL.
  2. Deploy it on Vercel as a static site.
  3. Set `og:url` and `og:image` to the live address, then redeploy.
  4. Give click-by-click steps for anything I must do myself.
  5. Confirm the live link works on a phone-sized screen, and that a sample share link opens the receiver flow.
  6. Give me the final live link and one sample share link.

---

## 10. Phase Report format

- **What I built** (3 to 5 bullets)
- **How to check it** (click steps)
- **Screenshots** (phone and laptop, where relevant)
- **Not working or cut,** explained in plain words
- **Time used** against the target

---

## 11. If we are running late

If I say "We're behind, apply the cut list", drop these in order:
1. Nice to Have items
2. "Send one back" prefill. Keep a plain "Make one for someone" button.
3. Crackle burst type and the name arrival crackle. Keep the whistle and the boom.

Never cut:
- The name formation
- The "Tap to open" receiver screen
- WhatsApp sharing
- Mute button
- Demo mode
- Privacy line
- Eye safety and reduced motion rules
- Deployment

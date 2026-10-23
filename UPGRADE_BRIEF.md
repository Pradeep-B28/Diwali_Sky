# Diwali Sky: Cinematic Upgrade Brief

The app in this folder is already built and live at https://diwalisky.vercel.app. This brief upgrades it. It does not start over.

Read this whole file first. Then read PROJECT_BRIEF.md for background. Every hard rule in PROJECT_BRIEF.md Section 2 still applies (plain HTML, CSS and JavaScript, no libraries, no em dashes, no emojis, phase reports, stop after two failed fixes, click steps for me). Follow the phases in Section 9 in order and stop at the end of each one.

---

## 1. Why we are upgrading

It works, but it looks simple. I checked the live site at phone size (390 x 844) and laptop size. These are the reasons, and each one is fixed below.

1. **The name looks like pixel art.** Name sparks are drawn as tiny squares on a perfect grid (`fillRect` in `show.js`, grid sampling in `nameText.js`). It reads as a digital font, not as fire. There is no glow around the letters.
2. **The name is almost one colour.** Three colour bands blended with `lighter` turn into pale cyan. The emerald-to-cyan gradient barely shows.
3. **The opening fireworks are small.** Bursts have 65 to 155 sparks (`fireworks.js`), so the sky looks empty before the name appears.
4. **The melt barely moves.** In `updateMelt`, sparks start with zero speed and weak gravity, so the name fades in place instead of pouring down.
5. **The scene is flat.** One thin skyline strip, a small temple shape, and nothing moving except stars and diyas. No depth, no light, no life.
6. **The home screen is just a form.** Nothing on the page sells the experience before you type.
7. **Bug, live right now:** the debug panel (FPS and the Peony, Ring, Willow, Crackle buttons) shows for every visitor. The HTML has `hidden`, but `.debug-hud { display: flex }` in `styles.css` overrides it.
8. **Minor:** README.md returns 404 on the live site.

The goal: someone opening the link should feel they are standing on a rooftop in Tamil Nadu on Diwali night, watching their name light up the sky.

---

## 2. Rules for this upgrade

1. **Do not break what works.** The share link format in `link.js`, the name rules in `validate.js` and `blocklist.js`, and `share.js` must not change. People have already shared links, and those links must keep opening.
2. **Work on a branch.** All upgrade work happens on a git branch called `cinematic`. The live site only changes when I reply "Ship it" (Phase 6). The one exception is the debug panel fix in Phase 0.
3. **Brand.** Every colour still comes from PROJECT_BRIEF.md Section 5, plus the new scene colours in Section 7 of this brief. Colours blended between two listed colours (for example, the name gradient) are allowed.
4. **Eye safety still applies.** No full screen flashes. Burst glows are local and soft.
5. **Phones first.** Every new effect has a quality tier (Section 6). A mid-range Android phone must stay smooth.
6. **Frame checks.** Do not judge visuals from a live screen recording alone. Use the frame stepping tool from Phase 0 to take exact screenshots at set show times.

---

## 3. Light quality (fixes reasons 1 to 4)

This is the biggest visible gain, so it comes first.

**A. Glow sprites instead of squares**
- At load, pre-render one small glow sprite per colour onto offscreen canvases (64 x 64).
  - Centre: `--spark-white` at full strength.
  - Middle (about 30% out): the spark colour.
  - Edge: fully transparent.
- Draw sparks with `drawImage(sprite, ...)` and `lighter` blending, sized at about 3 times the spark's current size, so each spark has a hot core and a soft halo.
- Use this in `particles.js` (bursts) and `show.js` (name).
- The Low quality tier keeps the old square drawing for bursts only.

**B. A smooth name gradient**
- Pre-render 16 sprites that blend step by step from `--name-from` to `--name-mid` to `--name-to`.
- Each name spark picks its sprite from its left-to-right position (`u`). The gradient must be clearly visible: emerald on the left, cyan on the right.
- Keep the gold glints (about 1 in 10 sparks).

**C. Break the grid**
- In `nameText.js`, after sampling, move each point by a random offset of up to 45% of the sampling step, and vary sizes between 70% and 130%.
- No visible rows or columns may remain. Check with a zoomed screenshot.

**D. A glowing aura behind the name**
- When the name forms, draw the name text once onto a small offscreen canvas (one quarter of screen size), filled with the brand gradient.
- Blur it by drawing it smaller and then larger again (scale down to one eighth, then back up with smoothing on). Do not rely on `ctx.filter`, because older iPhones do not support it.
- Draw this aura behind the sparks at 30% strength during the hold, and let it breathe slowly between 22% and 34% (a 2.5 second cycle).

**E. Bloom (High tier only)**
- Add a third canvas, `bloom-canvas`, above the fireworks canvas, at one quarter of the screen resolution.
- Each frame, draw the fireworks canvas into it scaled down.
- Style it in CSS: full screen size, `filter: blur(6px)`, `mix-blend-mode: screen`, `opacity: 0.55`, `pointer-events: none`.
- This makes every bright spark glow softly. Turn it off automatically below High tier.

**F. Fuller fireworks (same four burst types, no new shapes)**
- Raise spark counts: phone 180 to 240, laptop 260 to 360 per burst, within the particle budget.
- Make bursts about 25% wider and let sparks live about 30% longer.
- The show opens with 5 rockets instead of 3, staggered between 0.3 s and 2.4 s, spread across the sky.

**G. Hero burst moment**
- At the hero burst (3.5 s), add a soft local flash: a radial glow at the burst point, up to 35% strength, gone within 150 ms. This is not full screen.
- The burst lights up the scene around it (Section 4G).

**H. A real melt**
- When the melt starts, give each name spark a small random push (sideways up to 25 px/s, downward 10 to 40 px/s).
- Gravity 160, mild drag, sparks fade from their brand colour to gold over the fall.
- Stretch the melt from 2.5 s to 3.2 s.
- Target: sparks fall at least 35% of the screen height before they fade, like a golden waterfall.

---

## 4. The cinematic scene (fixes reason 5)

Build the sky as separate depth layers, back to front. Draw static layers once onto offscreen canvases at load and on resize (each about 40px wider than the screen so they can shift), then just copy them each frame. Put scene code in `js/scene.js` (and split into more files if it passes 400 lines).

**A. The night sky**
- Keep the current gradient and stars.
- Add a faint Milky Way band running diagonally: a dense cluster of tiny stars, very low strength, with a hint of `--spark-mint`.
- A shooting star every 10 to 18 seconds: a thin bright line that crosses part of the sky in about 0.6 s.
- **No moon.** Diwali falls on a new moon night, so a moon would be wrong.

**B. Far layer: the city**
- A long row of distant buildings across the full width, in `--layer-far`, up to 18% of screen height.
- Small lit windows: tiny dots in `--spark-gold` at 30 to 60% strength. A few switch on or off slowly, so the city feels alive.

**C. Mid layer: the temple tower (gopuram)**
- Replace the current small temple shape with a proper Tamil temple gopuram silhouette in `--layer-mid`:
  - A tall tapering tower with 6 to 7 stacked tiers.
  - Small niche shapes along each tier.
  - A barrel-shaped top with 5 small pot-shaped finials (kalasam).
- Centred horizontally. Its top must stay below 62% of the screen height, so it never overlaps the name.
- **Festival lights:** tiny `--spark-gold` bulbs along the tower's outline and tier edges, twinkling gently, like temples lit up for festivals.
- Houses on both sides with flat roofs, in `--layer-mid`, linked by strings of small lights (gentle curves between rooftops) alternating `--spark-gold` and `--spark-emerald`.

**D. Mist**
- 2 or 3 soft horizontal mist bands in the lower third, drifting slowly sideways (about 8 px per second), in `--mist`.
- Pre-render them as blurred shapes. They pick up colour from nearby bursts (Section 4G).

**E. Floating sky lanterns**
- 6 to 10 lanterns rising slowly from the bottom, each swaying gently side to side.
- Warm paper lanterns drawn in code: a rounded body from `--spark-amber` to `--spark-gold`, with a brighter inner glow.
- Lanterns further away are smaller, slower and dimmer. They fade out near the top and respawn at the bottom.
- They are behind the fireworks and never cross the name area during the hold. Move or fade any lantern in that zone.

**F. Front layer: the rooftop ledge**
- A dark rooftop wall along the bottom in `--layer-near`, with the diyas sitting on it.
- Make the diyas bigger (about 1.4 times) with a clay bowl shape, and a warm glow that reflects on the ledge.
- Embers: up to 40 tiny `--spark-amber` dots drifting up from the diyas and fading.

**G. Bursts light up the scene**
- Keep a short list (at most 6) of active lights from recent bursts: position, colour and strength that fades over 0.6 s.
- Each light adds a soft coloured glow to the sky, tints the mist, and adds a thin rim light (`--spark-teal`, up to 30% strength) along the top edges of the city and the gopuram.
- This is what makes it feel cinematic: when a big burst goes off, the whole scene glows with it.

**H. Depth and camera**
- **Parallax.** Layers shift with the phone's tilt (DeviceOrientation) or the mouse position on laptop.
  - Maximum shift: far layer 4px, mid layer 10px, front layer 18px. Ease it smoothly.
  - On iPhone, tilt needs permission. Ask only inside the tap on "Light it up" or "Tap to open". If refused or unavailable, use a very slow automatic drift instead.
- **Camera push.** During the show, scale only the sky and scene layers from 1.00 to 1.05 over 10 seconds, centred on the name. Do not scale the fireworks canvas, so the name positions stay exact.

---

## 5. A more attractive website (fixes reason 6)

**A. Home screen**
- **Headline on the sky,** above the card: "Write their name in the Diwali sky", weight 800, in `--on-sky`, with "Diwali sky" in `--spark-gold`. Below it in `--on-sky-muted`: "A fireworks greeting you can send on WhatsApp."
  - Phone: headline near the top. Laptop: headline and card together on the left third, so the scene and gopuram stay visible on the right.
- **Card polish** (keep the white site style):
  - A 3px brand gradient strip along the top edge of the card.
  - On laptop, "Their name" and "Your name" sit side by side.
  - The "Light it up" button gets a soft light sweep moving across it every 4 seconds, and a small spark icon drawn as inline SVG.
- **Live preview:** as the person types in "Their name", the name appears faintly in the sky at its final position (brand gradient, about 18% strength, with a few twinkling sparks). It shows where the magic will happen.
- **Launch from the button:** when they tap "Light it up", the first rocket of the show launches from the button itself and flies up into the sky as the card slides away.
- Ambient fireworks behind the home card must be clearly visible: one every 2 to 3 seconds.

**B. Receiver screen: the sky lights up**
- The scene starts dim: only the diyas glow, the rest of the scene sits under a dark layer at 60% strength.
- Card text stays: "Vivek sent you a Diwali surprise" and "Tap to open".
- **On tap, over about 1.5 seconds:**
  1. The dark layer fades away.
  2. City windows switch on in a quick ripple from left to right.
  3. The gopuram lights switch on tier by tier, bottom to top.
  4. Lanterns begin to rise.
  5. A single temple bell rings (Web Audio: a few sine tones at bell-like ratios such as 1, 2.76, 5.4 and 8.9, fading over about 2.5 seconds, quiet).
  6. Then the show starts.

**C. Share and end cards**
- At the middle of the hold, capture a still of the sky and the name (sky canvas plus fireworks canvas into one offscreen canvas).
- Show it as a rounded thumbnail at the top of the share card and the end card, so the person sees the moment they are about to send.

**D. Link preview**
- Rebuild `assets/og-image.png` (1200 x 630) from a real frame of the new scene with a name formed, plus "A Diwali surprise for you" in the brand gradient and the logo chip. Keep it under 300 KB.

---

## 6. Quality tiers and performance

| | High | Medium | Low |
|---|---|---|---|
| Bloom canvas | On | Off | Off |
| Glow sprites | Bursts and name | Bursts and name | Name only |
| Lanterns | 10 | 6 | 3 |
| Embers | 40 | 20 | 0 |
| Mist | 3 bands | 2 bands | Off |
| Scene lighting from bursts | On | On | Off |
| Parallax and camera push | On | On | Off |

- Start at High on laptop and Medium on phone.
- Measure the average frame rate every 2 seconds. If it drops under 45 fps, step down one tier. Never step up during a show.
- `?quality=high`, `?quality=medium` and `?quality=low` force a tier for testing.
- **Reduced motion:** no parallax, no camera push, no shooting stars, lanterns rise at half speed. Everything else as in PROJECT_BRIEF.md.
- **Target:** at 390 x 844 with 4x CPU throttling in Chrome DevTools, Medium tier averages at least 45 fps across the whole show. Report the numbers for all three tiers.

---

## 7. New scene colours

Add these to `:root` in `styles.css` next to the existing tokens. They are Tailwind slate shades, the same family the site uses.

- `--layer-far: #1E293B;` (distant city, slightly lighter, so it looks far away)
- `--layer-mid: #0F172A;` (gopuram and houses)
- `--layer-near: #020617;` (rooftop ledge, darkest)
- `--mist: rgba(203, 213, 225, 0.06);`
- `--dim-layer: rgba(2, 6, 23, 0.6);` (receiver screen before tap)

Lights, lanterns, embers and windows only use existing spark colours.

---

## 8. Checks (must pass, in addition to PROJECT_BRIEF.md Section 8)

1. **Old links still work.** Make a link with the current live site before changing anything, save it in the Phase 0 report, and confirm it opens the receiver flow on the new version.
2. **Self-test.** `?test=1` still passes in full.
3. **Frame screenshots.** Using the frame tool, at 390 x 844 and 1440 x 900, capture show times 2.0 s, 4.6 s, 7.5 s and 11.0 s for "Priya" and "Vijayalakshmi".
   - 2.0 s: at least three full bursts visible, and the scene glowing from them.
   - 4.6 s: sparks clearly flying into place.
   - 7.5 s: name readable, no visible grid, gradient visible from emerald to cyan, aura behind it.
   - 11.0 s: sparks clearly falling below the name.
4. **Scene screenshot.** Home screen at both sizes, with the gopuram, city, lanterns and mist visible and nothing overlapping the card text.
5. **Receiver light-up.** Screenshots at 0 s (dim), 0.8 s and 1.6 s after "Tap to open".
6. **Speed.** The numbers from Section 6.
7. **No debug panel** without `?debug=1`.
8. **Taps.** Tapping the sky still launches rockets on all tiers (the bloom canvas must not block taps).
9. **Brand match.** Re-run the side-by-side check with wrench-wise.com from PROJECT_BRIEF.md Section 8.

---

## 9. Phases

### Phase 0: Safety and quick fixes (target 20 min)
1. Make a share link for "Priya" from "Vivek" on the current live site. Save it for check 8.1.
2. **On `main`:** add `[hidden] { display: none !important; }` to `styles.css` so the debug panel hides. Add README.md (as described in PROJECT_BRIEF.md Phase 5). Commit and deploy to production. Confirm the debug panel is gone on the live site.
3. Create and switch to the `cinematic` branch.
4. **Frame tool:** with `?debug=1`, add `window.dsPause()`, `window.dsResume()` and `window.dsStep(seconds)` (runs the full update and draw loop at 1/60 s steps), plus `?debug=1&freeze=7.5`, which plays the show for "Priya" from "Vivek" and freezes at that time. Use this for every screenshot from now on.
- **Report:** the saved old link, confirmation the live debug panel is gone, and "before" frame screenshots at 2.0, 4.6, 7.5 and 11.0 s.

### Phase 1: Light quality (target 60 min)
- **Build:** everything in Section 3.
- **Report:** before and after frame screenshots at the same four times, zoomed screenshot of the name proving no grid, and fps.

### Phase 2: The cinematic scene (target 90 min)
- **Build:** everything in Section 4 and the colours in Section 7.
- **Report:** scene screenshots at both sizes, a burst lighting up the scene, and fps.

### Phase 3: The website (target 60 min)
- **Build:** everything in Section 5 (the link preview image waits for Phase 5).
- **Report:** home screen at both sizes, live preview while typing, the button launch, receiver light-up frames, and the share card with thumbnail.

### Phase 4: Quality tiers and performance (target 40 min)
- **Build:** Section 6. Tune until the speed target passes.
- **Report:** fps per tier, and screenshots of each tier at 7.5 s.

### Phase 5: Preview and docs (target 30 min)
1. Run every check in Section 8 and PROJECT_BRIEF.md Section 8.
2. Rebuild the link preview image (Section 5D).
3. Update README.md and REEL_SCRIPT.md. The reel should now open on the receiver light-up and the bell.
4. Push the `cinematic` branch to get a Vercel preview link.
   - If the project is connected to GitHub, Vercel makes a preview link for the branch automatically.
   - If not, run `npx vercel` (without `--prod`) for a preview link.
5. Give me the preview link and click steps to test it on my phone.
- **Report:** all check results, and the preview link.

### Phase 6: Ship it (only when I reply "Ship it")
1. Merge `cinematic` into `main` and deploy to production.
2. Confirm https://diwalisky.vercel.app shows the new version, the old saved link still opens, and the debug panel stays hidden.

---

## 10. Phase Report format

Same as PROJECT_BRIEF.md Section 10, plus "before and after" screenshots wherever something visual changed.

---

## 11. If we are running late

If I say "We're behind, apply the cut list", drop these in order:
1. Shooting stars and embers
2. Live preview while typing
3. Share card thumbnail
4. Tilt parallax on phones (keep mouse parallax on laptop)
5. Mist

Never cut:
- Glow sprites, smooth name gradient and broken grid
- The real melt
- The gopuram, city and lanterns
- Scene lighting from bursts
- The receiver light-up
- The debug panel fix
- Quality tiers
- The preview link before shipping

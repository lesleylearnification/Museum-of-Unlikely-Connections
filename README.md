# The Museum That Rearranges Itself: Historical Connections

A GitHub-ready prototype in which each gallery contains one randomly selected exhibit from twelve historical categories.

## Gameplay

1. The museum draws twelve exhibits from a collection of 120.
2. The player chooses any three.
3. Red yarn connects the dusty glass-covered exhibits and is held in place with translucent tape.
4. The player writes a possible relationship in the investigation journal.
5. The curator presents one interpretive connection.
6. The player opens a mini-library for the three exhibits.
7. The connection can be saved to a Cabinet of Curiosities.

There is no single correct answer.

## Run locally

Because the catalogue is stored in `data.json`, use a local server:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## Publish with GitHub Pages

Upload the contents of this folder to the root of a public repository. Then choose:

**Settings → Pages → Deploy from a branch → main → / (root)**

## Live Curator Task

The static prototype includes a local curator fallback so the game works immediately.

To connect live research:

1. Read `CURATOR-TASK-SPEC.md`.
2. Create a secure server-side Task or API endpoint.
3. Put its public endpoint URL in `curator-api.js`.
4. Never place private API keys in browser code or GitHub.

## Important prototype limitation

The local fallback builds a plausible thematic interpretation from curated exhibit metadata. It does **not** conduct live research. The live Task must be connected before describing generated curator paragraphs as newly researched or source-synthesized.

## Files

- `index.html` — game interface
- `styles.css` — museum, glass domes, red yarn, tape, journal, and library
- `game.js` — random selection, gameplay, local curator, library, and cabinet
- `data.json` — 120 exhibit records
- `curator-api.js` — live Task integration point
- `CURATOR-TASK-SPEC.md` — research and synthesis contract
- `assets/dashboard-concept.png` — approved dashboard concept


## Final visual and gameplay changes

- All 120 exhibit records now have local antique specimen SVG assets rendered in a unified dusty, sepia museum style.
- Bright emoji art has been removed from the display cases.
- The red yarn is sized to the exhibit grid itself, so it remains pinned in place when the curator response expands the journal.
- The repeated three exhibit descriptions were removed from the curator panel.
- The curator's compelling connection now appears directly beneath **2. Museum Curator’s Perspective**.
- The approved dusty museum journal artwork is included as the final style reference and atmospheric background.


## Fixed build

- Exhibit artwork is now rendered directly by `game.js`; the 120 SVG files are no longer required for gameplay.
- All three selected boxes display matching antique specimen thumbnails.
- The red yarn stays pinned after the curator response appears.
- A 1–5 star comparison unlocks the Research Library and New Connection buttons.


## Exhibit image correction

This version uses each exhibit's item-specific catalogue illustration instead of fallback initials. The illustrations are rendered directly from `data.json` and visually treated with grayscale, sepia, dust, shadow, plinth, and glass effects. No separate exhibit image folder is required.

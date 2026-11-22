# Plan: scroll-animated tablet video

Status: implementation complete; validation remains pending.

## Outcome

Add a tablet containing the supplied YouTube video directly between the homepage hero and manual flipbook:

`HomeHero → TabletVideoSection → ManualFlipbookSection → existing workshop sections`

Use the [Aceternity Container Scroll Animation](https://ui.aceternity.com/components/container-scroll-animation) as the visual reference: a perspective-tilted frame that rotates toward the viewer and settles flat as the page scrolls.

## Design and implementation decisions

- Reuse the installed `motion/react` library. No new animation dependency or wholesale component installation is needed.
- Create a focused `TabletVideoSection.tsx` with colocated CSS in `app/src/pages/home/`. Keep the frame and player together unless implementation reveals a real need for a reusable primitive.
- Use a landscape tablet with a very thin dark navy rim, small camera and side-button details, and a restrained shadow. Place it on the existing notebook background using the current page width, color tokens, and whole-row spacing.
- Omit section titles and avoid inventing a title or description for video content that has not been verified.
- Keep the section to one viewport-height stage. The tablet enters from below, enlarges and settles in the center, then tilts and exits above as the user scrolls through the section. Keep the section and notebook surface untransformed, and size the tablet to fit shorter viewports.
- Use section-relative native scroll progress, compatible with the existing Lenis setup. Keep the section to the same viewport-sized stage as the hero; do not overlap the hero or add a pinned scroll runway.
- Size the tablet from the available viewport-stage height while preserving its video ratio. On phones, reduce the tilt. With reduced motion enabled, show the final flat tablet in a single-screen section and respond to preference changes during the session, following the existing manual's media-query pattern.

## Ordered tasks

### 1. Build the tablet and video section

Files: new `app/src/pages/home/TabletVideoSection.tsx` and `TabletVideoSection.css`.

- [x] Build the responsive frame and semantically labelled section without a visible heading.
- [x] Embed video `_H9tByQyBv8` using a canonical YouTube embed URL, omitting the share-tracking query and trailing punctuation.
- [x] Keep native controls, keyboard interaction, inline playback, and fullscreen available. Use an informative iframe title, lazy loading, and an explicit referrer policy compatible with YouTube.
- [x] Start paused; playback begins through the native play control.
- [x] Reserve player dimensions to prevent layout shifts: 16:9 at larger widths, with at least 200px player height on narrow phones.

Verification: view the section at 320, 768, 1024, and 1440px widths; confirm unclipped controls, no horizontal overflow, theme contrast, and actual playback/fullscreen on a served page.

Dependency: none. Scope: small, two files.

### 2. Add scroll motion and integrate the homepage

Files: the new section files and `app/src/routes/index.tsx`.

- [x] Add a viewport-height stage and scroll-linked rise, multi-axis rotation, scale, and exit.
- [x] Insert the section immediately after `HomeHero` and before `ManualFlipbookSection`.
- [x] Keep the iframe mounted while scrolling so playback does not reset.
- [x] Provide a flat reduced-motion layout and hide the interactive video in print.

Verification checkpoint: inspect the complete hero → tablet → manual transition in light and dark themes; verify reduced motion, keyboard access, touch scrolling around the frame, and that the existing method anchor still reaches its destination.

Dependency: task 1. Scope: small, three files.

### 3. Validate integration

- [ ] Run production build, TypeScript, lint, and formatting checks for changed files.
- [ ] Run the existing scroll, notebook-grid, notebook-layer, and manual regression checks (`test:scroll`, `test:grid`, `test:notebook-layers`, `test:manual`).
- [ ] Inspect desktop and phone screenshots, browser errors, and playback controls. Check that notebook decoration never covers the video.
- [ ] If an existing browser assertion depends on the manual's old position, update it to locate the section rather than assume a fixed scroll distance.

Dependency: task 2. Scope: verification; adjust existing checks only where necessary.

## Known uncertainty

The supplied YouTube page could not be fetched during planning, so its title and permission to play in an embed remain unverified. Check the actual embed early in task 1. If playback is restricted by the uploader or network, keep the direct YouTube link usable and report the limitation; do not substitute another video.

YouTube documents a minimum player viewport of 200 × 200px and native playback parameters in its [embedded-player documentation](https://developers.google.com/youtube/player_parameters). The narrow-phone layout must respect that minimum rather than enforce 16:9 at every width.

## Completion criteria

The requested video plays inside a responsive tablet between the hero and manual; its scroll animation resembles the reference, fits the notebook design, respects reduced motion, and leaves the existing flipbook and navigation working.

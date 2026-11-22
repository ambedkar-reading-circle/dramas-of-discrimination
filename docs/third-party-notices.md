# Third-party notices

The manual preview includes `react-pageflip` 2.0.3 and `page-flip` 2.0.7,
both MIT licensed. Source, license, and attribution notices are available at
[Nodlik/react-pageflip](https://github.com/Nodlik/react-pageflip) and
[Nodlik/StPageFlip](https://github.com/Nodlik/StPageFlip).

The application applies local lifecycle and turn-progress modifications through
`app/scripts/patch-flipbook.mjs` during installation. The patch preserves React's
host/page nodes, cancels rendering and initialization work on teardown, removes
resize listeners, keeps React callbacks current, and exposes progress from the
engine's fold calculation. Upstream license files remain in the installed
packages. The former GulLabs dependencies are no longer shipped.

The outer scroll animation uses Motion for React (`motion`), MIT licensed.
Source and license: [motiondivision/motion](https://github.com/motiondivision/motion).

The displayed ARC logo and workshop illustration are existing project assets.

Smooth wheel scrolling uses Lenis (`lenis`), MIT licensed.
Source and license: [darkroomengineering/lenis](https://github.com/darkroomengineering/lenis).

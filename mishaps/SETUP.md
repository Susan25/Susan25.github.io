# Mishaps — setup

Upload these files into a `mishaps` folder at the repo root, next to `time-ladder`
(GitHub → Add file → Upload files, drag the files in, Commit):

    index.html  scenarios.js  sw.js  manifest.webmanifest
    icon-192.png  icon-512.png  apple-touch-icon.png  .nojekyll

The design notes and the two PDFs in this folder are for you and don't need uploading.

It appears at `https://susan25.github.io/mishaps/`. Open it on her phone in Safari → Share → Add to Home Screen.

## First time on her phone

1. **My info → My people.** Mom, Dad and Aunt are there as placeholders. Tap each to add the
   phone number and change names or tags. The order is the call order.
2. **My info → Home address.** Used for "directions home" and Uber.
3. **My info → Walk through my home.** Do this together with the printed checklist.
   Photos show up inside the matching steps (e.g. the sink valves photo appears in "Sink or tub overflowing").
4. **I'm lost → Show where I am** once, at home, so Safari asks for location permission
   while things are calm.

## Add it to the Pocket Tools hub

In `apps/index.html`, add a block to the `APPS` list (add a comma after the previous block's `}` first):

  {
    name: "Mishaps",
    desc: "Something gone wrong? Pick what's happening and take it one step at a time.",
    meta: "Help now · Practice · My info",
    href: "../mishaps/",
    icon: "../mishaps/icon-192.png"
  }

## Changing the wording

All scenario text lives in `scenarios.js`, with notes at the top on how it's laid out.
Edit there and upload just that file; `index.html` doesn't need to change.
`scenarios.js` is fetched network-first like the page, so edits reach her phone the next time
it opens with signal. If you change an icon or the manifest, also bump `CACHE = 'mishaps-v1'` in sw.js.

## Good to know

- Her people, notes and practice live in localStorage; photos live in IndexedDB. Both stay on the phone.
  **My info → Save a copy** makes one backup file, photos included. **Open a copy** restores it
  (replacing what's there), which is also how to move everything to a new phone.
- Clearing Safari's website data erases it all; the latest copy is the backup.
- Call buttons use the iPhone dialer and Messages. Location only works on the https site, not from a file.

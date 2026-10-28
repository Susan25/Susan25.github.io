# Pocket Budget — setup

No setup needed. Upload the `pocket-budget` folder to the repo root next to `time-ladder`
(GitHub → Add file → Upload files, drag the folder in, Commit). It appears at
`https://susan25.github.io/pocket-budget/`. Open it on her phone in Safari → Share → Add to Home Screen.

## Add it to the Pocket Tools hub

In `apps/index.html`, add a block to the `APPS` list (after Time Ladder's closing `}`, add a comma first):

  {
    name: "Pocket Budget",
    desc: "Tap what kind of thing you bought and what it cost. See where your money went each month.",
    meta: "Add · Month · Share a copy",
    href: "../pocket-budget/",
    icon: "../pocket-budget/icon-192.png"
  }

## The printable guide

`print/pocket-budget-guide.pdf` is the illustrated guide. To list it on the hub, upload it to `apps/print/`
and add a block to the `DOCS` list in `apps/index.html`:

  {
    name: "Pocket Budget — a short guide",
    desc: "How every part of the app works, with pictures.",
    href: "print/pocket-budget-guide.pdf"
  }

The app also has its own walkthrough: the **How it works** button under the title. It opens by itself
the very first time the app is opened on a device, then only when tapped.

## Sharing between phones

Her phone: Share tab → Share a copy → send it to you (Messages, Mail, AirDrop).
Your phone or computer: open Pocket Budget → Share tab → Choose a copy file.
Entries are matched by an internal id, so opening the same copy twice never doubles anything,
and edits and deletions she makes carry over in the next copy.

## Good to know

- Entries live only on the device (localStorage). Clearing Safari's website data erases them;
  the latest shared copy is the backup.
- Changes to index.html reach her phone on the next open with signal (the page is fetched network-first).
  If you change an icon or the manifest, also bump `CACHE = 'pocket-budget-v1'` in sw.js.

# Mishaps app — design notes

Working name: "mishaps" (rename freely). Status: content under review; app not built yet.

## Purpose
Help and teach for real-life mishaps (home and out and about), for someone who finds
reasoning under stress hard and has anxiety. Users: Susan's daughter, iPhone.

## Structure
- **Home screen:** "What's happening?" tiles by category (Water, Smoke & Fire, Power & Heat,
  Locked Out / Lost Things, Getting Around, People & Money, Weather, Hurt), a search box,
  and an always-visible **"I'm really anxious"** button. Tabs: Help Now · Practice · My Info.
- **Help Now:** one step per screen, big text, Yes/No branches. Every scenario opens with a
  safety check; life-safety branches go straight to "Get out. Call 911" with tap-to-call.
  Back button and Call button always visible.
- **Anxious mode:** skippable breathing screen (~3 breaths, never blocks an emergency),
  simpler choices, an extra reassurance line per step, bigger call button. Stays on until
  she turns it off.
- **Practice:** "What would you do?" with 3–4 choices. Feedback per choice:
  Right / Not first (reasonable but out of order) / Not this (with what to do instead) /
  Never (dangerous instinct, firmer styling). She always moves on; no loops, no score.
  End-of-round recap, "practice something I missed," light per-scenario progress markers.
  Results stay on her phone; "Share my progress" lets her send a summary if she chooses.
- **My Info:**
  - My Home: photos + notes for shutoffs, breaker panel, alarms, supplies (see walkthrough checklist).
    Built as a "Set up My Home" walkthrough mode — one item per screen, camera button,
    "Done it" for practice items, resumable.
  - My People: ordered call list with role tags. Call button tries people in order.
  - My Places: home address, usual bus routes.
  - Scenarios pull from My Info (e.g. her photo of the kitchen sink valves).
  - Practice can quiz her on her own house using her photos.

## Call list
1. Mom  2. Dad  3. Aunt — tagged *can coach by phone* and *can come help (~30 min)*
4. Specialists: NOVEC outage 703-335-0500; Washington Gas emergency leak line
   844-927-4427 option 1; plumber; bank card line (back of card). 911 for fire, smoke,
   gas, CO, anyone badly hurt, feeling unsafe.

## Household facts
- She lives at home with Susan and her dad. Electricity: NOVEC. Gas: Washington Gas.
- Gets around by Uber; learning Metro and buses (Fairfax Connector, SmarTrip).

## Scenarios (14)
1 Smoke alarm (alarm vs chirp) · 2 Burning on the stove · 3 Sink/tub overflowing ·
4 Toilet clogged/overflowing · 5 Power out · 6 Locked out · 7 Wrong train/bus or missed stop ·
8 I'm lost · 9 Card declined · 10 Scam call or text · 11 Carbon monoxide alarm ·
12 Smell gas · 13 Uber no-show/cancelled · 14 Car doesn't match the app

## Data format
Each scenario is a small tree, stored as data in a separate file next to index.html:
nodes of type `step` (text, optional `calm`, `why`, `myinfo` key, `practice` block),
`question` (yes/no targets), and `call` (who). Practice choices carry `result`
(right / notfirst / wrong / never) and `feedback`. Adding a scenario = editing data, not code.

## Platform (PocketTools conventions)
Single self-contained index.html, mobile first; manifest + icons; sw.js for offline
(network-first, cache fallback); data stored on the phone with export/import backup;
dialer/Messages links; Apple Maps for directions; point to iPhone Share My Location
rather than reinventing it. Design language from the PocketTools family.

## Next steps
- Susan + mentor review the scenario content doc next week.
- Walk the house with the checklist.
- Then: build outline for approval, then build.

# My Day — setup

My Day works without any setup: tasks and check marks are saved on the device.
To show her **Google Calendar** events too, do this once (about 15 minutes).

## 1. Put the app online

Upload the `my-day` folder next to `time-ladder`, the same way you published Time Ladder.
Note the address it ends up at, e.g. `https://YOURNAME.github.io/pocket-tools/my-day/`.
The part before the first `/` after the domain — `https://YOURNAME.github.io` — is the **origin**. You need it in step 2.

## 2. Get a Google "Client ID"

Sign in at https://console.cloud.google.com with either your Google account or hers. Whoever does it can manage the setup later; it doesn't affect whose calendar is shown.

1. **Create a project**: project picker at the top → *New project* → name it `My Day` → *Create*.
2. **Turn on the Calendar API**: search the top bar for *Google Calendar API* → *Enable*.
3. **Consent screen**: menu → *Google Auth Platform* → *Get started*.
   - App name: `My Day`. Support email: yours.
   - Audience: **External**.
   - Contact email: yours → agree → *Create*.
4. **Add her as a test user**: *Audience* → *Test users* → *Add users* → her Gmail address → *Save*.
   (Leave the app in "Testing". It never needs to be published or verified for family use.)
5. **Create the Client ID**: *Clients* → *Create client*.
   - Application type: **Web application**.
   - Authorized JavaScript origins → *Add URI* → the origin from step 1 (no trailing slash, no folder).
   - *Create*, then copy the **Client ID** (ends in `.apps.googleusercontent.com`).
     There's no secret to keep. The Client ID is safe to put in the page.

## 3. Paste it into the app

Open `my-day/index.html`, find this line near the bottom:

```js
var GOOGLE_CLIENT_ID = "";
```

Paste the Client ID between the quotes, save, and upload again.

## 4. Connect on her phone

Open My Day → **Plan** → **Connect Google Calendar** → sign in as her.
Google will show a **"Google hasn't verified this app"** screen. That's expected for a private family app:
tap *Continue*, tick the box that lets it see her calendar, and continue.

Her events now show up on the **Today** tab, mixed in with her tasks.

## Good to know

- **Read-only.** The app asks for view-only calendar access. It can't create, change or delete events.
- **Which calendars.** Everything she has ticked in Google Calendar's sidebar, including any family calendar you share with her.
- **Refreshing.** Google's permission lasts an hour at a time. After that the Today tab keeps showing the last copy
  and she taps **Refresh** to update (a Google window flashes open and closes). It works offline with the saved copy.
- **Her tasks live on one device.** Tasks and check marks are stored on the phone or browser where she enters them.
  They don't sync between devices, and clearing the browser's site data erases them.

## Add it to the Pocket Tools hub

In the hub's `index.html`, add a block to the `APPS` list:

```js
  {
    name: "My Day",
    desc: "Your to-do list and your calendar in one place. Tap things off as you go.",
    meta: "Tasks · Google Calendar",
    href: "../my-day/",
    icon: "../my-day/icon-192.png"
  }
```

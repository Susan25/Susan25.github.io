/* Mishaps - scenario content.
   ------------------------------------------------------------------
   This file is only content. Edit wording here; index.html never needs to change.

   Each scenario has:
     id, title, group ("home" | "out" | "money"), icon, keywords (for search),
     start  - the first node
     nodes  - the steps, keyed by name
     practice - "What would you do?" questions

   Node types (t):
     "step"  one instruction.          next: node to go to after "Done"
     "ask"   a question with buttons.  opts: [{ label, next }]
     "end"   last screen of a path.

   Optional fields on any node:
     more    extra short lines under the main instruction
     calm    reassurance shown only in calm mode
     why     shown when she taps "Why?"
     home    a My Home item (or list of them) whose photo + note to show
     call    buttons to show: "911", "people" (her list, in order), "coach",
             "come", "novec", "gas", "uber", "whereami", "sendloc", "directions",
             "findmy" (opens the Find My app), "doctor", "urgentcare",
             "mednote" (shows her medical note from My info),
             "alert" (one text to all her people: "I'm calling 911")
     danger  true for get-out / call-911 steps (stronger styling)
     level   on health end screens: "self", "doctor" or "911" (shown as a label)

   An answer in an "ask" can open another scenario with  run: "id"  instead of  next.

   Practice choice results (r):
     "right"     the best answer
     "ok"        also a good answer
     "notfirst"  reasonable, but not first
     "not"       not this (feedback says what to do instead)
     "never"     a dangerous instinct (firmer styling)

   Wording rule: no names of family in here. "Someone on your list" is filled in
   by the call buttons, which show the names she saved in My Info.
   ------------------------------------------------------------------ */

var SCENARIOS = [

/* ============================== 1. Smoke alarm ============================== */
{
  id: "smoke-alarm", title: "Smoke alarm going off", group: "home", icon: "alarm",
  keywords: ["smoke", "alarm", "beeping", "beep", "chirp", "chirping", "detector", "fire", "battery"],
  start: "sound",
  nodes: {
    sound: { t: "ask", text: "What does it sound like?",
      opts: [
        { label: "Loud beeping that keeps going", next: "flames" },
        { label: "One short chirp every minute or so", next: "chirp" }
      ] },
    flames: { t: "ask", text: "Do you see flames, or is smoke filling the room?",
      calm: "If you're not sure, choose the first answer. Getting outside is never wrong.",
      opts: [
        { label: "Yes, or I'm not sure", next: "out" },
        { label: "No. It's from cooking, and nothing is burning now", next: "cook" }
      ] },
    out: { t: "step", danger: true, text: "Get out now. Leave everything.",
      more: ["Shout \u201cFire!\u201d so everyone in the house gets out.",
             "Close doors behind you if you can.",
             "Smoke on the way? Stay low and go under it.",
             "A closed door feels hot? Don't open it. Use another way out."],
      home: "meeting_spot",
      calm: "Your only job right now is to get outside. Everything else can wait.",
      why: "Smoke rises, so the cleaner air is near the floor. A fire can fill a home in a couple of minutes.",
      next: "call911" },
    call911: { t: "ask",
      danger: true,
      text: "Is someone from home outside with you?",
      opts: [{"label": "Yes", "next": "call911_them"}, {"label": "No, I'm on my own", "next": "call911_911"}] },
    call911_them: { t: "step",
      text: "Let them call 911.",
      more: ["Stay outside together."],
      calm: "You got out, and you're not alone. That's exactly right.",
      next: "stayout" },
    call911_911: { t: "step",
      danger: true,
      level: "911",
      text: "Call 911.",
      more: ["Say: “There's a fire at my house and I'm outside.”", "Then tap Text everyone."],
      call: ["911", "alert"],
      next: "stayout" },
    stayout: { t: "end", text: "Stay outside until firefighters say it's safe.",
      more: ["Never go back in, not for pets or things. Firefighters will look for pets."] },
    cook: { t: "step", text: "Turn off the stove. Open a window and turn on the stove fan.",
      more: ["Wave a towel near the alarm to clear the smoke."],
      home: "stove_fan", next: "cookq" },
    cookq: { t: "ask", text: "Did the alarm stop within a few minutes?",
      opts: [
        { label: "Yes, it stopped", next: "cookdone" },
        { label: "No, or I smell burning I can't find", next: "out" }
      ] },
    cookdone: { t: "end", text: "All clear.", more: ["Leave the window open for a while."] },
    chirp: { t: "step", text: "That chirp means the battery is low. It's not a fire.",
      calm: "That sound is annoying, but it's just the alarm asking for a new battery. You're safe.",
      why: "A fire alarm is loud and keeps going. One chirp every 30 to 60 seconds is the low-battery warning.",
      next: "chirpend" },
    chirpend: { t: "end", text: "Let someone at home know which alarm is chirping, so it gets a new battery.",
      more: ["No need to take the alarm down yourself. An alarm with no battery can't warn anyone."],
      call: ["people"] }
  },
  practice: [
    { q: "The smoke alarm is beeping loudly and you see smoke in the hallway. What do you do?",
      choices: [
        { text: "Get out, staying low under the smoke, and shout so everyone gets out", r: "right", fb: "Yes. Getting out comes first, and the cleaner air is low. Once you're outside, someone calls 911." },
        { text: "Stop to call someone from inside", r: "notfirst", fb: "Get out first. Calls happen once you're outside. Every second inside counts." },
        { text: "Grab my phone, laptop and cat first", r: "never", fb: "Leave everything. Things can be replaced, and firefighters will look for pets." },
        { text: "Hide in my room until it stops", r: "never", fb: "Never hide. Get outside, even if it's scary." }
      ] },
    { q: "One alarm makes a short chirp every minute. What does that mean?",
      choices: [
        { text: "The battery is low. Let someone at home know", r: "right", fb: "Yes. It's a reminder, not an emergency." },
        { text: "There's a fire somewhere. Get out", r: "not", fb: "A fire alarm is loud and nonstop. One chirp a minute is the battery." },
        { text: "Pull the alarm off the ceiling", r: "not", fb: "Leave it up. An alarm with no battery can't warn anyone." }
      ] }
  ]
},

/* ============================== 2. Stove ============================== */
{
  id: "stove", title: "Something burning on the stove", group: "home", icon: "flame",
  keywords: ["stove", "burning", "fire", "pan", "grease", "oil", "oven", "microwave", "cooking", "smoke", "kitchen"],
  start: "off",
  nodes: {
    off: { t: "step", text: "Turn the burner off.",
      home: "stove_controls",
      calm: "Burner off first. That one move fixes most of it.",
      why: "Taking away the heat stops it from getting worse.",
      next: "flames" },
    flames: { t: "ask", text: "Are there flames?",
      opts: [
        { label: "No, just smoke", next: "smoke" },
        { label: "Yes, only inside the pan", next: "lid" },
        { label: "Yes, in the oven or microwave", next: "oven" },
        { label: "Bigger than the pan, spreading, or I'm not sure", next: "out" }
      ] },
    smoke: { t: "step", text: "Use an oven mitt to slide the pan onto a cold burner.",
      more: ["Open a window and turn on the stove fan."],
      home: "oven_mitts", next: "smokeend" },
    smokeend: { t: "end", text: "That's it.", more: ["Let the pan cool before you clean it."] },
    lid: { t: "step", text: "Slide a lid over the pan.",
      more: ["A baking sheet works too.", "Never use water."],
      home: "pan_lid",
      calm: "Covering it takes away its air. You're doing it right.",
      why: "Fire needs air. Water makes burning oil jump out of the pan.",
      next: "wait" },
    wait: { t: "step", text: "Leave the lid on. Don't move the pan.",
      more: ["Wait until it's completely cool. Lifting the lid early can restart the fire."],
      next: "lidq" },
    lidq: { t: "ask", text: "Did the flames go out?",
      opts: [ { label: "Yes", next: "fireend" }, { label: "No", next: "out" } ] },
    oven: { t: "step", text: "Turn it off and keep the door closed.",
      more: ["Without air, the fire goes out."],
      next: "ovenq" },
    ovenq: { t: "ask", text: "Did the flames go out?",
      opts: [ { label: "Yes", next: "fireend" }, { label: "No", next: "out" } ] },
    out: { t: "step", danger: true, text: "Get out.",
      more: ["Shout \u201cFire!\u201d so everyone in the house gets out.",
             "Close the kitchen door behind you if you can.", "Don't go back for anything."],
      calm: "Leaving is the brave choice here. Firefighters are fast.",
      next: "call911" },
    call911: { t: "ask",
      danger: true,
      text: "Is someone from home outside with you?",
      opts: [{"label": "Yes", "next": "call911_them"}, {"label": "No, I'm on my own", "next": "call911_911"}] },
    call911_them: { t: "step",
      text: "Let them call 911.",
      more: ["Stay outside together."],
      calm: "You got out, and you're not alone. That's exactly right.",
      next: "stayout" },
    call911_911: { t: "step",
      danger: true,
      level: "911",
      text: "Call 911.",
      more: ["Say: “There's a fire at my house and I'm outside.”", "Then tap Text everyone."],
      call: ["911", "alert"],
      next: "stayout" },
    stayout: { t: "end", text: "Stay outside until firefighters say it's safe." },
    fireend: { t: "end", text: "The fire is out.",
      more: ["Let someone at home know, even if it was small, so the stove gets checked."],
      call: ["people"] }
  },
  practice: [
    { q: "Oil in a frying pan catches fire. The flames are just in the pan. What do you do?",
      choices: [
        { text: "Burner off, slide a lid over the pan", r: "right", fb: "Yes. No air, no fire. Leave the lid on until it's cool." },
        { text: "Pour water on it", r: "never", fb: "Never put water on a grease fire. It makes burning oil jump out of the pan. Lid on, burner off." },
        { text: "Carry the pan to the sink", r: "never", fb: "Don't move it. Burning oil can spill on you. Lid on, burner off." },
        { text: "Wait to see if it goes out", r: "not", fb: "Act right away: burner off, lid on. Small fires grow fast." }
      ] },
    { q: "Something in the oven catches fire. What do you do?",
      choices: [
        { text: "Turn the oven off and keep the door shut", r: "right", fb: "Yes. With the door shut, the fire runs out of air." },
        { text: "Open the door to see", r: "not", fb: "Opening it feeds the fire air. Keep it closed." },
        { text: "Throw water in", r: "never", fb: "Keep the door closed instead. Water can spread some fires." }
      ] }
  ]
},

/* ============================== 3. Sink or tub ============================== */
{
  id: "overflow", title: "Sink or tub overflowing", group: "home", icon: "drop",
  keywords: ["sink", "tub", "bath", "bathtub", "overflow", "overflowing", "flood", "water", "faucet", "tap", "leak"],
  start: "faucet",
  nodes: {
    faucet: { t: "step", text: "Turn the faucet off.",
      calm: "Water on the floor looks bad, but it's fixable. Just the faucet first.",
      why: "Stopping the water matters more than the mess.",
      next: "stopped" },
    stopped: { t: "ask", text: "Did the water stop coming out?",
      opts: [
        { label: "Yes", next: "drain" },
        { label: "No, the faucet won't turn off", next: "which" }
      ] },
    which: { t: "ask", text: "Is it a sink or the tub?",
      opts: [ { label: "A sink", next: "valves" }, { label: "The tub", next: "main" } ] },
    valves: { t: "step", text: "Open the cabinet under the sink. Turn both valves to the right until they stop.",
      home: ["kitchen_valves", "bath_valves"],
      calm: "Right to tighten. Turn it until it stops.",
      next: "valveq" },
    valveq: { t: "ask", text: "Did the water stop?",
      opts: [
        { label: "Yes", next: "drain" },
        { label: "No, or the valves won't turn", next: "main" }
      ] },
    main: { t: "step", text: "Turn off the main water shutoff for the house.",
      home: "main_water", next: "drain" },
    drain: { t: "step", text: "Pull the stopper or open the drain so the water goes down.", next: "floor" },
    floor: { t: "step", text: "Water near a plug or anything plugged in? Don't touch it.",
      more: ["Otherwise, put towels down to soak up the water."],
      home: "towels", next: "end" },
    end: { t: "end", text: "The water's off. Everything else is just cleanup.",
      more: ["Let someone at home know, especially if water went under a door or through the floor."],
      call: ["people"] }
  },
  practice: [
    { q: "Water is spilling over the sink onto the floor. What do you do first?",
      choices: [
        { text: "Turn the faucet off", r: "right", fb: "Yes. Stopping the water comes first." },
        { text: "Grab towels for the floor", r: "notfirst", fb: "Towels help, but the water keeps coming until the faucet is off." },
        { text: "Call someone on my list", r: "notfirst", fb: "Good to do next. Stop the water first; it takes two seconds." },
        { text: "Leave the room", r: "not", fb: "Overflowing water isn't dangerous. Turning the faucet off fixes most of it." }
      ] },
    { q: "You turned the handle but the faucet keeps running. What now?",
      choices: [
        { text: "Turn the valves under the sink to the right", r: "right", fb: "Yes. Those valves shut off water to just that sink." },
        { text: "Keep twisting the faucet harder", r: "not", fb: "Forcing it can break it. Use the valves under the sink." },
        { text: "Unplug the drain and wait", r: "notfirst", fb: "Draining helps, but water is still coming in. Valves first." }
      ] }
  ]
},

/* ============================== 4. Toilet ============================== */
{
  id: "toilet", title: "Toilet clogged or overflowing", group: "home", icon: "toilet",
  keywords: ["toilet", "clog", "clogged", "overflow", "overflowing", "plunger", "flush", "bathroom"],
  start: "noflush",
  nodes: {
    noflush: { t: "step", text: "Don't flush again.",
      calm: "Gross, but not dangerous. Not flushing keeps it from getting worse.",
      why: "Each flush adds more water, and it goes on the floor.",
      next: "valve" },
    valve: { t: "step", text: "Turn the valve on the wall behind the toilet to the right until it stops.",
      more: ["It's near the floor. Turning it off stops any more water coming in."],
      home: "toilet_valves",
      calm: "That's the important part done. Now you just get help.",
      next: "help" },
    help: { t: "step", text: "Call someone on your list.",
      more: ["They can talk you through what's next, or deal with it when they're home."],
      call: ["coach", "people"],
      calm: "It's fine to leave the rest to someone else. It'll keep until then.",
      next: "clean" },
    clean: { t: "end", text: "Clean up any water on the floor.",
      more: ["Put towels down and wear rubber gloves if you have them.", "Wash your hands well afterward."],
      home: "gloves" }
  },
  practice: [
    { q: "You flush and the water rises toward the top of the bowl. What do you do?",
      choices: [
        { text: "Turn off the valve on the wall behind the toilet, then call someone", r: "right", fb: "Yes. That stops new water coming in, and someone can help with the rest." },
        { text: "Flush again to push it through", r: "not", fb: "Don't flush again. Each flush adds more water, and it ends up on the floor." },
        { text: "Start plunging right away", r: "not", fb: "Leave the plunging for later. Turn off the water first and get help." },
        { text: "Pour drain cleaner in", r: "not", fb: "Skip chemical cleaners. They can splash and burn, and rarely fix a toilet clog." }
      ] }
  ]
},

/* ============================== 5. Power ============================== */
{
  id: "power", title: "Power went out", group: "home", icon: "bolt",
  keywords: ["power", "outage", "electricity", "lights", "dark", "breaker", "outlet", "novec", "blackout"],
  start: "light",
  nodes: {
    light: { t: "step", text: "Stay where you are. Turn on your phone's flashlight.",
      more: ["Don't light candles."],
      home: "flashlights",
      calm: "The dark is just dark. Flashlight on, and you're okay.",
      next: "where" },
    where: { t: "ask", text: "Look out a window. What's dark?",
      opts: [
        { label: "The neighbors and streetlights too", next: "outage" },
        { label: "Only our house", next: "house" },
        { label: "Just one room or some outlets", next: "room" }
      ] },
    outage: { t: "step", text: "It's a power outage. Report it to NOVEC.",
      more: ["Or let someone on your list know, and they'll report it.", "Don't call 911 for an outage alone."],
      call: ["novec", "people"],
      calm: "Outages hit the whole street. Crews are already working on it.",
      next: "fridge" },
    fridge: { t: "step", text: "Keep the fridge and freezer closed.",
      more: ["Food stays cold about 4 hours in a closed fridge."], next: "unplug" },
    unplug: { t: "step", text: "Unplug the computer and TV. Leave one lamp switched on.",
      more: ["The lamp tells you when the power is back.",
             "See a wire down outside? Stay far away, and report it to NOVEC."],
      why: "Power can come back with a surge that damages electronics.",
      next: "outend" },
    outend: { t: "end", text: "Now you wait it out.",
      more: ["Cold? Add layers. Never use the stove or oven for heat.",
             "If it's cold or dark for a long time, someone can come get you."],
      call: ["come"] },
    house: { t: "end", text: "Call someone on your list.",
      more: ["It may be the main switch in the breaker panel. Leave that one to them."],
      call: ["people"] },
    room: { t: "step", text: "Unplug whatever you were just using.",
      more: ["Hair dryer, space heater, microwave…"],
      why: "Whatever tripped the switch will trip it again if it stays plugged in.",
      next: "roomhelp" },
    roomhelp: { t: "end", text: "Let someone at home know. They'll reset the switch in the breaker panel.",
      more: ["It's usually a tripped switch, and it's an easy fix for them.",
             "Leave the breaker panel to them.",
             "Smell burning? Get out, and get someone. If you can't reach anyone, call 911."],
      call: ["people", "alert"],
      calm: "This happens in every house. It's a small fix." }
  },
  practice: [
    { q: "The lights go out in your bedroom, but the hallway lights still work. What do you do?",
      choices: [
        { text: "Unplug what I was using, then let someone at home know", r: "right", fb: "Yes. One room out usually means a tripped breaker, and they'll reset it." },
        { text: "Go reset the breaker panel myself", r: "not", fb: "Leave the breaker panel to someone else. Unplug what you were using and let them know." },
        { text: "Call NOVEC", r: "not", fb: "The rest of the house has power, so it's a breaker, not an outage." },
        { text: "Keep plugging things back in to test", r: "not", fb: "Unplug first. Whatever tripped it may trip it again." }
      ] },
    { q: "The whole street is dark and it's getting cold. Which of these should you NOT do?",
      choices: [
        { text: "Turn on the gas stove to warm the kitchen", r: "right", fb: "Right, never do this. A stove or oven used for heat can fill the air with a poison gas you can't smell. Add layers instead." },
        { text: "Put on a sweater and grab a blanket", r: "not", fb: "That one's fine. Layers keep you warm safely. The stove is the one to avoid." },
        { text: "Keep the fridge closed", r: "not", fb: "That one's fine. It keeps food cold longer. The stove is the one to avoid." }
      ] }
  ]
},

/* ============================== 6. Locked out ============================== */
{
  id: "locked-out", title: "Locked out of home", group: "home", icon: "key",
  keywords: ["locked", "lockout", "keys", "key", "door", "home", "can't get in", "lost keys"],
  start: "other",
  nodes: {
    other: { t: "step", text: "Try the garage keypad.",
      more: ["Enter the code you know, then come in through the garage.",
             "No luck? Try the back door, or any door that's sometimes left unlocked.",
             "Don't climb through a window."],
      home: "ways_in",
      calm: "This happens to everyone. Someone will bring a key.",
      next: "gotin" },
    gotin: { t: "ask", text: "Did you get in?",
      opts: [ { label: "Yes", next: "inend" }, { label: "No", next: "call" } ] },
    inend: { t: "end", text: "You're in." },
    call: { t: "step", text: "Call someone on your list. Ask who can bring a key.",
      call: ["come", "people"], next: "safe" },
    safe: { t: "ask", text: "Is it cold, dark, raining, or do you feel unsafe where you are?",
      opts: [ { label: "No, I'm fine here", next: "wait" }, { label: "Yes", next: "warm" } ] },
    wait: { t: "step", text: "Wait near the door, or somewhere comfortable nearby.", next: "end" },
    warm: { t: "step", text: "Go somewhere warm and public to wait.",
      more: ["A store, a café, the library, or a neighbor you know.", "Tell whoever's coming where you are."],
      call: ["sendloc"], next: "end" },
    end: { t: "end", text: "While you wait:",
      more: ["Check Find My to see how far away they are.",
             "Don't call a locksmith you find online unless someone on your list says to. Some charge far more than they quote.",
             "If someone makes you feel unsafe, go into a busy store and call someone on your list. If you're in danger, call 911."],
      call: ["findmy"],
      calm: "You've called for help. Now you just wait somewhere comfortable." }
  },
  practice: [
    { q: "You get home and realize your keys are inside. Nobody's home. What do you do first?",
      choices: [
        { text: "Try the garage keypad, then call down my list", r: "right", fb: "Yes. The keypad usually gets you in, and if not, someone on your list can bring a key." },
        { text: "Search online for a locksmith", r: "notfirst", fb: "Call your list first. Many online locksmith ads quote a low price, then charge much more." },
        { text: "Climb in through a window", r: "not", fb: "Windows are easy to fall from or break. Call for a key instead." },
        { text: "Sit outside for hours, even though it's freezing", r: "not", fb: "You don't have to wait in the cold. Go somewhere warm and tell people where you are." }
      ] }
  ]
},

/* ============================== 7. Wrong train or bus ============================== */
{
  id: "transit", title: "Wrong train or bus, or missed my stop", group: "out", icon: "bus",
  keywords: ["bus", "metro", "train", "wrong", "missed", "stop", "station", "transit", "smartrip", "connector"],
  start: "calm",
  nodes: {
    calm: { t: "step", text: "Stay put for now. Going one stop too far is fine.",
      calm: "Riders miss stops every day. You just go back one stop.",
      next: "which" },
    which: { t: "ask", text: "Are you on a train or a bus?",
      opts: [ { label: "A Metro train", next: "t1" }, { label: "A bus", next: "b1" } ] },
    t1: { t: "step", text: "Get off at the next station.",
      more: ["Never pull an emergency handle to get off early."], next: "t2" },
    t2: { t: "step", text: "Follow the signs to trains going the other way.",
      more: ["Trains are named by their last stop. Look for the name at the end of the line you came from.",
             "You don't need to go out through the fare gates."],
      next: "t3" },
    t3: { t: "ask", text: "Do you know which platform to go to?",
      opts: [ { label: "Yes", next: "end" }, { label: "Not sure", next: "t4" } ] },
    t4: { t: "step", text: "Ask the station manager in the booth near the fare gates.",
      calm: "Station staff help lost riders all day. You won't bother them.",
      next: "end" },
    b1: { t: "step", text: "Press the strip or pull the cord for the next stop. Get off there.", next: "b2" },
    b2: { t: "step", text: "Cross at a crosswalk. Wait at the stop on the other side for a bus going back.",
      more: ["With SmarTrip, a local bus back is free within 2 hours."], next: "end" },
    end: { t: "end", text: "You're on your way back.",
      more: ["Not sure where you are, or it's getting dark? Order an Uber, or call someone on your list."],
      call: ["uber", "people"],
      calm: "Taking an Uber is a fine answer. You don't have to figure it all out." }
  },
  practice: [
    { q: "The Metro doors close and you realize the train is going the wrong way. What do you do?",
      choices: [
        { text: "Get off at the next station and take a train back", r: "right", fb: "Yes. It only costs a few minutes." },
        { text: "Pull the emergency handle to stop the train", r: "never", fb: "Emergency handles are only for emergencies. Missing a stop isn't one. Ride to the next station." },
        { text: "Stay on until the end of the line", r: "not", fb: "That takes you much farther. Get off at the very next stop." },
        { text: "Leave through the fare gates and pay again", r: "not", fb: "No need. You can switch platforms inside the station." }
      ] },
    { q: "You were looking at your phone and the bus passed your stop. What do you do?",
      choices: [
        { text: "Press for the next stop, get off, and catch a bus back across the street", r: "right", fb: "Yes. With SmarTrip, that ride back is free within 2 hours." },
        { text: "Ask the driver to stop right now, between stops", r: "not", fb: "Drivers can only stop at bus stops. Press for the next one." },
        { text: "Stay on and hope it loops back", r: "not", fb: "Many routes don't loop. Get off and ride back." }
      ] }
  ]
},

/* ============================== 8. Lost ============================== */
{
  id: "lost", title: "I'm lost", group: "out", icon: "pin",
  keywords: ["lost", "where", "location", "map", "directions", "home", "battery", "don't know"],
  start: "stop",
  nodes: {
    stop: { t: "step", text: "Stop walking.",
      more: ["Wandering usually makes it harder."],
      calm: "Lost just means you don't know the way yet. Your phone does.",
      next: "safe" },
    safe: { t: "step", text: "Go somewhere safe to stand.",
      more: ["Inside a store or café, or on a busy, well-lit sidewalk."], next: "batt" },
    batt: { t: "ask", text: "Is your phone battery under about 20%?",
      opts: [ { label: "Yes", next: "low" }, { label: "No", next: "where" } ] },
    low: { t: "step", text: "Turn on Low Power Mode.",
      more: ["Settings → Battery → Low Power Mode.", "Save your battery for getting home."],
      next: "send" },
    where: { t: "step", text: "See where you are.", call: ["whereami"], next: "self" },
    self: { t: "ask", text: "Want to find the way yourself?",
      opts: [ { label: "Yes, show me directions", next: "dir" }, { label: "No, I'd rather get help", next: "send" } ] },
    dir: { t: "step", text: "Get directions home.",
      more: ["Walking or transit both work."], call: ["directions"], next: "send" },
    send: { t: "step", text: "Send your location to someone on your list.",
      call: ["sendloc"],
      calm: "Now someone you trust knows exactly where you are.",
      next: "ride" },
    ride: { t: "step", text: "Rather not figure it out? Get a ride.",
      call: ["uber", "come"],
      calm: "Getting a ride is a smart choice, not giving up.",
      next: "done" },
    done: { t: "end", text: "Need to ask someone? Ask a person who works there.",
      more: ["A store clerk, a bus driver, or station staff.",
             "If someone makes you feel unsafe, go into a busy store and call someone on your list. If you're in danger, call 911."] }
  },
  practice: [
    { q: "You come out of a store and nothing looks familiar. What do you do first?",
      choices: [
        { text: "Stop, go somewhere safe, and check the map on my phone", r: "right", fb: "Yes. Standing still and checking is faster than wandering." },
        { text: "Keep walking until something looks familiar", r: "not", fb: "You may walk farther away. Stop and check your phone first." },
        { text: "Ask a stranger on the street for a ride", r: "never", fb: "Never take a ride from a stranger. Use Uber, or call someone on your list to come." },
        { text: "Send my location to someone on my list", r: "notfirst", fb: "Great to do, right after you get somewhere safe to stand." }
      ] },
    { q: "Your phone is at 8% and you're not sure where you are. What's the best use of your battery?",
      choices: [
        { text: "Low Power Mode, send my location, then call or order an Uber", r: "right", fb: "Yes. Save the battery for getting home." },
        { text: "Walk with the map open the whole way", r: "not", fb: "The map uses a lot of battery. Send your location first while you still can." },
        { text: "Scroll social media while I think", r: "not", fb: "Save every bit of battery for getting home." }
      ] }
  ]
},

/* ============================== 9. Card declined ============================== */
{
  id: "card", title: "Card declined at the register", group: "money", icon: "card",
  keywords: ["card", "declined", "payment", "pay", "register", "checkout", "bank", "apple pay", "money"],
  start: "say",
  nodes: {
    say: { t: "step", text: "Say: “Sorry, let me try again.”",
      calm: "This happens to everyone. The cashier has seen it many times today.",
      next: "retry" },
    retry: { t: "step", text: "Try once more. Tap or insert the card instead of swiping.",
      more: ["Check that you entered the right PIN."], next: "ok1" },
    ok1: { t: "ask", text: "Did it work?",
      opts: [ { label: "Yes", next: "done" }, { label: "No", next: "alert" } ] },
    done: { t: "end", text: "Done." },
    alert: { t: "ask", text: "Check your phone. Is your bank asking “Did you make this purchase?”",
      opts: [
        { label: "Yes, in my bank's app", next: "confirm" },
        { label: "Yes, in a text with a link", next: "link" },
        { label: "No alert", next: "other" }
      ] },
    confirm: { t: "step", text: "Answer yes in the bank's app, then try the card again.", next: "ok2" },
    link: { t: "step", text: "Don't tap the link. Open your bank's own app to check instead.",
      more: ["Links in texts can be scams."], next: "other" },
    ok2: { t: "ask", text: "Did it work?",
      opts: [ { label: "Yes", next: "done" }, { label: "No", next: "other" } ] },
    other: { t: "step", text: "Try another way to pay if you have one.",
      more: ["Apple Pay with a different card, another card, or cash."], next: "ok3" },
    ok3: { t: "ask", text: "Did that work?",
      opts: [ { label: "Yes", next: "done" }, { label: "No", next: "aside" } ] },
    aside: { t: "step", text: "Say: “Could you set these aside? I'll come back for them.”",
      more: ["That's all you need to say."],
      calm: "You don't owe anyone an explanation.",
      next: "later" },
    later: { t: "end", text: "Step away. Sort it out later.",
      more: ["Call the number on the back of your card to find out why.",
             "Want help? Call someone on your list."],
      call: ["people"],
      calm: "It's a card problem, not a you problem. It can be fixed later." }
  },
  practice: [
    { q: "The card reader says DECLINED and there's a line behind you. What do you do?",
      choices: [
        { text: "Say “let me try again” and tap or insert the card once more", r: "right", fb: "Yes. Many declines are just a bad read or a typo." },
        { text: "Leave the store without saying anything", r: "not", fb: "You can calmly say “I'll come back for these.” Nobody minds." },
        { text: "Keep trying the card over and over", r: "not", fb: "Two tries is enough. Then check your phone or use another way to pay." },
        { text: "Check my phone for a bank alert", r: "notfirst", fb: "Good second step. Try once more first; it's often just a bad read." }
      ] },
    { q: "A text says your card was blocked. It has a link to “verify your account.” What do you do?",
      choices: [
        { text: "Don't tap it. Check the bank's own app or call the number on my card", r: "right", fb: "Yes. Real bank alerts can be checked in the app. Links in texts can be scams." },
        { text: "Tap the link and enter my card number", r: "never", fb: "Never enter card details from a link in a text. Open the bank's app yourself instead." }
      ] }
  ]
},

/* ============================== 10. Scams ============================== */
{
  id: "scam", title: "Scam call or text", group: "money", icon: "chat",
  keywords: ["scam", "text", "call", "phishing", "link", "code", "fraud", "package", "irs", "gift card", "suspicious"],
  start: "pause",
  nodes: {
    pause: { t: "step", text: "Pause. Don't tap any link, reply, or press any number yet.",
      calm: "Scary messages are made to rush you. Slowing down is the right move.",
      next: "signs" },
    signs: { t: "ask", text: "Does it do any of these?",
      more: ["Says it's urgent: account locked, package held, you owe money, you'll be arrested",
             "Asks for a password, a code, a card number, or your Social Security number",
             "Wants payment by gift card, a cash app, or wire",
             "Offers a prize, refund, or gift you didn't expect"],
      opts: [ { label: "Yes, at least one", next: "scam" }, { label: "None of those", next: "check" } ] },
    scam: { t: "step", text: "It's almost certainly a scam. Hang up, or don't reply.",
      more: ["You're allowed to hang up on anyone.", "Never share a code that was texted to you. Real companies never ask for one."],
      calm: "Hanging up isn't rude. It's how you stay safe.",
      next: "check" },
    check: { t: "step", text: "Worried it might be real? Check it yourself.",
      more: ["Open the company's own app, or call the number on your card or their official website.",
             "Never use the number or link in the message."],
      next: "already" },
    already: { t: "ask", text: "Did you already tap a link, share information, or pay?",
      opts: [ { label: "No", next: "delete" }, { label: "Yes", next: "tell" } ] },
    delete: { t: "end", text: "Report it as spam and delete it.",
      more: ["If your iPhone shows Delete and Report Spam, tap that. It reports it and deletes it in one go.",
             "Talking it over with someone on your list helps you see it clearly."],
      call: ["coach"] },
    tell: { t: "end", text: "Tell someone on your list right away.",
      more: ["It's fixable, and acting quickly helps.",
             "If you gave card details, call the number on the back of your card too."],
      call: ["people"],
      calm: "Scammers fool smart people every day. Telling someone now is exactly right." }
  },
  practice: [
    { q: "A text says: “USPS: your package is on hold. Pay $1.99 at this link within 24 hours.” What do you do?",
      choices: [
        { text: "Don't tap it. Tap Delete and Report Spam", r: "right", fb: "Yes. Rushing you and asking for a small fee by link are classic scam signs." },
        { text: "Tap the link; it's only $1.99", r: "never", fb: "Never pay through a link in a surprise text. They want your card number, not the $1.99." },
        { text: "Reply STOP", r: "not", fb: "Replying tells scammers your number works. Just report it as spam." },
        { text: "Check whether I'm actually expecting a package", r: "ok", fb: "Good idea. If you are, check the tracking in the store's own app, not the text." }
      ] },
    { q: "A caller says he's from your bank and needs the code they just texted you. What do you do?",
      choices: [
        { text: "Hang up, then call the number on the back of my card", r: "right", fb: "Yes. Banks never ask for those codes." },
        { text: "Read him the code so my account stays safe", r: "never", fb: "Never read a texted code to anyone. That code lets them into your account." },
        { text: "Ask him to prove he's from the bank", r: "not", fb: "Scammers can sound very convincing. Just hang up and call the bank yourself." }
      ] }
  ]
},

/* ============================== 11. Carbon monoxide ============================== */
{
  id: "co-alarm", title: "Carbon monoxide alarm", group: "home", icon: "air",
  keywords: ["carbon monoxide", "co", "alarm", "beeping", "gas", "detector", "headache", "dizzy"],
  start: "sound",
  nodes: {
    sound: { t: "ask", text: "What is the carbon monoxide alarm doing?",
      opts: [
        { label: "Loud beeps that keep repeating", next: "out" },
        { label: "One chirp every minute or so", next: "chirp" }
      ] },
    out: { t: "step", danger: true, text: "Get outside now.",
      more: ["Shout so everyone in the house gets out.",
             "Take your phone, and pets if they're right there.", "Don't stop to look for anything."],
      home: "meeting_spot",
      calm: "You can't smell this, so the alarm does the noticing for you. Just go outside.",
      why: "Carbon monoxide has no smell or color. Feeling fine doesn't mean the air is safe.",
      next: "call911" },
    call911: { t: "ask",
      danger: true,
      text: "Is someone from home outside with you?",
      opts: [{"label": "Yes", "next": "call911_them"}, {"label": "No, I'm on my own", "next": "call911_911"}] },
    call911_them: { t: "step",
      text: "Let them call 911.",
      more: ["Stay outside together."],
      calm: "You got out, and you're not alone. That's exactly right.",
      next: "stay" },
    call911_911: { t: "step",
      danger: true,
      level: "911",
      text: "Call 911.",
      more: ["Say: “Our carbon monoxide alarm is going off and I'm outside.”", "Tell them if you have a headache, feel dizzy, or feel sick.", "Then tap Text everyone."],
      call: ["911", "alert"],
      next: "stay" },
    stay: { t: "end", text: "Stay outside, even if the alarm stops.",
      more: ["Cold? Wait at a neighbor's, or in a car parked on the street, not in the garage.",
             "Go back in only when firefighters say it's safe."],
      calm: "Firefighters check this all the time. They'll tell you when it's safe." },
    chirp: { t: "end", text: "That chirp means it needs a new battery or a new alarm. You're safe.",
      more: ["Let someone at home know which alarm it is."], call: ["people"] }
  },
  practice: [
    { q: "The carbon monoxide alarm is beeping loudly, but you feel fine and don't smell anything. What do you do?",
      choices: [
        { text: "Go outside, get everyone out, then get help", r: "right", fb: "Yes. You can't smell carbon monoxide, so trust the alarm. Once you're outside, someone calls 911." },
        { text: "Press the button to silence it and go back to bed", r: "never", fb: "Never ignore a carbon monoxide alarm. Feeling fine doesn't mean the air is safe. Go outside and get help." },
        { text: "Look around the house for the cause", r: "not", fb: "Leave finding the cause to firefighters. Your job is to get outside." },
        { text: "Wait inside to see if it stops", r: "not", fb: "Even if it stops, the gas may still be there. Get outside first." }
      ] }
  ]
},

/* ============================== 12. Gas ============================== */
{
  id: "gas", title: "I smell gas", group: "home", icon: "gas",
  keywords: ["gas", "smell", "rotten egg", "sulfur", "hissing", "leak", "washington gas"],
  start: "where",
  nodes: {
    where: { t: "ask", text: "Where do you smell it?",
      more: ["Gas smells like rotten eggs, on purpose, so you'll notice. Hissing counts too."],
      opts: [ { label: "Inside the house", next: "leave" }, { label: "Outside", next: "away" } ] },
    leave: { t: "step", danger: true, text: "Leave the house now.",
      more: ["Don't turn any lights or switches on or off.",
             "Don't use your phone inside.",
             "Don't light anything. Don't use the garage door opener.",
             "Leave the front door open behind you.",
             "Tell everyone in the house to get out too."],
      calm: "That smell is there to warn you, and it worked. Just walk outside.",
      why: "A tiny spark from a switch or phone can light gas.",
      next: "far" },
    far: { t: "step", text: "Walk well away from the house.",
      more: ["The end of the driveway, or a neighbor's yard."], next: "call" },
    away: { t: "step", text: "Walk away from the smell.", next: "call" },
    call: { t: "ask",
      danger: true,
      text: "Is someone from home outside with you?",
      opts: [{"label": "Yes", "next": "call_them"}, {"label": "No, I'm on my own", "next": "call_911"}] },
    call_them: { t: "step",
      text: "Let them call 911 and Washington Gas.",
      more: ["Stay outside together."],
      calm: "You got out, and you're not alone. That's exactly right.",
      next: "end" },
    call_911: { t: "step",
      danger: true,
      level: "911",
      text: "Call 911, then Washington Gas.",
      more: ["For Washington Gas, choose option 1 for a leak.", "Then tap Text everyone."],
      call: ["911", "alert", "gas"],
      next: "end" },
    end: { t: "end", text: "Stay outside until the gas company or firefighters say it's safe.",
      calm: "The gas company checks smells like this every day. They'll fix it." }
  },
  practice: [
    { q: "You walk into the kitchen and it smells like rotten eggs. What do you do?",
      choices: [
        { text: "Leave without touching any switches, then call from outside", r: "right", fb: "Yes. Get out first, then call once you're away from the house." },
        { text: "Turn on the light to look for the leak", r: "never", fb: "Never flip a switch when you smell gas. A spark can light it. Leave in the dark if you have to." },
        { text: "Call 911 from the kitchen", r: "not", fb: "Don't use your phone inside. Walk out first, then call." },
        { text: "Open all the windows before leaving", r: "not", fb: "Don't spend time inside. Just leave the front door open as you go." }
      ] }
  ]
},

/* ============================== 13. Uber no-show ============================== */
{
  id: "uber-noshow", title: "Uber didn't show up or cancelled", group: "out", icon: "car",
  keywords: ["uber", "ride", "driver", "cancelled", "canceled", "no show", "late", "car"],
  start: "inside",
  nodes: {
    inside: { t: "step", text: "Wait inside, or somewhere comfortable, until the app shows your driver has arrived.",
      next: "app" },
    app: { t: "ask", text: "What does the Uber app show?",
      opts: [
        { label: "The car is still on its way", next: "keep" },
        { label: "It says it's here, but I can't find it", next: "find" },
        { label: "The ride was cancelled", next: "rebook" }
      ] },
    keep: { t: "step", text: "Keep waiting. You can message the driver in the app.", next: "end" },
    find: { t: "step", text: "Look for the license plate shown in the app, or message the driver.", next: "end" },
    rebook: { t: "step", text: "Request a new ride.",
      more: ["Cancellations happen a lot. It isn't your fault."],
      call: ["uber"],
      calm: "Drivers cancel all the time. It's not about you.",
      next: "coming" },
    coming: { t: "ask", text: "Is a new car coming?",
      opts: [ { label: "Yes", next: "end" }, { label: "No cars, or it's taking too long", next: "fam" } ] },
    fam: { t: "step", text: "Call someone on your list to come get you.",
      more: ["Find My shows how far away they are."],
      call: ["come", "people", "findmy"],
      calm: "Asking for a ride is a good plan, not a failure.",
      next: "end" },
    end: { t: "end", text: "Good to remember:",
      more: ["Uber rides only come through the app. If someone offers you a ride and you didn't match with them in the app, say no.",
             "Charged for a ride that never came? Report it in the app later. It doesn't need fixing now."] }
  },
  practice: [
    { q: "Your Uber cancels, and a man in a car nearby says, “I'm a driver, I can take you.” What do you do?",
      choices: [
        { text: "Say no, and request a new ride in the app", r: "right", fb: "Yes. Uber rides only come through the app." },
        { text: "Get in; he says he drives for Uber", r: "never", fb: "Never get in a car you didn't match with in the app. Anyone can say they drive for Uber." },
        { text: "Give up and walk home in the dark", r: "not", fb: "Request another ride, or call someone on your list to come get you." }
      ] }
  ]
},

/* ============================== 14. Car doesn't match ============================== */
{
  id: "uber-match", title: "The Uber car doesn't match the app", group: "out", icon: "plate",
  keywords: ["uber", "car", "driver", "plate", "license", "wrong car", "match", "ride"],
  start: "check",
  nodes: {
    check: { t: "step", text: "Before you open the door, check the app.",
      more: ["The license plate", "The car's make, model, and color", "The driver looks like the photo"],
      calm: "Checking is normal. Good drivers expect it.",
      next: "ask" },
    ask: { t: "step", text: "Ask: “Who are you here to pick up?”",
      more: ["Let the driver say your name. Don't say it for them."], next: "match" },
    match: { t: "ask", text: "Did everything match?",
      opts: [ { label: "Yes", next: "ok" }, { label: "No, or I'm not sure", next: "no" } ] },
    ok: { t: "end", text: "Get in the back seat.",
      more: ["Tap Share trip status in the Uber app so someone on your list can follow along.",
             "Something feels wrong during the ride? Ask to be let out somewhere busy and well-lit."],
      calm: "Everything matched. Sit back and enjoy the ride." },
    no: { t: "step", text: "Don't get in. Say “Sorry, wrong car” and step back somewhere safe.",
      calm: "Saying no is always allowed. Another car is easy to get.",
      next: "cancel" },
    cancel: { t: "step", text: "Cancel the ride in the app and request a new one.",
      more: ["Report the mismatch in the app later."], call: ["uber"], next: "end" },
    end: { t: "end", text: "If anyone pressures you to get in, or follows you:",
      more: ["Go into a busy store and call someone on your list.",
             "If you're in danger, call 911. The Uber app has an emergency button too."],
      call: ["people", "911"] }
  },
  practice: [
    { q: "A car pulls up and the driver asks, “Are you Sam?” Your name isn't Sam, but the car color is right. What do you do?",
      choices: [
        { text: "Ask “Who are you here to pick up?” and check the plate", r: "right", fb: "Yes. If the name or plate is wrong, it's not your ride." },
        { text: "Get in; the color matches", r: "never", fb: "Check the plate, not just the color. Many cars look alike. Never get in until everything matches." },
        { text: "Say “Yes, I'm Sam” to be polite", r: "never", fb: "Never agree to a name that isn't yours. Let the driver tell you who they're picking up." }
      ] },
    { q: "Where should you sit in an Uber?",
      choices: [
        { text: "The back seat", r: "right", fb: "Yes. You can get out on either side, and you have your own space." },
        { text: "The front seat", r: "not", fb: "The back seat is safer, especially when you're riding alone." }
      ] }
  ]
}
,
/* ============================== 15. Can't reach someone ============================== */
{
  id: "cant-reach", title: "Can't reach someone", group: "out", icon: "phone",
  keywords: ["reach", "answer", "call", "voicemail", "where", "find my", "no answer", "family"],
  start: "again",
  nodes: {
    again: { t: "step", text: "Try calling once more. Then send a text.",
      more: ["Something like: \u201cCall me when you can.\u201d"],
      call: ["people"],
      calm: "People miss calls all the time. It usually means they're busy, not that something's wrong.",
      next: "where" },
    where: { t: "step", text: "See where they are.",
      more: ["If they're driving or at work, that often explains why they didn't pick up."],
      call: ["findmy"],
      next: "urgent" },
    urgent: { t: "ask", text: "Is it urgent?",
      opts: [
        { label: "No, it can wait", next: "wait" },
        { label: "Yes, I need help now", next: "next" },
        { label: "It's an emergency", next: "sos" }
      ] },
    wait: { t: "end", text: "Wait for them to call back.",
      more: ["They'll see your missed call and your text."],
      calm: "You've done everything you need to. They'll get back to you." },
    next: { t: "end", text: "Call the next person on your list.",
      call: ["people"],
      calm: "That's what the list is for. Someone will pick up." },
    sos: { t: "end", danger: true, text: "Call 911.",
      more: ["Then keep trying your people, or text them what's happening."],
      call: ["911", "alert"] }
  },
  practice: [
    { q: "You've called twice and nobody on your list is answering. It isn't urgent. What do you do?",
      choices: [
        { text: "Send a text, check Find My to see where they are, then wait for a call back", r: "right", fb: "Yes. A text and a look at Find My usually explain it, like someone driving or in a meeting." },
        { text: "Keep calling every minute until they answer", r: "not", fb: "One more try is plenty. Send a text instead; they'll see it when they can." },
        { text: "Call 911", r: "not", fb: "911 is for emergencies. If it isn't urgent, text and wait." },
        { text: "Check Find My to see where they are", r: "ok", fb: "Good idea. Seeing where they are often explains the missed call. Send a text too." }
      ] }
  ]
}
,
/* ======================================================================
   HEALTH AND WELLNESS
   Every path ends at one of three levels (level: on the last node):
     "self"   fix it yourself
     "doctor" call the doctor's office or go to urgent care
     "911"    call 911 (also marked danger)
   An answer can open another scenario with  run: "scenario-id"  instead of next.
   Sources: Mayo Clinic first aid pages, Cleveland Clinic (stitches),
   American College of Emergency Physicians warning signs. Checked Nov 2026.
   ====================================================================== */

/* ============================== H1. Is this an emergency? ============================== */
{
  id: "emergency", title: "Is this an emergency?", group: "health", icon: "aid",
  keywords: ["emergency", "hurt", "sick", "911", "pain", "breathing", "chest", "bleeding", "injury", "doctor"],
  start: "signs",
  nodes: {
    signs: { t: "ask", text: "Is any of this happening?",
      more: ["Trouble breathing, or short of breath",
             "Chest pain or pressure lasting more than 2 minutes",
             "Fainting, or sudden dizziness or weakness",
             "Trouble speaking, or a sudden change in vision",
             "Confusion, or very hard to stay awake",
             "Bleeding that won't stop",
             "Sudden, severe pain",
             "Coughing up or throwing up blood"],
      calm: "If you're not sure, choose yes. Getting someone when you weren't sure is never wrong.",
      opts: [
        { label: "Yes, at least one", next: "call" },
        { label: "None of those", next: "what" }
      ] },
    call: { t: "step",
      danger: true,
      text: "This needs help right away.",
      more: ["Someone home? Call out loudly, or go get them.", "Otherwise, call someone on your list."],
      call: ["people", "alert"],
      calm: "Help is the next thing. You're doing the right thing.",
      next: "call_got" },
    call_got: { t: "ask",
      text: "Did you get someone?",
      opts: [{"label": "Yes", "next": "call_them"}, {"label": "No, I couldn't reach anyone", "next": "call_911"}] },
    call_them: { t: "end",
      text: "Let them take it from here.",
      more: ["Tell them what's happening.", "They'll decide whether to call 911."],
      calm: "You got help. That's exactly right." },
    call_911: { t: "end",
      danger: true,
      level: "911",
      text: "Call 911.",
      more: ["Say what's happening and where you are.", "Stay on the phone and do what they tell you.", "If you have a medical note in My info, show it to the paramedics."],
      call: ["911", "alert", "mednote"] },
    what: { t: "ask", text: "What happened?",
      opts: [
        { label: "A cut or scrape", run: "cut" },
        { label: "A burn", run: "burn" },
        { label: "I fell or hit my head", run: "head" },
        { label: "I twisted an ankle or wrist", run: "sprain" },
        { label: "A nosebleed", run: "nosebleed" },
        { label: "A bee sting or allergic reaction", run: "sting" },
        { label: "I feel sick", run: "sick" },
        { label: "Something else", next: "other" }
      ] },
    other: { t: "end", level: "doctor", text: "Not sure? Let someone know, and call the doctor's office.",
      more: ["Someone on your list can help you decide.",
             "The doctor's office can tell you whether to come in, go to urgent care, or look after it at home.",
             "If it gets worse, or any of the warning signs start, get help right away."],
      call: ["people", "doctor"] }
  },
  practice: [
    { q: "You've had a heavy feeling in your chest for a few minutes and you feel short of breath. What do you do?",
      choices: [
        { text: "Get someone right away. If I can't reach anyone, call 911", r: "right", fb: "Yes. Chest pain with trouble breathing needs help right away. Get someone first; 911 if no one's there." },
        { text: "Lie down and see if it passes", r: "never", fb: "Don't wait with chest pain or trouble breathing. Get someone right away." },
        { text: "Call the doctor's office for an appointment", r: "not", fb: "This can't wait for an appointment. Get someone right away." }
      ] },
    { q: "Something feels wrong, and you're not sure how serious it is. What's the best choice?",
      choices: [
        { text: "Get someone at home, or call someone on my list", r: "right", fb: "Yes. They can help you decide what to do, including whether to call 911." },
        { text: "Call 911 right away", r: "notfirst", fb: "Get someone first. If you can't reach anyone and it's serious, then call 911." },
        { text: "Wait and say nothing", r: "not", fb: "Don't keep it to yourself. Getting someone is always right." }
      ] }
  ]
},

/* ============================== H2. Cut or scrape ============================== */
{
  id: "cut", title: "Cut or scrape", group: "health", icon: "bandage",
  keywords: ["cut", "scrape", "bleeding", "blood", "bandage", "band-aid", "bactine", "knife", "stitches", "wound"],
  start: "spurt",
  nodes: {
    spurt: { t: "ask", text: "Is blood spurting out, or soaking through a cloth fast?",
      opts: [ { label: "Yes", next: "sos" }, { label: "No", next: "loop" } ] },
    loop: { t: "step", text: "Let someone know right away.",
      more: ["Hold a clean cloth on the cut while you do.",
             "If someone's home, go tell them. If not, call or text someone on your list.",
             "They can help, and give you a second opinion."],
      call: ["people"],
      calm: "You don't have to figure this out on your own.",
      next: "press" },
    sos: { t: "step",
      danger: true,
      text: "Press hard on it, and get help right now.",
      more: ["Use a cloth or towel. Don't lift it to look.", "Someone home? Call out loudly, or go get them.", "Otherwise, call someone on your list."],
      call: ["people", "alert"],
      calm: "Help is the next thing. You're doing the right thing.",
      next: "sos_got" },
    sos_got: { t: "ask",
      text: "Did you get someone?",
      opts: [{"label": "Yes", "next": "sos_them"}, {"label": "No, I couldn't reach anyone", "next": "sos_911"}] },
    sos_them: { t: "end",
      text: "Let them take it from here. Keep pressing.",
      more: ["They'll decide whether to call 911."],
      calm: "You got help. That's exactly right." },
    sos_911: { t: "end",
      danger: true,
      level: "911",
      text: "Call 911. Keep pressing hard on the cut.",
      more: ["Then tap Text everyone."],
      call: ["911", "alert"] },
    press: { t: "step", text: "Press on it with a clean cloth or bandage.",
      more: ["Raise it above your heart if you can.", "Keep pressing for 10 minutes without lifting to check."],
      calm: "Most cuts look worse than they are. Pressing is all it needs right now.",
      why: "Steady pressure lets the blood clot. Lifting to peek starts it again.",
      next: "stopped" },
    stopped: { t: "ask", text: "After 10 minutes, has it stopped, or slowed down a lot?",
      opts: [ { label: "Yes", next: "check" }, { label: "No", next: "press2" } ] },
    press2: { t: "step", text: "Press for 5 more minutes.", next: "stopped2" },
    stopped2: { t: "ask", text: "Has it stopped, or slowed down a lot, now?",
      opts: [ { label: "Yes", next: "check" }, { label: "No", next: "uc" } ] },
    uc: { t: "end", level: "doctor", text: "Go to urgent care or the emergency room. Keep pressing on the way.",
      more: ["Don't drive yourself. Ask someone on your list, or take an Uber."],
      call: ["come", "urgentcare", "uber"] },
    check: { t: "ask", text: "Does any of this fit?",
      more: ["It's deep, or the edges gape open",
             "It's from a bite, by an animal or a person",
             "It's from something rusty or dirty, or there's dirt you can't get out",
             "It's on your face, or over a joint like a knuckle or knee"],
      opts: [ { label: "Yes", next: "seen" }, { label: "No, it's a small cut or scrape", next: "wash" } ] },
    seen: { t: "end", level: "doctor", text: "Get it checked today, at the doctor's office or urgent care.",
      more: ["Cuts that need stitches do best within about 24 hours.",
             "A dirty cut may need a tetanus shot.",
             "Let someone on your list know. They can help you get there."],
      call: ["doctor", "urgentcare", "people"] },
    wash: { t: "step", text: "Wash your hands, then rinse the cut under running water.",
      more: ["Wash around it with soap, but keep soap out of the cut."], next: "cover" },
    cover: { t: "step", text: "Put on antiseptic or antibiotic ointment, then a bandage.",
      more: ["Something like Bactine or Neosporin, then a Band-Aid.",
             "Change the bandage every day, or whenever it gets wet or dirty."],
      home: "first_aid", next: "watch" },
    watch: { t: "end", level: "self", text: "That's it. Keep an eye on it for a few days.",
      more: ["Getting redder, warmer, more swollen, more painful, or leaking? Call the doctor's office.",
             "Keep whoever you told posted if it gets worse."],
      calm: "You took care of it yourself.",
      call: ["doctor"] }
  },
  practice: [
    { q: "You cut your finger chopping vegetables. It's bleeding, but not spurting. What do you do first?",
      choices: [
        { text: "Press on it with a clean cloth for 10 minutes", r: "right", fb: "Yes. Steady pressure stops most cuts." },
        { text: "Put a Band-Aid on right away", r: "notfirst", fb: "Stop the bleeding first. A bandage won't stay on while it's still bleeding." },
        { text: "Lift the cloth every minute to check", r: "not", fb: "Lifting it restarts the bleeding. Hold it for the full 10 minutes." },
        { text: "Pour hydrogen peroxide on it", r: "not", fb: "Plain running water is better. Peroxide can irritate a cut." }
      ] },
    { q: "You've pressed on a cut for 15 minutes and it's still bleeding a lot. What now?",
      choices: [
        { text: "Go to urgent care or the ER, keep pressing, and have someone drive", r: "right", fb: "Yes. A cut that keeps bleeding needs a doctor." },
        { text: "Put a bandage on and wait", r: "not", fb: "If 15 minutes of pressure hasn't slowed it, get it seen today." },
        { text: "Drive myself to urgent care", r: "not", fb: "Keep both hands free to press. Ask someone on your list, or take an Uber." }
      ] }
  ]
},

/* ============================== H3. Burn ============================== */
{
  id: "burn", title: "Burn", group: "health", icon: "burn",
  keywords: ["burn", "burned", "burnt", "hot", "stove", "oven", "iron", "blister", "scald"],
  start: "serious",
  nodes: {
    serious: { t: "ask", text: "Does any of this fit?",
      more: ["Bigger than 3 inches across, about the width of your palm",
             "The skin looks white, brown, black, leathery or charred",
             "It goes all the way around an arm, leg or finger",
             "It's from electricity or a chemical"],
      opts: [ { label: "Yes", next: "sos" }, { label: "No", next: "loop" } ] },
    loop: { t: "step", text: "Let someone know right away.",
      more: ["Run cool water over the burn while you do, if you can.",
             "If someone's home, go tell them. If not, call or text someone on your list.",
             "They can help, and give you a second opinion."],
      call: ["people"],
      calm: "You don't have to figure this out on your own.",
      next: "where" },
    sos: { t: "step",
      danger: true,
      text: "This burn needs help right away.",
      more: ["Don't put ice, butter or cream on it.", "Cover it loosely with a clean cloth.", "Someone home? Call out loudly, or go get them.", "Otherwise, call someone on your list."],
      call: ["people", "alert"],
      calm: "Help is the next thing. You're doing the right thing.",
      next: "sos_got" },
    sos_got: { t: "ask",
      text: "Did you get someone?",
      opts: [{"label": "Yes", "next": "sos_them"}, {"label": "No, I couldn't reach anyone", "next": "sos_911"}] },
    sos_them: { t: "end",
      text: "Let them take it from here.",
      more: ["They may take you to the emergency room.", "They'll decide whether to call 911."],
      calm: "You got help. That's exactly right." },
    sos_911: { t: "end",
      danger: true,
      level: "911",
      text: "Call 911.",
      more: ["Take off rings or anything tight near it, unless it's stuck.", "Then tap Text everyone."],
      call: ["911", "alert"] },
    where: { t: "ask", text: "Is it on your face, hands, feet or a joint, or is it blistering a lot?",
      opts: [ { label: "Yes", next: "coolB" }, { label: "No", next: "coolA" } ] },
    coolA: { t: "step", text: "Run cool water, not cold, over it for about 10 minutes.",
      more: ["No ice, butter, toothpaste or oil."],
      calm: "Cool water is doing the work. Just keep it there.",
      why: "Cooling stops the burn from going deeper and eases the pain. Ice is too cold and can hurt the skin.",
      next: "ringsA" },
    ringsA: { t: "step", text: "Take off rings or anything tight near the burn.",
      more: ["Burns swell, and that makes it harder later."], next: "coverA" },
    coverA: { t: "step", text: "Cover it loosely with a clean bandage.",
      more: ["Don't pop any blisters. They protect the skin underneath.",
             "A pain reliever like Tylenol or Advil can help. Follow the label."],
      home: "first_aid", next: "watchA" },
    watchA: { t: "end", level: "self", text: "Keep an eye on it.",
      more: ["Redder, more swollen, leaking or more painful after a day or two? Call the doctor's office.",
             "Have whoever you told take a look at it too."],
      call: ["doctor", "people"] },
    coolB: { t: "step", text: "Cool it first: cool water, not cold, for about 10 minutes.",
      more: ["On your face? Use a cool, wet cloth instead.", "No ice, butter, toothpaste or oil."],
      calm: "Cool water is doing the work. Just keep it there.",
      next: "coverB" },
    coverB: { t: "step", text: "Take off anything tight nearby, and cover it loosely with a clean bandage.",
      more: ["Don't pop any blisters."], home: "first_aid", next: "checkB" },
    checkB: { t: "end", level: "doctor", text: "Get it checked today, at the doctor's office or urgent care.",
      more: ["Burns on the face, hands, feet or joints, or with big blisters, should be looked at.",
             "Let someone on your list know. They can help you get there."],
      call: ["doctor", "urgentcare", "people"] }
  },
  practice: [
    { q: "You brush your arm against a hot oven rack. The spot is small, red and stings. What do you do first?",
      choices: [
        { text: "Run cool water over it for about 10 minutes", r: "right", fb: "Yes. Cool water stops the burn from going deeper." },
        { text: "Put ice on it", r: "not", fb: "Ice is too cold and can hurt the skin more. Use cool running water." },
        { text: "Put butter on it", r: "not", fb: "Butter holds the heat in. Cool running water instead." },
        { text: "Cover it with a bandage", r: "notfirst", fb: "Cool it first for about 10 minutes, then cover it loosely." }
      ] },
    { q: "A small burn has formed a blister. What do you do with it?",
      choices: [
        { text: "Leave it alone and cover it loosely", r: "right", fb: "Yes. The blister protects the skin underneath." },
        { text: "Pop it so it heals faster", r: "not", fb: "Popping it lets germs in. Leave it and cover it loosely." }
      ] }
  ]
},

/* ============================== H4. Head ============================== */
{
  id: "head", title: "Fell or hit my head", group: "health", icon: "head",
  keywords: ["head", "fell", "fall", "bump", "concussion", "hit", "dizzy", "headache"],
  start: "sos",
  nodes: {
    sos: { t: "ask", text: "Is any of this happening?",
      more: ["You passed out, even for a few seconds",
             "Bleeding a lot from the head, or blood or fluid from the nose or ears",
             "Confusion that's getting worse, or slurred speech",
             "Can't keep your balance, or an arm or leg is weak",
             "A seizure",
             "It was a big fall, like from a ladder or down stairs, or a car crash"],
      opts: [ { label: "Yes", next: "call" }, { label: "No", next: "loop" } ] },
    loop: { t: "step", text: "Let someone know right away that you hit your head.",
      more: ["If someone's home, go tell them.",
             "If not, call or text someone on your list.",
             "A second opinion helps, and they can help you."],
      call: ["people"],
      calm: "You don't have to figure this out on your own.",
      next: "signs" },
    call: { t: "step",
      danger: true,
      text: "Stay still, and get help right now.",
      more: ["Try not to move around.", "Someone home? Call out loudly, or go get them.", "Otherwise, call someone on your list."],
      call: ["people", "alert"],
      calm: "Help is the next thing. You're doing the right thing.",
      next: "call_got" },
    call_got: { t: "ask",
      text: "Did you get someone?",
      opts: [{"label": "Yes", "next": "call_them"}, {"label": "No, I couldn't reach anyone", "next": "call_911"}] },
    call_them: { t: "end",
      text: "Let them take it from here.",
      more: ["Tell them how you hit your head.", "They'll decide whether to call 911."],
      calm: "You got help. That's exactly right." },
    call_911: { t: "end",
      danger: true,
      level: "911",
      text: "Call 911. Stay still until help comes.",
      more: ["Then tap Text everyone."],
      call: ["911", "alert"] },
    signs: { t: "ask", text: "Do you have any of these?",
      more: ["A headache that won't go away",
             "Feeling sick, or throwing up",
             "Blurry vision, or ringing in your ears",
             "Dizzy, or trouble concentrating or remembering"],
      opts: [ { label: "Yes", next: "seen" }, { label: "No", next: "rest" } ] },
    seen: { t: "end", level: "doctor", text: "Get checked today.",
      more: ["Call the doctor's office, or go to urgent care.",
             "Don't drive yourself. Ask someone on your list to take you."],
      call: ["doctor", "urgentcare", "come"] },
    rest: { t: "step", text: "Sit down and rest for a while.",
      more: ["Hold something cold, wrapped in a cloth, on any bump, for 15 to 20 minutes."],
      calm: "A bump without those signs is usually fine. Resting is the right thing.",
      next: "tell" },
    tell: { t: "end", level: "self", text: "Rest, and have someone check on you.",
      more: ["Ask whoever you told to check on you over the next day.",
             "If a headache gets worse, you throw up, or you feel confused or very sleepy, get checked right away."],
      call: ["people"] }
  },
  practice: [
    { q: "You bump your head on a cabinet. An hour later you throw up, and your headache is getting worse. What do you do?",
      choices: [
        { text: "Get checked today, and have someone take me", r: "right", fb: "Yes. Throwing up and a worsening headache after a bump should be checked." },
        { text: "Sleep it off", r: "not", fb: "Those are signs to get checked today. Let someone on your list know and go." },
        { text: "Drive myself to urgent care", r: "not", fb: "Don't drive after a head injury with symptoms. Ask someone to take you." }
      ] }
  ]
},

/* ============================== H5. Sprain ============================== */
{
  id: "sprain", title: "Twisted ankle or wrist", group: "health", icon: "foot",
  keywords: ["sprain", "twisted", "ankle", "wrist", "knee", "swollen", "ice", "rolled"],
  start: "loop",
  nodes: {
    loop: { t: "step", text: "First, let someone know right away.",
      more: ["If someone's home, go tell them.",
             "If not, call or text someone on your list.",
             "A second opinion helps, and they can help you."],
      call: ["people"],
      calm: "You don't have to figure this out on your own.",
      next: "serious" },
    serious: { t: "ask", text: "Does any of this fit?",
      more: ["You can't put any weight on it, or can't use it at all",
             "It feels numb or wobbly",
             "The pain is right on the bone",
             "It looks bent or out of shape"],
      opts: [ { label: "Yes", next: "seen" }, { label: "No", next: "rest" } ] },
    seen: { t: "end", level: "doctor", text: "Get it checked today at urgent care.",
      more: ["Try not to walk on it or use it.", "Ask someone on your list to take you."],
      call: ["urgentcare", "come"] },
    rest: { t: "step", text: "Rest it. Stay off it as much as you can.",
      calm: "Sprains hurt, but they heal. Resting is the first part of the fix.",
      next: "ice" },
    ice: { t: "step", text: "Put ice on it for 15 to 20 minutes.",
      more: ["Wrap the ice in a thin towel first, never right on your skin.",
             "Do it a few times a day for the first 2 days."],
      next: "wrap" },
    wrap: { t: "step", text: "Wrap it with an elastic bandage, snug but not tight.",
      more: ["If your toes or fingers tingle or turn pale, loosen it."],
      home: "first_aid", next: "raise" },
    raise: { t: "step", text: "Keep it raised, above your heart if you can.",
      more: ["Prop it up on pillows."], next: "end" },
    end: { t: "end", level: "self", text: "Give it a few days.",
      more: ["Not better after 2 or 3 days? Call the doctor's office."],
      call: ["doctor", "people"] }
  },
  practice: [
    { q: "You twist your ankle stepping off a curb. You can walk on it, but it's sore and puffy. What do you do?",
      choices: [
        { text: "Rest it, ice it for 15 to 20 minutes, wrap it, and raise it", r: "right", fb: "Yes. Rest, ice, wrap, raise." },
        { text: "Keep walking to work it out", r: "not", fb: "Walking on it can make it worse. Rest it first." },
        { text: "Keep ice on it for an hour", r: "not", fb: "No more than 20 minutes at a time, with a towel between the ice and your skin." }
      ] },
    { q: "You can't put any weight on your ankle at all. What do you do?",
      choices: [
        { text: "Get it checked today at urgent care", r: "right", fb: "Yes. Not being able to stand on it needs a doctor." },
        { text: "Wait a few days and see", r: "not", fb: "If you can't put any weight on it, get it checked today." }
      ] }
  ]
},

/* ============================== H6. Nosebleed ============================== */
{
  id: "nosebleed", title: "Nosebleed", group: "health", icon: "nose",
  keywords: ["nose", "nosebleed", "bleeding", "blood"],
  start: "cause",
  nodes: {
    cause: { t: "ask", text: "Did it start after a fall or a hit to the face, or do you feel faint?",
      opts: [ { label: "Yes", next: "er" }, { label: "No", next: "loop" } ] },
    loop: { t: "step", text: "Let someone know right away.",
      more: ["Sit, lean forward and pinch your nose while you do.",
             "If someone's home, go tell them. If not, call or text someone on your list.",
             "They can help, and give you a second opinion."],
      call: ["people"],
      calm: "You don't have to figure this out on your own.",
      next: "sit" },
    sit: { t: "step", text: "Sit up and lean forward.",
      more: ["Not back. Leaning back makes blood run down your throat."],
      calm: "Nosebleeds look like a lot of blood, but they're rarely serious.",
      next: "pinch" },
    pinch: { t: "step", text: "Pinch the soft part of your nose shut and breathe through your mouth.",
      more: ["Keep pinching for 10 to 15 minutes.", "Don't let go to check."],
      why: "Steady pressure lets it clot. Letting go to peek starts it again.",
      next: "q1" },
    q1: { t: "ask", text: "Has it stopped?",
      opts: [ { label: "Yes", next: "after" }, { label: "No", next: "again" } ] },
    again: { t: "step", text: "Pinch again for another 15 minutes.", next: "q2" },
    q2: { t: "ask", text: "Has it stopped now?",
      opts: [ { label: "Yes", next: "after" }, { label: "No", next: "er" } ] },
    er: { t: "step",
      danger: true,
      text: "Keep pinching, and get help now.",
      more: ["Someone home? Call out loudly, or go get them.", "Otherwise, call someone on your list."],
      call: ["people", "alert"],
      calm: "Help is the next thing. You're doing the right thing.",
      next: "er_got" },
    er_got: { t: "ask",
      text: "Did you get someone?",
      opts: [{"label": "Yes", "next": "er_them"}, {"label": "No, I couldn't reach anyone", "next": "er_911"}] },
    er_them: { t: "end",
      text: "Have them take you to the emergency room.",
      more: ["Keep pinching on the way.", "They'll decide whether to call 911."],
      calm: "You got help. That's exactly right." },
    er_911: { t: "end",
      danger: true,
      level: "911",
      text: "Call 911.",
      more: ["Keep pinching.", "Then tap Text everyone."],
      call: ["911", "alert"] },
    after: { t: "end", level: "self", text: "Take it easy for a few hours.",
      more: ["Don't blow or pick your nose, and don't bend over or lift heavy things.",
             "Getting nosebleeds often? Mention it to the doctor."] }
  },
  practice: [
    { q: "Your nose starts bleeding while you're watching TV. What do you do?",
      choices: [
        { text: "Sit up, lean forward, and pinch my nose for 10 to 15 minutes", r: "right", fb: "Yes. Lean forward, pinch, and don't let go to check." },
        { text: "Tip my head back", r: "not", fb: "That sends blood down your throat. Lean forward instead." },
        { text: "Let go every minute to see if it's stopped", r: "not", fb: "Peeking starts it again. Hold for the full 10 to 15 minutes." }
      ] }
  ]
},

/* ============================== H7. Sting or allergic reaction ============================== */
{
  id: "sting", title: "Bee sting or allergic reaction", group: "health", icon: "bee",
  keywords: ["bee", "sting", "wasp", "allergic", "allergy", "swelling", "hives", "epipen", "bug", "bite"],
  start: "signs",
  nodes: {
    signs: { t: "ask", text: "Is any of this happening?",
      more: ["Trouble breathing",
             "Swelling of the lips, face, eyelids or throat",
             "Dizzy or faint",
             "Hives spreading over your body",
             "Feeling sick to your stomach, or throwing up"],
      calm: "If you're not sure, choose yes.",
      opts: [ { label: "Yes", next: "sos" }, { label: "No, just a sore spot", next: "loop" } ] },
    loop: { t: "step", text: "Let someone know right away that you got stung.",
      more: ["If someone's home, go tell them.",
             "If not, call or text someone on your list.",
             "A second opinion helps, and they can help you."],
      call: ["people"],
      calm: "You don't have to figure this out on your own.",
      next: "move" },
    sos: { t: "step",
      danger: true,
      text: "This needs help right away.",
      more: ["If you have an EpiPen, use it now, the way you were shown.", "Loosen tight clothes. Don't drink anything.", "Someone home? Call out loudly, or go get them.", "Otherwise, call someone on your list."],
      call: ["people", "alert"],
      calm: "Help is the next thing. You're doing the right thing.",
      next: "sos_got" },
    sos_got: { t: "ask",
      text: "Did you get someone?",
      opts: [{"label": "Yes", "next": "sos_them"}, {"label": "No, I couldn't reach anyone", "next": "sos_911"}] },
    sos_them: { t: "end",
      text: "Let them take it from here.",
      more: ["They'll decide whether to call 911."],
      calm: "You got help. That's exactly right." },
    sos_911: { t: "end",
      danger: true,
      level: "911",
      text: "Call 911.",
      more: ["Stay where you are until help comes.", "Then tap Text everyone."],
      call: ["911", "alert", "mednote"] },
    move: { t: "step", text: "Move away from the bugs. Then get the stinger out.",
      more: ["Scrape it out sideways with a fingernail or the edge of a card."], next: "wash" },
    wash: { t: "step", text: "Wash it with soap and water.", next: "cold" },
    cold: { t: "step", text: "Hold something cold on it for 10 to 20 minutes.",
      more: ["Ice wrapped in a cloth, or a cold, wet cloth.", "On an arm or leg? Raise it."], next: "end" },
    end: { t: "end", level: "self", text: "Ease the itch and keep an eye on it.",
      more: ["Hydrocortisone cream or calamine lotion helps the itch.",
             "Swelling getting bigger, signs of infection, or feeling unwell? Call the doctor's office.",
             "Trouble breathing or swelling in your face later? Get help right away."],
      call: ["doctor"] }
  },
  practice: [
    { q: "A bee stings you. A few minutes later your lips start to swell. What do you do?",
      choices: [
        { text: "Get someone right away. If I can't reach anyone, call 911", r: "right", fb: "Yes. Swelling of the lips or face can be a serious allergic reaction. Get help right away." },
        { text: "Wait and see if it goes down", r: "never", fb: "Swelling of the lips or face can affect breathing. Get help right away." },
        { text: "Put ice on the sting and lie down", r: "not", fb: "With swelling of the lips, get help first." }
      ] },
    { q: "A bee stings your arm. It's red and sore, and that's all. What do you do?",
      choices: [
        { text: "Get the stinger out, wash it, and hold something cold on it", r: "right", fb: "Yes. That's all a normal sting needs." },
        { text: "Call 911", r: "not", fb: "A sore red spot is a normal sting. Let someone know, and look after it yourself." }
      ] }
  ]
},

/* ============================== H8. I feel sick ============================== */
{
  id: "sick", title: "I feel sick", group: "health", icon: "thermo",
  keywords: ["sick", "fever", "flu", "stomach", "vomit", "throwing up", "diarrhea", "temperature", "cold", "ill"],
  start: "sos",
  nodes: {
    sos: { t: "ask", text: "Is any of this happening?",
      more: ["Trouble breathing", "Chest pain or pressure", "Confusion, or very hard to stay awake",
             "Throwing up blood", "A seizure"],
      opts: [ { label: "Yes", next: "call" }, { label: "No", next: "loop" } ] },
    loop: { t: "step", text: "Let someone know right away that you're not feeling well.",
      more: ["If someone's home, go tell them.",
             "If not, call or text someone on your list.",
             "A second opinion helps, and they can help you."],
      call: ["people"],
      calm: "You don't have to figure this out on your own.",
      next: "doc" },
    call: { t: "step",
      danger: true,
      text: "This needs help right away.",
      more: ["Someone home? Call out loudly, or go get them.", "Otherwise, call someone on your list."],
      call: ["people", "alert"],
      calm: "Help is the next thing. You're doing the right thing.",
      next: "call_got" },
    call_got: { t: "ask",
      text: "Did you get someone?",
      opts: [{"label": "Yes", "next": "call_them"}, {"label": "No, I couldn't reach anyone", "next": "call_911"}] },
    call_them: { t: "end",
      text: "Let them take it from here.",
      more: ["Tell them how you're feeling.", "They'll decide whether to call 911."],
      calm: "You got help. That's exactly right." },
    call_911: { t: "end",
      danger: true,
      level: "911",
      text: "Call 911.",
      more: ["If you have a medical note in My info, show it to the paramedics.", "Then tap Text everyone."],
      call: ["911", "alert", "mednote"] },
    doc: { t: "ask", text: "Does any of this fit?",
      more: ["A fever above 104°F",
             "A bad headache with a stiff neck, or a new rash",
             "Bad stomach pain",
             "You can't keep liquids down for 24 hours",
             "Throwing up or diarrhea for more than 2 days",
             "Very thirsty, dry mouth, dark or very little pee, or dizzy",
             "Blood in your poop",
             "Pain when you pee"],
      opts: [ { label: "Yes", next: "docend" }, { label: "No", next: "rest" } ] },
    docend: { t: "end", level: "doctor", text: "Call the doctor's office today.",
      more: ["If they're closed, go to urgent care.",
             "Let someone on your list know. They can help you get there."],
      call: ["doctor", "urgentcare", "people"] },
    rest: { t: "step", text: "Rest, and drink plenty of fluids.",
      more: ["Upset stomach? Small sips, often. Water or a sports drink.",
             "Wear light clothes. Use a light blanket if you have chills."],
      calm: "Most bugs pass in a few days. Rest is the medicine.",
      next: "temp" },
    temp: { t: "step", text: "If you have a thermometer, take your temperature.",
      more: ["100.4°F or higher is a fever.", "Above 104°F, call the doctor's office."], next: "meds" },
    meds: { t: "step", text: "A fever reducer like Tylenol or Advil can help.",
      more: ["Follow the dose on the label.",
             "If you take other medicines, ask the doctor or a pharmacist first."],
      next: "end" },
    end: { t: "end", level: "self", text: "Rest, and check how you feel.",
      more: ["Keep whoever you told posted on how you feel.",
             "If a warning sign shows up, or you're not getting better, call the doctor's office."],
      call: ["people", "doctor"] }
  },
  practice: [
    { q: "You have a stomach bug and haven't kept any water down since yesterday. What do you do?",
      choices: [
        { text: "Call the doctor's office today", r: "right", fb: "Yes. Not keeping liquids down for 24 hours can make you dehydrated." },
        { text: "Keep waiting it out", r: "not", fb: "After 24 hours without keeping liquids down, call the doctor's office." },
        { text: "Call 911", r: "not", fb: "This isn't a 911 call. Let someone know, and call the doctor's office." }
      ] },
    { q: "You have a fever of 100.8°F and feel achy, with no other warning signs. What do you do?",
      choices: [
        { text: "Rest, drink fluids, and let someone at home know", r: "right", fb: "Yes. Watch for warning signs, and call the doctor if they show up." },
        { text: "Go to the emergency room", r: "not", fb: "A mild fever on its own can be looked after at home. Watch for warning signs." }
      ] }
  ]
},

/* ============================== H9. When to let someone know ============================== */
{
  id: "tell-someone", title: "When to let someone know", group: "health", icon: "people",
  keywords: ["tell", "let someone know", "family", "help", "hurt", "sick", "mom", "dad"],
  start: "list",
  nodes: {
    list: { t: "end", text: "Let someone on your list know when:",
      more: ["You're hurt or not feeling well at all. They can help, and give a second opinion",
             "You called 911, or went to urgent care or the emergency room",
             "You need to see a doctor, or need someone to drive you",
             "You hit your head",
             "It still hurts, or it's worse, the next day",
             "You took medicine and aren't sure it was right",
             "You're not sure what to do. That's always a good reason."],
      calm: "Telling someone isn't making a fuss. It's how you make sure you're looked after.",
      call: ["people"] }
  },
  practice: [
    { q: "You treated a twisted ankle yourself. The next morning it's more swollen and hurts more. What do you do?",
      choices: [
        { text: "Let someone on my list know, and call the doctor's office", r: "right", fb: "Yes. Worse the next day is a reason to tell someone and get it checked." },
        { text: "Keep it to myself and wait", r: "not", fb: "Getting worse is a good reason to let someone know." }
      ] },
    { q: "You twist your wrist. It's sore but you can move it. What's the first thing to do?",
      choices: [
        { text: "Let someone know what happened", r: "right", fb: "Yes. A second opinion helps, and they can help you look after it." },
        { text: "Ice it and don't mention it", r: "notfirst", fb: "Icing is good, but let someone know first. They can help you decide what it needs." },
        { text: "Look it up online and decide myself", r: "not", fb: "Let someone know instead. A person who can see it is a better second opinion." }
      ] },
    { q: "You feel sick, but you're not sure it's bad enough to mention. What do you do?",
      choices: [
        { text: "Let someone know anyway", r: "right", fb: "Yes. Not being sure is a good reason to tell someone." },
        { text: "Don't bother anyone", r: "not", fb: "You're not bothering anyone. Telling them is how they help." }
      ] }
  ]
}

];

/* ------------------------------------------------------------------
   My Home: the walkthrough items. "do" lists what she does with each:
   photo = take a picture, practice = try it once, look = just learn where it is.
   ------------------------------------------------------------------ */
var HOME_GROUPS = [
  { id: "water", title: "Water" },
  { id: "power", title: "Electricity" },
  { id: "fire", title: "Fire, smoke and air" },
  { id: "gas", title: "Gas" },
  { id: "out", title: "Getting out and getting in" },
  { id: "supplies", title: "Supplies" }
];
var HOME_ITEMS = [
  { id: "main_water", group: "water", title: "Main water shutoff", do: ["photo", "practice"],
    how: "Turns off water to the whole house. Often in the basement, utility room, or near the water heater. Turn it partway to the right and back, so you know how it feels." },
  { id: "kitchen_valves", group: "water", title: "Kitchen sink valves", do: ["photo", "practice"],
    how: "Under the kitchen sink, one for hot and one for cold. Right to close." },
  { id: "bath_valves", group: "water", title: "Bathroom sink valves", do: ["photo", "practice"],
    how: "Under each bathroom sink. Note which bathroom in the note." },
  { id: "toilet_valves", group: "water", title: "Toilet valves", do: ["photo", "practice"],
    how: "On the wall behind each toilet, near the floor. Turn it to the right once to close it, then back." },
  { id: "washer_valves", group: "water", title: "Washing machine valves", do: ["photo"],
    how: "Behind the washer, where the hoses connect." },
  { id: "water_heater", group: "water", title: "Water heater", do: ["look"],
    how: "Just know where it is." },

  { id: "breaker_panel", group: "power", title: "Breaker panel", do: ["photo"],
    how: "The metal box of switches. Take one photo of the door and one of the switches inside." },
  { id: "breaker_labels", group: "power", title: "Breaker labels", do: ["photo"],
    how: "Each switch should say which room it controls. Fix any blank or wrong labels." },
  { id: "breaker_reset", group: "power", title: "What a tripped breaker looks like", do: ["look"],
    how: "With someone there, see what a tripped switch looks like, so you can describe it. When it happens for real, let someone at home reset it." },
  { id: "main_breaker", group: "power", title: "Main breaker", do: ["look"],
    how: "The big switch at the top. Leave this one to someone else." },
  { id: "flashlights", group: "power", title: "Flashlights", do: ["photo"],
    how: "Where they live. Check the batteries." },

  { id: "smoke_alarms", group: "fire", title: "Smoke alarms", do: ["photo"],
    how: "Every one in the house. Say which room in the note." },
  { id: "co_alarms", group: "fire", title: "Carbon monoxide alarms", do: ["photo"],
    how: "Every one, including combined smoke and CO alarms." },
  { id: "alarm_sounds", group: "fire", title: "What the alarms sound like", do: ["practice"],
    how: "Press the test button on one smoke alarm and one CO alarm so you know both sounds." },
  { id: "stove_controls", group: "fire", title: "Turning off the stove and oven", do: ["practice"],
    how: "Turn each burner and the oven off, so the knobs feel familiar." },
  { id: "pan_lid", group: "fire", title: "The pan lid by the stove", do: ["photo"],
    how: "Pick one lid that always stays within reach of the stove. A baking sheet works too." },
  { id: "stove_fan", group: "fire", title: "Stove fan switch", do: ["practice"],
    how: "Turn it on and off once." },
  { id: "oven_mitts", group: "fire", title: "Oven mitts", do: ["photo"], how: "Where they live." },
  { id: "extinguisher", group: "fire", title: "Fire extinguisher", do: ["look"],
    how: "Know where it is. The app tells you to use a lid or get out, not this." },

  { id: "gas_meter", group: "gas", title: "Gas meter", do: ["look"],
    how: "Outside the house. Look only: if you smell gas, your job is to leave, not to turn anything." },
  { id: "gas_appliances", group: "gas", title: "What uses gas", do: ["look"],
    how: "Stove, furnace, water heater, dryer. Helps you know where a smell might come from." },

  { id: "ways_out", group: "out", title: "Two ways out", do: ["practice"],
    how: "Walk two ways out of your bedroom, and two ways out of the house." },
  { id: "meeting_spot", group: "out", title: "Outside meeting spot", do: ["photo"],
    how: "Somewhere fixed, like the mailbox or a neighbor's tree, where everyone meets after getting out." },
  { id: "ways_in", group: "out", title: "Garage keypad and other ways in", do: ["photo", "practice"],
    how: "Practice opening the garage with the keypad. Photograph the keypad and doors only, and keep the code out of photos and notes." },
  { id: "neighbors", group: "out", title: "Neighbors you can go to", do: ["look"],
    how: "Which houses you could go to in an emergency." },

  { id: "plunger", group: "supplies", title: "Plunger", do: ["photo"], how: "One per bathroom if possible." },
  { id: "towels", group: "supplies", title: "Old towels", do: ["photo"], how: "For spills and floods." },
  { id: "gloves", group: "supplies", title: "Rubber gloves", do: ["photo"], how: "Where they live." },
  { id: "first_aid", group: "supplies", title: "First aid kit", do: ["photo"], how: "Where it lives." },
  { id: "batteries", group: "supplies", title: "Spare batteries", do: ["photo"], how: "For flashlights." },
  { id: "charger", group: "supplies", title: "Phone charger or power bank", do: ["photo"],
    how: "One you can grab on your way out." }
];

/* Services shown in My Info. Numbers checked October 2026. */
var SERVICES = [
  { id: "novec", name: "NOVEC (power outages)", phone: "703-335-0500" },
  { id: "gas", name: "Washington Gas emergency (option 1)", phone: "844-927-4427" }
];

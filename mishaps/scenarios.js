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
             "come", "novec", "gas", "uber", "whereami", "sendloc", "directions"
     danger  true for get-out / call-911 steps (stronger styling)

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
      more: ["Close doors behind you if you can.",
             "Smoke on the way? Stay low and go under it.",
             "A closed door feels hot? Don't open it. Use another way out."],
      home: "meeting_spot",
      calm: "Your only job right now is to get outside. Everything else can wait.",
      why: "Smoke rises, so the cleaner air is near the floor. A fire can fill a home in a couple of minutes.",
      next: "call911" },
    call911: { t: "step", danger: true, text: "Once you're outside, call 911.",
      more: ["Say: “There's a fire at my house and I'm outside.”", "Then call someone on your list."],
      call: ["911", "people"],
      calm: "You did exactly the right thing. Firefighters handle the rest.",
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
        { text: "Get out, staying low under the smoke, then call 911", r: "right", fb: "Yes. Getting out comes first, and the cleaner air is low." },
        { text: "Call 911 from inside", r: "notfirst", fb: "Call from outside. Every second inside counts." },
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
      more: ["Close the kitchen door behind you if you can.", "Don't go back for anything."],
      calm: "Leaving is the brave choice here. Firefighters are fast.",
      next: "call911" },
    call911: { t: "step", danger: true, text: "Once you're outside, call 911.",
      more: ["Then call someone on your list."],
      call: ["911", "people"], next: "stayout" },
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
      calm: "Gross, but not dangerous. Don't flush, and the water stops rising.",
      why: "Each flush adds more water, and it goes on the floor.",
      next: "rising" },
    rising: { t: "ask", text: "Is the water in the bowl still rising?",
      opts: [ { label: "Yes", next: "float" }, { label: "No", next: "wait" } ] },
    float: { t: "step", text: "Take the lid off the tank behind the bowl. Lift the floating part up and hold it.",
      more: ["Set the lid down gently. It can crack.", "Holding the float up stops new water coming in."],
      home: "toilet_tank", next: "valve" },
    valve: { t: "step", text: "Turn the valve on the wall behind the toilet to the right until it stops.",
      home: "toilet_valves", next: "wait" },
    wait: { t: "step", text: "Wait a few minutes.",
      more: ["Often the water slowly goes down on its own."], next: "plunge" },
    plunge: { t: "step", text: "Plunge.",
      more: ["Put the plunger in the bowl so the cup covers the hole.",
             "Push down gently the first time.",
             "Then push and pull firmly about 10 times, keeping the seal."],
      home: "plunger",
      calm: "It often takes a few tries. That's normal.",
      next: "drained" },
    drained: { t: "ask", text: "Did the water drain away?",
      opts: [
        { label: "Yes", next: "refill" },
        { label: "No, after 2 or 3 tries", next: "help" }
      ] },
    refill: { t: "step", text: "Turn the wall valve back to the left. Let the tank fill, then flush once to check.",
      next: "clean" },
    help: { t: "step", text: "Stop here and get help.",
      more: ["Someone can talk you through it on the phone, or deal with it when they're home."],
      call: ["coach"],
      calm: "It's fine to stop here. It'll keep until then.",
      next: "clean" },
    clean: { t: "end", text: "Clean up.",
      more: ["Put towels down and wear rubber gloves if you have them.", "Wash your hands well afterward."],
      home: "gloves" }
  },
  practice: [
    { q: "You flush and the water rises toward the top of the bowl. What do you do?",
      choices: [
        { text: "Lift the float in the tank, then turn off the wall valve", r: "right", fb: "Yes. That stops new water from coming in." },
        { text: "Flush again to push it through", r: "not", fb: "Don't flush again. Each flush adds more water, and it ends up on the floor." },
        { text: "Start plunging right away", r: "notfirst", fb: "Plunging works best once the water stops rising. Float and valve first." },
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
             "See a wire down outside? Stay far away and call 911."],
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
      next: "panel" },
    panel: { t: "step", text: "Go to the breaker panel. Find the switch pointing a different way from the others.",
      home: ["breaker_panel", "breaker_labels"],
      calm: "This switch is made to be flipped. You can't hurt anything by doing it.",
      next: "flip" },
    flip: { t: "step", text: "Push that switch all the way to OFF, then back to ON.",
      home: "breaker_reset", next: "back" },
    back: { t: "ask", text: "Did the power come back?",
      opts: [
        { label: "Yes", next: "roomend" },
        { label: "No, it flips off again, or I smell burning", next: "roomhelp" }
      ] },
    roomend: { t: "end", text: "Power's back.", more: ["Plug things back in one at a time."] },
    roomhelp: { t: "end", text: "Leave it off and call someone on your list.",
      more: ["Smell burning? Get out and call 911."],
      call: ["people", "911"] }
  },
  practice: [
    { q: "The lights go out in your bedroom, but the hallway lights still work. What do you do?",
      choices: [
        { text: "Unplug what I was using, then reset the switch in the breaker panel", r: "right", fb: "Yes. One room out usually means a tripped breaker." },
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
    other: { t: "step", text: "Check the other ways in.",
      more: ["Back door, garage door, any door that's sometimes left unlocked.", "Don't climb through a window."],
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
      more: ["Don't call a locksmith you find online unless someone on your list says to. Some charge far more than they quote.",
             "If someone makes you feel unsafe, go into a busy store or call 911."],
      calm: "You've called for help. Now you just wait somewhere comfortable." }
  },
  practice: [
    { q: "You get home and realize your keys are inside. Nobody's home. What do you do first?",
      choices: [
        { text: "Check the other doors, then call down my list", r: "right", fb: "Yes. Another door may be open, and someone on your list can bring a key." },
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
             "If someone makes you feel unsafe, go into a busy store or call 911."] }
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
    delete: { t: "end", text: "Delete it.",
      more: ["For a text, you can forward it to 7726 (SPAM) first to report it.",
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
        { text: "Don't tap it. Delete it, or forward it to 7726 first", r: "right", fb: "Yes. Rushing you and asking for a small fee by link are classic scam signs." },
        { text: "Tap the link; it's only $1.99", r: "never", fb: "Never pay through a link in a surprise text. They want your card number, not the $1.99." },
        { text: "Reply STOP", r: "not", fb: "Replying tells scammers your number works. Just delete it." },
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
      more: ["Take your phone, and pets if they're right there.", "Don't stop to look for anything."],
      home: "meeting_spot",
      calm: "You can't smell this, so the alarm does the noticing for you. Just go outside.",
      why: "Carbon monoxide has no smell or color. Feeling fine doesn't mean the air is safe.",
      next: "call911" },
    call911: { t: "step", danger: true, text: "Once you're outside, call 911.",
      more: ["Say: “Our carbon monoxide alarm is going off and I'm outside.”",
             "Tell them if you have a headache, feel dizzy, or feel sick.",
             "Then call someone on your list."],
      call: ["911", "people"],
      calm: "Fresh air fixes it. You're doing exactly the right thing.",
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
        { text: "Go outside, then call 911", r: "right", fb: "Yes. You can't smell carbon monoxide, so trust the alarm." },
        { text: "Press the button to silence it and go back to bed", r: "never", fb: "Never ignore a carbon monoxide alarm. Feeling fine doesn't mean the air is safe. Go outside and call 911." },
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
             "Leave the front door open behind you."],
      calm: "That smell is there to warn you, and it worked. Just walk outside.",
      why: "A tiny spark from a switch or phone can light gas.",
      next: "far" },
    far: { t: "step", text: "Walk well away from the house.",
      more: ["The end of the driveway, or a neighbor's yard."], next: "call" },
    away: { t: "step", text: "Walk away from the smell.", next: "call" },
    call: { t: "step", danger: true, text: "Now call 911, then Washington Gas.",
      more: ["For Washington Gas, choose option 1 for a leak."],
      call: ["911", "gas"],
      calm: "You're safe out here. Now the calls.",
      next: "people" },
    people: { t: "step", text: "Then call someone on your list.", call: ["people"], next: "end" },
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
      call: ["come", "people"],
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
  id: "uber-match", title: "The car doesn't match the app", group: "out", icon: "plate",
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
      more: ["Go into a busy store and call 911. The Uber app has an emergency button too."],
      call: ["911"] }
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
    how: "On the wall behind each toilet, near the floor. Right to close." },
  { id: "toilet_tank", group: "water", title: "Inside a toilet tank", do: ["practice"],
    how: "Lift the tank lid and set it down gently. Find the float, and lift it once. That's what stops new water." },
  { id: "washer_valves", group: "water", title: "Washing machine valves", do: ["photo"],
    how: "Behind the washer, where the hoses connect." },
  { id: "water_heater", group: "water", title: "Water heater", do: ["look"],
    how: "Just know where it is." },

  { id: "breaker_panel", group: "power", title: "Breaker panel", do: ["photo"],
    how: "The metal box of switches. Take one photo of the door and one of the switches inside." },
  { id: "breaker_labels", group: "power", title: "Breaker labels", do: ["photo"],
    how: "Each switch should say which room it controls. Fix any blank or wrong labels." },
  { id: "breaker_reset", group: "power", title: "Resetting a breaker", do: ["practice"],
    how: "With someone there, switch off one bedroom's outlets so you see the position, then push it all the way off and back on." },
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
  { id: "ways_in", group: "out", title: "Other ways in", do: ["photo"],
    how: "Back door, garage keypad, a neighbor with a key. Photograph the doors only. Keep codes out of photos." },
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

// ─────────────────────────────────────────────────────────────
// Shared workout-plan template + helpers for the gym app.
// Loaded by both index.html and admin/index.html; exposes
// window.DEFAULT_PLAN (the seed/fallback plan) and
// window.slugifyUsername (username → Firestore-safe doc id).
// ─────────────────────────────────────────────────────────────
(function () {
const CZ = "#B388FF"; // Coach Z accent

const days = [
  {
    id: "mon",
    label: "MON",
    title: "Push",
    subtitle: "Chest · Triceps · Delts",
    color: "#FF4D1C",
    icon: "🔥",
    burn: "~520 kcal",
    cardioType: "Post-lift Zone 2",
    sections: [
      {
        name: "WARM-UP",
        badge: "8 min",
        items: [
          { label: "Light Barbell Bench Press", detail: "2 warm-up sets · 40–50% working weight", tip: "Groove the bar path, set scapular retraction. Rehearsal, not work." },
          { label: "Band Pull-Aparts", detail: "2×15", tip: "Arms straight, pull to chest level. Primes rear delts before pressing." },
          { label: "Stomach Vacuum (ADIM)", detail: "2×15s holds", tip: "Full exhale, navel to spine, hold 15s. Activates the transverse abdominis before loading." },
        ],
      },
      {
        name: "STRENGTH — MUSCLE PRESERVATION",
        badge: "6 exercises · 32 min",
        note: "Rest: 75s compounds (1–2) · 60s isolation (3–6). Pick a load that makes the LAST set of each lift genuinely hard — 0–1 reps left in the tank. In a deficit that effort level, not the calories you burn lifting, is what protects muscle — so let the weight climb as your strength returns instead of staying light. Maintaining or adding load week-to-week is your #1 sign muscle is being retained. Coach Z: visualize before every set, 3s eccentrics, flex during rest.",
        items: [
          {
            label: "1. Barbell Bench Press",
            detail: "3×10–12 · 75s rest · START: 55–60lbs (≈65% of your ~90lb max)",
            tip: "Elbows 45°, drive feet into floor, push the bar away from you. Take the LAST set to 0–1 reps in reserve — that hard effort is the muscle-retention signal. On earlier sets leave ~2 in reserve so bar speed and form stay crisp.",
            coachZ: "Before unracking, visualize your pecs doing the work — not your arms. 3-second lowering on every rep. Between sets, do a hard 10s pec flex (hands pressed together) to keep the mind-muscle connection lit.",
            avoid: "Don't bounce the bar or grind ugly reps past form breakdown.",
          },
          {
            label: "2. Incline DB Press",
            detail: "3×10–12 · 75s rest · START: 17.5–20lb DBs",
            tip: "3-second lowering phase. DBs in line with lower chest at the bottom, press up and slightly inward.",
            coachZ: "Squeeze the pecs HARD at the top before lowering — own that contraction. The upper-chest line is what shows first when you lean out; treat every top-position squeeze as posing practice.",
            avoid: "Don't let the lower back arch off the bench.",
          },
          {
            label: "3. Pec Deck / Cable Flys",
            detail: "3×12–15 · 60s rest",
            tip: "Slight elbow bend locked in, 1s hard squeeze at peak. Think 'hugging a barrel.'",
            coachZ: "On cables, arc low-to-high — start low outside, finish high inside at eye level. This carves the upper-chest line. Hold the peak squeeze 2 full seconds on your last 3 reps of each set.",
            avoid: "Don't swing or let the stack crash between reps.",
          },
          {
            label: "4. Dips (Bench or Bars)",
            detail: "3×8–10 · 60s rest · BW Week 1",
            tip: "Torso upright to isolate triceps. Descend to 90° elbow bend only.",
            coachZ: "This is the move that builds the horseshoe — own every inch of every rep. Slow 3s descent, no drop-and-pop. Flex the triceps hard between sets with an arm-extended pose.",
            avoid: "Don't dip past 90° during comeback weeks.",
          },
          {
            label: "5. Cable Tricep Pushdowns",
            detail: "3×12–15 · 60s rest · START: 20–25lbs stack",
            tip: "Elbows pinned to ribs the entire set. Full 1s lockout at the bottom, controlled return.",
            coachZ: "At lockout, squeeze the triceps like you're hitting a side-triceps pose — 1 full second every rep. The lockout squeeze IS the rep; everything else is travel.",
            avoid: "Don't let elbows flare or drift forward.",
          },
          {
            label: "6. DB Lateral Raises",
            detail: "3×12–15 · 60s rest · START: 10–12.5lb DBs",
            tip: "Lean 5° forward, lead with elbows, lift to shoulder height only.",
            coachZ: "After your final full set, immediately do 15 top-half partials — the lateral-head burnout. Wide delts are the #1 visual fat-loss multiplier: the wider the shoulders, the smaller the waist looks.",
            avoid: "Don't shrug at the top — traps stealing the work.",
          },
        ],
      },
      {
        name: "CARDIO — POST-LIFT",
        badge: "27 min · Zone 2",
        note: "Cardio goes after the lifting, not before — pre-lift cardio blunts your pressing strength, and the lift is what protects muscle. These minutes add straight to today's calorie deficit.",
        items: [
          { label: "Incline Treadmill Walk", detail: "27 min · RPE 5–6 · 3.0–3.5mph / 8–10%", tip: "Upright posture, no rails — holding the rails cuts the work. Bump incline 1–2% in the final 5 minutes if you have gas left." },
        ],
      },
      {
        name: "CORE & COOLDOWN",
        badge: "5 min",
        items: [
          { label: "Stomach Vacuum (ADIM)", detail: "3×15s", tip: "The vacuum tightens the waist from the inside — the only 'spot' work that actually changes waistline appearance." },
          { label: "Plank", detail: "2×45s", tip: "Glutes squeezed, neutral pelvis, push the floor away with your forearms." },
          { label: "Chest + Triceps Stretch", detail: "60s", tip: "Doorway stretch for chest, overhead reach for triceps. 20–30s holds." },
        ],
      },
    ],
  },
  {
    id: "tue",
    label: "TUE",
    title: "Pull + HIIT",
    subtitle: "Back · Biceps · Sprint Finisher",
    color: "#00C2FF",
    icon: "🧲",
    burn: "~560 kcal",
    cardioType: "Post-lift Zone 2 + HIIT finisher",
    sections: [
      {
        name: "WARM-UP",
        badge: "5 min",
        items: [
          { label: "Band Rows + Shoulder Circles", detail: "2 rounds", tip: "Drive elbows behind you, squeeze shoulder blades. Circles mobilize the joint before heavy pulling." },
          { label: "Stomach Vacuum (ADIM)", detail: "2×15s", tip: "Daily vacuum frequency is what builds the waist-tightening adaptation." },
        ],
      },
      {
        name: "STRENGTH — MUSCLE PRESERVATION",
        badge: "6 exercises · 32 min",
        note: "Rest: 75s compounds (1–3) · 60s isolation (4–6). Last set of each lift to 0–1 reps in reserve — let the load climb week to week; that effort is the muscle-retention signal. Coach Z: use straps on heavy pulling so grip never limits back stimulus.",
        items: [
          {
            label: "1. Lat Pulldown / Pull-Ups",
            detail: "3×8–10 · 75s rest · START: 70–80lbs stack",
            tip: "Full 3s stretch at the top of every rep. Lat width is the top half of the V-taper.",
            coachZ: "Pull your shoulders DOWN first, then drive elbows toward your back pockets — that sequence is what isolates the lats. Between sets, hit a lat-spread pose for 10s; if you can't flex it, you're not building it.",
            avoid: "Don't pull with biceps or rock the torso backward.",
          },
          {
            label: "2. Seated Cable Row / Bent-Over Row",
            detail: "3×10–12 · 75s rest · START: 70–80lbs cable / 65lb barbell",
            tip: "Back flat, hinge at hips, drive the handle to your lower stomach.",
            coachZ: "Squeeze the shoulder blades together and HOLD 1s at full contraction every rep — feel the mid-back fold. 3s on the return stretch. Back thickness comes from the squeeze, not the weight.",
            avoid: "Don't round the lower back or jerk with momentum.",
          },
          {
            label: "3. 1-Arm Dumbbell Row",
            detail: "3×10–12 · 75s rest · RPE 7",
            tip: "Brace the free arm on the bench, spine neutral.",
            coachZ: "Drive the elbow low toward your hip pocket and pause at the top — this path builds the lower-lat 'meat' that makes the waist look tighter from behind. Visualize the lat shortening before each set.",
            avoid: "Don't rotate the torso excessively to finish reps.",
          },
          {
            label: "4. Cable Face Pulls",
            detail: "3×15–20 · 60s rest · light",
            tip: "Cable at face height, elbows high, pull to nose with thumbs rotating back. Posture insurance.",
            coachZ: "Hold the end position 1s with thumbs pointing behind you — feel the rear delts and rotators light up. Good posture alone makes you look 5lbs leaner: shoulders back, chest up, all day.",
            avoid: "Don't load this heavy. Corrective, not a strength lift.",
          },
          {
            label: "5. Barbell / DB Curls",
            detail: "3×10–12 · 60s rest",
            tip: "Elbows pinned at sides, 2s up, 3s down.",
            coachZ: "Visualize the bicep peak before each set. Squeeze at the top like you're hitting a front double-bicep — every rep is a rehearsal. The 3s negative is where the arm is built.",
            avoid: "Don't swing the torso to start the rep.",
          },
          {
            label: "6. Hammer Curls",
            detail: "3×10–12 · 60s rest",
            tip: "Neutral thumb-up grip, 1s squeeze at the top.",
            coachZ: "Brachialis growth pushes the bicep UP from underneath — this is the thickness move. Flex both arms in a hammer-style pose between sets to keep blood in the muscle.",
            avoid: "Don't let the wrist roll. Locked neutral.",
          },
        ],
      },
      {
        name: "CARDIO — POST-LIFT",
        badge: "10 min · Zone 2",
        note: "Cardio after the lift, never before — it keeps your pulling strength intact and adds to today's deficit.",
        items: [
          { label: "Row Machine", detail: "10 min · conversational pace · damper 4–5", tip: "Full leg drive, controlled arm pull. Legs do 60% of the work — don't yank with your arms." },
        ],
      },
      {
        name: "HIIT FINISHER",
        badge: "🔑 10 min · Sprint Finisher",
        note: "Second short HIIT dose of the week. HIIT and steady-state burn about the same fat when the minutes match — this one's here for conditioning and time efficiency, kept away from leg day so it never taxes your squats.",
        items: [
          { label: "Bike Sprints", detail: "8 rounds · 20s sprint / 55s easy spin", tip: "Bike on pull day — legs fresh, zero impact before Thursday. Sprints at RPE 8–9. If round 8 feels like round 1, you went too easy.", highlight: true },
        ],
      },
      {
        name: "CORE & COOLDOWN",
        badge: "7 min",
        items: [
          { label: "Hanging Leg Raises", detail: "3×10", tip: "Curl the pelvis upward at the top — that's what activates lower abs. No swinging." },
          { label: "Dead Bugs", detail: "2×12 per side", tip: "Lower back pressed flat for every rep. Exhale on exertion." },
          { label: "Lats / Biceps / Shoulder Stretch", detail: "60s", tip: "Overhead doorframe lean for lats, cross-arm for rear delt, palm-press for biceps." },
        ],
      },
    ],
  },
  {
    id: "thu",
    label: "THU",
    title: "Legs",
    subtitle: "Highest Calorie Day",
    color: "#00E87A",
    icon: "🦵",
    burn: "~600 kcal",
    cardioType: "Post-lift Zone 2",
    sections: [
      {
        name: "WARM-UP",
        badge: "10 min",
        note: "No pre-lift cardio today — squats and hinges need fresh legs, and protecting that strength is what protects muscle. Cardio comes after.",
        items: [
          { label: "Stationary Bike", detail: "5 min · easy spin · 80–90 RPM", tip: "Low resistance, pure joint lubrication for knees, hips, ankles." },
          { label: "BW Squats + Leg Swings + Glute Bridges", detail: "2 rounds", tip: "Full-depth squats, front and lateral swings, 2s holds on bridges. Don't skip — cold leg compounds are the fastest route to injury." },
        ],
      },
      {
        name: "STRENGTH — BIGGEST BURN OF THE WEEK",
        badge: "6 exercises · 35 min",
        note: "Rest: 90s compounds (1–3) · 75s machines (4–5) · 60s calves. Drive the last set of each lift to 1–2 reps in reserve — legs earn a touch more caution than upper body, but the effort still has to be real. Let the load climb as strength returns; that's your muscle-retention signal. Legs are ~60% of your muscle mass, so holding strength here matters most.",
        items: [
          {
            label: "1. Barbell Back Squat",
            detail: "3×10–12 · 90s rest · START: 65–75lbs (≈65% of your ~114lb max)",
            tip: "Brace hard before descending. Hit full depth (hip crease below knee). Highest calorie-per-rep exercise in the program.",
            coachZ: "3-second descent, visualize the quads loading like springs. Drive up through the whole foot and squeeze the glutes at lockout. Control builds legs; speed just moves weight.",
            avoid: "Don't let knees cave or heels lift. Lighter weight, full depth — always.",
          },
          {
            label: "2. Romanian Deadlift (RDL)",
            detail: "3×10–12 · 90s rest · START: 65–75lbs",
            tip: "Slight knee bend, push hips back, bar close to shins. Feel the hamstring stretch before driving hips forward.",
            coachZ: "Visualize the hamstrings lengthening like cables on the way down — 3 full seconds. The stretch position under load is the single biggest hamstring growth trigger. Squeeze glutes hard at the top.",
            avoid: "Don't round the lower back. No hamstring stretch = too heavy.",
          },
          {
            label: "3. Walking Lunges",
            detail: "3×10/leg · 90s rest · BW or light DBs",
            tip: "Long step, front shin near vertical, back knee taps the floor.",
            coachZ: "Stay tall like you're walking a stage — chest proud, eyes forward. Push through the front heel and feel the glute fire on every step. Highest heart-rate strength move in the plan; embrace the burn.",
            avoid: "Don't push off the back foot to cheat. Front leg does the work.",
          },
          {
            label: "4. Leg Press",
            detail: "3×15 · 75s rest · full ROM",
            tip: "Feet mid-platform, push through the whole foot, stop short of lockout.",
            coachZ: "Slow 3s descent into a deep stretch, then drive. On the last 5 reps of the final set, add a 1s pause at the bottom — the pause strips momentum and forces pure quad.",
            avoid: "Don't let your lower back round off the pad at the bottom.",
          },
          {
            label: "5. Leg Curl (Seated or Lying)",
            detail: "3×12–15 · 75s rest",
            tip: "Start near-straight, curl to full contraction, 1s peak hold.",
            coachZ: "Point your toes during the curl to take the calves out and isolate the hamstrings fully. Flex the hamstring during rest — if you can't feel it contract, slow the reps down.",
            avoid: "Don't let hips rise (seated) or glutes lift (lying).",
          },
          {
            label: "6. Standing Calf Raises",
            detail: "3×20 · 60s rest",
            tip: "2s pause at the deep bottom stretch, full lockout squeeze at top.",
            coachZ: "Rise onto the big toe — not the outside of the foot — and squeeze at the top like you're trying to see the calf split. Calves are a posing muscle: contraction quality is everything.",
            avoid: "Don't bounce. The stretch pause IS the stimulus.",
          },
        ],
      },
      {
        name: "CARDIO — POST-LIFT",
        badge: "20 min · Zone 2",
        note: "Legs are your biggest muscles, so this session plus the walk after it is your largest single-day calorie output. Total calories are what move fat — this is just the day they add up fastest.",
        items: [
          { label: "Incline Treadmill Walk", detail: "20 min · RPE 5–6 · 3.0mph / 8%", tip: "Legs will be heavy — expected. Slightly slower speed is fine; keep the incline. No rails.", highlight: true },
        ],
      },
      {
        name: "CORE FINISHER",
        badge: "8 min",
        items: [
          { label: "Suitcase Carry", detail: "3×40m per side · moderate DB", tip: "Walk a perfectly straight line without leaning. Trims the flank without thickening it like loaded twists would." },
          { label: "Side Plank", detail: "2×30s per side", tip: "Drive the hip up, don't sag. Anti-lateral-flexion tightens the waist without oblique bulk." },
          { label: "Quads / Hams / Hip Stretch", detail: "90s", tip: "Standing quad pull, seated toe-touch, figure-4. 30s holds — legs need longer." },
        ],
      },
    ],
  },
  {
    id: "fri",
    label: "FRI",
    title: "Shoulders + HIIT",
    subtitle: "Delts · Arms · HIIT Finisher",
    color: "#FFB800",
    icon: "💥",
    burn: "~540 kcal",
    cardioType: "Primary HIIT session",
    sections: [
      {
        name: "WARM-UP",
        badge: "8 min",
        items: [
          { label: "Arm Swings + Light DB Press + Band Pull-Aparts", detail: "2 rounds", tip: "Big circles both directions, near-empty DB presses to groove the overhead pattern." },
          { label: "Stomach Vacuum (ADIM)", detail: "2×15s", tip: "The vacuum-braced core protects the lower back under overhead load." },
        ],
      },
      {
        name: "STRENGTH — MUSCLE PRESERVATION",
        badge: "6 exercises · 30 min",
        note: "Rest: 60s ALL sets — tightest of the week. Last set of each lift to 0–1 reps in reserve; keep the load honest even on the shorter rest. Coach Z: this is the aesthetics day — every set ends with a squeeze, every rest includes a flex.",
        items: [
          {
            label: "1. Overhead Press (BB or DB)",
            detail: "3×10–12 · 60s rest · START: 17.5–20lb DBs or 45lb empty bar",
            tip: "Press to full lockout directly over mid-foot. Brace the core like you're about to be punched.",
            coachZ: "Visualize the delts capping as you press. At lockout, push your head slightly through the window and squeeze for 1s. 3-second lowering — the eccentric is where caps are carved.",
            avoid: "Don't arch the lower back to press forward.",
          },
          {
            label: "2. DB Lateral Raises",
            detail: "3×12–15 · 60s rest",
            tip: "5° forward lean, lead with elbows, shoulder height only, slight pinky-up at top.",
            coachZ: "Raise OUT, not up — imagine pushing the walls apart. Final set: 15 top-half partials to failure. Then hit a 10s lat-spread + delts flex between sets. Width is the whole game.",
            avoid: "Don't swing or shrug. Lighter and stricter wins.",
          },
          {
            label: "3. Rear Delt Fly Machine",
            detail: "3×15 · 60s rest · START: 30–40lbs stack",
            tip: "Lead with pinkies flared out. Do NOT pinch shoulder blades together.",
            coachZ: "Pause 1s at the rear position and feel the rear delt — not the mid-back — do the holding. Rear delts are what make shoulders look 3D from the side. Most lifters skip them; that's your edge.",
            avoid: "Don't rock the torso or use momentum.",
          },
          {
            label: "4. Barbell Shrugs",
            detail: "3×15 · 60s rest",
            tip: "Straight up and slightly back, 1s hold at peak, 2s lower.",
            coachZ: "At the top, hold and visualize the traps touching your ears. Controlled 3s lowering on the final 5 reps of each set — stretch-under-load grows traps faster than heavier shrugging.",
            avoid: "Don't roll shoulders forward — AC joint stress for zero benefit.",
          },
          {
            label: "5. Skullcrushers (EZ Bar)",
            detail: "3×10–12 · 60s rest",
            tip: "Elbows fixed pointing at the ceiling. Lower to forehead over 3s, press to lockout.",
            coachZ: "The 3s lower IS the exercise — the long head grows from the deep stretch behind your head. Squeeze the lockout, then flex a side-triceps pose during rest.",
            avoid: "Don't flare the elbows — it unloads the long head.",
          },
          {
            label: "6. DB / EZ Bar Curls",
            detail: "3×10–12 · 60s rest",
            tip: "Full extension at the bottom, hard peak squeeze, 3s negative.",
            coachZ: "Last arm work of the week — finish with a front double-bicep hold for 15s after the final set. Posing under fatigue hardens the muscle and trains you to actually display what you're building.",
            avoid: "Don't drift elbows forward or swing the torso.",
          },
        ],
      },
      {
        name: "AB PRIME",
        badge: "6 min",
        note: "Light load — primes blood flow to abdominal tissue ahead of HIIT.",
        items: [
          { label: "Ab Crunch Machine", detail: "3 sets · ~40 reps/min · 30–40% 1RM", tip: "Initiate from the abs, round the spine forward. Brief pause at full contraction." },
        ],
      },
      {
        name: "PRIMARY HIIT SESSION",
        badge: "🔑 16 min · Sprint Session",
        note: "Your main conditioning dose of the week. The afterburn is real but small — it's the sprint minutes themselves adding to today's deficit that matter. Placed on shoulder day so it never eats into your squats or pulls.",
        items: [
          { label: "Treadmill or Bike HIIT", detail: "14 rounds · 30s sprint / 40s walk", tip: "Sprints at RPE 8–9 — hard but repeatable. Use the full 40s recovery; quality sprints beat sloppy ones.", highlight: true },
        ],
      },
      {
        name: "COOLDOWN",
        badge: "4 min",
        items: [
          { label: "Standing Stomach Vacuum", detail: "3×15s", tip: "Standing works against gravity — hardest variation. Full exhale, draw in and up." },
          { label: "Shoulders / Traps / Arms Stretch", detail: "60s", tip: "Cross-arm, overhead reach, gentle neck tilts. 20s+ each." },
        ],
      },
    ],
  },
  {
    id: "sat",
    label: "SAT",
    title: "Full Body",
    subtitle: "Full-Body Strength · Week Closer",
    color: "#C84BFF",
    icon: "🧩",
    burn: "~580 kcal",
    cardioType: "Progressive Zone 2→3",
    sections: [
      {
        name: "WARM-UP",
        badge: "10 min",
        items: [
          { label: "Row Machine", detail: "5 min · moderate", tip: "Warm the whole system without burning glycogen you need for the session." },
          { label: "BW Lunges + Push-Ups + Glute Band Walks", detail: "2 rounds", tip: "Lunges prep hips/knees for deadlifts, push-ups prime pressing, band walks fire the glute medius." },
        ],
      },
      {
        name: "FULL-BODY STRENGTH — STRAIGHT SETS",
        badge: "6 exercises · 33 min",
        note: "Rest: 75s on deadlift and hack squat, 60s on the rest — enough to keep the loads heavy so this stays real strength work, not a rushed circuit. Last set of each lift to 1–2 reps in reserve. Lower → upper → lower sequencing keeps things moving without ever shortchanging the compounds.",
        items: [
          {
            label: "1. Deadlift (Barbell or Trap Bar)",
            detail: "3×6–8 · 75s rest · last set 1–2 RIR · START: 95–115lbs",
            tip: "Chest up, spine neutral, bar over mid-foot, push the floor away. Recruits more total muscle than any other lift.",
            coachZ: "Before each set, visualize the entire posterior chain — hams, glutes, back — firing as one unit. Squeeze the glutes hard at lockout and stand tall for 1s like you're finishing a pose.",
            avoid: "Don't grind reps. 6–8 clean, rack it.",
          },
          {
            label: "2. Hack Squat Machine",
            detail: "3×8–10 · 75s rest · START: 1 plate/side (90lbs sled)",
            tip: "3s controlled descent, feet shoulder-width slightly toed out. Zero spinal compression after deadlifts.",
            coachZ: "Ride the 3-second descent into a deep quad stretch and feel the sweep loading. The hack squat builds the outer-quad line that shows through pants when you lean out.",
            avoid: "Don't let knees cave or heels lift off the platform.",
          },
          {
            label: "3. Lat Pulldown",
            detail: "3×8–10 · 60s rest",
            tip: "3s stretch at top of every rep.",
            coachZ: "Same cue as Tuesday: shoulders down FIRST, then elbows to back pockets. End the final set with a 10s lat-spread pose — close the week's back work the way you opened it.",
            avoid: "Don't swing the torso for momentum.",
          },
          {
            label: "4. DB / Machine Chest Press",
            detail: "3×12 · 60s rest",
            tip: "Elbows 45°, 2s descent, strong press. Full control both directions.",
            coachZ: "Squeeze the pecs together at the top of every rep — imagine crushing a walnut between them. Fatigued-state contractions like these harden the chest line.",
            avoid: "Don't bounce at the bottom of the rep.",
          },
          {
            label: "5. Leg Extension → Leg Curl (Alternating Sets)",
            detail: "3×12 each · 60s rest between",
            tip: "Alternating straight sets, NOT a superset — extension, rest 60s, curl, rest 60s, repeat.",
            coachZ: "Extension: 1s squeeze at the top, visualize the teardrop above the knee. Curl: toes pointed, hamstring-only. Constant tension both ways — never let the stack touch down.",
            avoid: "Don't hyperextend on extension or let hips rise on curls.",
          },
          {
            label: "6. Plank-to-Push-Up",
            detail: "2×10 · 60s rest",
            tip: "Forearm plank to straight-arm plank one hand at a time. Squeeze glutes to kill hip sway.",
            coachZ: "Move like every transition is being judged — zero hip rotation, rigid line. Core control under fatigue is what makes the vacuum and posing work translate to how you carry yourself.",
            avoid: "Don't let hips rotate. Slow down before form breaks.",
          },
        ],
      },
      {
        name: "PROGRESSIVE CARDIO",
        badge: "20 min · Builds to Zone 3",
        note: "Ends the training week at peak output.",
        items: [
          { label: "Treadmill or Bike", detail: "10 min RPE 6 → 10 min RPE 7–7.5", tip: "Raise speed or incline every 2–3 min in the back half. Finish breathing hard. Adds ~60–80 kcal vs flat steady-state.", highlight: true },
        ],
      },
      {
        name: "DEEP CORE & POSING PRACTICE",
        badge: "10 min",
        note: "Coach Z: how you stand is half the look. Saturday closes with posing — it hardens muscle, builds mind-muscle connection, and teaches you to display the physique you're building.",
        items: [
          { label: "Plank", detail: "2×60s", tip: "Longest holds of the week. Lock glutes, core, quads. Breathe through it." },
          { label: "Bird Dog", detail: "2×10 per side", tip: "Opposite arm-leg, lower back flat, zero rotation. Slow and deliberate." },
          { label: "Standing Stomach Vacuum", detail: "3×15s", tip: "15+ vacuum sets per week is the dose that produces visible waist-tightening over 4–6 weeks." },
          { label: "🅩 Posing Practice", detail: "5 min · mirror or phone camera", tip: "Coach Z's Saturday ritual: front double-bicep (10s), lat spread (10s), side chest (10s), vacuum pose (15s) — 2 rounds each. Flexing under weekly fatigue hardens the physique and shows you exactly where you're progressing. Film it monthly; the camera tracks fat loss better than the scale.", highlight: true },
          { label: "Full Body Static Stretch", detail: "3–4 min", tip: "Quads, hams, hip flexors, lats, chest, shoulders. 20–30s each." },
        ],
      },
    ],
  },
];

const dailyLayer = [
  { icon: "👣", title: "10,000 Steps Daily", body: "Including rest days. NEAT can account for 300–500 kcal/day — often more than the workout itself. Park far, take stairs, walk calls." },
  { icon: "🚶", title: "Rest Days = Active", body: "Wed & Sun: 25–35 min brisk walk. Keeps weekly burn high, speeds recovery via blood flow, maintains the step target. Foam roll + stretch after." },
  { icon: "🍽️", title: "Protein 140–150g", body: "Top of the range while cutting. Preserves muscle in a deficit, highest thermic effect of any macro (~25% burns during digestion), keeps you full." },
  { icon: "📉", title: "Deficit: 400–500 kcal", body: "With ~550 kcal/session training burn + 10k steps, this produces ~0.5–0.7 kg/week fat loss — the max sustainable rate that protects muscle." },
  { icon: "💧", title: "Hydration + Sleep", body: "3L+ water daily. 7–8 hrs sleep — under 6 hrs shifts weight loss away from fat and toward muscle. Sleep is a fat-loss tool." },
  { icon: "⚖️", title: "Weigh-In Protocol", body: "Daily, same time, after bathroom, before food. Track the 7-day average, not the daily number. The trend line is the truth." },
  { icon: "📈", title: "Effort + Double Progression", body: "Take the LAST set of every lift close to failure — 0–1 reps in reserve on upper body, 1–2 on legs. That effort, not the calories you burn lifting, is what protects muscle in a deficit. When all 3 sets hit the TOP of the rep range with clean form, add 5lbs (upper) or 10lbs (lower) next session. Holding or adding load week-to-week is your #1 sign muscle is being retained — so log every session. Returning lifters ride fast 'muscle memory' gains for 8–12 weeks." },
  { icon: "🥘", title: "Indian Protein Playbook", body: "Hitting 140g on a desi diet: paneer (18g/100g), dal + rice (complete protein combo), Greek yogurt/hung curd (10g/100g), eggs, chicken, soy chunks (52g/100g — the cheapest protein in India). Watch ghee/oil portions — that's where hidden deficit-killers live." },
];

const coachZPrinciples = [
  { num: "01", title: "Visualize Before Every Set", body: "See the target muscle doing the work before you touch the weight. Mind-muscle connection measurably increases activation — and in a deficit, every rep has to count." },
  { num: "02", title: "3-Second Eccentrics on All Compounds", body: "The lowering phase is where muscle is built and kept. Slow negatives preserve more muscle per set while cutting — exactly the trade you want." },
  { num: "03", title: "Flex & Pose Between Sets", body: "10s hard contractions of the target muscle during rest. Keeps blood in the muscle, sharpens the connection, and turns rest periods into extra stimulus for free." },
  { num: "04", title: "The Squeeze IS the Rep", body: "1–2s peak contraction holds on every isolation movement. Travel moves weight; the squeeze builds the look." },
  { num: "05", title: "Width Beats Everything", body: "Lateral delts and lats get priority cues all week. The wider the frame, the smaller the waist appears — the V-taper is a fat-loss multiplier you build, not burn." },
  { num: "06", title: "How You Stand Is Half the Look", body: "Saturday posing practice + all-day posture (shoulders back, chest up, core braced). Film monthly — the camera tracks fat loss better than the scale ever will." },
];

const weekMap = [
  { day: "MON", focus: "Push + Post-Lift Zone 2", burn: 520, color: "#FF4D1C" },
  { day: "TUE", focus: "Pull + HIIT Finisher", burn: 560, color: "#00C2FF" },
  { day: "WED", focus: "Rest — 30min Walk + 10k Steps", burn: 220, color: "#444" },
  { day: "THU", focus: "Legs + Post-Lift Zone 2", burn: 600, color: "#00E87A" },
  { day: "FRI", focus: "Shoulders + Primary HIIT", burn: 540, color: "#FFB800" },
  { day: "SAT", focus: "Full Body + Posing Practice", burn: 580, color: "#C84BFF" },
  { day: "SUN", focus: "Rest — 30min Walk + 10k Steps", burn: 220, color: "#444" },
];

  window.DEFAULT_PLAN = {
    branding: {
      title: "TRAINING APP",
      accentColor: CZ,
      gymLabel: "CRUNCH HUNTINGDON VALLEY · FAT LOSS × COACH Z",
      statsLine: "78KG · BENCH ~90 · SQUAT ~114",
      showMethodTab: true,
    },
    days: days,
    dailyLayer: dailyLayer,
    principles: coachZPrinciples,
    weekMap: weekMap,
  };

  window.slugifyUsername = function (name) {
    return String(name || "").trim().toLowerCase()
      .replace(/[^a-z0-9_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };
})();

// ─────────────────────────────────────────────────────────────
// Shared workout-plan template + helpers for the gym app.
// Loaded by both index.html and admin/index.html; exposes
// window.DEFAULT_PLAN (the seed/fallback plan) and
// window.slugifyUsername (username → Firestore-safe doc id).
//
// PHASE: Lean V-taper cut — 80kg → 75kg (Oct 5) → 70kg (Dec).
// Split: Upper / Lower / Upper / Lower / Delts+Arms (Nippard MIN-MAX
// style for a fat-loss phase — every muscle ~2×/week, laterals 3×).
// Mon/Tue/Thu/Fri 6:15–7:45am · Sat 7:00–8:15am (gym opens 7 on Sat).
// ─────────────────────────────────────────────────────────────
(function () {
const CZ = "#B388FF"; // Coach Z accent

// Shared copy blocks — keeps the effort/progression rules identical on every day.
const EFFORT_UPPER = "Rest as prescribed. Last set of every lift to 0–1 reps in reserve; leave ~2 in reserve on the sets before it so form and bar speed stay clean. In a deficit that final-set effort — not the calories you burn lifting — is what protects muscle. DOUBLE PROGRESSION: when every set hits the TOP of the rep range with clean form, add 5lbs next session. WEEK 1 IS LOAD-FINDING — leave 2–3 in reserve everywhere and let the loads climb from week 2. Holding or adding load week-to-week is your #1 proof muscle is being retained, so log every set.";
const EFFORT_LOWER = "Rest as prescribed. Last set to 1–2 reps in reserve on legs — deeper fatigue here costs you the next session for no extra muscle. DOUBLE PROGRESSION: all sets at the top of the range with clean form → add 10lbs next session. WEEK 1 IS LOAD-FINDING — 2–3 in reserve everywhere. Legs are the biggest calorie burners in your week; they anchor the deficit even though we are not chasing size here.";

const days = [
  {
    id: "mon",
    label: "MON",
    title: "Upper A",
    subtitle: "6:15–7:45am · Chest · Back Width · Delts",
    color: "#FF4D1C",
    icon: "🔥",
    burn: "~440 kcal",
    cardioType: "Post-lift Zone 2 · 15 min",
    sections: [
      {
        name: "WARM-UP",
        badge: "6 min",
        items: [
          { label: "Rower or Bike", detail: "3 min · easy", tip: "Raise core temperature and get blood into the shoulders. This is not a workout." },
          { label: "Band Pull-Aparts", detail: "2×15", tip: "Arms straight, pull to chest level. Primes rear delts and scapular control before pressing." },
          { label: "Light Incline Bench", detail: "2 warm-up sets · 40–50% working weight", tip: "Groove the bar path and set scapular retraction. Rehearsal, not work." },
          { label: "Stomach Vacuum (ADIM)", detail: "2×15s holds", tip: "Full exhale, navel to spine, hold 15s. Wakes up the transverse abdominis — the muscle that actually cinches the waist." },
        ],
      },
      {
        name: "STRENGTH — UPPER A",
        badge: "6 exercises · 44 min",
        isStrength: true,
        note: EFFORT_UPPER + " SHAPE LOGIC FOR TODAY: incline leads because upper chest is the shape muscle and it is the first line to reappear as chest fat comes off. The pulldown is heavy and early because lat width is half the V-taper.",
        items: [
          {
            label: "1. Incline Barbell Bench Press",
            detail: "4×6–8 · 120s rest · START: 55–65lbs, find it in week 1",
            sets: 4, restSeconds: 120,
            tip: "Bench at 30°, not 45° — any higher and it becomes a shoulder press. Elbows ~45° from the torso, feet driving into the floor, bar to the upper chest.",
            coachZ: "Visualize the upper chest doing the work before you unrack. 3-second lowering on every rep. Between sets, 10s of hard pec flexing to keep the connection lit.",
            avoid: "Do not bounce the bar off the chest or grind ugly reps past form breakdown.",
          },
          {
            label: "2. Wide-Grip Lat Pulldown",
            detail: "4×8–10 · 90s rest",
            sets: 4, restSeconds: 90,
            tip: "Grip just outside shoulder width, thumbs over the bar. Pull to the collarbone by driving the elbows DOWN, not by pulling with the hands. Slow 3s return, full stretch at the top.",
            coachZ: "Every rep here is width. Think elbows into your back pockets. Hold the bottom squeeze one full second and feel the lats spread.",
            avoid: "Do not lean back past ~15° — that turns it into a row and steals the width work.",
          },
          {
            label: "3. Chest-Supported Row (Hammer Strength)",
            detail: "3×10–12 · 75s rest",
            sets: 3, restSeconds: 75,
            tip: "Chest stays glued to the pad — that is the entire point of the machine, it takes the lower back out of the equation. Pull to the lower ribs, 1s squeeze.",
            coachZ: "Upper-back thickness is what holds the posture that makes a V-taper visible with a shirt on. Retract the shoulder blades HARD at the end of every rep.",
            avoid: "Do not shrug the weight up or let the chest come off the pad to move more load.",
          },
          {
            label: "4. Flat DB Press",
            detail: "3×10–12 · 75s rest · START: 25–30lb DBs",
            sets: 3, restSeconds: 75,
            tip: "Dumbbells in line with the lower chest at the bottom, press up and slightly inward. Full stretch at the bottom is where the stimulus lives.",
            coachZ: "Squeeze the pecs hard at the top before lowering. Own the contraction; the dumbbells are just along for the ride.",
            avoid: "Do not let the lower back arch off the bench or the dumbbells drift out wide.",
          },
          {
            label: "5. Cable Lateral Raise",
            detail: "4×12–15 · 45s rest · START: lowest pin, 10–15lbs",
            sets: 4, restSeconds: 45,
            tip: "Low pulley behind you, lean 5° away, lead with the elbow, stop at shoulder height. Cables keep tension on at the bottom where dumbbells give you nothing.",
            coachZ: "Laterals get hit three times this week — Monday, Thursday, Saturday — because wide delts are the fastest visual return available while you lean out. After the final set, 15 top-half partials to finish the lateral head.",
            avoid: "Do not shrug at the top — that is the traps stealing the work. Do not swing the stack.",
          },
          {
            label: "6. Rope Tricep Pushdown",
            detail: "3×12–15 · 45s rest · START: 25–30lbs stack",
            sets: 3, restSeconds: 45,
            tip: "Elbows pinned to the ribs the entire set. Spread the rope apart at the bottom, 1s lockout, controlled return.",
            coachZ: "The lockout squeeze IS the rep; everything else is travel. Hold it one full second every time.",
            avoid: "Do not let the elbows flare or drift forward — that turns it into a press.",
          },
        ],
      },
      {
        name: "CARDIO — POST-LIFT",
        badge: "15 min · Zone 2",
        note: "Cardio goes AFTER the lifting, never before — pre-lift cardio blunts your pressing strength, and the lift is what protects muscle. Only 15 minutes, because this is a strength-led plan: the real calorie work happens in your step count and your food, not on the treadmill.",
        items: [
          { label: "Incline Treadmill Walk", detail: "15 min · RPE 5–6 · 3.0–3.5mph / 8–10%", tip: "Upright posture, hands OFF the rails — holding on cuts the work by roughly a third. Bump the incline 1–2% for the last 3 minutes if you have gas left." },
        ],
      },
      {
        name: "CORE & COOLDOWN",
        badge: "5 min",
        note: "No weighted side bends and no loaded oblique twists anywhere in this program. Loaded obliques thicken the waist, which is the exact opposite of what you are building. Vacuums, planks and leg raises only.",
        items: [
          { label: "Stomach Vacuum (ADIM)", detail: "3×15s", tip: "The vacuum tightens the waist from the inside by training the transverse abdominis. It is the only waist work that genuinely changes how the midsection sits." },
          { label: "Plank", detail: "2×45s", tip: "Glutes squeezed, pelvis neutral, push the floor away with your forearms." },
          { label: "Chest + Lat Stretch", detail: "60s", tip: "Doorway stretch for the chest, hang from the pulldown bar for the lats. 20–30s holds." },
        ],
      },
    ],
  },
  {
    id: "tue",
    label: "TUE",
    title: "Lower A",
    subtitle: "6:15–7:45am · Squat-Dominant",
    color: "#00E87A",
    icon: "🦵",
    burn: "~480 kcal",
    cardioType: "Post-lift Zone 2 · 20 min",
    sections: [
      {
        name: "WARM-UP",
        badge: "7 min",
        items: [
          { label: "Bike", detail: "4 min · easy", tip: "Legs need more warming than upper body, especially at 6:15am. Do not skip this one." },
          { label: "Bodyweight Squats + Leg Swings", detail: "2×15 squats · 10 swings/leg", tip: "Open the hips and ankles. Full depth on the bodyweight squats." },
          { label: "Empty Bar Squats", detail: "2×10", tip: "Groove the bar position and depth before loading." },
        ],
      },
      {
        name: "STRENGTH — LOWER A",
        badge: "5 exercises · 42 min",
        isStrength: true,
        note: EFFORT_LOWER + " FIVE exercises rather than six, so the 20-minute Zone 2 block fits inside 75 minutes. Legs are not being chased for size on this plan — they are being kept strong and used as the biggest calorie furnace in your week.",
        items: [
          {
            label: "1. Barbell Back Squat",
            detail: "4×6–8 · 150s rest · START: 95–115lbs, find it in week 1",
            sets: 4, restSeconds: 150,
            tip: "Brace hard before you descend — big breath into the belly, not the chest. Break at the hips and knees together, go to a depth you can control with a neutral spine.",
            coachZ: "150s rest is not laziness, it is the point. This lift only protects muscle if the last set is still heavy and still clean. Sit down, breathe, then go.",
            avoid: "Do not let the knees cave in, and do not chase depth you cannot hold position through.",
          },
          {
            label: "2. Romanian Deadlift",
            detail: "3×8–10 · 120s rest · START: 75–95lbs",
            sets: 3, restSeconds: 120,
            tip: "Soft knees, push the hips STRAIGHT back, bar dragging the thighs. Stop when the hamstrings run out of stretch — not when the bar reaches the floor.",
            coachZ: "Feel the hamstrings load like a rubber band on the way down. Three-second lowering, then drive the hips forward hard.",
            avoid: "Do not round the lower back to reach lower. Range comes from the hamstrings, not the spine.",
          },
          {
            label: "3. Leg Press",
            detail: "3×12–15 · 90s rest",
            sets: 3, restSeconds: 90,
            tip: "Feet mid-platform, shoulder width. Bring the knees toward the armpits as far as the lower back stays flat against the pad. Higher reps here — the joints have already done their heavy work on squats.",
            coachZ: "This is where you spend the effort you saved on squats. Last set to 1–2 in reserve and it will be genuinely unpleasant. That is correct.",
            avoid: "Never lock the knees out hard at the top, and never let the hips curl off the seat.",
          },
          {
            label: "4. Seated Leg Curl",
            detail: "3×12–15 · 60s rest",
            sets: 3, restSeconds: 60,
            tip: "Seated beats lying here — the hip position puts the hamstrings under a better stretch. 1s squeeze at the bottom, slow 3s return.",
            coachZ: "Hamstrings are what stop legs looking flat from the side once you lean out. Squeeze every rep like you mean it.",
            avoid: "Do not let the hips lift off the seat to finish reps.",
          },
          {
            label: "5. Standing Calf Raise",
            detail: "3×12–15 · 45s rest",
            sets: 3, restSeconds: 45,
            tip: "Full stretch at the bottom, 2s pause at the top. Calves respond to time under tension, not to bouncing.",
            coachZ: "Two-second holds. If it does not burn by rep 10 you are bouncing, not lifting.",
            avoid: "Do not bounce out of the bottom on the Achilles tendon.",
          },
        ],
      },
      {
        name: "CARDIO — POST-LIFT",
        badge: "20 min · Zone 2",
        note: "Bike rather than treadmill on leg days — the legs have done enough impact work, and the bike lets you hold Zone 2 without the quads giving out. Twenty minutes here because leg days carry one fewer exercise.",
        items: [
          { label: "Upright or Recumbent Bike", detail: "20 min · RPE 5–6 · conversational pace", tip: "You should be able to hold a sentence but not a conversation. Steady resistance, 70–85 rpm." },
        ],
      },
      {
        name: "CORE & COOLDOWN",
        badge: "5 min",
        items: [
          { label: "Hanging Knee Raise", detail: "3×12", tip: "Curl the pelvis up at the top — that is the part that trains the lower abs. Control the way down, no swinging." },
          { label: "Stomach Vacuum (ADIM)", detail: "2×15s", tip: "Full exhale, navel to spine." },
          { label: "Quad + Hip Flexor Stretch", detail: "60s", tip: "Couch stretch or standing quad pull. 20–30s each side." },
        ],
      },
    ],
  },
  {
    id: "thu",
    label: "THU",
    title: "Upper B",
    subtitle: "6:15–7:45am · The V-Taper Day",
    color: "#00C2FF",
    icon: "🔺",
    burn: "~440 kcal",
    cardioType: "Post-lift Zone 2 · 15 min",
    sections: [
      {
        name: "WARM-UP",
        badge: "6 min",
        items: [
          { label: "Rower", detail: "3 min · easy", tip: "Rowing warms the exact chain this day uses — lats, rear delts, upper back." },
          { label: "Band Pull-Aparts + Shoulder Dislocates", detail: "2×15 each", tip: "Overhead pressing needs the shoulders genuinely mobile, not merely warm." },
          { label: "Dead Hang", detail: "2×20s", tip: "Decompresses the spine and pre-stretches the lats before pull-ups." },
        ],
      },
      {
        name: "STRENGTH — UPPER B",
        badge: "6 exercises · 44 min",
        isStrength: true,
        note: EFFORT_UPPER + " THIS IS THE V-TAPER DAY. Vertical pull leads, vertical press second, then the two width movements. Every exercise here is chosen for the shoulder-to-waist ratio — the one number that decides whether a lean physique reads as athletic.",
        items: [
          {
            label: "1. Pull-Up (assisted or weighted)",
            detail: "4×6–8 · 120s rest · use the assist machine to reach 6–8 clean reps",
            sets: 4, restSeconds: 120,
            tip: "Grip slightly outside shoulder width. Start from a dead hang, drive the elbows down and back, chin clears the bar. If you cannot get 6, use the assist machine and reduce the assistance weekly — that IS the progression.",
            coachZ: "The best lat-width exercise in the building. Every week you take 10lbs off the assist stack is a week the taper got wider.",
            avoid: "No kipping, no swinging. Half a clean rep beats a full ugly one.",
          },
          {
            label: "2. Seated DB Shoulder Press",
            detail: "3×8–10 · 90s rest · START: 25–30lb DBs",
            sets: 3, restSeconds: 90,
            tip: "Back supported, dumbbells start at ear height, press up and slightly together. Do not lock out hard at the top — stop just short and keep the delts loaded.",
            coachZ: "Front delts give the shoulder its depth from the side. Press with the elbows, not the hands.",
            avoid: "Do not arch the lower back to press heavier — that is a decline press with extra steps.",
          },
          {
            label: "3. Machine Row, Neutral Grip",
            detail: "3×10–12 · 75s rest",
            sets: 3, restSeconds: 75,
            tip: "Neutral, palms-facing handles put the lats in their strongest line. Pull to the lower ribs, 1s squeeze, 3s return.",
            coachZ: "Chest on the pad, elbows tight to the body. You should feel this under the armpit — that is the lat, not the arm.",
            avoid: "Do not yank with the lower back or let the shoulders roll forward at the stretch.",
          },
          {
            label: "4. Cross-Body Cable Y-Raise",
            detail: "4×12–15 · 45s rest · low pulley, light weight",
            sets: 4, restSeconds: 45,
            tip: "Stand side-on to a low pulley and take the handle with the FAR hand so the cable crosses your body, then raise up and out on a Y-line to shoulder height. Starting across the body gives the lateral delt a stretch a dumbbell can never reach.",
            coachZ: "This ranks at the top of Jeff Nippard's lateral-delt picks, and the reason is the stretch — it is the deepest loaded stretch you can get on a side delt. Go lighter than your ego wants and hold the top for a full second.",
            avoid: "Do not turn it into a front raise. The path is out to the side and slightly forward, never straight ahead.",
          },
          {
            label: "5. Straight-Arm Cable Pulldown",
            detail: "3×12–15 · 45s rest",
            sets: 3, restSeconds: 45,
            tip: "High pulley, rope or straight bar, arms locked nearly straight. Drive down to the thighs using only the lats. Torso stays still.",
            coachZ: "Pure lat isolation with zero bicep involvement. Biceps are usually what fail first on width work, so this is the movement that finishes the lats properly.",
            avoid: "Do not bend the elbows — the moment you do, it becomes a pushdown.",
          },
          {
            label: "6. Incline DB Curl",
            detail: "3×10–12 · 45s rest · START: 15–17.5lb DBs",
            sets: 3, restSeconds: 45,
            tip: "Bench at 45–60°, arms hanging straight down behind the torso. That stretched start is why this beats a standing curl.",
            coachZ: "Let the arms hang fully at the bottom — the stretch position is where the long head of the bicep actually grows.",
            avoid: "Do not let the elbows swing forward to start the rep.",
          },
        ],
      },
      {
        name: "CARDIO — POST-LIFT",
        badge: "15 min · Zone 2",
        note: "Fifteen minutes, after the lift, on every upper day. Consistent and unremarkable is the point — this is a strength-led fat-loss plan and the treadmill is not where the weight comes off.",
        items: [
          { label: "Incline Treadmill Walk", detail: "15 min · RPE 5–6 · 3.0–3.5mph / 8–10%", tip: "Hands off the rails. If you could sing, raise the incline; if you cannot speak, lower it." },
        ],
      },
      {
        name: "CORE & COOLDOWN",
        badge: "5 min",
        items: [
          { label: "Cable Crunch", detail: "3×15", tip: "Kneel facing the stack, rope behind the head, crunch by rounding the spine down toward the knees. Hips stay still — this is spinal flexion, not a hip hinge." },
          { label: "Stomach Vacuum (ADIM)", detail: "2×15s", tip: "Full exhale, navel to spine." },
          { label: "Lat + Rear Delt Stretch", detail: "60s", tip: "Hang from the bar, then a cross-body arm pull. 20–30s each." },
        ],
      },
    ],
  },
  {
    id: "fri",
    label: "FRI",
    title: "Lower B",
    subtitle: "6:15–7:45am · Hinge + Glutes",
    color: "#FFB800",
    icon: "⚡",
    burn: "~480 kcal",
    cardioType: "Post-lift Zone 2 · 20 min",
    sections: [
      {
        name: "WARM-UP",
        badge: "7 min",
        items: [
          { label: "Bike", detail: "4 min · easy", tip: "Deadlifting at 6:15am on a cold spine is how backs get tweaked. Warm up properly." },
          { label: "Glute Bridges + Cat-Cow", detail: "2×15 bridges · 10 cat-cow", tip: "Wake the glutes up before hinging, or the lower back will do their job for them." },
          { label: "Light Trap-Bar Pulls", detail: "2×5 · 40–50% working weight", tip: "Groove the setup: hips back, chest up, lats engaged." },
        ],
      },
      {
        name: "STRENGTH — LOWER B",
        badge: "5 exercises · 42 min",
        isStrength: true,
        note: EFFORT_LOWER + " Hinge day. Trap-bar over conventional because it keeps the spine more upright and lets you train hard without the recovery cost of a barbell deadlift in a deficit. Glutes get direct work here — training them does not burn fat off them, because nothing does, but strong glutes change the shape of the hips regardless of what the scale says.",
        items: [
          {
            label: "1. Trap-Bar Deadlift",
            detail: "3×5 · 150s rest · START: 135–155lbs, find it in week 1",
            sets: 3, restSeconds: 150,
            tip: "Stand tall inside the bar, hips back, chest up, lats squeezed. Push the floor away rather than pulling the bar up. Reset the brace between every rep.",
            coachZ: "Three sets of five. Heavy, clean, done. This lift exists to hold your total-body strength while you diet, not to be a workout by itself.",
            avoid: "Never round the lower back. If the back rounds, the set is over — no exceptions.",
          },
          {
            label: "2. Bulgarian Split Squat",
            detail: "3×8–10 per leg · 90s rest · bodyweight or light DBs",
            sets: 3, restSeconds: 90,
            tip: "Rear foot on a bench, front foot far enough forward that the front shin stays roughly vertical. Leaning the torso slightly forward loads the glute; staying upright loads the quad.",
            coachZ: "The most honest exercise in the program — it will find every imbalance you have. Start at bodyweight and add dumbbells once 10 clean reps a side is easy.",
            avoid: "Do not let the front knee cave inward, and do not push off the back foot.",
          },
          {
            label: "3. Barbell or Machine Hip Thrust",
            detail: "3×10–12 · 75s rest",
            sets: 3, restSeconds: 75,
            tip: "Shoulder blades on the bench, chin tucked, drive through the heels. Full lockout with a hard 1s glute squeeze, ribs down — do not finish the rep with your lower back.",
            coachZ: "One-second squeeze at the top of every single rep. Glutes are a posture muscle as much as a shape muscle; they change how you stand.",
            avoid: "Do not hyperextend the lower back at the top to fake extra range.",
          },
          {
            label: "4. Lying Leg Curl",
            detail: "3×12–15 · 60s rest",
            sets: 3, restSeconds: 60,
            tip: "Hips flat on the pad, curl all the way to the glutes, 3s return. Point the toes toward your shins to keep the calves out of it.",
            coachZ: "Second hamstring session of the week. Hamstrings recover fast — train them twice and they will take it.",
            avoid: "Do not let the hips pop up off the pad to finish reps.",
          },
          {
            label: "5. Seated Calf Raise",
            detail: "3×15–20 · 45s rest",
            sets: 3, restSeconds: 45,
            tip: "Seated hits the soleus, which Tuesday's standing version misses. Full stretch, 2s pause at the top.",
            coachZ: "Higher reps than Tuesday on purpose — the soleus is almost entirely slow-twitch and wants the volume.",
            avoid: "Do not bounce. Ever, on calves.",
          },
        ],
      },
      {
        name: "CARDIO — POST-LIFT",
        badge: "20 min · Zone 2",
        note: "Bike again. After trap-bar pulls and split squats, the last thing the legs need is twenty minutes of impact. Seated, steady, easy on the joints, straight into the deficit.",
        items: [
          { label: "Upright or Recumbent Bike", detail: "20 min · RPE 5–6 · conversational pace", tip: "Steady resistance at 70–85 rpm. Do not race it — Zone 2 means you could keep going for another twenty." },
        ],
      },
      {
        name: "CORE & COOLDOWN",
        badge: "5 min",
        note: "Side planks, not side bends. An isometric hold trains the obliques to stabilise without adding the thickness that loaded side bends build.",
        items: [
          { label: "Side Plank", detail: "2×40s per side", tip: "Body in one straight line, hips high, top shoulder stacked over the bottom one." },
          { label: "Stomach Vacuum (ADIM)", detail: "2×15s", tip: "Full exhale, navel to spine." },
          { label: "Hamstring + Glute Stretch", detail: "60s", tip: "Seated forward fold and figure-4 stretch. 20–30s each side." },
        ],
      },
    ],
  },
  {
    id: "sat",
    label: "SAT",
    title: "Delts + Arms",
    subtitle: "7:00–8:15am · Gym opens 7 on Saturdays",
    color: "#C84BFF",
    icon: "💜",
    burn: "~460 kcal",
    cardioType: "HIIT conditioning · 18 min",
    sections: [
      {
        name: "WARM-UP",
        badge: "6 min",
        items: [
          { label: "Bike or Rower", detail: "3 min · easy", tip: "Saturday starts at 7am because the gym does not open earlier. Home by 8:15 either way." },
          { label: "Band Pull-Aparts + Band Face Pulls", detail: "2×20 each", tip: "The shoulders carry the whole session today. Warm them properly." },
          { label: "Empty Bar Overhead Press", detail: "2×10", tip: "Groove the press path and check overhead mobility." },
        ],
      },
      {
        name: "STRENGTH — DELTS & ARMS",
        badge: "6 exercises · 38 min",
        isStrength: true,
        note: EFFORT_UPPER + " The whole day is width and detail — the two things that make a lean physique read as built rather than merely thin. Third lateral-delt session of the week, and the arms get their only dedicated block. The strength block is shorter because the conditioning finisher is longer today.",
        items: [
          {
            label: "1. Standing Barbell Overhead Press",
            detail: "3×6–8 · 120s rest · START: 55–65lbs",
            sets: 3, restSeconds: 120,
            tip: "Squeeze the glutes and brace the abs before you press — standing means your core pays for any sloppiness. Bar path close to the face, finish with the bar over the mid-foot.",
            coachZ: "The one genuinely heavy press of the day. Everything after this is detail work.",
            avoid: "Do not lean back to press the bar around your head. Move the head back, not the bar forward.",
          },
          {
            label: "2. DB Lateral Raise (drop set on the last)",
            detail: "4×12–15 · 45s rest · START: 10–12.5lb DBs · last set is a drop set",
            sets: 4, restSeconds: 45,
            tip: "Lean 5° forward, lead with the elbows, stop at shoulder height. On the LAST set only: go to failure, immediately drop to the next lighter pair, go to failure again.",
            coachZ: "Third lateral session this week — Monday cables, Thursday Y-raises, today dumbbells. Three angles, one goal: the wider the shoulders, the smaller the waist reads. This is the highest-leverage exercise in the whole program for the look you want.",
            avoid: "Do not shrug or swing. If the traps are burning, the weight is too heavy.",
          },
          {
            label: "3. Face Pull",
            detail: "3×15–20 · 45s rest · rope at eye height",
            sets: 3, restSeconds: 45,
            tip: "Rope at eye height, pull toward the forehead and rotate the hands so the knuckles finish facing behind you. High reps, light weight, 1s hold.",
            coachZ: "Rear delts and external rotators. This is what keeps the shoulders sitting BACK — and posture is genuinely half of how lean you look in a shirt.",
            avoid: "Do not go heavy enough that the lats and traps take over.",
          },
          {
            label: "4. EZ-Bar Curl",
            detail: "3×10–12 · 60s rest · START: 40–50lbs",
            sets: 3, restSeconds: 60,
            tip: "Elbows pinned at the sides, full extension at the bottom, 3s lowering. The EZ bar angle is easier on the wrists than a straight bar.",
            coachZ: "No body english. If the hips are moving, the biceps have stopped working.",
            avoid: "Do not swing the weight up or let the elbows travel forward.",
          },
          {
            label: "5. Overhead Cable Tricep Extension",
            detail: "3×10–12 · 60s rest",
            sets: 3, restSeconds: 60,
            tip: "Face away from a low-to-mid pulley, rope overhead, elbows pointed forward and fixed. The overhead position stretches the long head — the part that gives the arm thickness from behind.",
            coachZ: "Deep stretch at the bottom, full lockout at the top. The long head is two-thirds of the tricep and this is the only position that properly loads it.",
            avoid: "Do not let the elbows flare out wide or drift down.",
          },
          {
            label: "6. Hammer Curl → Rope Pushdown (superset)",
            detail: "2×12–15 each · 45s rest after the pair",
            sets: 2, restSeconds: 45,
            tip: "Hammer curls straight into rope pushdowns with no rest between them, then rest 45s. Neutral-grip curls hit the brachialis, which pushes the bicep up and makes the arm look wider from the front.",
            coachZ: "The finisher. Two rounds, full pump, then get to the bike. It is a superset because we are buying back minutes for the conditioning block.",
            avoid: "Do not let form fall apart chasing the burn.",
          },
        ],
      },
      {
        name: "CARDIO — CONDITIONING FINISHER",
        badge: "18 min · intervals",
        note: "The one interval session of the week. Minute for minute, HIIT and steady-state burn about the same fat — HIIT is here because it fits more work into fewer minutes, not because it is magic. If you are beaten up or under-slept, swap it for an 18-minute incline walk with zero guilt.",
        items: [
          { label: "Bike Intervals", detail: "18 min · 3 min easy warm-up, then 9× (30s HARD / 60s easy), 1.5 min cool-down", tip: "The 30s efforts should be genuinely hard — RPE 8–9, you cannot talk. The 60s recovery is a real recovery: keep pedalling, but easy.", highlight: true },
          { label: "Alternative: Incline Walk", detail: "18 min · RPE 5–6 · 3.0–3.5mph / 10%", tip: "Same fat-loss result across the week. Take it whenever recovery is the limiting factor." },
        ],
      },
      {
        name: "CORE & COOLDOWN",
        badge: "7 min",
        items: [
          { label: "🅩 Posing Practice", detail: "5 min · mirror or phone camera", tip: "Coach Z's Saturday ritual: front lat spread (10s), front double-bicep (10s), side chest (10s), vacuum pose (15s) — two rounds each. Flexing under weekly fatigue hardens the physique and shows you exactly where the taper is developing. Film it monthly; the camera tracks fat loss far better than the scale.", highlight: true },
          { label: "Stomach Vacuum (ADIM)", detail: "3×15s", tip: "Full exhale, navel to spine." },
          { label: "Full Body Static Stretch", detail: "2 min", tip: "Delts, lats, chest, hip flexors, hamstrings. 20–30s each." },
        ],
      },
    ],
  },
];

const dailyLayer = [
  { icon: "📉", title: "PHASE 1 — 1,800 kcal/day", body: "Aug 20 → Oct 5, the 80→75kg push. Band: 1,750–1,900. Your maintenance sits around 2,650–2,700 with five lifting days and 10k steps, so this is roughly an 850 kcal/day deficit — aggressive on purpose, because 0.77 kg/week is what the deadline demands." },
  { icon: "📅", title: "PHASE 2 — 2,000 kcal/day", body: "Oct 6 → mid-December, the 75→70kg finish. Recalculated at the lighter bodyweight and a gentler ~0.5 kg/week. Easier to live with, and 70kg is where this ends." },
  { icon: "🍽️", title: "Protein 170g/day", body: "2.1 g/kg — raised from 140g precisely BECAUSE the Phase 1 rate is aggressive. This is the most important number on this screen: in a deficit this steep, protein plus hard lifting is the entire reason you lose fat instead of muscle. Drop to 160g in Phase 2." },
  { icon: "🥑", title: "Fat 60g Floor · Carbs Fill the Rest", body: "60g of fat minimum for hormone production — do not go under it. At 1,800 kcal that leaves roughly 150g of carbs. Put most of them around the 6:15am session and the evening meal." },
  { icon: "👣", title: "10,000–12,000 Steps Daily", body: "Rest days included. NEAT is worth 300–500 kcal/day, often more than the workout itself, and it is already counted in the maintenance number above. With a desk job this does not happen by accident — it has to be deliberate." },
  { icon: "📏", title: "Waist Under 90cm", body: "Measure at the navel, same time, once a week. 90cm is the expert cut-point for South Asian men and it tracks visceral fat better than the scale does. Love handles and belly are exactly what this number measures — and it keeps moving in weeks when the scale sulks." },
  { icon: "🚫", title: "No Spot Reduction", body: "Chest, love handles, tummy and glutes come off in the order your genetics decide, driven by the total deficit. Nothing you train changes that order. The honest version: hold the deficit, keep lifting, and those areas go last because they went on first. If a firm, tender lump stays right under a nipple once you are lean, that is gynecomastia rather than fat — a doctor question, not a cardio one." },
  { icon: "🔁", title: "The Stall Protocol", body: "If the 7-day average has not moved in 10+ days: subtract 100 kcal OR add 2,000 steps — one, not both. If you are losing more than 1 kg/week for two weeks running, add 100 kcal back; that rate is costing you muscle." },
  { icon: "⚖️", title: "Weigh-In Protocol", body: "Daily, same time, after the bathroom, before food. Track the 7-day average, never the daily number. The trend line is the truth; a single morning is water, salt and last night's dinner." },
  { icon: "📈", title: "Effort + Double Progression", body: "Last set of every lift to 0–1 reps in reserve on upper body, 1–2 on legs. When all sets reach the TOP of the rep range with clean form, add 5lbs upper or 10lbs lower. Holding or adding load week-to-week is your #1 proof that muscle is being retained — so log every session. Returning lifters ride fast muscle-memory gains for 8–12 weeks; use them." },
  { icon: "💧", title: "Hydration + Sleep", body: "3L+ water daily. 7–8 hours of sleep — under 6 hours shifts weight loss away from fat and toward muscle, which on this plan is the one failure mode that matters. Sleep is a fat-loss tool, not a luxury." },
  { icon: "🥘", title: "Indian Protein Playbook", body: "Hitting 170g on a desi diet: soy chunks (52g/100g, the cheapest protein there is), paneer (18g/100g), Greek yogurt or hung curd (10g/100g), dal and rice as a complete combo, eggs, chicken. The hidden deficit-killers are ghee and cooking oil — a tablespoon is 120 kcal, and four of them is your entire day's margin." },
];

const coachZPrinciples = [
  { num: "01", title: "Laterals Three Times a Week", body: "Monday cables, Thursday cross-body Y-raises, Saturday dumbbells. Side delts are the highest-leverage muscle you have for the look you are after: the wider the shoulders, the smaller the waist reads, and that ratio is what makes a lean physique look built." },
  { num: "02", title: "Every Upper Day Is a Lat Day", body: "Pulldowns Monday, pull-ups and straight-arm pulldowns Thursday, face pulls Saturday. Lats are the other half of the V — width you build while the fat comes off, so the taper is already there when you get lean." },
  { num: "03", title: "Guard the Waist", body: "No weighted side bends, no loaded oblique twists — they build exactly the thickness you are trying to lose. Vacuums, planks and leg raises only. The vacuum is the one piece of waist training that genuinely changes how the midsection sits." },
  { num: "04", title: "3-Second Eccentrics on Compounds", body: "The lowering phase is where muscle is built and kept. Slow negatives preserve more muscle per set while cutting — exactly the trade you want when calories are low and every set has to earn its place." },
  { num: "05", title: "The Squeeze IS the Rep", body: "1–2s peak contraction on every isolation movement. Travel moves weight; the squeeze builds the shape. In a deficit you cannot out-volume your recovery, so quality per rep is the only lever left." },
  { num: "06", title: "Film It Monthly", body: "Saturday posing practice, plus all-day posture — shoulders back, chest up, core braced. Photograph the same three poses in the same light on the 1st of every month. Between 80kg and 70kg the camera will show you things the scale never will." },
];

const weekMap = [
  { day: "MON", focus: "Upper A — Chest + Back Width", burn: 440, color: "#FF4D1C" },
  { day: "TUE", focus: "Lower A — Squat + Zone 2", burn: 480, color: "#00E87A" },
  { day: "WED", focus: "Off — Walk 30min + 10k Steps", burn: 250, color: "#444" },
  { day: "THU", focus: "Upper B — The V-Taper Day", burn: 440, color: "#00C2FF" },
  { day: "FRI", focus: "Lower B — Hinge + Zone 2", burn: 480, color: "#FFB800" },
  { day: "SAT", focus: "Delts + Arms + Intervals", burn: 460, color: "#C84BFF" },
  { day: "SUN", focus: "Off — Walk 30min + 10k Steps", burn: 250, color: "#444" },
];

  window.DEFAULT_PLAN = {
    branding: {
      title: "TRAINING APP",
      accentColor: CZ,
      gymLabel: "CRUNCH HUNTINGDON VALLEY · LEAN V-TAPER × COACH Z",
      statsLine: "80KG → 75KG BY OCT 5 → 70KG BY DEC",
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

// ─────────────────────────────────────────────────────────────
// Shared workout-plan template + helpers for the gym app.
// Loaded by both index.html and admin/index.html; exposes
// window.DEFAULT_PLAN (the seed/fallback plan) and
// window.slugifyUsername (username → Firestore-safe doc id).
//
// PHASE: Lean V-taper cut — 80kg → 75kg (Oct 5) → 70kg (Dec).
// Split: 4 days, Upper / Lower / Upper / Lower, 6:15am slot.
// Mon Upper A · Tue Lower A + HIIT · Thu Upper B · Fri Lower B + HIIT.
// Wed / Sat / Sun: the daily 30-min walk + steps.
// ─────────────────────────────────────────────────────────────
(function () {
const CZ = "#B388FF"; // Coach Z accent

// ─────────────────────────────────────────────────────────────
// 4-DAY STICK-TO-IT BUILD · JEFF NIPPARD × COACH Z
// Goal: the most fat loss per minute of effort, in a plan that holds
// up for months — not the most work that can be crammed into a week.
// Nutrition, phase targets and the waist target are unchanged from the
// 5-day V-taper build this replaces.
//
// What the evidence says, and how it shaped this:
//   • The food deficit drives weight loss; exercise alone gives modest
//     loss (ACSM position stand, Donnelly 2009). >250 min/week of
//     activity is linked to clinically meaningful loss — 4 gym days
//     (~200 min) + the daily 30-min walk (~210 min) clears that easily.
//   • Lifting's job in a cut is holding muscle. Iversen et al. 2021
//     ("No Time to Lift?"): ≥4 hard sets per muscle per week, mostly
//     multi-joint lifts, is the time-efficient floor. Bickel 2011: trained
//     lifters kept size/strength on ~1/3 of the volume that built it.
//   • HIIT doesn't beat steady cardio for long-term adherence (12-month
//     trials), so it stays short and limited to 2×/week, used only
//     because it's time-efficient.
//   • The daily walk IS the Zone 2 work. It's an existing habit, which
//     makes it far more reliable than 15–20 min treadmill blocks, so
//     those were taken out of the gym sessions.
//   • Habit: same slots every week (consistent context, Lally 2010),
//     and a missed session doesn't break the habit — a Bad Day Rule
//     (warm-up + first 2 lifts) keeps short weeks from derailing it.
//
// Lift selection and SLOT ORDER match the 5-day V-taper build, so logged
// sets and personal-best badges (which map old logs by day + slot) keep
// pointing at the same lift. Max 5 main lifts a day: upper days dropped
// their trailing arm isolation; lower days keep all five slots, with the
// calf raise at 2 short sets.
//
// Session length (computed as sets × (work + rest) + transitions):
//   Upper ≈ 46 min, +10 min optional extra-burn walk
//   Lower ≈ 56 min including the HIIT finisher
// No supersets — straight sets, fixed rest.
// ─────────────────────────────────────────────────────────────

const days = [
  {
    id: "mon",
    label: "MON",
    title: "Upper A",
    subtitle: "6:15am · Incline · Lat Width · Row · Delts",
    color: "#FF4D1C",
    icon: "🔥",
    burn: "~380 kcal",
    cardioType: "Lift + optional incline walk",
    sections: [
      {
        name: "WARM-UP & JOINT PREP",
        badge: "8 min",
        note: "~46 min total today (~56 with the optional walk). Rope raises core temp fast; the drills open the shoulders and mid-back you're about to load. Don't skip it — cold shoulders under a pressing load are the #1 way people get hurt on upper days.",
        items: [
          { label: "Skipping Rope Primer", detail: "3 min · easy–moderate bounce", tip: "Full-body, ~12–15 kcal/min, spikes heart rate faster than a bike. Light two-foot bounce, 1–2 inches off the floor, elbows in, wrists doing the turning. Land soft — this is a primer, not the workout. 60s on / 20s off if you're new to it." },
          { label: "Band Pull-Aparts + Band Face Pulls", detail: "2×15 each", tip: "Arms straight on the pull-aparts, shoulder blades down-and-back. Face pulls: elbows high, thumbs rotate back. Rear-delt and rotator-cuff prep — the posture you'll press and row from." },
          { label: "Thoracic Rotations + Scapular Wall Slides", detail: "2×8 per side / 2×10", tip: "On all fours, thread one arm under then rotate open. Then back to a wall, arms in a goalpost, slide up and down keeping wrists and elbows on the wall. Mid-back mobility lets you press without the lower back arching." },
          { label: "Light Incline Bench", detail: "2×8 · 40–50% working weight", tip: "Rehearsal, not work. Set the shoulder blades, plant the feet, groove the bar path to the upper chest. Finish with a 15s stomach vacuum before set 1." },
        ],
      },
      {
        name: "STRENGTH — UPPER A",
        badge: "5 exercises · 32 min",
        note: "Straight sets, fixed rest — use the in-app timer; these numbers are what make the block land at ~32 min. Last set of each lift at 0–1 reps in reserve: genuinely hard, form still clean. That effort, not the calories burned lifting, is what tells your body to keep muscle in a deficit. When every set hits the top of the rep range, add 5lb next time — the PB badge shows the number to beat. Incline leads because upper chest is the first line to reappear as chest fat comes off; the pulldown is early because lat width is half the V-taper. BAD DAY RULE: short on time or energy? Warm-up + exercises 1–2, then go (~25 min). A short session keeps the habit; a skipped one starts breaking it.",
        items: [
          {
            label: "1. Incline Barbell Bench Press",
            detail: "3×6–10 · 2 min rest",
            sets: 3, restSeconds: 120,
            tip: "Bench at 30°, not 45° — any higher and it becomes a shoulder press. Shoulder blades pinched down and back into the bench, feet flat and driving into the floor, elbows ~45° from the torso, bar to the upper chest. Wrists stacked straight over the elbows the whole time.",
            coachZ: "Visualize the upper chest doing the work before you unrack. 3-second lowering on every rep. Between sets, 10s of hard pec flexing to keep the connection lit.",
            avoid: "No bouncing the bar off the chest, no flared elbows (shoulder-impingement risk), no grinding ugly reps once the wrists bend back or the hips leave the bench.",
          },
          {
            label: "2. Wide-Grip Lat Pulldown",
            detail: "3×8–12 · 90s rest",
            sets: 3, restSeconds: 90,
            tip: "Grip just outside shoulder width, thumbs over the bar. Chest up, ~15° lean from the hips — not a rocking torso. Pull the shoulder blades DOWN first, then drive the elbows down toward the back pockets. Bar to the collarbone, slow 3s return, full stretch at the top.",
            coachZ: "Every rep here is width. Hold the bottom squeeze one full second and feel the lats spread.",
            avoid: "Don't lean back past ~15° (that turns it into a row), pull with the biceps, or pull behind the neck.",
          },
          {
            label: "3. Chest-Supported Row (Hammer Strength)",
            detail: "2×10–12 · 75s rest",
            sets: 2, restSeconds: 75,
            tip: "Chest stays glued to the pad — that takes the lower back out of the equation entirely, the safest row there is in a deficit. Pull to the lower ribs, 1s squeeze of the shoulder blades, 3s on the return stretch.",
            coachZ: "Upper-back thickness is what holds the posture that makes a V-taper visible with a shirt on. Retract the shoulder blades HARD at the end of every rep.",
            avoid: "Don't shrug the weight up or let the chest come off the pad to move more load.",
          },
          {
            label: "4. Flat DB Press",
            detail: "2×10–12 · 75s rest",
            sets: 2, restSeconds: 75,
            tip: "Shoulder blades set back and down, ribcage down, dumbbells in line with the lower chest at the bottom, elbows ~45° from the torso. Press up and slightly inward. Full stretch at the bottom is where the stimulus lives.",
            coachZ: "Squeeze the pecs hard at the top before lowering. Own the contraction; the dumbbells are just along for the ride.",
            avoid: "Don't let the lower back arch off the bench or the dumbbells drift out wide.",
          },
          {
            label: "5. Cable Lateral Raise",
            detail: "3×12–15 · 45s rest",
            sets: 3, restSeconds: 45,
            tip: "Low pulley behind you, lean 5° away, soft elbow, lead with the elbow, stop at shoulder height. Cables keep tension at the bottom where dumbbells give you nothing. 2–3s lowering.",
            coachZ: "Laterals get hit twice this week — here and Thursday's Y-raise — because wide delts are the fastest visual return while you lean out. After the final set, 15 top-half partials.",
            avoid: "Don't shrug at the top — that's the traps stealing the work. Don't swing the stack.",
          },
        ],
      },
      {
        name: "CORE & COOLDOWN",
        badge: "6 min",
        note: "Weighted, progressible core is the driver — add load or reps every week. The vacuum stays a 30-second posture primer.",
        items: [
          { label: "1. Weighted Cable Crunch", detail: "3×12–15 · add load when 15 is easy", tip: "Kneel facing the stack, rope by the ears, hips fixed. Crunch by rounding the spine down toward the pelvis — pull with the abs, not the arms or hips. 1s squeeze, 3s back up." },
          { label: "2. Stomach Vacuum (ADIM)", detail: "2×15s holds", tip: "Full exhale, draw the navel in and up under the ribs. Deep-core support work — a bonus, not the driver." },
          { label: "Chest + Lats Stretch", detail: "60s", tip: "Doorway stretch for the chest, overhead doorframe lean for the lats. Breathe into it, don't bounce." },
        ],
      },
      {
        name: "OPTIONAL — EXTRA BURN",
        badge: "10 min · skip if short on time",
        note: "Only if you have the time. Your daily 30-min walk already covers your Zone 2, so skipping this costs you ~60–80 kcal — not the plan.",
        items: [
          { label: "Incline Treadmill Walk", detail: "10 min · RPE 5–6 · 3.0–3.5mph / 8–12%", tip: "Tall posture, ribs over hips, hands OFF the rails — holding on cuts the calorie cost by a fifth to a third." },
        ],
      },
    ],
  },
  {
    id: "tue",
    label: "TUE",
    title: "Lower A + HIIT",
    subtitle: "6:15am · Squat · RDL · Sprint Finisher",
    color: "#00E87A",
    icon: "🦵",
    burn: "~420 kcal",
    cardioType: "Lift + HIIT finisher",
    sections: [
      {
        name: "WARM-UP & JOINT PREP",
        badge: "8 min",
        note: "~56 min total today. Cold hips and knees under a loaded squat is the fastest route to injury. Rope is short today so it doesn't pre-tire the calves.",
        items: [
          { label: "Skipping Rope Primer", detail: "2 min · easy bounce", tip: "Kept short on leg day. Light two-foot bounce, soft landings — just raising core temp and getting blood into the lower legs." },
          { label: "90/90 Hip Switches + Adductor Rockbacks", detail: "2×8 per side", tip: "Opens hip rotation so you can hit depth without the pelvis tucking under ('butt wink'). The best 2 minutes you can spend before squatting." },
          { label: "BW Squats + Glute Bridges", detail: "2 rounds · 10 each", tip: "Full-depth BW squats to rehearse the pattern; 2s holds at the top of each bridge to switch the glutes on." },
          { label: "Empty-Bar Squat", detail: "1–2 sets · 8 reps", tip: "Grease the exact groove. Brace, sit between the hips, drive through the whole foot. Add a 15s vacuum before set 1." },
        ],
      },
      {
        name: "STRENGTH — LOWER A",
        badge: "5 exercises · 33 min",
        note: "Straight sets, fixed rest — timed to ~33 min. Legs need the longest rests; the numbers below already include them. Last set of each lift at 1–2 reps in reserve — real effort, with a touch more caution than upper body. Legs are your biggest muscles, so holding strength here matters most. BAD DAY RULE: warm-up + squat + RDL, then go (~25 min).",
        items: [
          {
            label: "1. Barbell Back Squat",
            detail: "3×6–10 · 2.5 min rest",
            sets: 3, restSeconds: 150,
            tip: "Bar on the traps, not the neck. Big breath into the belly, brace 360° before you unrack. Break at hips and knees together, knees tracking over the toes, go to a depth you can hold with a neutral spine — hip crease below the knee if your hips allow it. Drive up through the whole foot, hips and chest rising together.",
            coachZ: "2.5 min rest is not laziness, it's the point — this lift only protects muscle if the last set is still heavy and still clean. 3-second descent, squeeze the glutes at lockout.",
            avoid: "Knees caving in, heels lifting, chest dumping forward, or chasing depth you can't hold position through.",
          },
          {
            label: "2. Romanian Deadlift",
            detail: "3×8–12 · 2 min rest",
            sets: 3, restSeconds: 120,
            tip: "Soft knee bend, push the hips STRAIGHT back, bar drags down the thighs over mid-foot. Flat back, lats tight. Stop when the hamstrings run out of stretch — usually mid-shin, not the floor. Drive the hips forward to stand.",
            coachZ: "Hamstrings loading like a rubber band on the way down — 3 full seconds. That loaded stretch is the biggest hamstring stimulus there is.",
            avoid: "Rounding the lower back to reach lower — range comes from the hamstrings, not the spine. No hamstring stretch = spine doing the work = too heavy.",
          },
          {
            label: "3. Leg Press",
            detail: "2×10–15 · 90s rest · full ROM",
            sets: 2, restSeconds: 90,
            tip: "Feet mid-platform shoulder-width, back and glutes flat against the pad the entire set. Knees toward the armpits only as far as the lower back stays flat, drive through the whole foot, stop just short of locking the knees.",
            coachZ: "3s descent into a deep stretch. Last 5 reps of the final set: 1s pause at the bottom.",
            avoid: "Lower back rounding off the pad (disc stress), slamming into lockout, or loading so heavy the range shrinks to a few inches.",
          },
          {
            label: "4. Seated Leg Curl",
            detail: "2×10–15 · 75s rest",
            sets: 2, restSeconds: 75,
            tip: "Pad just above the heels, thighs strapped down, hips fixed. Seated puts the hamstrings under a better stretch than lying. Curl to full contraction with a 1s squeeze, 3s back to the stretch. Point the toes to take the calves out.",
            coachZ: "Hamstrings are what stop legs looking flat from the side once you lean out. Squeeze every rep like you mean it.",
            avoid: "Hips lifting off the seat to finish reps, bouncing out of the stretch.",
          },
          {
            label: "5. Standing Calf Raise",
            detail: "2×12–15 · 45s rest",
            sets: 2, restSeconds: 45,
            tip: "Ball of the foot on the platform, knees straight but not locked, body tall and braced. Full stretch at the bottom, 2s pause at the top, rise over the big toe — not the outside edge of the foot. Strong calves and Achilles make the rope and the daily walk easier on the ankles.",
            coachZ: "Two-second holds. If it doesn't burn by rep 10 you're bouncing, not lifting.",
            avoid: "Don't bounce out of the bottom on the Achilles tendon.",
          },
        ],
      },
      {
        name: "HIIT FINISHER",
        badge: "🔑 12 min · Bike Sprints",
        note: "Highest burn-per-minute block of the day. On leg day so your legs get Wed off afterward, and your next lower session is 3 days away. Bike, not treadmill — zero impact on legs that just squatted. Beaten up or under-slept? Swap for a 12-min incline walk, no guilt.",
        items: [
          { label: "Bike Sprints", detail: "8 rounds · 20s sprint / 60s easy spin + 2 min easy", tip: "Sit tall, don't collapse over the bars. Sprints at RPE 8–9 — hard but repeatable. If round 8 feels like round 1, you went too easy. Use the full 60s recovery.", highlight: true },
        ],
      },
      {
        name: "COOLDOWN",
        badge: "3 min",
        items: [
          { label: "Quads / Hams / Hip-Flexor Stretch", detail: "2 min", tip: "Standing quad pull, seated toe-touch, half-kneeling hip-flexor lunge. 20–30s each." },
          { label: "Standing Stomach Vacuum", detail: "2×15s holds", tip: "Short posture primer. Full exhale, navel in and up under the ribs." },
        ],
      },
    ],
  },
  {
    id: "thu",
    label: "THU",
    title: "Upper B",
    subtitle: "6:15am · The V-Taper Day · Pull-Ups · Press · Width",
    color: "#00C2FF",
    icon: "🧲",
    burn: "~380 kcal",
    cardioType: "Lift + optional incline walk",
    sections: [
      {
        name: "WARM-UP & JOINT PREP",
        badge: "8 min",
        note: "~46 min total today (~56 with the optional walk). Hanging and pressing overhead need healthy shoulder rotation and a stable mid-back — prep both before loading them.",
        items: [
          { label: "Skipping Rope Primer", detail: "3 min · easy–moderate bounce", tip: "Fast full-body temp-raise. Elbows in, wrists turning the rope, shoulders relaxed — don't grip the handles white-knuckle." },
          { label: "Band Shoulder Dislocates + Wall Slides", detail: "2×10 each", tip: "Wide grip on the band, slowly front-to-back — screens and opens shoulder rotation before anything goes overhead. Wall slides groove overhead alignment." },
          { label: "Dead Hang + Scapular Pull-Ups", detail: "2 × 20s hang / 8 scap pulls", tip: "Hang, then pull the shoulder blades down without bending the elbows. That's the first inch of every pull-up — rehearse it. 15s vacuum before set 1." },
        ],
      },
      {
        name: "STRENGTH — UPPER B",
        badge: "5 exercises · 32 min",
        note: "Straight sets, fixed rest — timed to ~32 min. Last set of each lift at 0–1 reps in reserve. Coach Z: this is the width day — lats and side delts get the priority slots, every set ends with a squeeze, every rest includes a flex. BAD DAY RULE: warm-up + pull-ups + shoulder press, then go (~25 min).",
        items: [
          {
            label: "1. Pull-Up (assisted or weighted)",
            detail: "3×6–10 · 2 min rest · assist machine to reach 6 clean reps",
            sets: 3, restSeconds: 120,
            tip: "Grip slightly outside shoulder width. Start from a dead hang, shoulder blades DOWN first, then drive the elbows down and back until the chin clears the bar. Ribs down, legs still. If you can't get 6, use the assist machine and take assistance off weekly — that IS the progression.",
            coachZ: "The best lat-width exercise in the building. Every 10lbs you take off the assist stack is a week the taper got wider.",
            avoid: "No kipping, no swinging, no half-reps with the shoulders shrugged up. Half a clean rep beats a full ugly one.",
          },
          {
            label: "2. Seated DB Shoulder Press",
            detail: "3×8–12 · 90s rest",
            sets: 3, restSeconds: 90,
            tip: "Sit tall with the whole spine against the pad, core braced, ribs down. Dumbbells start at ear height, press up and slightly together — vertical path, not forward. Stop just short of hard lockout to keep the delts loaded.",
            coachZ: "Front delts give the shoulder its depth from the side. Press with the elbows, not the hands. 3s lowering.",
            avoid: "Don't arch the lower back off the pad to press heavier — that's the load leaking into your spine instead of your delts.",
          },
          {
            label: "3. Machine Row, Neutral Grip",
            detail: "2×10–12 · 75s rest",
            sets: 2, restSeconds: 75,
            tip: "Chest on the pad, elbows tight to the body. Neutral, palms-facing handles put the lats in their strongest line. Pull to the lower ribs, 1s squeeze, 3s return.",
            coachZ: "You should feel this under the armpit — that's the lat, not the arm.",
            avoid: "Don't yank with the lower back or let the shoulders roll forward at the stretch.",
          },
          {
            label: "4. Cross-Body Cable Y-Raise",
            detail: "3×12–15 per arm · 45s rest · low pulley, light weight",
            sets: 3, restSeconds: 45,
            tip: "Stand side-on to a low pulley and take the handle with the FAR hand so the cable crosses your body, then raise up and out on a Y-line to shoulder height. Stand tall, no torso sway. Starting across the body gives the side delt a stretch a dumbbell can't reach.",
            coachZ: "One of Nippard's top lateral-delt picks, because of that stretch. Go lighter than your ego wants and hold the top for a full second.",
            avoid: "Don't turn it into a front raise — the path is out to the side and slightly forward, never straight ahead.",
          },
          {
            label: "5. Straight-Arm Cable Pulldown",
            detail: "2×12–15 · 45s rest",
            sets: 2, restSeconds: 45,
            tip: "High pulley, rope or straight bar, slight hip hinge, arms locked nearly straight. Drive down to the thighs using only the lats; torso stays still, ribs down.",
            coachZ: "Pure lat isolation with zero bicep — the movement that finishes the lats after the pull-ups have tired your arms.",
            avoid: "Don't bend the elbows — the moment you do, it becomes a pushdown.",
          },
        ],
      },
      {
        name: "CORE & COOLDOWN",
        badge: "6 min",
        note: "Loaded and progressible — the weighted move is the driver.",
        items: [
          { label: "1. Hanging Leg Raise (add a DB between the feet when 3×12 is easy)", detail: "3×10–12", tip: "Dead-hang, shoulders packed. Curl the pelvis up toward the ribs at the top — that tilt loads the lower abs; just lifting the legs is mostly hip flexor. No swinging." },
          { label: "2. Stomach Vacuum (ADIM)", detail: "2×15s holds", tip: "30-second posture primer. Full exhale, navel in and up." },
          { label: "Shoulders / Lats / Arms Stretch", detail: "60s", tip: "Cross-body rear delt, overhead lat lean, gentle neck tilts. Breathe into it." },
        ],
      },
      {
        name: "OPTIONAL — EXTRA BURN",
        badge: "10 min · skip if short on time",
        note: "Only if you have the time. Your daily 30-min walk already covers your Zone 2.",
        items: [
          { label: "Incline Treadmill Walk", detail: "10 min · RPE 5–6 · 3.0–3.5mph / 8–12%", tip: "Hands off the rails. If you could sing, raise the incline; if you can't speak, lower it." },
        ],
      },
    ],
  },
  {
    id: "fri",
    label: "FRI",
    title: "Lower B + HIIT",
    subtitle: "6:15am · Deadlift · Split Squat · Glutes · Intervals",
    color: "#C84BFF",
    icon: "🧩",
    burn: "~420 kcal",
    cardioType: "Lift + HIIT finisher",
    sections: [
      {
        name: "WARM-UP & JOINT PREP",
        badge: "8 min",
        note: "~56 min total today. Hinge day — the hips and spine need to be warm before the deadlift.",
        items: [
          { label: "Skipping Rope Primer", detail: "2 min · easy bounce", tip: "Short and easy — raise core temp without tiring the calves." },
          { label: "90/90 Hip Switches + Cat-Cow", detail: "2×8", tip: "Hips for the deadlift and split squats, spine for everything. Slow and deliberate." },
          { label: "Hip Hinge Drill + Glute Bridges", detail: "2×8 / 2×10", tip: "Dowel on the back, 3 points of contact (head, mid-back, tailbone) — push the hips back without losing any of them. That IS the deadlift groove." },
          { label: "Light Trap-Bar Deadlift", detail: "1–2 sets · 8 reps", tip: "Rehearse the setup: stand tall inside the bar, chest up, lats tight, push the floor away. 15s vacuum before set 1." },
        ],
      },
      {
        name: "STRENGTH — LOWER B",
        badge: "5 exercises · 33 min",
        note: "Straight sets, fixed rest — timed to ~33 min. Last set of each lift at 1–2 reps in reserve. The split squat is the highest heart-rate lift of the week — more burn per set than any machine. BAD DAY RULE: warm-up + deadlift + split squats, then go (~25 min).",
        items: [
          {
            label: "1. Trap-Bar Deadlift",
            detail: "3×5–8 · 2.5 min rest",
            sets: 3, restSeconds: 150,
            tip: "The trap bar keeps the load in line with your spine. Stand tall inside the bar, shins close, hips higher than the knees, chest up, lats squeezed like you're holding paper in your armpits. Push the floor away rather than pulling the bar up; bar and hips rise together. Reset the brace every rep.",
            coachZ: "Heavy, clean, done. This lift exists to hold your total-body strength while you diet. Squeeze the glutes at lockout and stand tall 1s.",
            avoid: "Never round the lower back — if the back rounds, the set is over, no exceptions. Don't let the hips shoot up first.",
          },
          {
            label: "2. Bulgarian Split Squat",
            detail: "3×8–10 per leg · 90s rest · bodyweight or light DBs",
            sets: 3, restSeconds: 90,
            tip: "Rear foot on a bench, front foot far enough forward that the front shin stays roughly vertical. Front knee tracks over the toes. A slight forward lean loads the glute; staying upright loads the quad. Control the descent, drive through the front heel.",
            coachZ: "The most honest exercise in the program — it finds every imbalance you have. Start at bodyweight; add dumbbells once 10 clean reps a side is easy.",
            avoid: "Don't let the front knee cave inward, and don't push off the back foot.",
          },
          {
            label: "3. Barbell or Machine Hip Thrust",
            detail: "2×10–12 · 75s rest",
            sets: 2, restSeconds: 75,
            tip: "Shoulder blades on the bench, chin tucked, feet flat, drive through the heels. Full lockout with a hard 1s glute squeeze, ribs down — the movement is hip extension, not spinal extension.",
            coachZ: "One-second squeeze at the top of every rep. Glutes are a posture muscle as much as a shape muscle; they change how you stand.",
            avoid: "Don't hyperextend the lower back at the top to fake extra range.",
          },
          {
            label: "4. Lying Leg Curl",
            detail: "2×10–15 · 75s rest",
            sets: 2, restSeconds: 75,
            tip: "Hips flat on the pad, curl all the way toward the glutes, 3s return. Point the toes toward your shins to keep the calves out of it.",
            coachZ: "Second hamstring session of the week. Hamstrings recover fast — train them twice and they'll take it.",
            avoid: "Don't let the hips pop up off the pad to finish reps.",
          },
          {
            label: "5. Seated Calf Raise",
            detail: "2×15–20 · 45s rest",
            sets: 2, restSeconds: 45,
            tip: "Pad snug above the knees, balls of the feet on the platform, sit tall. Seated hits the soleus, which Tuesday's standing version misses. Full stretch, 2s pause at the top.",
            coachZ: "Higher reps than Tuesday on purpose — the soleus is almost entirely slow-twitch and wants the volume.",
            avoid: "Don't bounce. Ever, on calves.",
          },
        ],
      },
      {
        name: "HIIT FINISHER",
        badge: "🔑 12 min · Bike or Rower",
        note: "Second HIIT dose of the week. Legs get the whole weekend off afterward. Low-impact machine only after deadlifts and split squats. Beaten up or under-slept? Swap for a 12-min incline walk, no guilt.",
        items: [
          { label: "Bike or Rower Intervals", detail: "8 rounds · 30s hard / 60s easy + 1 min easy", tip: "RPE 8–9 on the hard pieces, all 8 at the same output. On the rower: legs → hips → arms, flat back — never yank with the arms when tired.", highlight: true },
        ],
      },
      {
        name: "COOLDOWN",
        badge: "3 min",
        items: [
          { label: "Hamstring / Hip / Lower-Back Stretch", detail: "2 min", tip: "Seated toe-touch, figure-4, child's pose. 20–30s each." },
          { label: "Standing Stomach Vacuum", detail: "2×15s holds", tip: "Short posture primer to close the week's training." },
        ],
      },
    ],
  },
];

const dailyLayer = [
  { icon: "📉", title: "PHASE 1 — 1,800 kcal/day", body: "Aug 20 → Oct 5, the 80→75kg push. Band: 1,750–1,900. Your maintenance sits around 2,600–2,700 with four lifting days, your daily walk and 10k steps, so this is roughly an 800–850 kcal/day deficit — aggressive on purpose, because the deadline demands ~0.75 kg/week. Don't eat back the gym burn; it's already inside that maintenance number." },
  { icon: "📅", title: "PHASE 2 — 2,000 kcal/day", body: "Oct 6 → mid-December, the 75→70kg finish. Recalculated at the lighter bodyweight and a gentler ~0.5 kg/week. Easier to live with, and 70kg is where this ends." },
  { icon: "🍽️", title: "Protein 170g/day", body: "2.1 g/kg — high precisely BECAUSE the Phase 1 rate is aggressive. In a deficit this steep, protein plus hard lifting is the entire reason you lose fat instead of muscle. Drop to 160g in Phase 2." },
  { icon: "🥑", title: "Fat 60g Floor · Carbs Fill the Rest", body: "60g of fat minimum for hormone production — do not go under it. At 1,800 kcal that leaves roughly 150g of carbs. Put most of them around the 6:15am session and the evening meal." },
  { icon: "🚶", title: "Your Daily 30-Min Walk = Your Zone 2", body: "The walk you already do every day is the most reliable cardio in this plan — it's an existing habit, it costs nothing to recover from, and it doesn't spike appetite. ~30 min at a comfortable, steady pace is roughly 3,000–4,000 steps and ~130–170 kcal. That's why the treadmill blocks came out of the gym sessions: 7 walks a week (~210 min) is more steady cardio than the gym would ever give you. Keep it every day, including gym days." },
  { icon: "👣", title: "10,000–12,000 Steps Daily", body: "The walk gets you a third of the way. The rest is NEAT — stairs, parking far, walking calls — worth 300–500 kcal/day, often more than the workout, and already counted in the maintenance number above. With a desk job it doesn't happen by accident; it has to be deliberate." },
  { icon: "📏", title: "Waist Under 90cm", body: "Measure at the navel, same time, once a week. 90cm is the expert cut-point for South Asian men and it tracks visceral fat better than the scale does. It keeps moving in weeks when the scale sulks." },
  { icon: "🗓️", title: "Same Slots, Every Week", body: "Habits form fastest when the behaviour happens in the same context each time (Lally 2010) — so keep the 4 gym days in the 6:15am slot, like your walk. Missing a single session doesn't break a habit; missing two in a row starts to. If Monday gets wiped out, train it Wednesday and keep going — don't cram two days into one." },
  { icon: "⏱️", title: "Bad Day Rule", body: "Short on time or energy? Do the warm-up and the first two lifts of the day, then go home — about 25 minutes. Those two compounds carry most of the muscle-retention signal. A short session keeps the streak and the habit alive; a skipped one is how most plans quietly die." },
  { icon: "🔬", title: "Why 4 Days Is Enough", body: "Lifting's job in a cut is holding muscle, not building it. The 'No Time to Lift?' review (Iversen 2021) puts the time-efficient floor at ~4 hard sets per muscle per week on mostly multi-joint lifts; this plan gives every major muscle 5–12. Bickel 2011 found trained lifters kept strength and size on as little as 1/3 of the volume that built it. The fat loss comes from the deficit and your walking — the gym protects the muscle underneath." },
  { icon: "📈", title: "Effort + Double Progression", body: "Last set of every lift close to failure — 0–1 RIR upper, 1–2 lower. When every set hits the top of the rep range with clean form, add 5lb (upper) or 10lb (lower). The PB badge on each lift shows the number to beat. Holding or adding load week-to-week is your #1 sign muscle is being kept — log every session." },
  { icon: "🎯", title: "Load the Core, Don't Just Vacuum It", body: "Weighted, progressible ab work (cable crunch, weighted hanging leg raise) builds visible muscle and a stronger brace. The stomach vacuum trains the deep 'corset' muscle for spinal support — worth 30s a day, but it doesn't build visible muscle or burn fat." },
  { icon: "🚫", title: "No Spot Reduction", body: "Chest, love handles, tummy and glutes come off in the order your genetics decide, driven by the total deficit. Nothing you train changes that order. Hold the deficit, keep lifting, and those areas go last because they went on first. If a firm, tender lump stays right under a nipple once you are lean, that is gynecomastia rather than fat — a doctor question, not a cardio one." },
  { icon: "🔁", title: "The Stall Protocol", body: "If the 7-day average has not moved in 10+ days: subtract 100 kcal OR add 2,000 steps — one, not both. If you are losing more than 1 kg/week for two weeks running, add 100 kcal back; that rate is costing you muscle." },
  { icon: "⚖️", title: "Weigh-In Protocol", body: "Daily, same time, after the bathroom, before food. Track the 7-day average, never the daily number. A single morning is water, salt and last night's dinner." },
  { icon: "💧", title: "Hydration + Sleep", body: "3L+ water daily. 7–8 hours of sleep — under 6 hours shifts weight loss away from fat and toward muscle, which on this plan is the one failure mode that matters." },
  { icon: "🥘", title: "Indian Protein Playbook", body: "Hitting 170g on a desi diet: soy chunks (52g/100g, the cheapest protein there is), paneer (18g/100g), Greek yogurt or hung curd (10g/100g), dal and rice as a complete combo, eggs, chicken. The hidden deficit-killers are ghee and cooking oil — a tablespoon is 120 kcal, and four of them is your entire day's margin." },
];

const coachZPrinciples = [
  { num: "01", title: "Consistency Beats Intensity", body: "The best plan is the one you still follow in month four. Four sessions you never miss beat five you half-do. Fixed days, fixed times, and a Bad Day Rule for when life gets in the way." },
  { num: "02", title: "Hard Sets Beat Burned Calories", body: "Nippard's core cutting principle: the calories burned lifting are small. Lifting's job is to tell your body — through hard sets near failure — to keep the muscle while the deficit strips fat." },
  { num: "03", title: "Walk Outside, Lift Inside", body: "Your daily walk is your Zone 2; the gym is for lifting plus two short HIIT finishers. That split keeps each gym visit under an hour without losing any cardio." },
  { num: "04", title: "Own Your Positions", body: "Neutral spine, stacked joints, braced core on every rep. Good positions let you push hard safely and put the load exactly where you want it." },
  { num: "05", title: "3-Second Eccentrics on Compounds", body: "The lowering phase is where muscle is built and kept. Slow negatives get more out of every set — exactly the trade you want when sets are limited." },
  { num: "06", title: "Straight Sets, Timed Rest", body: "No supersets. Every rest period is a fixed number that makes the session fit its time. Use the timer, don't stretch it." },
  { num: "07", title: "Every Upper Day Is a Width Day", body: "Pulldowns and cable laterals Monday, pull-ups, Y-raises and straight-arm pulldowns Thursday. Lats and side delts are the V — width you build while the fat comes off, so the taper is already there when you get lean." },
  { num: "08", title: "Guard the Waist", body: "No weighted side bends, no loaded oblique twists — they build exactly the thickness you are trying to lose. Weighted crunches, leg raises and the vacuum only." },
  { num: "09", title: "Film It Monthly", body: "All-day posture — shoulders back, chest up, ribs over hips. Photograph the same three poses in the same light on the 1st of every month. Between 80kg and 70kg the camera will show you things the scale never will." },
];

const weekMap = [
  { day: "MON", focus: "Upper A (~46–56 min) + daily walk", burn: 380, color: "#FF4D1C" },
  { day: "TUE", focus: "Lower A + HIIT (~56 min) + daily walk", burn: 420, color: "#00E87A" },
  { day: "WED", focus: "Off — daily 30-min walk + 10k steps", burn: 150, color: "#444" },
  { day: "THU", focus: "Upper B (~46–56 min) + daily walk", burn: 380, color: "#00C2FF" },
  { day: "FRI", focus: "Lower B + HIIT (~56 min) + daily walk", burn: 420, color: "#C84BFF" },
  { day: "SAT", focus: "Off — daily 30-min walk + 10k steps", burn: 150, color: "#444" },
  { day: "SUN", focus: "Off — daily 30-min walk + 10k steps", burn: 150, color: "#444" },
];

  window.DEFAULT_PLAN = {
    branding: {
      title: "TRAINING APP",
      accentColor: CZ,
      gymLabel: "CRUNCH HUNTINGDON VALLEY · LEAN V-TAPER · NIPPARD × COACH Z",
      statsLine: "80KG → 75KG BY OCT 5 → 70KG BY DEC · 4 DAYS",
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

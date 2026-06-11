export const workoutPlans = [
  {
    id: 1,
    name: 'Push Day',
    category: 'Strength',
    duration: 60,
    difficulty: 'Intermediate',
    muscles: ['Chest', 'Shoulders', 'Triceps'],
    exercises: [
      { id: 1, name: 'Bench Press', sets: 4, reps: '8-10', rest: 90, weight: 135 },
      { id: 2, name: 'Incline Dumbbell Press', sets: 3, reps: '10-12', rest: 75, weight: 50 },
      { id: 3, name: 'Cable Fly', sets: 3, reps: '12-15', rest: 60, weight: 30 },
      { id: 4, name: 'Overhead Press', sets: 4, reps: '8-10', rest: 90, weight: 95 },
      { id: 5, name: 'Lateral Raise', sets: 3, reps: '15-20', rest: 45, weight: 20 },
      { id: 6, name: 'Tricep Pushdown', sets: 3, reps: '12-15', rest: 60, weight: 50 },
    ],
  },
  {
    id: 2,
    name: 'Pull Day',
    category: 'Strength',
    duration: 65,
    difficulty: 'Intermediate',
    muscles: ['Back', 'Biceps', 'Rear Delts'],
    exercises: [
      { id: 7, name: 'Deadlift', sets: 4, reps: '5-6', rest: 120, weight: 225 },
      { id: 8, name: 'Pull-Up', sets: 4, reps: '6-10', rest: 90, weight: 0 },
      { id: 9, name: 'Seated Cable Row', sets: 3, reps: '10-12', rest: 75, weight: 120 },
      { id: 10, name: 'Face Pull', sets: 3, reps: '15-20', rest: 60, weight: 40 },
      { id: 11, name: 'Barbell Curl', sets: 3, reps: '10-12', rest: 60, weight: 65 },
      { id: 12, name: 'Hammer Curl', sets: 3, reps: '12-15', rest: 45, weight: 30 },
    ],
  },
  {
    id: 3,
    name: 'Leg Day',
    category: 'Strength',
    duration: 70,
    difficulty: 'Hard',
    muscles: ['Quads', 'Hamstrings', 'Glutes', 'Calves'],
    exercises: [
      { id: 13, name: 'Back Squat', sets: 5, reps: '5', rest: 150, weight: 185 },
      { id: 14, name: 'Romanian Deadlift', sets: 4, reps: '8-10', rest: 90, weight: 135 },
      { id: 15, name: 'Leg Press', sets: 3, reps: '12-15', rest: 75, weight: 360 },
      { id: 16, name: 'Leg Curl', sets: 3, reps: '12-15', rest: 60, weight: 80 },
      { id: 17, name: 'Bulgarian Split Squat', sets: 3, reps: '10', rest: 75, weight: 40 },
      { id: 18, name: 'Standing Calf Raise', sets: 4, reps: '15-20', rest: 45, weight: 135 },
    ],
  },
  {
    id: 4,
    name: 'HIIT Cardio',
    category: 'Cardio',
    duration: 30,
    difficulty: 'Hard',
    muscles: ['Full Body'],
    exercises: [
      { id: 19, name: 'Burpees', sets: 4, reps: '30s on / 15s off', rest: 30, weight: 0 },
      { id: 20, name: 'Box Jumps', sets: 4, reps: '30s on / 15s off', rest: 30, weight: 0 },
      { id: 21, name: 'Mountain Climbers', sets: 4, reps: '30s on / 15s off', rest: 30, weight: 0 },
      { id: 22, name: 'Sprint Intervals', sets: 6, reps: '20s sprint / 40s walk', rest: 0, weight: 0 },
    ],
  },
  {
    id: 5,
    name: 'Core & Mobility',
    category: 'Flexibility',
    duration: 40,
    difficulty: 'Easy',
    muscles: ['Core', 'Hip Flexors', 'Spine'],
    exercises: [
      { id: 23, name: 'Plank', sets: 3, reps: '60s', rest: 45, weight: 0 },
      { id: 24, name: 'Dead Bug', sets: 3, reps: '10 each', rest: 45, weight: 0 },
      { id: 25, name: 'Cable Crunch', sets: 3, reps: '15-20', rest: 45, weight: 50 },
      { id: 26, name: 'Hip Flexor Stretch', sets: 3, reps: '45s each', rest: 30, weight: 0 },
    ],
  },
];

export const weeklyLog = [
  { day: 'Mon', calories: 2650, completed: true, workout: 'Push Day' },
  { day: 'Tue', calories: 2400, completed: true, workout: 'Pull Day' },
  { day: 'Wed', calories: 2200, completed: true, workout: 'Rest' },
  { day: 'Thu', calories: 2750, completed: true, workout: 'Leg Day' },
  { day: 'Fri', calories: 2500, completed: true, workout: 'HIIT Cardio' },
  { day: 'Sat', calories: 2300, completed: false, workout: 'Core & Mobility' },
  { day: 'Sun', calories: 0, completed: false, workout: 'Rest' },
];

export const progressData = [
  { week: 'Wk 1', squat: 155, bench: 115, deadlift: 185, bodyweight: 178 },
  { week: 'Wk 2', squat: 165, bench: 120, deadlift: 195, bodyweight: 177 },
  { week: 'Wk 3', squat: 170, bench: 125, deadlift: 205, bodyweight: 176.5 },
  { week: 'Wk 4', squat: 175, bench: 125, deadlift: 215, bodyweight: 175.8 },
  { week: 'Wk 5', squat: 180, bench: 130, deadlift: 220, bodyweight: 175 },
  { week: 'Wk 6', squat: 185, bench: 135, deadlift: 225, bodyweight: 174.2 },
];

export const nutritionTargets = {
  calories: 2600,
  protein: 195,
  carbs: 260,
  fat: 72,
};

export const todayNutrition = {
  calories: 1840,
  protein: 142,
  carbs: 185,
  fat: 51,
  meals: [
    { name: 'Breakfast', time: '7:30 AM', calories: 480, protein: 38, carbs: 45, fat: 12, items: ['5 egg whites + 2 whole eggs', 'Oatmeal 80g', 'Banana'] },
    { name: 'Lunch', time: '12:00 PM', calories: 620, protein: 55, carbs: 70, fat: 15, items: ['Chicken breast 200g', 'Brown rice 150g', 'Broccoli'] },
    { name: 'Pre-workout', time: '3:30 PM', calories: 310, protein: 25, carbs: 40, fat: 8, items: ['Greek yogurt', 'Protein bar'] },
    { name: 'Post-workout', time: '6:00 PM', calories: 430, protein: 24, carbs: 30, fat: 16, items: ['Protein shake', 'Peanut butter toast'] },
  ],
};

export const stats = {
  workoutsThisWeek: 4,
  weeklyGoal: 5,
  totalVolume: 48200,
  streak: 12,
  personalRecords: { squat: 185, bench: 135, deadlift: 225 },
};

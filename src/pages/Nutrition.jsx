import { nutritionTargets, todayNutrition } from '../data/gymData';
import ProgressRing from '../components/ProgressRing';
import styles from './Nutrition.module.css';

const macroColors = {
  protein: 'var(--green)',
  carbs: 'var(--blue-light)',
  fat: '#E67E22',
};

function MacroBar({ label, current, target, color }) {
  const pct = Math.min(current / target, 1) * 100;
  return (
    <div className={styles.macroBar}>
      <div className={styles.macroLabelRow}>
        <span className={styles.macroName}>{label}</span>
        <span className={styles.macroValues}>{current}g <span className={styles.macroTarget}>/ {target}g</span></span>
      </div>
      <div className={styles.barTrack}>
        <div className={styles.barFill} style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}

export default function Nutrition() {
  const calPct = todayNutrition.calories / nutritionTargets.calories;

  return (
    <div className={`${styles.page} fade-in`}>
      <div className={styles.header}>
        <h1 className={styles.title}>Nutrition</h1>
        <p className={styles.subtitle}>Today's intake</p>
      </div>

      <div className={styles.topRow}>
        {/* Calorie ring */}
        <div className={styles.calCard}>
          <ProgressRing
            value={todayNutrition.calories}
            max={nutritionTargets.calories}
            size={140}
            stroke={10}
            color="var(--amber)"
          />
          <div className={styles.calInfo}>
            <p className={styles.calTitle}>Calories</p>
            <p className={styles.calNumbers}>
              <span className={styles.calCurrent}>{todayNutrition.calories}</span>
              <span className={styles.calSep}> / </span>
              <span className={styles.calTarget}>{nutritionTargets.calories} kcal</span>
            </p>
            <p className={styles.calRemaining}>{nutritionTargets.calories - todayNutrition.calories} kcal remaining</p>
          </div>
        </div>

        {/* Macro breakdown */}
        <div className={styles.macroCard}>
          <h3 className={styles.macroCardTitle}>Macronutrients</h3>
          <div className={styles.macroRings}>
            <ProgressRing value={todayNutrition.protein} max={nutritionTargets.protein} size={90} stroke={7} color={macroColors.protein} label="Protein" sublabel={`${todayNutrition.protein}g`} />
            <ProgressRing value={todayNutrition.carbs} max={nutritionTargets.carbs} size={90} stroke={7} color={macroColors.carbs} label="Carbs" sublabel={`${todayNutrition.carbs}g`} />
            <ProgressRing value={todayNutrition.fat} max={nutritionTargets.fat} size={90} stroke={7} color={macroColors.fat} label="Fat" sublabel={`${todayNutrition.fat}g`} />
          </div>
          <div className={styles.macroBars}>
            <MacroBar label="Protein" current={todayNutrition.protein} target={nutritionTargets.protein} color={macroColors.protein} />
            <MacroBar label="Carbohydrates" current={todayNutrition.carbs} target={nutritionTargets.carbs} color={macroColors.carbs} />
            <MacroBar label="Fat" current={todayNutrition.fat} target={nutritionTargets.fat} color={macroColors.fat} />
          </div>
        </div>
      </div>

      {/* Meal log */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Meal Log</h3>
        <div className={styles.mealList}>
          {todayNutrition.meals.map((meal) => (
            <div key={meal.name} className={styles.mealCard}>
              <div className={styles.mealHeader}>
                <div>
                  <span className={styles.mealName}>{meal.name}</span>
                  <span className={styles.mealTime}>{meal.time}</span>
                </div>
                <span className={styles.mealCal}>{meal.calories} kcal</span>
              </div>
              <div className={styles.mealItems}>
                {meal.items.map(item => (
                  <span key={item} className={styles.mealItem}>{item}</span>
                ))}
              </div>
              <div className={styles.mealMacros}>
                <span style={{ color: macroColors.protein }}>P {meal.protein}g</span>
                <span style={{ color: macroColors.carbs }}>C {meal.carbs}g</span>
                <span style={{ color: macroColors.fat }}>F {meal.fat}g</span>
              </div>
            </div>
          ))}
          <button className={styles.addMealBtn}>+ Add meal</button>
        </div>
      </section>
    </div>
  );
}

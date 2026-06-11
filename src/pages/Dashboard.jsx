import { useNavigate } from 'react-router-dom';
import { Flame, Zap, Trophy, Clock, ChevronRight, Play } from 'lucide-react';
import ProgressRing from '../components/ProgressRing';
import { stats, weeklyLog, workoutPlans, nutritionTargets, todayNutrition } from '../data/gymData';
import { useGym } from '../context/GymContext';
import styles from './Dashboard.module.css';

const difficultyColor = { Easy: '#2ECC71', Intermediate: '#F5A623', Hard: '#E74C3C' };

export default function Dashboard() {
  const navigate = useNavigate();
  const { startWorkout } = useGym();

  const nextWorkout = workoutPlans[0];

  const handleQuickStart = () => {
    startWorkout(nextWorkout);
    navigate('/workouts');
  };

  return (
    <div className={`${styles.page} fade-in`}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <p className={styles.greeting}>Thursday, June 12</p>
          <h1 className={styles.title}>Good morning, Alex</h1>
        </div>
        <div className={styles.streakBadge}>
          <Flame size={16} className={styles.flame} />
          <span>{stats.streak} day streak</span>
        </div>
      </div>

      {/* Quick start card */}
      <div className={styles.heroCard}>
        <div className={styles.heroLeft}>
          <span className={styles.heroEyebrow}>UP NEXT</span>
          <h2 className={styles.heroTitle}>{nextWorkout.name}</h2>
          <div className={styles.heroMeta}>
            <span>{nextWorkout.duration} min</span>
            <span className={styles.dot}>·</span>
            <span style={{ color: difficultyColor[nextWorkout.difficulty] }}>{nextWorkout.difficulty}</span>
            <span className={styles.dot}>·</span>
            <span>{nextWorkout.exercises.length} exercises</span>
          </div>
          <p className={styles.heroMuscles}>{nextWorkout.muscles.join(' · ')}</p>
          <button className={styles.startBtn} onClick={handleQuickStart}>
            <Play size={16} fill="currentColor" />
            Start Workout
          </button>
        </div>
        <div className={styles.heroRings}>
          <ProgressRing value={stats.workoutsThisWeek} max={stats.weeklyGoal} size={100} stroke={8} label="Weekly" sublabel={`${stats.workoutsThisWeek}/${stats.weeklyGoal} sessions`} />
          <ProgressRing value={todayNutrition.calories} max={nutritionTargets.calories} size={100} stroke={8} color="var(--blue-light)" label="Calories" sublabel={`${todayNutrition.calories} / ${nutritionTargets.calories}`} />
          <ProgressRing value={todayNutrition.protein} max={nutritionTargets.protein} size={100} stroke={8} color="var(--green)" label="Protein" sublabel={`${todayNutrition.protein}g / ${nutritionTargets.protein}g`} />
        </div>
      </div>

      {/* Stats row */}
      <div className={styles.statsRow}>
        <StatCard icon={<Zap size={18} />} label="Total Volume" value={`${(stats.totalVolume / 1000).toFixed(1)}k`} unit="lbs" color="var(--amber)" />
        <StatCard icon={<Trophy size={18} />} label="Squat PR" value={stats.personalRecords.squat} unit="lbs" color="var(--blue-light)" />
        <StatCard icon={<Trophy size={18} />} label="Bench PR" value={stats.personalRecords.bench} unit="lbs" color="var(--green)" />
        <StatCard icon={<Clock size={18} />} label="Streak" value={stats.streak} unit="days" color="var(--amber)" />
      </div>

      {/* Week log */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>This Week</h3>
        <div className={styles.weekGrid}>
          {weeklyLog.map((d) => (
            <div key={d.day} className={`${styles.dayCard} ${d.completed ? styles.dayDone : ''}`}>
              <span className={styles.dayLabel}>{d.day}</span>
              <div className={`${styles.dayDot} ${d.completed ? styles.dotDone : ''}`} />
              <span className={styles.dayWorkout}>{d.workout}</span>
              {d.calories > 0 && <span className={styles.dayCal}>{d.calories} kcal</span>}
            </div>
          ))}
        </div>
      </section>

      {/* Quick workout list */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h3 className={styles.sectionTitle}>All Workouts</h3>
          <button className={styles.seeAll} onClick={() => navigate('/workouts')}>
            See all <ChevronRight size={14} />
          </button>
        </div>
        <div className={styles.workoutList}>
          {workoutPlans.slice(0, 3).map((plan) => (
            <div key={plan.id} className={styles.workoutRow} onClick={() => { startWorkout(plan); navigate('/workouts'); }}>
              <div className={styles.workoutInfo}>
                <span className={styles.workoutName}>{plan.name}</span>
                <span className={styles.workoutDetail}>{plan.exercises.length} exercises · {plan.duration} min</span>
              </div>
              <div className={styles.workoutRight}>
                <span className={styles.badge} style={{ color: difficultyColor[plan.difficulty], borderColor: difficultyColor[plan.difficulty] + '44' }}>
                  {plan.difficulty}
                </span>
                <ChevronRight size={16} className={styles.arrow} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function StatCard({ icon, label, value, unit, color }) {
  return (
    <div className={styles.statCard}>
      <div className={styles.statIcon} style={{ color, background: color + '18' }}>{icon}</div>
      <div>
        <p className={styles.statValue}>{value} <span className={styles.statUnit}>{unit}</span></p>
        <p className={styles.statLabel}>{label}</p>
      </div>
    </div>
  );
}

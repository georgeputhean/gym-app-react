import { workoutPlans, weeklyLog } from '../data/gymData';
import styles from './Schedule.module.css';

const schedule = [
  { day: 'Monday', workout: workoutPlans[0] },
  { day: 'Tuesday', workout: workoutPlans[1] },
  { day: 'Wednesday', workout: null },
  { day: 'Thursday', workout: workoutPlans[2] },
  { day: 'Friday', workout: workoutPlans[3] },
  { day: 'Saturday', workout: workoutPlans[4] },
  { day: 'Sunday', workout: null },
];

const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });

export default function Schedule() {
  return (
    <div className={`${styles.page} fade-in`}>
      <div className={styles.header}>
        <h1 className={styles.title}>Schedule</h1>
        <p className={styles.subtitle}>Weekly training plan</p>
      </div>

      <div className={styles.grid}>
        {schedule.map(({ day, workout }) => {
          const isToday = day === today;
          const log = weeklyLog.find(d => d.day === day.slice(0, 3));
          return (
            <div key={day} className={`${styles.dayCard} ${isToday ? styles.today : ''} ${log?.completed ? styles.done : ''}`}>
              <div className={styles.dayHeader}>
                <div>
                  <span className={styles.dayName}>{day}</span>
                  {isToday && <span className={styles.todayBadge}>Today</span>}
                </div>
                {log?.completed && <span className={styles.doneBadge}>✓ Done</span>}
              </div>
              {workout ? (
                <div className={styles.workoutInfo}>
                  <p className={styles.workoutName}>{workout.name}</p>
                  <p className={styles.workoutDetail}>{workout.duration} min · {workout.exercises.length} exercises</p>
                  <div className={styles.muscles}>
                    {workout.muscles.map(m => (
                      <span key={m} className={styles.muscle}>{m}</span>
                    ))}
                  </div>
                </div>
              ) : (
                <div className={styles.restDay}>
                  <span className={styles.restLabel}>Rest Day</span>
                  <span className={styles.restDesc}>Recovery & mobility</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

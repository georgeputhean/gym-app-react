import { useState, useEffect } from 'react';
import { Play, X, CheckCircle2, Circle, ChevronDown, ChevronUp, Timer } from 'lucide-react';
import { workoutPlans } from '../data/gymData';
import { useGym } from '../context/GymContext';
import styles from './Workouts.module.css';

const difficultyColor = { Easy: '#2ECC71', Intermediate: '#F5A623', Hard: '#E74C3C' };
const categoryColor = { Strength: 'var(--amber)', Cardio: 'var(--blue-light)', Flexibility: 'var(--green)' };

export default function Workouts() {
  const { activeWorkout, startWorkout, endWorkout, toggleSet, isSetDone } = useGym();
  const [expandedExercise, setExpandedExercise] = useState(null);
  const [elapsed, setElapsed] = useState(0);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    if (!activeWorkout) return;
    const id = setInterval(() => setElapsed(Math.floor((Date.now() - startTime) / 1000)), 1000);
    return () => clearInterval(id);
  }, [activeWorkout, startTime]);

  const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  if (activeWorkout) {
    const totalSets = activeWorkout.exercises.reduce((sum, e) => sum + e.sets, 0);
    const doneSets = activeWorkout.exercises.reduce((sum, e) =>
      sum + Array.from({ length: e.sets }, (_, i) => isSetDone(e.id, i) ? 1 : 0).reduce((a, b) => a + b, 0), 0);

    return (
      <div className={`${styles.page} fade-in`}>
        <div className={styles.activeHeader}>
          <div>
            <p className={styles.activeMeta}>Active Workout</p>
            <h1 className={styles.activeTitle}>{activeWorkout.name}</h1>
          </div>
          <div className={styles.activeActions}>
            <div className={styles.timerBadge}>
              <Timer size={14} />
              {formatTime(elapsed)}
            </div>
            <div className={styles.progressPill}>{doneSets}/{totalSets} sets</div>
            <button className={styles.endBtn} onClick={endWorkout}>
              <X size={16} /> End Workout
            </button>
          </div>
        </div>

        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: `${(doneSets / totalSets) * 100}%` }} />
        </div>

        <div className={styles.exerciseList}>
          {activeWorkout.exercises.map((ex) => {
            const isExpanded = expandedExercise === ex.id;
            const doneSetsCount = Array.from({ length: ex.sets }, (_, i) => isSetDone(ex.id, i) ? 1 : 0).reduce((a, b) => a + b, 0);
            const allDone = doneSetsCount === ex.sets;

            return (
              <div key={ex.id} className={`${styles.exerciseCard} ${allDone ? styles.exerciseDone : ''}`}>
                <div className={styles.exerciseHeader} onClick={() => setExpandedExercise(isExpanded ? null : ex.id)}>
                  <div className={styles.exerciseName}>
                    {allDone && <CheckCircle2 size={16} className={styles.doneIcon} />}
                    <span>{ex.name}</span>
                  </div>
                  <div className={styles.exerciseMeta}>
                    <span>{ex.sets} × {ex.reps}</span>
                    {ex.weight > 0 && <span className={styles.weight}>{ex.weight} lbs</span>}
                    <span className={styles.setsCount}>{doneSetsCount}/{ex.sets}</span>
                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>
                </div>

                {isExpanded && (
                  <div className={styles.setsGrid}>
                    <div className={styles.setsHeader}>
                      <span>Set</span><span>Reps</span><span>Weight</span><span>Done</span>
                    </div>
                    {Array.from({ length: ex.sets }, (_, i) => (
                      <div key={i} className={`${styles.setRow} ${isSetDone(ex.id, i) ? styles.setDone : ''}`}>
                        <span className={styles.setNum}>{i + 1}</span>
                        <span>{ex.reps}</span>
                        <span>{ex.weight > 0 ? `${ex.weight} lbs` : 'BW'}</span>
                        <button className={styles.setCheck} onClick={() => toggleSet(ex.id, i)}>
                          {isSetDone(ex.id, i)
                            ? <CheckCircle2 size={20} className={styles.checkDone} />
                            : <Circle size={20} className={styles.checkEmpty} />}
                        </button>
                      </div>
                    ))}
                    {ex.rest > 0 && (
                      <p className={styles.restNote}><Timer size={12} /> Rest: {ex.rest}s between sets</p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.page} fade-in`}>
      <div className={styles.header}>
        <h1 className={styles.title}>Workout Plans</h1>
        <p className={styles.subtitle}>{workoutPlans.length} programs ready</p>
      </div>

      <div className={styles.grid}>
        {workoutPlans.map((plan) => (
          <div key={plan.id} className={styles.planCard}>
            <div className={styles.planTop}>
              <span className={styles.category} style={{ color: categoryColor[plan.category], borderColor: categoryColor[plan.category] + '33' }}>
                {plan.category}
              </span>
              <span className={styles.difficulty} style={{ color: difficultyColor[plan.difficulty] }}>
                {plan.difficulty}
              </span>
            </div>
            <h2 className={styles.planName}>{plan.name}</h2>
            <div className={styles.planMuscles}>{plan.muscles.join(' · ')}</div>
            <div className={styles.planStats}>
              <span>{plan.exercises.length} exercises</span>
              <span className={styles.separator}>·</span>
              <span>{plan.duration} min</span>
            </div>
            <div className={styles.exercisePreview}>
              {plan.exercises.slice(0, 3).map(ex => (
                <span key={ex.id} className={styles.exPill}>{ex.name}</span>
              ))}
              {plan.exercises.length > 3 && (
                <span className={styles.exMore}>+{plan.exercises.length - 3} more</span>
              )}
            </div>
            <button className={styles.planBtn} onClick={() => startWorkout(plan)}>
              <Play size={14} fill="currentColor" /> Start
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

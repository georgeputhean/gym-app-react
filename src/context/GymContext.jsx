import { createContext, useContext, useState } from 'react';
import { workoutPlans, todayNutrition, stats } from '../data/gymData';

const GymContext = createContext(null);

export function GymProvider({ children }) {
  const [activeWorkout, setActiveWorkout] = useState(null);
  const [completedSets, setCompletedSets] = useState({});
  const [timer, setTimer] = useState(0);
  const [workoutStartTime, setWorkoutStartTime] = useState(null);

  const startWorkout = (plan) => {
    setActiveWorkout(plan);
    setCompletedSets({});
    setWorkoutStartTime(Date.now());
  };

  const endWorkout = () => {
    setActiveWorkout(null);
    setCompletedSets({});
    setWorkoutStartTime(null);
  };

  const toggleSet = (exerciseId, setIndex) => {
    const key = `${exerciseId}-${setIndex}`;
    setCompletedSets(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const isSetDone = (exerciseId, setIndex) => {
    return !!completedSets[`${exerciseId}-${setIndex}`];
  };

  return (
    <GymContext.Provider value={{
      activeWorkout, startWorkout, endWorkout,
      completedSets, toggleSet, isSetDone,
      workoutStartTime,
    }}>
      {children}
    </GymContext.Provider>
  );
}

export const useGym = () => useContext(GymContext);

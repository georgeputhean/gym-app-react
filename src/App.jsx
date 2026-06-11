import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { GymProvider } from './context/GymContext';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Workouts from './pages/Workouts';
import Nutrition from './pages/Nutrition';
import Progress from './pages/Progress';
import Schedule from './pages/Schedule';
import Settings from './pages/Settings';
import styles from './App.module.css';

export default function App() {
  return (
    <GymProvider>
      <BrowserRouter>
        <div className={styles.layout}>
          <Sidebar />
          <main className={styles.main}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/workouts" element={<Workouts />} />
              <Route path="/nutrition" element={<Nutrition />} />
              <Route path="/progress" element={<Progress />} />
              <Route path="/schedule" element={<Schedule />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </GymProvider>
  );
}

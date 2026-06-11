import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Dumbbell, Apple, TrendingUp, Calendar, Settings, Zap } from 'lucide-react';
import styles from './Sidebar.module.css';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/workouts', icon: Dumbbell, label: 'Workouts' },
  { to: '/nutrition', icon: Apple, label: 'Nutrition' },
  { to: '/progress', icon: TrendingUp, label: 'Progress' },
  { to: '/schedule', icon: Calendar, label: 'Schedule' },
];

export default function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <Zap size={22} className={styles.logoIcon} />
        <span className={styles.logoText}>IRONFORGE</span>
      </div>

      <nav className={styles.nav}>
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `${styles.navItem} ${isActive ? styles.active : ''}`
            }
          >
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className={styles.bottom}>
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `${styles.navItem} ${isActive ? styles.active : ''}`
          }
        >
          <Settings size={18} />
          <span>Settings</span>
        </NavLink>
        <div className={styles.profile}>
          <div className={styles.avatar}>AJ</div>
          <div className={styles.profileInfo}>
            <span className={styles.profileName}>Alex Johnson</span>
            <span className={styles.profilePlan}>Pro Member</span>
          </div>
        </div>
      </div>
    </aside>
  );
}

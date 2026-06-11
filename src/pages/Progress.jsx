import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { progressData, stats } from '../data/gymData';
import styles from './Progress.module.css';

const lifts = [
  { key: 'squat', label: 'Squat', color: '#F5A623' },
  { key: 'bench', label: 'Bench', color: '#4A6FA5' },
  { key: 'deadlift', label: 'Deadlift', color: '#2ECC71' },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className={styles.tooltip}>
      <p className={styles.tooltipLabel}>{label}</p>
      {payload.map(p => (
        <p key={p.dataKey} className={styles.tooltipRow} style={{ color: p.color }}>
          {p.name}: <strong>{p.value} lbs</strong>
        </p>
      ))}
    </div>
  );
};

const WeightTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className={styles.tooltip}>
      <p className={styles.tooltipLabel}>{label}</p>
      <p className={styles.tooltipRow} style={{ color: '#F5A623' }}>
        Weight: <strong>{payload[0].value} lbs</strong>
      </p>
    </div>
  );
};

export default function Progress() {
  const [activeLifts, setActiveLifts] = useState(['squat', 'bench', 'deadlift']);

  const toggleLift = (key) => {
    setActiveLifts(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  const latestData = progressData[progressData.length - 1];
  const firstData = progressData[0];

  return (
    <div className={`${styles.page} fade-in`}>
      <div className={styles.header}>
        <h1 className={styles.title}>Progress</h1>
        <p className={styles.subtitle}>6-week tracking</p>
      </div>

      {/* PR Cards */}
      <div className={styles.prRow}>
        {lifts.map(({ key, label, color }) => {
          const gain = latestData[key] - firstData[key];
          return (
            <div key={key} className={styles.prCard} style={{ borderColor: color + '33' }}>
              <span className={styles.prLabel}>{label} PR</span>
              <span className={styles.prValue} style={{ color }}>{latestData[key]} <span className={styles.prUnit}>lbs</span></span>
              <span className={styles.prGain}>+{gain} lbs over 6 weeks</span>
            </div>
          );
        })}
        <div className={styles.prCard} style={{ borderColor: 'rgba(245,166,35,0.2)' }}>
          <span className={styles.prLabel}>Body Weight</span>
          <span className={styles.prValue} style={{ color: 'var(--amber)' }}>{latestData.bodyweight} <span className={styles.prUnit}>lbs</span></span>
          <span className={styles.prGain} style={{ color: 'var(--green)' }}>-{(firstData.bodyweight - latestData.bodyweight).toFixed(1)} lbs</span>
        </div>
      </div>

      {/* Strength chart */}
      <div className={styles.chartCard}>
        <div className={styles.chartHeader}>
          <h3 className={styles.chartTitle}>Strength Progress</h3>
          <div className={styles.toggles}>
            {lifts.map(({ key, label, color }) => (
              <button
                key={key}
                className={`${styles.toggle} ${activeLifts.includes(key) ? styles.toggleActive : ''}`}
                style={activeLifts.includes(key) ? { borderColor: color, color, background: color + '18' } : {}}
                onClick={() => toggleLift(key)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={progressData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" />
            <XAxis dataKey="week" tick={{ fill: '#6B6B6B', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#6B6B6B', fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            {lifts.filter(l => activeLifts.includes(l.key)).map(({ key, label, color }) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                name={label}
                stroke={color}
                strokeWidth={2.5}
                dot={{ fill: color, r: 4, strokeWidth: 0 }}
                activeDot={{ r: 6 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Bodyweight chart */}
      <div className={styles.chartCard}>
        <h3 className={styles.chartTitle}>Body Weight</h3>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={progressData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" />
            <XAxis dataKey="week" tick={{ fill: '#6B6B6B', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis domain={['auto', 'auto']} tick={{ fill: '#6B6B6B', fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip content={<WeightTooltip />} />
            <Line
              type="monotone"
              dataKey="bodyweight"
              stroke="var(--amber)"
              strokeWidth={2.5}
              dot={{ fill: 'var(--amber)', r: 4, strokeWidth: 0 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

import { useEffect, useRef } from 'react';
import styles from './ProgressRing.module.css';

export default function ProgressRing({ value, max, size = 80, stroke = 7, color = 'var(--amber)', label, sublabel }) {
  const pct = Math.min(value / max, 1);
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - pct);
  const circleRef = useRef(null);

  useEffect(() => {
    const el = circleRef.current;
    if (!el) return;
    el.style.strokeDasharray = circumference;
    el.style.strokeDashoffset = circumference;
    requestAnimationFrame(() => {
      el.style.transition = 'stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)';
      el.style.strokeDashoffset = offset;
    });
  }, [circumference, offset]);

  return (
    <div className={styles.wrapper}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className={styles.svg}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--steel)"
          strokeWidth={stroke}
        />
        <circle
          ref={circleRef}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <div className={styles.center}>
        <span className={styles.value}>{Math.round(pct * 100)}<span className={styles.pct}>%</span></span>
      </div>
      {label && <p className={styles.label}>{label}</p>}
      {sublabel && <p className={styles.sublabel}>{sublabel}</p>}
    </div>
  );
}

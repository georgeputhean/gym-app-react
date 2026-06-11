import styles from './Settings.module.css';

export default function Settings() {
  return (
    <div className={`${styles.page} fade-in`}>
      <div className={styles.header}>
        <h1 className={styles.title}>Settings</h1>
        <p className={styles.subtitle}>Account & preferences</p>
      </div>

      <div className={styles.sections}>
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Profile</h3>
          <div className={styles.card}>
            <Field label="Name" value="Alex Johnson" />
            <Field label="Email" value="alex@example.com" />
            <Field label="Height" value="5'11&quot;" />
            <Field label="Weight" value="174 lbs" />
            <Field label="Goal" value="Body Recomposition" />
          </div>
        </section>

        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Nutrition Goals</h3>
          <div className={styles.card}>
            <Field label="Daily Calories" value="2,600 kcal" />
            <Field label="Protein" value="195g" />
            <Field label="Carbohydrates" value="260g" />
            <Field label="Fat" value="72g" />
          </div>
        </section>

        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Training</h3>
          <div className={styles.card}>
            <Field label="Weekly Workout Goal" value="5 sessions" />
            <Field label="Default Rest Timer" value="90 seconds" />
            <Field label="Weight Unit" value="lbs" />
          </div>
        </section>
      </div>
    </div>
  );
}

function Field({ label, value }) {
  return (
    <div className={styles.field}>
      <span className={styles.fieldLabel}>{label}</span>
      <span className={styles.fieldValue}>{value}</span>
    </div>
  );
}

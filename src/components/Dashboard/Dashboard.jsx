import styles from "./Dashboard.module.css";

const Dashboard = () => {
  return (
    <main className={styles.pageWrapper}>
      <div className={styles.introParagraph}>
        <h1 className={styles.title}>BrightBell</h1>
        <p className={styles.p}>
          Do you have trouble keeping track of time? If so, you're not alone.
          Keep track of time with BrightBell by setting custom alarms. Need an
          alarm to remind you to take the chicken out of the freezer before your
          mom gets home? We got you. Or what about an alarm to remind you to get
          out of bed so that you can go on that pre-work run? We've got you
          covered there too. Never run late again with BrightBell!
        </p>
      </div>
    </main>
  );
};

export default Dashboard;

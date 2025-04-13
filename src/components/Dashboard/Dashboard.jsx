import Clock from "../Clock/Clock";
import styles from './Dashboard.module.css'

const Dashboard = ({ alarms }) => {
  return (
    <main>
      <div className={styles.introBlurb}>
        <h1>Alarm Mate</h1>
        <p>
          Do you have trouble keeping track of time? If so, you're not alone. Keep
          track of time with Alarm Mate by setting custom alarms. Need an alarm to
          remind you to take the chicken out of the freezer before your mom gets
          home? We got you. Or what about an alarm to remind you to get your butt
          out of bed so that you can go on that pre-work run? We've got you
          covered there too. Never run late again with Alarm Mate.
        </p>
        <div>
          {/* we will pass down the current user's alarms to this component */}
          <Clock alarms={alarms} />
        </div>
      </div>
    </main>
  );
};

export default Dashboard;

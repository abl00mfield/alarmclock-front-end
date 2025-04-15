import { Link } from "react-router";
import { formatTimeTo12Hour } from "../../utils/timeUtils";
import Clock from "../Clock/Clock";
import styles from "./AlarmList.module.css";

const AlarmList = ({ alarms }) => {
  return (
    <main className={styles.pageWrapper}>
      <div className={styles.alarmContainer}>
        {alarms.map((alarm) => (
          <Link
            className={styles.singleAlarm}
            key={alarm._id}
            to={`/alarms/${alarm._id}`}
          >
            <img src="/images/alarm-clock-black-white.png" alt="alarm clock" />

            <h2>{formatTimeTo12Hour(alarm.time)}</h2>
            <p>Name: {alarm.name}</p>

            {alarm.active ? <p>Alarm is active</p> : <p>Alarm is not active</p>}
          </Link>
        ))}
      </div>
    </main>
  );
};

export default AlarmList;

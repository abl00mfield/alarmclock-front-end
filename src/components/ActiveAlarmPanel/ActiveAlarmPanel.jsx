import styles from "./ActiveAlarmPanel.module.css";

const ActiveAlarmPanel = ({
  alarm,
  handleStop,
  handleSnooze,
  snoozeMinutes,
}) => {
  return (
    <div className={styles.activeAlarm}>
      <img src="/images/bell.gif" alt="ringing bell" width={140} height={140} />
      <div className={styles.alarmInfo}>
        <p>
          <strong>{alarm.name}</strong>
        </p>
        <button onClick={handleStop} className={styles.stopButton}>
          Stop Alarm
        </button>
        {alarm.snoozeOn && (
          <button onClick={handleSnooze} className={styles.snoozeButton}>
            Snooze {snoozeMinutes} minutes
          </button>
        )}
      </div>
    </div>
  );
};

export default ActiveAlarmPanel;

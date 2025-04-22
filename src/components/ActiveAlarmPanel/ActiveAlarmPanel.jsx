import styles from "./ActiveAlarmPanel.module.css";

const ActiveAlarmPanel = ({ alarm, handleStop, handleSnooze }) => {
  return (
    <div className={styles.activeAlarm}>
      <img src="/images/bell.gif" alt="ringing bell" width={140} height={140} />
      <div className={styles.alarmInfo}>
        <strong className={styles.alarmName}>{alarm.name}</strong>
        <button onClick={handleStop} className={styles.stopButton}>
          Stop Alarm
        </button>
        {alarm.snoozeOn && (
          <button
            onClick={() => handleSnooze(alarm.snoozeTime)}
            className={styles.snoozeButton}
          >
            Snooze {alarm.snoozeTime}
            {alarm.snoozeTime === 1 ? " minute" : " minutes"}
          </button>
        )}
      </div>
    </div>
  );
};

export default ActiveAlarmPanel;

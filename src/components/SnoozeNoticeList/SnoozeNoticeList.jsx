import styles from "./SnoozeNoticeList.module.css";

const SnoozeNoticeList = ({ snoozedUntilMap, handleCancel }) => {
  return (
    <>
      {Array.from(snoozedUntilMap.entries()).map(([id, until]) => (
        <div key={id} className={styles.snoozeNotice}>
          <p>
            Alarm snoozed until{" "}
            {until.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })}
          </p>
          <button
            className="snoozeAlarmButton"
            onClick={() => handleCancel(id)}
          >
            Cancel Snooze
          </button>
        </div>
      ))}
    </>
  );
};

export default SnoozeNoticeList;

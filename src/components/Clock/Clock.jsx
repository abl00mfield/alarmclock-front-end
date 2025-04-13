import { useAlarmLogic } from "../hooks/useAlarmLogic";
import CurrentTimeDisplay from "../CurrentTimeDisplay/CurrentTimeDisplay.jsx";
import ActiveAlarmPanel from "../ActiveAlarmPanel/ActiveAlarmPanel.jsx";
import SnoozeNoticeList from "../SnoozeNoticeList/SnoozeNoticeList.jsx";
import { Link } from "react-router";
import styles from "./Clock.module.css";

const Clock = ({ alarms }) => {
  const {
    time,
    alarmActive,
    stopAlarm,
    snoozeAlarm,
    cancelSnooze,
    SNOOZE_AMT,
    snoozedUntilMap,
  } = useAlarmLogic(alarms);

  return (
    <div className={styles.elementContainer}>
      <h2 className={styles.currentTime}>Current Time</h2>
      <CurrentTimeDisplay time={time} />

      {alarmActive && (
        <ActiveAlarmPanel
          alarm={alarmActive}
          onStop={stopAlarm}
          onSnooze={snoozeAlarm}
          snoozeMinutes={SNOOZE_AMT}
        />
      )}

      <SnoozeNoticeList
        snoozedUntilMap={snoozedUntilMap}
        onCancelSnooze={cancelSnooze}
      />

      <Link className={styles.addAlarmLink} to="/alarms/new">
        AddAlarm
      </Link>
    </div>
  );
};

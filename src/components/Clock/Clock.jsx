import { useAlarmLogic } from "../hooks/useAlarmLogic";
import { useContext } from "react";
import CurrentTimeDisplay from "../CurrentTimeDisplay/CurrentTimeDisplay.jsx";
import ActiveAlarmPanel from "../ActiveAlarmPanel/ActiveAlarmPanel.jsx";
import SnoozeNoticeList from "../SnoozeNoticeList/SnoozeNoticeList.jsx";
import AddAlarmLink from "../AddAlarmLink/AddAlarmLink.jsx";
import { UserContext } from "../../contexts/UserContext.jsx";
import styles from "./Clock.module.css";

const Clock = ({ alarms }) => {
  const { user } = useContext(UserContext);
  const {
    currentTime,
    activeAlarm,
    stopAlarm,
    snoozeAlarm,
    cancelSnooze,
    snoozedUntilMap,
    SNOOZE_AMT,
  } = useAlarmLogic(alarms);

  return (
    <div className={styles.elementContainer}>
      <h2 className={styles.currentTime}>Current Time</h2>
      <CurrentTimeDisplay time={currentTime} />

      {activeAlarm && (
        <ActiveAlarmPanel
          alarm={activeAlarm}
          handleStop={stopAlarm}
          handleSnooze={snoozeAlarm}
          snoozeMinutes={SNOOZE_AMT}
        />
      )}

      <SnoozeNoticeList
        snoozedUntilMap={snoozedUntilMap}
        handleCancel={cancelSnooze}
      />

      {user && <AddAlarmLink />}
    </div>
  );
};

export default Clock;

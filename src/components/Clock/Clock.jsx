import { useAlarmLogic } from "../../hooks/useAlarmLogic.js";
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
  } = useAlarmLogic(alarms);

  return (
    <div className={styles.elementContainer}>
      <CurrentTimeDisplay currentTime={currentTime} />

      {activeAlarm && (
        <ActiveAlarmPanel
          alarm={activeAlarm}
          handleStop={stopAlarm}
          handleSnooze={snoozeAlarm}
        />
      )}

      <SnoozeNoticeList
        snoozedUntilMap={snoozedUntilMap}
        handleCancel={cancelSnooze}
        alarms={alarms}
      />

      {user && <AddAlarmLink />}
    </div>
  );
};

export default Clock;

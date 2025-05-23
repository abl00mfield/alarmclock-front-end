const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}`;
import { useContext, useRef, useEffect } from "react";
import { UserContext } from "../../contexts/UserContext";
import { useParams, Link } from "react-router";
import { formatTimeTo12Hour } from "../../utils/timeUtils";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import styles from "./AlarmDetails.module.css";

const AlarmDetails = ({ alarms, handleDeleteAlarm }) => {
  const { alarmId } = useParams();
  const { user } = useContext(UserContext);
  const audioRef = useRef(null);

  const alarm = alarms.find((a) => a._id === alarmId);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current = null;
      }
    };
  }, []);

  const playTone = () => {
    if (alarm?.tone?.fileUrl) {
      const audio = new Audio(`${BASE_URL}${alarm.tone.fileUrl}`);
      audioRef.current = audio;
      audio
        .play()
        .catch((error) => console.error("Error playing tone: ", error));
    }
  };

  const stopTone = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
  };

  if (!alarm) {
    return (
      <main className={styles.wrapper}>
        <LoadingSpinner message="Loading alarm details..." />
      </main>
    );
  }

  return (
    <main className={styles.wrapper}>
      <div className={styles.card}>
        <h1 className={styles.title}>{formatTimeTo12Hour(alarm.time)}</h1>
        <h2 className={styles.info}>Name: {alarm.name}</h2>
        <h2 className={styles.info}>Tone: {alarm.tone?.toneName}</h2>
        {alarm.snoozeOn ? (
          <>
            <h2 className={styles.status}>Snooze is on</h2>
            <h2 className={styles.status}>
              Snooze Time: {alarm.snoozeTime}
              {alarm.snoozeTime === 1 ? " minute" : " minutes"}
            </h2>
          </>
        ) : (
          <h2 className={styles.status}>Snooze is off</h2>
        )}
        {alarm.active ? (
          <h2 className={styles.status}>Alarm is on</h2>
        ) : (
          <h2 className={styles.status}>Alarm is off</h2>
        )}
        <div className={styles.buttonGroup}>
          <button onClick={playTone} className={styles.button}>
            {" "}
            Play Tone
          </button>
          <button onClick={stopTone} className={styles.button}>
            Stop Tone
          </button>
        </div>
        {alarm.owner._id === user._id && (
          <div className={styles.actions}>
            <Link to={`/alarms/${alarmId}/edit`} className={styles.link}>
              Edit
            </Link>
            <button
              onClick={() => handleDeleteAlarm(alarmId)}
              className={styles.deleteButton}
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </main>
  );
};
export default AlarmDetails;

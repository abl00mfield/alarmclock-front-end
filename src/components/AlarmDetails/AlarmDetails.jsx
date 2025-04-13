const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}`;
import { useState, useEffect, useContext, useRef } from "react";
import { UserContext } from "../../contexts/UserContext";
import { useParams, Link } from "react-router";
import * as alarmService from "../../services/alarmService";
import { formatTimeTo12Hour } from "../../utils/timeUtils";
import styles from "./AlarmDetails.module.css";
import Clock from "../Clock/Clock";

const AlarmDetails = (props) => {
  const [alarm, setAlarm] = useState(null);
  const { alarmId } = useParams();
  const { user } = useContext(UserContext);
  const audioRef = useRef(null);

  useEffect(() => {
    const fetchAlarm = async () => {
      try {
        const alarmData = await alarmService.show(alarmId);
        setAlarm(alarmData);
      } catch (err) {
        console.error("Error fetching alarm:", error);
      }
    };
    fetchAlarm();
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [alarmId]);

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

  if (!alarm) return <main>Loading.....</main>;

  return (
    <main className={styles.wrapper}>
      <Clock alarms={props.alarms} />
      <div className={styles.card}>
        <h1 className={styles.title}>{formatTimeTo12Hour(alarm.time)}</h1>
        <h2 className={styles.info}>Name: {alarm.name}</h2>
        <h2 className={styles.info}>Tone: {alarm.tone?.toneName}</h2>
        {alarm.snoozeOn ? (
          <h2 className={styles.status}>Snooze is on</h2>
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
          <>
            <div className={styles.actions}>
              <Link to={`/alarms/${alarmId}/edit`} className={styles.link}>
                Edit
              </Link>
              <button
                onClick={() => props.handleDeleteAlarm(alarmId)}
                className={`${styles.button} ${styles.deleteButton}`}
              >
                Delete
              </button>
            </div>
          </>
        )}
      </div>
    </main>
  );
};
export default AlarmDetails;

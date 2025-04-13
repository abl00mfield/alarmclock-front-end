import { useEffect, useState, useRef } from "react";
import { Link } from "react-router";
const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}`;

//persist alarms across component mounts/unmounts
import {
  globalActiveAlarmMap,
  globalTriggerMap,
  snoozeTimeoutMap,
  snoozedUntilMap,
  globalAudioRef,
} from "../../utils/clockGlobals";

const SNOOZE_AMT = 9;

import styles from "./Clock.module.css";

const Clock = (props) => {
  const [time, setTime] = useState(new Date());

  const [alarmActive, setAlarmActive] = useState(false);
  const audioRef = useRef(null);
  const alarmTimeoutRef = useRef(null);

  const lastTriggerMapRef = useRef(globalTriggerMap); //this will keep track of an alarm so it won't be triggered more than once per minute

  const triggerAlarm = (alarm) => {
    if (alarm.tone && alarm.tone.fileUrl) {
      const audio = new Audio(`${BASE_URL}${alarm.tone.fileUrl}`);
      audio.loop = true;
      audio.play();
      audioRef.current = audio;
      globalActiveAlarmMap.set(alarm._id, alarm);
      globalAudioRef.current = audio;
      setAlarmActive(alarm);
      alarmTimeoutRef.current = setTimeout(() => {
        stopAlarm();
      }, 5 * 60 * 1000); //turns the alarm off after 5 min
    }
  };

  const stopAlarm = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.loop = false;
      audioRef.current = null;
    }
    if (alarmTimeoutRef.current) {
      clearTimeout(alarmTimeoutRef.current);
      alarmTimeoutRef.current = null;
    }

    if (alarmActive?._id) {
      globalActiveAlarmMap.delete(alarmActive._id);
    }

    if (globalAudioRef.current) {
      globalAudioRef.current.pause();
      globalAudioRef.current.currentTime = 0;
      globalAudioRef.current.loop = false;
      globalAudioRef.current = null;
    }
    setAlarmActive(null);
  };

  const snoozeAlarm = () => {
    const snoozeDelay = SNOOZE_AMT * 60 * 1000;
    const alarmToSnooze = alarmActive;

    stopAlarm();
    //clear previous state
    lastTriggerMapRef.current.delete(alarmToSnooze._id);
    clearTimeout(snoozeTimeoutMap.get(alarmToSnooze._id));

    // Set snooze end time
    const snoozeUntilTime = new Date(Date.now() + snoozeDelay);
    snoozedUntilMap.set(alarmToSnooze._id, snoozeUntilTime);

    const timeoutId = setTimeout(() => {
      //double check alarm is still active
      const updatedAlarm = props.alarms.find(
        (a) => a._id === alarmToSnooze._id
      );
      if (updatedAlarm?.active) {
        setAlarmActive(updatedAlarm);
        globalActiveAlarmMap.set(updatedAlarm._id, updatedAlarm);
        triggerAlarm(updatedAlarm);
      }

      snoozeTimeoutMap.delete(alarmToSnooze._id);
      snoozedUntilMap.delete(alarmToSnooze._id);
    }, snoozeDelay);

    snoozeTimeoutMap.set(alarmToSnooze._id, timeoutId);
  };

  useEffect(() => {
    const uiSyncTimer = setInterval(() => {
      for (const [_, alarmObj] of globalActiveAlarmMap.entries()) {
        setAlarmActive(alarmObj);
      }
    }, 1000);

    return () => clearInterval(uiSyncTimer);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      let now = new Date();
      let hour = now.getHours().toString().padStart(2, "0");
      let minute = now.getMinutes().toString().padStart(2, "0");

      const currentTimeStr = `${hour}:${minute}`;

      setTime(now);

      props.alarms.forEach((alarm) => {
        const snoozedUntil = snoozedUntilMap.get(alarm._id);
        const isSnoozed = snoozedUntil && snoozedUntil > now;

        const last = lastTriggerMapRef.current.get(alarm._id);
        const shouldTrigger =
          alarm.time === currentTimeStr &&
          alarm.active &&
          !isSnoozed &&
          (!last ||
            last.triggeredFor !== alarm.time ||
            last.triggeredAt !== currentTimeStr);
        // Only trigger the alarm if:
        // - it's active
        // - AND it has never triggered before
        // - OR its time has changed since the last trigger
        // - OR it hasn't already triggered at the current time

        if (shouldTrigger) {
          setAlarmActive(alarm);
          triggerAlarm(alarm);
          globalActiveAlarmMap.set(alarm._id, alarm);
          lastTriggerMapRef.current.set(alarm._id, {
            triggeredFor: alarm.time,
            triggeredAt: currentTimeStr,
          });
        }
      });
    }, 1000);

    return () => {
      clearInterval(timer);

      if (alarmTimeoutRef.current) {
        clearTimeout(alarmTimeoutRef.current);
        alarmTimeoutRef.current = null;
      }

      // Stop the alarm sound if it's playing
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current.loop = false;
        audioRef.current = null;
      }
      if (globalAudioRef.current) {
        globalAudioRef.current.pause();
        globalAudioRef.current.currentTime = 0;
        globalAudioRef.current.loop = false;
        globalAudioRef.current = null;
      }
    };
  }, [props.alarms]);

  return (
    <>
      <h2 className={styles.currentTime}>Current Time</h2>
      <div className={styles.elementContainer}>
        <div className={styles.clockContainer}>
          {time.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })}
        </div>
        {alarmActive && (
          <div className={styles.activeAlarm}>
            <img
              src="/images/bell.gif"
              alt="ringing bell"
              width={140}
              height={140}
              className={styles.bellGif}
            />
            <div className={styles.alarmInfo}>
              <p>
                <strong>{alarmActive.name}</strong>
              </p>
              <button onClick={stopAlarm} className="stop-alarm-btn">
                Stop Alarm
              </button>
              {alarmActive.snoozeOn && (
                <button onClick={snoozeAlarm} className="snooze-alarm-btn">
                  Snooze {SNOOZE_AMT} Min
                </button>
              )}
            </div>
          </div>
        )}
        {Array.from(snoozedUntilMap.entries()).map(([id, until]) => (
          <div key={id} className={styles.snoozeNotice}>
            <p>
              ⏰ Alarm snoozed until{" "}
              {until.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}
            </p>
          </div>
        ))}

        <Link className={styles.addAlarmLink} to="/alarms/new">
          Add Alarm
        </Link>
      </div>
    </>
  );
};

export default Clock;

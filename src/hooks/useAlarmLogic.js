import { useState, useEffect, useRef, useContext } from "react";
import { UserContext } from "../contexts/UserContext";
const SNOOZE_AMT = 2;
const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}`;

export function useAlarmLogic(alarms) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeAlarm, setActiveAlarm] = useState(null);
  const [snoozedUntilMap, setSnoozedUntilMap] = useState(new Map());
  const audioRef = useRef(null);
  const alarmTimeoutRef = useRef(null);
  const { user } = useContext(UserContext);

  const playAlarmSound = async (alarm) => {
    if (!alarm.tone?.fileUrl) return;

    const audio = new Audio(`${BASE_URL}${alarm.tone.fileUrl}`);
    audio.loop = true;
    try {
      await audio.play();
      audioRef.current = audio;

      alarmTimeoutRef.current = setTimeout(() => {
        stopAlarm();
      }, 5 * 60 * 1000); // Auto stop after 5 minutes
    } catch (error) {
      console.error("Error playing alarm sound: ", error);
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

    setActiveAlarm(null);
  };

  const snoozeAlarm = () => {
    const snoozeDelay = SNOOZE_AMT * 60 * 1000;
    const alarmToSnooze = activeAlarm;

    stopAlarm();

    const snoozeUntil = new Date(Date.now() + snoozeDelay);
    setSnoozedUntilMap((prev) => {
      const updated = new Map(prev);
      updated.set(alarmToSnooze._id, snoozeUntil);
      return updated;
    });
  };

  const cancelSnooze = (alarmId) => {
    setSnoozedUntilMap((prev) => {
      const updated = new Map(prev);
      updated.delete(alarmId);
      return updated;
    });
  };

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);

      const currentStr = now.toTimeString().split(" ")[0].slice(0, 8);

      alarms?.forEach((alarm) => {
        const snoozedUntil = snoozedUntilMap.get(alarm._id);
        const isSnoozeMatch =
          snoozedUntil &&
          snoozedUntil.toTimeString().split(" ")[0].slice(0, 8) === currentStr;
        if (alarm.active && (alarm.time === currentStr || isSnoozeMatch)) {
          if (activeAlarm) stopAlarm();
          setActiveAlarm(alarm);
          playAlarmSound(alarm);
        }
        if (isSnoozeMatch) cancelSnooze(alarm._id);
      });
    }, 1000);

    if (alarms.length === 0 || !user) {
      stopAlarm();
    }

    return () => {
      clearInterval(timer);

      if (alarmTimeoutRef.current) {
        clearTimeout(alarmTimeoutRef.current);
        alarmTimeoutRef.current = null;
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current.loop = false;
        audioRef.current = null;
      }
    };
  }, [alarms, snoozedUntilMap, user]);

  return {
    currentTime,
    activeAlarm,
    stopAlarm,
    snoozeAlarm,
    cancelSnooze,
    snoozedUntilMap,
    SNOOZE_AMT,
  };
}

export default useAlarmLogic;

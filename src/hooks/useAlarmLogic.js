import { useState, useEffect, useRef } from "react";
const SNOOZE_AMT = 1;
const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}`;

export function useAlarmLogic(alarms) {
  const [currentTime, setCurrentTime] = useState(newDate());
  const [activeAlarm, setActiveAlarm] = useState(null);
  const [snoozedUntilMap, setSnoozedUntilMap] = useState(new Map());
  const [ringingAlarm, setRingingAlarm] = useState(new Set());
  const audioRef = useRef(null);
  const alarmTimeoutRef = useRef(null);

  const playAlarmSound = (alarm) => {
    if (!alarm.tone?.fileUrl) return;

    const audio = new Audio(`${BASE_URL}${alarm.tone.fileUrl}`);
    audio.loop = true;
    audio.play();
    audioRef.current = audio;

    alarmTimeoutRef.current = setTimeout(() => {
      stopAlarm();
    }, 5 * 60 * 1000); // Auto stop after 5 minutes
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
    setRingingAlarm(new Set());
  };

  const snoozeAlarm = () => {
    const snoozeDelay = SNOOZE_AMT * 60 * 1000;
    const alarmToSnooze = alarmActive;

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
      alarms.forEach((alarm) => {
        const isRinging = ringingAlarm.has(alarm._id);
        const snoozedUntil = snoozedUntilMap.get(alarm._id);
        const isSnoozed = snoozedUntil && snoozedUntil > now;

        if (
          alarm.active &&
          alarm.time === currentStr &&
          !isRinging &&
          !isSnoozed
        ) {
          setActiveAlarm(alarm);
          setRingingAlarm((prev) => new Set(prev).add(alarm._id));
          playAlarmSound(alarm);
        }
      });
    }, 1000);

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
    //clean up logic
  }, [alarms, snoozedUntilMap, ringingAlarm]);

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

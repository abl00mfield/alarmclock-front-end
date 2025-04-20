import { useState, useEffect, useRef, useContext } from "react";
import { UserContext } from "../contexts/UserContext";
const SNOOZE_AMT = 5;
const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}`;

export function useAlarmLogic(alarms) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeAlarm, setActiveAlarm] = useState(null);
  const [snoozedUntilMap, setSnoozedUntilMap] = useState(new Map());
  const [ringingAlarm, setRingingAlarm] = useState(new Set());
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

    if (activeAlarm?._id) {
      setRingingAlarm((prev) => {
        const updated = new Set(prev);
        updated.delete(activeAlarm._id);
        return updated;
      });
    }

    setActiveAlarm(null);
  };

  const snoozeAlarm = () => {
    const snoozeDelay = SNOOZE_AMT * 60 * 1000;
    const alarmToSnooze = activeAlarm;

    stopAlarm(); //don't clear out snoozeMap when we are just snoozing an alarm

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
        const isRinging = ringingAlarm.has(alarm._id);
        const snoozedUntil = snoozedUntilMap.get(alarm._id);
        const isSnoozed = snoozedUntil && snoozedUntil > now;
        const isSnoozeMatch =
          snoozedUntil &&
          snoozedUntil.toTimeString().split(" ")[0].slice(0, 8) === currentStr;

        if (
          alarm.active &&
          !isRinging &&
          (alarm.time === currentStr || isSnoozeMatch) &&
          !isSnoozed
        ) {
          setActiveAlarm(alarm);
          setRingingAlarm((prev) => new Set(prev).add(alarm._id));
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
    //clean up logic
  }, [alarms, snoozedUntilMap, ringingAlarm, user]);

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

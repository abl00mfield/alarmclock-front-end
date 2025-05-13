import { useState, useEffect, useRef, useContext } from "react";
import { UserContext } from "../contexts/UserContext";
const SNOOZE_AMT = 5;
const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}`;

export function useAlarmLogic(alarms) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeAlarm, setActiveAlarm] = useState(null);
  const [snoozedUntilMap, setSnoozedUntilMap] = useState(new Map());
  const { user } = useContext(UserContext);

  const scheduledAlarms = useRef(new Map()); //alarmId => tiemoutId
  const snoozedTimeouts = useRef(new Map()); //alarmId => timeoutId
  const audioRef = useRef(null);
  const alarmAutoStopTimeoutRef = useRef(null);

  useEffect(() => {
    // update current time every second
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    //schedule all alarms when component mounts or alarms change
    alarms?.forEach((alarm) => {
      scheduleAlarm(alarm);
    });

    return () => {
      const existingIds = new Set(alarms.map((alarm) => alarm._id));

      //clear all scheduled timeouts
      for (const timeoutId of scheduledAlarms.current.values()) {
        clearTimeout(timeoutId);
      }
      for (const [alarmId, timeoutId] of snoozedTimeouts.current.entries()) {
        if (!existingIds.has(alarmId)) {
          clearTimeout(timeoutId);
          snoozedTimeouts.current.delete(alarmId);
        }
      }

      scheduledAlarms.current.clear();

      stopAlarm();
    };
  }, [alarms, user]);

  const scheduleAlarm = (alarm) => {
    if (!alarm.active) return;

    const [h, m, s] = alarm.time.split(":");
    const target = new Date();
    target.setHours(h, m, s || "00", 0);

    const now = new Date();
    const delay = target - now;

    if (delay > 0) {
      const timeoutId = setTimeout(() => {
        triggerAlarm(alarm);
      }, delay);
      scheduledAlarms.current.set(alarm._id, timeoutId);
    }
  };

  const triggerAlarm = async (alarm) => {
    setActiveAlarm(alarm);
    await playAlarmSound(alarm);
  };

  const playAlarmSound = async (alarm) => {
    if (!alarm.tone?.fileUrl) return;

    const audio = new Audio(`${BASE_URL}${alarm.tone.fileUrl}`);
    audio.loop = true;
    try {
      await audio.play();
      audioRef.current = audio;

      alarmAutoStopTimeoutRef.current = setTimeout(() => {
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

    if (alarmAutoStopTimeoutRef.current) {
      clearTimeout(alarmAutoStopTimeoutRef.current);
      alarmAutoStopTimeoutRef.current = null;
    }

    setActiveAlarm(null);
  };

  const snoozeAlarm = (snoozeMinutes) => {
    const snoozeAmt = snoozeMinutes || SNOOZE_AMT;

    const alarm = activeAlarm;
    if (!alarm) return;

    stopAlarm();

    const snoozeUntil = new Date(Date.now() + snoozeAmt * 60 * 1000);

    const timeoutId = setTimeout(() => {
      triggerAlarm(alarm);
      snoozedTimeouts.current.delete(alarm._id);

      setSnoozedUntilMap((prev) => {
        const updated = new Map(prev);
        updated.delete(alarm._id);
        return updated;
      });
    }, snoozeUntil - new Date());

    snoozedTimeouts.current.set(alarm._id, timeoutId);

    setSnoozedUntilMap((prev) => {
      const updated = new Map(prev);
      updated.set(alarm._id, snoozeUntil);
      return updated;
    });
  };

  const cancelSnooze = (alarmId) => {
    const timeoutId = snoozedTimeouts.current.get(alarmId);
    if (timeoutId) {
      clearTimeout(timeoutId);
      snoozedTimeouts.current.delete(alarmId);
    }

    setSnoozedUntilMap((prev) => {
      const updated = new Map(prev);
      updated.delete(alarmId);
      return updated;
    });
  };

  return {
    currentTime,
    activeAlarm,
    stopAlarm,
    snoozeAlarm,
    cancelSnooze,
    snoozedUntilMap,
  };
}

export default useAlarmLogic;

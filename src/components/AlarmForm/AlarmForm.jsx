import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router";
import ToneSelector from "../ToneSelector/ToneSelector";
import styles from "./AlarmForm.module.css";

const AlarmForm = ({ alarms, handleAddAlarm, handleUpdateAlarm }) => {
  const { alarmId } = useParams();
  const audioRef = useRef(null); //this is a container for the audio object that is created in the tone selector
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    time: "",
    tone: "",
    snoozeOn: false,
    snoozeTime: 1,
    active: true,
  });

  const handleChange = (event) => {
    const { name, value } = event.target; //destructure these out for easier handling
    setFormData({
      ...formData,
      [name]:
        name === "snoozeOn" || name === "active" ? value === "true" : value, //we have to convert the value of the boolean to a string
    });
  };

  //use for scaffolding alarm submit fn
  const handleSubmit = (event) => {
    event.preventDefault();
    if (audioRef.current) {
      //stop any audio that is playing
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    const updatedFormData = {
      ...formData,
      time: formData.time.length === 5 ? `${formData.time}:00` : formData.time,
    };

    if (alarmId) {
      handleUpdateAlarm(alarmId, updatedFormData);
    } else {
      handleAddAlarm(updatedFormData);
    }
  };

  useEffect(() => {
    if (alarmId && alarms?.length) {
      setLoading(true);
      const foundAlarm = alarms.find((alarm) => alarm._id === alarmId);
      if (foundAlarm) {
        setFormData({
          ...foundAlarm,
          tone: foundAlarm.tone?._id || "",
        });
      }
    }
    setLoading(false);
    //clean up function
    return () =>
      setFormData({
        name: "",
        time: "",
        tone: "",
        snoozeOn: false,
        snoozeTime: 1,
        active: true,
      });
  }, [alarmId, alarms]);

  return (
    <main className={styles.pageWrapper}>
      {loading && <LoadingSpinner message="Getting alarm data..." />}
      <div className={styles.container}>
        <h1 className={styles.title}>{alarmId ? "Edit Alarm" : "New Alarm"}</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="name-input">Name</label>
            <input
              required
              type="text"
              name="name"
              id="name-input"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="time">Time</label>
            <input
              required
              type="time"
              name="time"
              id="time"
              value={formData.time}
              onChange={handleChange}
            />
          </div>
          <div className={styles.field}>
            <ToneSelector
              selectedTone={formData.tone}
              handleChange={handleChange}
              audioRef={audioRef}
            />
          </div>
          <div className={styles.radioGroup}>
            <label htmlFor="snoozeOn">Snooze:</label>
            <label htmlFor="snoozeOn-on">
              <input
                type="radio"
                name="snoozeOn"
                id="snoozeOn-on"
                value="true"
                checked={formData.snoozeOn === true}
                onChange={handleChange}
              />
              On
            </label>
            <label htmlFor="snoozeOn-off">
              <input
                type="radio"
                name="snoozeOn"
                id="snoozeOn-off"
                value="false"
                checked={formData.snoozeOn === false}
                onChange={handleChange}
              />
              Off
            </label>
          </div>
          <div className={styles.snooze}>
            <label htmlFor="snoozeTime">Snooze Minutes</label>
            <input
              className={styles.snoozeInput}
              type="number"
              id="snoozeTime"
              name="snoozeTime"
              value={formData.snoozeTime}
              min="1"
              max="15"
              onChange={handleChange}
              disabled={!formData.snoozeOn}
            />
          </div>
          {alarmId && (
            <div className={styles.radioGroup}>
              <label htmlFor="active">Alarm on:</label>
              <label htmlFor="active-on">
                <input
                  type="radio"
                  id="active-on"
                  name="active"
                  value="true"
                  checked={formData.active === true}
                  onChange={handleChange}
                />
                On
              </label>
              <label htmlFor="active-off">
                <input
                  type="radio"
                  id="active-off"
                  name="active"
                  value="false"
                  checked={formData.active === false}
                  onChange={handleChange}
                />
                Off
              </label>
            </div>
          )}
          <button type="submit" className={styles.button}>
            {alarmId ? "Edit Alarm" : "Add Alarm"}
          </button>
        </form>
      </div>
    </main>
  );
};

export default AlarmForm;

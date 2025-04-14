import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router";
import ToneSelector from "../ToneSelector/ToneSelector";
import * as alarmService from "../../services/alarmService";
import styles from "./AlarmForm.module.css";
import Clock from "../Clock/Clock";

const AlarmForm = (props) => {
  const { alarmId } = useParams();
  const audioRef = useRef(null); //this is a container for the audio object that is created in the tone selector

  const [formData, setFormData] = useState({
    name: "",
    time: "",
    tone: "",
    snoozeOn: false,
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
      props.handleUpdateAlarm(alarmId, updatedFormData);
    } else {
      props.handleAddAlarm(updatedFormData);
    }
  };

  useEffect(() => {
    const fetchAlarm = async () => {
      const alarmData = await alarmService.show(alarmId);
      setFormData({ ...alarmData, tone: alarmData.tone?._id || "" });
    };
    if (alarmId) fetchAlarm();
    //clean up function
    return () =>
      setFormData({
        name: "",
        time: "",
        tone: "",
        snoozeOn: false,
        active: true,
      });
  }, [alarmId]);

  return (
    <main className={styles.pageWrapper}>
      <div className={styles.container}>
        <h1>{alarmId ? "Edit Alarm" : "New Alarm"}</h1>
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

import styles from "./CurrentTimeDisplay.module.css";

const CurrentTimeDisplay = ({ currentTime }) => {
  return (
    <div className={styles.clockContainer}>
      {currentTime.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })}
    </div>
  );
};

export default CurrentTimeDisplay;

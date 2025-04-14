import { Link } from "react-router";
import styles from "./AddAlarmLink.module.css";

const AddAlarmLink = () => {
  return (
    <Link className={styles.addAlarm} to="/alarms/new">
      Add New Alarm
    </Link>
  );
};

export default AddAlarmLink;

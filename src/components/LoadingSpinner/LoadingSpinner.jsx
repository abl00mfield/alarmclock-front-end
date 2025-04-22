import styles from "./LoadingSpinner.module.css";

const LoadingSpinner = ({ message = "Loading..." }) => {
  return (
    <div className={styles.overlay}>
      <div className={styles.spinner} />
      <p className={styles.message}>{message}</p>
    </div>
  );
};

export default LoadingSpinner;

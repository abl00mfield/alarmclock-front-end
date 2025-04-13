import React from "react";
import styles from "./Landing.module.css";

const Landing = () => {
  return (
    <main className={styles.landing}>
      <div className={styles.landingBlurb}>
        <h1>Welcome to Alarm Mate</h1>
        <p>Sign up now, or sign in to create your own personalized alarms!</p>
      </div>
    </main>
  );
};

export default Landing;

import { useState, useEffect } from "react";
import styles from "./ThemeToggle.module.css";

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("dark-theme", isDark);
    document.body.classList.toggle("light-theme", !isDark);
  }, [isDark]);

  return (
    <button className={styles.themeButton} onClick={() => setIsDark(!isDark)}>
      Change Theme
    </button>
  );
};

export default ThemeToggle;

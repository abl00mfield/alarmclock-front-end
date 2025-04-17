import { useContext, useState } from "react";
import { Link } from "react-router";
import ThemeToggle from "../ThemeToggle/ThemeToggle";
import { UserContext } from "../../contexts/UserContext";
import styles from "./NavBar.module.css";

const NavBar = () => {
  const { user, setUser } = useContext(UserContext);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <nav className={styles.container}>
      {user ? (
        <div className={styles.navContainer}>
          <ul>
            <li>
              <img
                src="/images/alarm-clock.png"
                alt="alarm clock"
                width="30px"
              />
            </li>
            <li>Welcome - {user.username}</li>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/alarms">Your Alarms</Link>
            </li>
            <li>
              <Link to="/" onClick={handleSignOut}>
                Sign Out
              </Link>
            </li>
          </ul>
          <ThemeToggle />
        </div>
      ) : (
        <ul className={styles.navContainer}>
          <div>
            <li>
              <Link to="/">Home</Link>
            </li>
          </div>
          <div className={styles.signInUp}>
            <li>
              <Link to="/sign-in">Sign In</Link>
            </li>
            <li>
              <Link to="/sign-up">Sign Up</Link>
            </li>
          </div>
        </ul>
      )}
    </nav>
  );
};

export default NavBar;

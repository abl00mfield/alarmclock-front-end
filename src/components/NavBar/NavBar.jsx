import { useContext, useState } from "react";
import { Link } from "react-router";
import ThemeToggle from "../ThemeToggle/ThemeToggle";
import { UserContext } from "../../contexts/UserContext";
import styles from "./Navbar.module.css";

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
            <li>Alarm Mate</li>
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
        <ul>
          <div className={styles.left}>
            <li>
              <Link to="/">Home</Link>
            </li>
          </div>
          <div className={styles.right}>
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

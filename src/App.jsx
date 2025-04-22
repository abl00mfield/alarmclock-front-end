import { useContext, useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router";
import { UserContext } from "./contexts/UserContext";

import NavBar from "./components/NavBar/NavBar";
import Clock from "./components/Clock/Clock";
import SignUpForm from "./components/SignUpForm/SignUpForm";
import SignInForm from "./components/SignInForm/SignInForm";
import Landing from "./components/Landing/Landing";
import Dashboard from "./components/Dashboard/Dashboard";
import AlarmForm from "./components/AlarmForm/AlarmForm";
import AlarmList from "./components/AlarmList/AlarmList";
import AlarmDetails from "./components/AlarmDetails/AlarmDetails";
import LoadingSpinner from "./components/LoadingSpinner/LoadingSpinner";
import * as alarmService from "./services/alarmService";

function App() {
  const { user } = useContext(UserContext);
  const [alarms, setAlarms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    //fetch all user's alarms
    const fetchAlarms = async () => {
      setLoading(true);
      setMessage("Getting alarms ...");
      try {
        const fetchedAlarms = await alarmService.index();
        setAlarms(fetchedAlarms);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
        setMessage("");
      }
    };
    if (user) {
      fetchAlarms();
    } else {
      setAlarms([]);
    }
  }, [user]);

  // handleAddAlarm to go to /alarms
  const handleAddAlarm = async (alarmFormData) => {
    setLoading(true);
    setMessage("Adding alarm...");
    try {
      await alarmService.create(alarmFormData);
      const fetchedAlarms = await alarmService.index();
      setAlarms(fetchedAlarms);
    } catch (err) {
      console.error("Error adding alarm", err.message);
    } finally {
      setLoading(false);
      setMessage("");
    }
    navigate("/alarms");
  };

  const handleUpdateAlarm = async (alarmId, alarmFormData) => {
    setLoading(true);
    setMessage("Updating alarm...");
    try {
      const updatedAlarm = await alarmService.updateAlarm(
        alarmId,
        alarmFormData
      );
      const updatedAlarms = alarms.map((alarm) =>
        alarmId === alarm._id ? updatedAlarm : alarm
      );
      updatedAlarms.sort((a, b) => a.time.localeCompare(b.time));
      setAlarms(updatedAlarms);
      navigate(`/alarms/${alarmId}`);
    } catch (err) {
      console.error("Error updating Alarm ", err.message);
      navigate("/alarms");
    } finally {
      setLoading(false);
      setMessage("");
    }
  };

  const handleDeleteAlarm = async (alarmId) => {
    setLoading(true);
    setMessage("Deleting alarm...");
    try {
      const deletedAlarm = await alarmService.deleteAlarm(alarmId);
      setAlarms(alarms.filter((alarm) => alarm._id !== deletedAlarm._id));
    } catch (err) {
      console.error("Error deleting alarm", err.message);
    } finally {
      setLoading(false);
      setMessage("");
    }
    navigate("/alarms");
  };

  return (
    <>
      {loading && <LoadingSpinner message={message} />}
      <NavBar />
      <Clock alarms={alarms} />
      <Routes>
        <Route path="/" element={user ? <Dashboard /> : <Landing />} />
        {user ? (
          <>
            <Route path="/alarms" element={<AlarmList alarms={alarms} />} />
            <Route
              path="/alarms/new"
              element={
                <AlarmForm alarms={alarms} handleAddAlarm={handleAddAlarm} />
              }
            />
            <Route
              path="/alarms/:alarmId"
              element={
                <AlarmDetails
                  alarms={alarms}
                  handleDeleteAlarm={handleDeleteAlarm}
                />
              }
            />
            <Route
              path="/alarms/:alarmId/edit"
              element={
                <AlarmForm
                  alarms={alarms}
                  handleUpdateAlarm={handleUpdateAlarm}
                />
              }
            />
          </>
        ) : (
          <>
            <Route path="/sign-up" element={<SignUpForm />} />
            <Route path="/sign-in" element={<SignInForm />} />
          </>
        )}
      </Routes>
    </>
  );
}

export default App;

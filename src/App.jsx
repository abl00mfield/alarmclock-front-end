import { useContext, useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router";

import NavBar from "./components/NavBar/NavBar";
import Clock from "./components/Clock/Clock";
import SignUpForm from "./components/SignUpForm/SignUpForm";
import SignInForm from "./components/SignInForm/SignInForm";
import Landing from "./components/Landing/Landing";
import Dashboard from "./components/Dashboard/Dashboard";
import { UserContext } from "./contexts/UserContext";
import AlarmForm from "./components/AlarmForm/AlarmForm";
import AlarmList from "./components/AlarmList/AlarmList";
import AlarmDetails from "./components/AlarmDetails/AlarmDetails";
import * as alarmService from "./services/alarmService";

function App() {
  const { user } = useContext(UserContext);
  const [alarms, setAlarms] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    //lets fetch all the current user's alarms and pass down to the clock component so it has access to them
    const fetchAlarms = async () => {
      try {
        const fetchedAlarms = await alarmService.index();
        setAlarms(fetchedAlarms);
      } catch (err) {
        console.log(err);
      }
    };
    if (user) fetchAlarms();
  }, [user]);

  // handleAddAlarm to go to /alarms
  const handleAddAlarm = async (alarmFormData) => {
    await alarmService.create(alarmFormData);
    const fetchedAlarms = await alarmService.index();
    setAlarms(fetchedAlarms);
    navigate("/alarms");
  };

  const handleUpdateAlarm = async (alarmId, alarmFormData) => {
    const updatedAlarm = await alarmService.updateAlarm(alarmId, alarmFormData);
    const updatedAlarms = alarms.map((alarm) =>
      alarmId === alarm._id ? updatedAlarm : alarm
    );
    updatedAlarms.sort((a, b) => a.time.localeCompare(b.time));
    setAlarms(updatedAlarms);
    navigate(`/alarms/${alarmId}`);
  };

  const handleDeleteAlarm = async (alarmId) => {
    const deletedAlarm = await alarmService.deleteAlarm(alarmId);
    setAlarms(alarms.filter((alarm) => alarm._id !== deletedAlarm._id));
    navigate("/alarms");
  };

  return (
    <>
      <NavBar />
      <Clock alarms={alarms} />
      <Routes>
        <Route
          path="/"
          element={user ? <Dashboard alarms={alarms} /> : <Landing />}
        />
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

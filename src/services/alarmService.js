const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/alarms`;

const index = async () => {
  try {
    const res = await fetch(BASE_URL, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.error(error);
  }
};

//POST creating a new alarm /alarms
const create = async (alarmFormData) => {
  try {
    const res = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(alarmFormData),
    });
    return res.json();
  } catch (error) {
    console.error(error);
  }
};

//GET show route, show a single alarm
//alarm/:alarmId
const show = async (alarmId) => {
  try {
    const res = await fetch(`${BASE_URL}/${alarmId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return res.json();
  } catch (error) {
    console.error(error);
  }
};

//DELETE route /alarms/:alarmId
const deleteAlarm = async (alarmId) => {
  try {
    const res = await fetch(`${BASE_URL}/${alarmId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return res.json();
  } catch (error) {
    console.error(error);
  }
};

//PUT route /alarms/:alarmId

const updateAlarm = async (alarmId, alarmFormData) => {
  try {
    const res = await fetch(`${BASE_URL}/${alarmId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-type": "application/json",
      },
      body: JSON.stringify(alarmFormData),
    });
    return res.json();
  } catch (error) {
    console.log(error);
  }
};

export { index, create, show, deleteAlarm, updateAlarm };

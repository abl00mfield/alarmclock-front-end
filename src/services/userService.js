const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/users`;

const index = async () => {
  try {
    const res = await fetch(BASE_URL, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });

    const data = await res.json();

    if (data.err) {
      throw new Error(data.err);
    }

    return data;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

export { index };

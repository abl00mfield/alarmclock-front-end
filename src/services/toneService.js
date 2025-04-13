const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/tones`;

const index = async () => {
  try {
    const res = await fetch(BASE_URL);
    const data = await res.json();

    if (data.error) {
      throw new Error(data.error);
    }
    return data;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

export { index };

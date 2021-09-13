const getToken = async () => {
  try {
    const token = localStorage.getItem("@ioasys-books:token");
    const refreshToken = localStorage.getItem("@ioasys-books:refresh-token");

    return {
      token,
      refreshToken,
    };
  } catch (err) {
    throw new Error(err);
  }
};

export default getToken;

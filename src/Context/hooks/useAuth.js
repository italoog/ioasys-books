import { useState, useEffect, createContext, useContext } from "react";
import router from "next/dist/client/router";

import api from "../../services/api";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("@ioasys-books:token");

    if (token) {
      api.defaults.headers.Authorization = `Bearer ${JSON.parse(token)}`;
      setAuthenticated(true);
    }

    setLoading(false);
  }, []);

  async function handleLogin(email, password) {
    const response = await api.post("auth/sign-in", {
      email,
      password,
    });
    const name = response.data.name;
    const token = response.headers.authorization;
    const refreshToken = response.headers["@ioasys-books:refresh-token"];

    localStorage.setItem("@ioasys-books:name", JSON.stringify(name));
    localStorage.setItem("@ioasys-books:token", JSON.stringify(token));
    localStorage.setItem(
      "@ioasys-books:refresh-token",
      JSON.stringify(refreshToken)
    );

    api.defaults.headers.Authorization = `Bearer ${token}`;

    setAuthenticated(true);
  }

  function handleLogout() {
    setAuthenticated(false);
    localStorage.removeItem("@ioasys-books:token");
    localStorage.removeItem("@ioasys-books:name");
    localStorage.removeItem("@ioasys-books:refresh-token");
    api.defaults.headers.Authorization = undefined;
    router.push("/");
  }

  return (
    <AuthContext.Provider
      value={{ loading, authenticated, handleLogin, handleLogout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  return context;
};

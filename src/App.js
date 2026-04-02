import { useState } from "react";
import AuthPage from "./AuthPage";
import MainPage from "./MainPage";

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  const handleLogin = (token) => {
    localStorage.setItem("token", token);
    setLoggedIn(true);
  };

  if (loggedIn) {
    return <MainPage />;
  }

  return <AuthPage onLogin={handleLogin} />;
}
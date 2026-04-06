import { useState } from "react";
import AuthPage from "./AuthPage";
import MainPage from "./MainPage";

export default function App() {
  // ✅ Keep user logged in after refresh
  const [loggedIn, setLoggedIn] = useState(
    !!localStorage.getItem("token")
  );

  // ✅ Handle login
  const handleLogin = (token) => {
    localStorage.setItem("token", token);
    setLoggedIn(true);
  };

  // ✅ Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    setLoggedIn(false);
  };

  return (
    <>
      {loggedIn ? (
        <MainPage onLogout={handleLogout} />
      ) : (
        <AuthPage onLogin={handleLogin} />
      )}
    </>
  );
}
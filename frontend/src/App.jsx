import { useContext } from "react";
import { UserDataContext } from "./context/UserContext";
import { Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/home";
import Signin from "./pages/signin";
import Signup from "./pages/signup";
import Customise from "./pages/customise";
import Customise2 from "./pages/customise2";

function App() {
  const { userData, loadingUser } = useContext(UserDataContext);

  return (
    <Routes>
      <Route
        path="/"
        element={
          loadingUser ? (
            <div>Loading...</div>
          ) : userData?.assistantImage && userData?.assistantName ? (
            <Home />
          ) : (
            <Navigate to="/customise" />
          )
        }
      />
      <Route
        path="/signup"
        element={
          loadingUser ? (
            <div>Loading...</div>
          ) : !userData ? (
            <Signup />
          ) : (
            <Navigate to="/" />
          )
        }
      />
      <Route
        path="/signin"
        element={
          loadingUser ? (
            <div>Loading...</div>
          ) : !userData ? (
            <Signin />
          ) : (
            <Navigate to="/" />
          )
        }
      />
      <Route path="/customise" element={<Customise />} />
      <Route
        path="/customise2"
        element={
          loadingUser ? (
            <div>Loading...</div>
          ) : userData ? (
            <Customise2 />
          ) : (
            <Navigate to="/signup" />
          )
        }
      />
      {/* Catch-all route */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
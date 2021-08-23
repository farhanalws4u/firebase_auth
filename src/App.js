import React from "react";
import Auth from "./Auth/Auth";
import Home from "./components/Home";

function App() {
  const user = JSON.parse(localStorage.getItem("currentUser"));

  return !user ? <Auth /> : <Home />;
}

export default App;

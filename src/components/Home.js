import React from "react";
import { Button } from "@material-ui/core";
import { auth } from "../firebase/index";

function Home() {
  const user = JSON.parse(localStorage.getItem("currentUser"));

  const handleSignOut = () => {
    auth.signOut().then(() => {
      localStorage.removeItem("currentUser");
      window.location.reload();
    });
  };

  return (
    <div style={styles.container}>
      <h2>Welcome {user.displayName}</h2>
      <p>Email:{user.email}</p>
      <Button variant="contained" color="primary" onClick={handleSignOut}>
        SignOut
      </Button>
    </div>
  );
}

const styles = {
  container: {
    width: "fit-content",
    height: "fit-content",
    backgroundColor: "skyblue",
    borderRadius: 20,
    textAlign: "center",
    padding: "20px 10px",
    marginLeft: "40%",
    marginTop: "10%",
  },
};

export default Home;

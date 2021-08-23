import React, { useState } from "react";
import firebase from "firebase";
import { auth, getUserDocument, generateUserDocument } from "../firebase/index";
import {
  Avatar,
  Button,
  Paper,
  Grid,
  Typography,
  Container,
} from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import useStyles from "./styles";
import Input from "./Input";
import Icon from "./icon";

function Auth() {
  const classes = useStyles();
  const provider = new firebase.auth.GoogleAuthProvider();
  const [isSignup, setIsSignup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [signUpError, setSignUpError] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

  const signUp = async (email, password) => {
    try {
      const { user } = await auth.createUserWithEmailAndPassword(
        email,
        password
      );

      const currentUser = await generateUserDocument(user, formData);

      localStorage.setItem("currentUser", JSON.stringify(currentUser));
      window.location.reload();
    } catch (e) {
      console.log(e);
      setSignUpError(e.message);
    }
  };

  const signIn = async (email, password) => {
    try {
      const { user } = await auth.signInWithEmailAndPassword(email, password);

      const currentUser = await getUserDocument(user.uid);

      localStorage.setItem("currentUser", JSON.stringify(currentUser));

      window.location.reload();
    } catch (e) {
      setSignUpError(e.message);
    }
  };

  const googleLoginHandle = async () => {
    try {
      const { user } = await auth.signInWithPopup(provider);
      console.log(user);

      const additionalData = {
        firstName: user.displayName.split(" ")[0],
        lastName: user.displayName.split(" ")[1],
        photoURL: user.photoURL,
      };

      const currentUser = await generateUserDocument(user, additionalData);

      localStorage.setItem("currentUser", JSON.stringify(currentUser));

      window.location.reload();
    } catch (e) {
      setSignUpError(e.message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { email, password } = formData;

    isSignup ? signUp(email, password) : signIn(email, password);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleShowPassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const switchMode = () => {
    setIsSignup((prev) => !prev);
    handleShowPassword(false);
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper className={classes.paper} elevation={3}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography variant="h5">{isSignup ? "Sign Up" : "Sign In"}</Typography>
        {signUpError && <Alert severity="error">{signUpError}</Alert>}
        <form className={classes.form} onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {isSignup && (
              <>
                <Input
                  name="firstName"
                  label="First Name"
                  handleChange={handleChange}
                  autoFocus
                  half
                />

                <Input
                  name="lastName"
                  label="Last Name"
                  handleChange={handleChange}
                  half
                />
              </>
            )}
            <Input
              name="email"
              label="Email Address"
              handleChange={handleChange}
              type="email"
            />
            <Input
              name="password"
              label="Password"
              handleChange={handleChange}
              type={showPassword ? "text" : "password"}
              handleShowPassword={handleShowPassword}
            />
            {isSignup && (
              <Input
                name="confirmPassword"
                label="Repeat Password"
                handleChange={handleChange}
                type="password"
              />
            )}
          </Grid>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            {isSignup ? "Sign Up" : "Sign In"}
          </Button>

          <Button
            onClick={googleLoginHandle}
            variant="outlined"
            color="primary"
            fullWidth
          >
            <Icon />
            &nbsp; Google Login
          </Button>

          <Grid container justify="center">
            <Grid item>
              <Button onClick={switchMode}>
                {isSignup
                  ? "Alreday have an account? Sign In"
                  : "Don't have an account? Sign Up"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
}

export default Auth;

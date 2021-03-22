import { useState } from "react";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import { signUpQuery, signInQuery } from "../query/loginQuery";

const Login = ({ darkMode, loggedIn, setLogIn, makeNotification }) => {
  const [displayLogin, setDisplayLogin] = useState(true);

  const changeDisplay = () => {
    setDisplayLogin(!displayLogin);
  };

  return (
    <div
      className={`Login ${darkMode ? "side-D" : "side-L"}`}
      style={{ display: !loggedIn ? "block" : "none" }}
    >
      <div className="Login-Title">
        <div
          style={{ fontSize: "2.7rem", fontWeight: "600", cursor: "default" }}
        >
          Messenger
        </div>
      </div>
      <div className="Login-Title">
        <div
          onClick={changeDisplay}
          className={
            darkMode
              ? displayLogin
                ? "text1-D"
                : "text2-L"
              : displayLogin
              ? "text1-L"
              : "text2-D"
          }
        >
          Log In
        </div>
        <div className={darkMode ? "text1-D" : "text1-L"}>|</div>
        <div
          onClick={changeDisplay}
          className={
            darkMode
              ? !displayLogin
                ? "text1-D"
                : "text2-L"
              : !displayLogin
              ? "text1-L"
              : "text2-D"
          }
        >
          Sign Up
        </div>
      </div>
      <SignIn
        darkMode={darkMode}
        display={displayLogin}
        signInQuery={signInQuery}
        setLogIn={setLogIn}
        makeNotification={makeNotification}
      />
      <SignUp
        darkMode={darkMode}
        display={displayLogin}
        signUpQuery={signUpQuery}
        makeNotification={makeNotification}
      />
    </div>
  );
};

export default Login;

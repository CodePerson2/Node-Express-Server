import React from "react";
import { useState } from "react";

const SignIn = ({ darkMode, display, signInQuery, setLogIn, makeNotification }) => {

  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");

  const signInMethod = () => {
    signInQuery(userName, password, setLogIn, makeNotification);
  }

  const onUsernameChange = (e) =>{
    setUserName(e.target.value);
  }

  const onPasswordChange = (e) =>{
    setPassword(e.target.value);
  }

  return (
    <div className="SignIn" style={{ display: display ? "block" : "none", opacity: display ? "1" : "0" }}>
      <div className="SignIn-Inp">
        <input
          className={darkMode ? "input-D" : "input-L"}
          type="text"
          placeholder="Username"
          name="uname"
          required
          onChange={(e) => onUsernameChange(e)}
          value={userName}
        />
      </div>

      <div className="SignIn-Inp">
        <input
          className={darkMode ? "input-D" : "input-L"}
          type="password"
          placeholder="Password"
          name="psw"
          required
          onChange={(e) => onPasswordChange(e)}
          value={password}
        />
      </div>
      <div className="SignIn-Sub">
        <div className={`SignIn-Sub-Rem ${darkMode ? "text2-D" : "text2-L"}`}>
          <input type="checkbox" name="remember" />
          <label>Remember Me</label>
        </div>
        <button type="submit" onClick={signInMethod}>Log In</button>
      </div>
    </div>
  );
};

export default SignIn;

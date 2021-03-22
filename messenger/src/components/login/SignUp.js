import React from "react";
import { useState } from "react";

const SignUp = ({ darkMode, display, signUpQuery, makeNotification }) => {

  const [userName, setUserName] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");

  const signUpMethod = () => {
    signUpQuery(userName, password1, password2, makeNotification);
  }

  const onUsernameChange = (e) =>{
    setUserName(e.target.value);
  }

  const onPassword1Change = (e) =>{
    setPassword1(e.target.value);
  }

  const onPassword2Change = (e) =>{
    setPassword2(e.target.value);
  }

  return (
    <div className="SignIn" style={{ display: !display ? "block" : "none", opacity: !display ? "1" : "0" }}>
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
          onChange={(e) => onPassword1Change(e)}
          value={password1}
        />
      </div>
      <div className="SignIn-Inp">
        <input
          className={darkMode ? "input-D" : "input-L"}
          type="password"
          placeholder="Re-enter Password"
          name="psw"
          required
          onChange={(e) => onPassword2Change(e)}
          value={password2}
        />
      </div>
      <div className="SignIn-Sub">
        <button type="submit" onClick={signUpMethod}>Sign Up</button>
      </div>
    </div>
  );
};

export default SignUp;

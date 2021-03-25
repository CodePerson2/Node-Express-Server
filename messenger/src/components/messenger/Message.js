import { useState } from "react";

const Message = ({ darkMode, message }) => {
  const [show, setShow] = useState(false);

  return (
    <div
      className="App-MessageBox-Messages-Message"
      style={{ textAlign: message.right ? "right" : "left" }}
    >
      <div
        className={`App-MessageBox-Messages-Message-Time ${
          darkMode ? "text2-D" : "text2-L"
        }`}
        style={{ display: show ? "block" : "none" }}
      >
        {message.time}
      </div>
      <div className="App-MessageBox-Messages-Message-Bub">
        <div
          className={`App-MessageBox-Messages-Message-Bub-Text ${
            message.right
              ? "bubble-B-D"
              : darkMode
              ? "bubble-G-D"
              : "bubble-G-L"
          }`}
          onClick={() => (
              setShow(!show)
          )}
        >
          {message.message}
        </div>
      </div>
      <div
        className={`App-MessageBox-Messages-Message-Name ${
          message.right ? "text3-D" : "text3-L"
        }`}
        style={{ display: show ? "block" : "none" }}
      >
        {message.name}
      </div>
    </div>
  );
};

export default Message;

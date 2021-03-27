import { useState, useRef, useEffect } from "react";
import { FaArrowCircleLeft } from "react-icons/fa";
import Messages from "./Messages";

const MessagesBox = ({ sendMessageOnClick, messages, darkMode, back, smallApp, visible, name }) => {
  const [timer, setTimer] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [message, setMessage] = useState("");

  const [sendInputCont, setSendInputCont] = useState(18);
  const [heightCont, setHeightCont] = useState(200);
  const [heightTitle, setHeightTitle] = useState(60);

  const messageBox = useRef(null);
  const titleBox = useRef(null);
  const inputBox = useRef(null);
  const container = useRef(null);

  //resize message box onload
  useEffect(() => {
    setTimeout(() => {
      setHeightCont(container.current.clientHeight);
      setHeightTitle(titleBox.current.clientHeight);
    }, 500);

    window.addEventListener("resize", updateSize);
  }, []);

  //resize based on window resize
  const updateSize = () => {
    if (container.current == null) return;
    setHeightCont(container.current.clientHeight);
    setHeightTitle(titleBox.current.clientHeight);
  };

  //Checks for typing in message box
  const onMessageChange = (e) => {
    setMessage(e.target.value);

    setIsTyping(true);

    clearTimeout(timer);
    setTimer(
      setTimeout(() => {
        setIsTyping(false);
      }, 5000)
    );
    adjustTextArea(e);
  };

  //Set height of send box to fit message up to 4 lines
  const adjustTextArea = (e) => {
    if (container.current == null) return;
    if (
      e.target.scrollHeight < 90 &&
      e.target.scrollHeight !== e.target.clientHeight
    ) {
      setSendInputCont(e.target.scrollHeight - 10);
    }

    if (
      messageBox.current.scrollHeight < 90 &&
      messageBox.current.scrollHeight < e.target.clientHeight
    ) {
      setSendInputCont(messageBox.current.scrollHeight - 10);
    }
  };

  return (
    <div
      ref={container}
      className="App-MessageBox"
      style={{
        visibility: visible ? "visible" : "hidden",
        width: smallApp ? "100%" : "70%",
        left: smallApp ? (visible ? "0" : "100%") : "30%",
      }}
    >
      <div ref={titleBox} className="App-MessageBox-Title">
        {smallApp && (
          <div
            onClick={back}
            className={`App-MessageBox-Title-Back ${
              darkMode ? "text1-D" : "text1-L"
            }`}
          >
            <FaArrowCircleLeft />
          </div>
        )}
        <div
          className={`App-MessageBox-Title-Name ${
            darkMode ? "text1-D" : "text1-L"
          }`}
        >
          {name}
        </div>
      </div>
      <Messages
        messages={messages}
        darkMode={darkMode}
        height={heightCont - (heightTitle + sendInputCont + 35)}
      />
      <div
        ref={inputBox}
        style={{ height: sendInputCont + 35 + "px" }}
        className="App-MessageBox-Input"
      >
        <textarea
          className={darkMode ? "input-D" : "input-L"}
          onChange={(e) => onMessageChange(e)}
          value={message}
          style={{ height: sendInputCont + "px" }}
          type="text"
          name="send"
          id="send"
          placeholder="Type here..."
          maxLength="255"
        />
        <textarea
          style={{ visibility: "hidden" }}
          type="text"
          value={message}
          ref={messageBox}
          readOnly
        />
        <button onClick={() => sendMessageOnClick(message, setMessage, setSendInputCont)}>Send</button>
      </div>
    </div>
  );
};

export default MessagesBox;

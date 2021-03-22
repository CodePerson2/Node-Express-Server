import Message from "./Message";

const Messages = ({ darkMode, height, messages = null }) => {
  return (
    <div className="App-MessageBox-Messages" style={{ height: height }}>
      {messages !== null && Messages.length > 0 ? (
        messages.map((message) => (
          <Message
            key={message.id}
            darkMode={darkMode}
            message={{
              time: message.time,
              message: message.message,
              name: message.name,
              right: message.right,
            }}
          />
        ))
      ) : (
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            fontSize: "1.5rem",
            transform: "translate(-50%, -50%)",
            textAlign: "center",
          }}
          className={darkMode ? "text3-D" : "text3-L"}
        >
          No Messages
        </div>
      )}
    </div>
  );
};

export default Messages;

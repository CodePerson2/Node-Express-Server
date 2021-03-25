import SideBar from "./SideBar";
import MessageBox from "./MessagesBox";
import { useState } from "react";
import { getMessages } from "../query/messengerQuery";
const appWidthLimit = 700;

const Messenger = ({
  userInfo,
  setLogIn,
  colorMode,
  darkMode,
  back,
  appWidth,
  appLocation,
  friends,
  onToggle,
  name,
  loggedIn,
  returnSearch,
}) => {
  const [messages, setMessages] = useState(null);

  //Add messages to message box
  const returnMessagesOnClick = (groupID, lastMessageDate = 0) => {
    var mess = new Promise((res, rej) => {
      getMessages(res, userInfo.userID, userInfo.token, groupID);
    });
    mess.then((res) => {
      if (res === undefined) setMessages([]);
      else if (res.success === 0) {
        setMessages([]);
      } else {
        res.forEach((e) => {
          e.right = false;
        });
        res.forEach((e) =>
          e.userName === userInfo.userName
            ? (e.right = true)
            : (e.right = false)
        );
        setMessages(res);
      }
    });
  };

  return (
    <div style={{ opacity: loggedIn ? "1" : "0" }}>
      <SideBar
        colorMode={colorMode}
        darkMode={darkMode}
        smallApp={appWidth < appWidthLimit}
        visible={loggedIn && (appWidth >= appWidthLimit || !appLocation)}
        friends={friends}
        onToggle={onToggle}
        userInfo={userInfo}
        setLogIn={setLogIn}
        getMessages={returnMessagesOnClick}
        returnSearch={returnSearch}
      />
      <MessageBox
        darkMode={darkMode}
        back={back}
        smallApp={appWidth < appWidthLimit}
        visible={loggedIn && (appWidth >= appWidthLimit || appLocation)}
        name={name}
        messages={messages}
      />
    </div>
  );
};

export default Messenger;

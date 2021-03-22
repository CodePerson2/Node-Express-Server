import SideBar from "./SideBar";
import MessageBox from "./MessagesBox";
import { useState } from "react";
import { getMessages } from "../query/messengerQuery";
const appWidthLimit = 700;

const Messenger = ({
  setLogIn,
  colorMode,
  darkMode,
  back,
  appWidth,
  appLocation,
  friends,
  onToggle,
  onSearch,
  name,
  loggedIn,
}) => {
  const [messages, setMessages] = useState(null);

  const returnMessagesOnClick = () => {
    var mess = getMessages();
    setMessages(mess);
  };

  return (
    <div style={{opacity: loggedIn? '1' : '0'}}>
      <SideBar
        colorMode={colorMode}
        darkMode={darkMode}
        smallApp={appWidth < appWidthLimit}
        visible={loggedIn && (appWidth >= appWidthLimit || !appLocation)}
        friends={friends}
        onToggle={onToggle}
        onSearch={onSearch}
        setLogIn={setLogIn}
        getMessages={returnMessagesOnClick}
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

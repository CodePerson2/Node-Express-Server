import SideBar from "./SideBar";
import MessageBox from "./MessagesBox";
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
  makeGroup,
  searchResults,
  messages,
  getMessages,
}) => {
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
        getMessages={getMessages}
        returnSearch={returnSearch}
        makeGroup={makeGroup}
        searchResults={searchResults}
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

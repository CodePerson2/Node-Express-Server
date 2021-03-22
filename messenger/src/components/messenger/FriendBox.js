import React from "react";

const FriendBox = ({ getMessages, darkMode, friend, onToggle }) => {

  const openChat = () => {
    onToggle(friend.id);
    getMessages();
  }
  return (
    <div
      className={`App-SideBar-Boxes-Box ${darkMode ? "side-D" : "side-L"} ${ darkMode ? (friend.highlight ? "sideHigh-D" : "") : (friend.highlight ? "sideHigh-L" : "")}`}
      onClick={openChat}
    >
      <div className={`App-SideBar-Boxes-Box-name ${darkMode ? "text1-D" : "text1-L"}`}>{friend.name}</div>
      <div className="App-SideBar-Boxes-Box-Cont">
        <div className={`App-SideBar-Boxes-Box-Cont-messageSender ${darkMode ? "text2-D" : "text2-L"}`}>
          {friend.messageSender}:
        </div>
        <div className={`App-SideBar-Boxes-Box-Cont-message ${darkMode ? "text3-D" : "text3-L"}`}>{friend.message}</div>
        <div className={`App-SideBar-Boxes-Box-Cont-date ${darkMode ? "text2-D" : "text2-L"}`}>&#8226; {friend.date}</div>
      </div>
    </div>
  );
};

export default FriendBox;

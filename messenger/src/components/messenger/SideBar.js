import React from "react";
import FriendBox from "./FriendBox";
import SearchBar from "./SearchBar";
import { useState } from "react";
import { FaCogs, FaArrowCircleLeft } from "react-icons/fa";

const SideBar = ({
  colorMode,
  darkMode,
  smallApp,
  visible,
  friends,
  onToggle,
  onSearch,
  setLogIn,
  getMessages,
}) => {
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <div>
      <div
        className={`App-SideBar ${darkMode ? "side-D" : "side-L"}`}
        style={{
          visibility: visible
            ? !settingsOpen
              ? "visible"
              : "hidden"
            : "hidden",
          width: smallApp ? "100%" : "30%",
          left: visible ? (!settingsOpen ? "0" : "-100%") : "-100%",
        }}
      >
        <div
          className={`App-SideBar-Settings ${darkMode ? "text1-D" : "text1-L"}`}
          onClick={() => setSettingsOpen(true)}
        >
          <FaCogs />
        </div>
        <div className="App-SideBar-Logout">
          <button onClick={setLogIn}>Log Out</button>
        </div>
        <div
          className={`App-SideBar-Title ${darkMode ? "text1-D" : "text1-L"}`}
        >
          Messenger
        </div>
        <SearchBar darkMode={darkMode} onSearch={onSearch} />
        <div className="App-SideBar-Boxes">
          {friends !== null && friends.length > 0 ? (
            friends.map((friend) => (
              <FriendBox
                key={friend.id}
                friend={friend}
                onToggle={onToggle}
                darkMode={darkMode}
                getMessages={getMessages}
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
              Search For Friends!
            </div>
          )}
        </div>
      </div>

      <div
        className={`App-SideBar ${darkMode ? "side-D" : "side-L"}`}
        style={{
          visibility: visible
            ? settingsOpen
              ? "visible"
              : "hidden"
            : "hidden",
          width: smallApp ? "100%" : "30%",
          top: visible ? (settingsOpen ? "0" : "-100%") : "-100%",
        }}
      >
        <div
          className={`App-SideBar-Back ${darkMode ? "text1-D" : "text1-L"}`}
          onClick={() => setSettingsOpen(false)}
        >
          <FaArrowCircleLeft />
        </div>
        <div
          className={`App-SideBar-Title ${darkMode ? "text1-D" : "text1-L"}`}
        >
          Settings
        </div>
        <div className="Settings">
          <div className={`Settings-Title ${darkMode ? "text2-D" : "text2-L"}`}>
            Dark-Mode
          </div>
          <label className="switch">
            <input type="checkbox" onClick={colorMode} />
            <span className="slider round"></span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default SideBar;

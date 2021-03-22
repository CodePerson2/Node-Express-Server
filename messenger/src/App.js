import { useState, useEffect, useRef } from "react";
import React from "react";
import "./style/index.css";
import Messenger from "./components/messenger/Messenger";
import Login from "./components/login/Login";
import { getFriends } from "./components/query/messengerQuery";
import Notification from "./components/notification/Notification";

function App() {
  const [name, setName] = useState("");

  const [username, setUsername] = useState("");
  const [token, setToken] = useState("");
  const [userid, setUserid] = useState(0);

  const [appWidth, setAppWidth] = useState(0);
  const [appLocation, setAppLocation] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);

  const [notifText, setNotifText] = useState("");
  const [notifState, setNotifState] = useState(false);

  const [friends, setFriends] = useState(null);

  const App = useRef(null);

  //Get width of App for adjusting UI
  useEffect(() => {
    if (App.current === null) return;
    setAppWidth(App.current.clientWidth);
    window.addEventListener("resize", updateSize);
  }, []);

  //resize based on window resize
  const updateSize = () => {
    if (App.current === null) return;
    setAppWidth(App.current.clientWidth);
  };

  const toggleFriend = async (id) => {
    setFriends(
      friends.map((friend) =>
        friend.id === id
          ? { ...friend, highlight: true }
          : { ...friend, highlight: false }
      )
    );
    friends.forEach((e) => (e.id === id ? openMessage(e) : e));
    setAppLocation(true);
  };

  const backToFriendList = () => {
    setAppLocation(false);
  };

  const openMessage = (friend) => {
    setName(friend.name);
  };

  const search = (val) => {
    console.log(val);
  };

  const colorMode = () => {
    setDarkMode(!darkMode);
  };

  const returnFriends = (id, token) => {
    var friends = new Promise((res, rej) => {
      getFriends(res, id, token);
    });
    friends.then((res) => {
      if (res === undefined) setFriends([]);
      else setFriends(res);
      console.log(res);
    });
  };

  const changeLoggedIn = (id = 0, token = "", user = "") => {
    setUsername(user);
    setToken(token);
    setUserid(id);
    console.log(user + " " + token + " " + id);

    if (!loggedIn) {
      returnFriends(id, token);
    }
    loadPage();
    setLoading(true);
    setTimeout(() => {
      setLoggedIn(!loggedIn);
    }, 500);
  };

  const loadPage = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  const makeNotification = (text) => {
    setNotifText(text);
    setNotifState(true);

    setTimeout(() => {
      setNotifState(false);
    }, 3000);
  };

  return (
    <div className={`App ${darkMode ? "main-D" : "main-L"}`} ref={App}>
      <Messenger
        setLogIn={changeLoggedIn}
        loggedIn={loggedIn}
        colorMode={colorMode}
        darkMode={darkMode}
        back={backToFriendList}
        appLocation={appLocation}
        appWidth={appWidth}
        friends={friends}
        onToggle={toggleFriend}
        onSearch={search}
        name={name}
      />
      <Login
        setLogIn={changeLoggedIn}
        darkMode={darkMode}
        loggedIn={loggedIn}
        makeNotification={makeNotification}
      />

      <div
        style={{
          opacity: loading ? "1" : "0",
          visibility: loading ? "visible" : "hidden",
        }}
        className={`loadTran ${darkMode ? "side-D" : "side-L"}`}
      ></div>

      <Notification
        darkMode={darkMode}
        notifState={notifState}
        notifText={notifText}
      />
    </div>
  );
}

export default App;

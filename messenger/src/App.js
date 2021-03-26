import { useState, useEffect, useRef } from "react";
import React from "react";
import "./style/index.css";
import Messenger from "./components/messenger/Messenger";
import Login from "./components/login/Login";
import { getFriends, getSearch, addGroup, getMessages } from "./components/query/messengerQuery";
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
  const [searchResults, setSearchResults] = useState([]);
  const [messages, setMessages] = useState(null);

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
        friend.groupID === id
          ? { ...friend, highlight: true }
          : { ...friend, highlight: false }
      )
    );
    friends.forEach((e) => (e.groupID === id ? openMessage(e) : e));
    setAppLocation(true);
  };

  const backToFriendList = () => {
    setAppLocation(false);
  };

  const openMessage = (friend) => {
    setName(friend.userName);
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
      else if (res.success === 0) {
        makeNotification(res.res);
      } else {
        res.forEach((f) => (f.highlight = false));
        setFriends(res);
      }
    });
  };

  const returnSearch = (search) => {
    if (search.length === 0) {
      setSearchResults([]);
      return;
    }
    var friends = new Promise((res, rej) => {
      getSearch(res, userid, token, search);
    });
    friends.then((res) => {
      if (res.success === 1) {
        setSearchResults(res["users"]);
      } else if (res.success === 0 && res.error === 0) {
        setSearchResults([]);
      } else if (res.error === 1) {
        setSearchResults([]);
        makeNotification(res.response);
      }
    });
  };

  const makeGroup = (friendID) => {
    var add = new Promise((res, rej) => {
      addGroup(res, userid, token, friendID);
    });
    add.then((res) => {
      if (res.success === 1) {
        makeNotification(res.response)
        returnFriends(userid, token)
      } else if (res.success === 0 && res.error === 0) {
        makeNotification(res.response);
      } else if (res.error === 1) {
        makeNotification(res.response);
      }
    });
  }

  //Add messages to message box
  const returnMessagesOnClick = (groupID, lastMessageDate = 0) => {
    var mess = new Promise((res, rej) => {
      getMessages(res, userid, token, groupID);
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
          e.userName === username
            ? (e.right = true)
            : (e.right = false)
        );
        setMessages(res);
      }
    });
  };

  const changeLoggedIn = (id = 0, token = "", user = "") => {
    setUsername(user);
    setToken(token);
    setUserid(id);
    setFriends([]);
    setSearchResults([]);
    setMessages([]);

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
        name={name}
        userInfo={{ userName: username, userID: userid, token: token }}
        returnSearch={returnSearch}
        makeGroup={makeGroup}
        searchResults={searchResults}
        getMessages={returnMessagesOnClick}
        messages={messages}
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

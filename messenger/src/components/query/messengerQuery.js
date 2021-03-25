const messages = [
  { id: 1, message: "hello dude", name: "bob", time: "212893", right: true },
  {
    id: 2,
    message: "What is the happening",
    name: "tim",
    time: "234234",
    right: false,
  },
  {
    id: 3,
    message: "Not much honestly",
    name: "bob",
    time: "212893",
    right: true,
  },
  {
    id: 4,
    message: "Coolio",
    name: "tim",
    time: "234234",
    right: false,
  },
  {
    id: 5,
    message: "Hard to find filler",
    name: "bob",
    time: "212893",
    right: true,
  },
  {
    id: 6,
    message: "I know what do people talk about",
    name: "bob",
    time: "212893",
    right: true,
  },
  { id: 7, message: "IDk :)", name: "bob", time: "212893", right: true },
];

const friends = [
  {
    id: 1,
    name: "bob",
    messageSender: "bob",
    message: "Hi how is the weather",
    date: "01-05-1999",
    highlight: false,
  },
  {
    id: 2,
    name: "Fred",
    messageSender: "bob",
    message: "Gotcha!",
    date: "01-05-1999",
    highlight: false,
  },
  {
    id: 3,
    name: "Sara",
    messageSender: "mat",
    message: "all Good",
    date: "01-05-1999",
    highlight: false,
  },
  {
    id: 4,
    name: "George",
    messageSender: "mat",
    message: "No problem",
    date: "01-05-1999",
    highlight: false,
  },
  {
    id: 5,
    name: "Jasmin",
    messageSender: "mat",
    message: "Definitley",
    date: "01-05-1999",
    highlight: false,
  },
  {
    id: 6,
    name: "Sam",
    messageSender: "mat",
    message: "Okay as you say",
    date: "01-05-1999",
    highlight: false,
  },
];

//querys database for messages
export const getMessages = (
  res,
  id,
  token,
  groupID,
  lastMessDate = "2031-03-22 16:31:32"
) => {
  return query(res, "/getMessages/", {
    token: token,
    userID: id,
    groupID: groupID,
    lastMessDate: lastMessDate,
  });
};

export const getFriends = (res, id, token) => {
  return query(res, "/getFriends/", { token: token, userID: id });
};

export const getSearch = (res, userID, token, search) => {
  return query(res, '/getSearch/', {userID: userID, token: token, search: search})
}

function query(res, queryLocation, info) {
  var xhttp;
  var loc = queryLocation;
  info = JSON.stringify(info);

  xhttp = new XMLHttpRequest();
  xhttp.open("POST", loc, true);
  xhttp.setRequestHeader("Content-Type", "application/json");

  xhttp.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      var resp = JSON.parse(this.responseText);
      res(resp);
    }
  };

  xhttp.send(info);
}

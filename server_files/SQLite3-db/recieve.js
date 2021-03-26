const account = require("./account");
const login = require("./login");
const search = require("./search")

function recieve(app) {
  app.post("/login/", (req, res) => {
    var info = req.body;
    login.loginAccount(info.username, info.password).then((resp) => {
      res.send(resp);
    });
  });

  app.post("/signup/", (req, res) => {
    var info = req.body;
    login
      .createAccount(info.username, info.password1, info.password2)
      .then((resp) => {
        res.send(resp);
      });
  });

  app.post("/getFriends/", (req, res) => {
    var info = req.body;
    account.getChats(info.userID, info.token).then((resp) => {
      res.send(resp);
    });
  });

  app.post("/getSearch/", (req, res) => {
    var info = req.body;
    var srch = new Promise((res, rej) => {
      search.getSearch(info.userID, info.token, info.search, res);
    });
    srch.then((val) => {
      res.send(val);
    });
    srch.catch((rej) => {
      console.log(rej)
    })
  });

  app.post("/addGroup/", (req, res) => {
    var info = req.body;
    var grp = new Promise((res, rej) => {
      account.createGroup(info.userID, info.token, [info.userID, info.friendID], res);
    });
    grp.then((val) => {
      res.send(val);
    });
  });

  app.post("/getMessages/", (req, res) => {
    var info = req.body;
    account
      .getMessages(info.groupID, info.userID, info.token, info.lastMessDate)
      .then((val) => {
        res.send(val);
      });
  });

  app.post("/sendMessage/", (req, res) => {
    var info = req.body;
    var grp = new Promise((res, rej) => {
      account.sendMessage(
        info.groupID,
        info.userID,
        info.token,
        info.message,
        res
      );
    });
    grp.then((val) => {
      res.send(val);
    });
  });
}

exports.recieve = recieve;

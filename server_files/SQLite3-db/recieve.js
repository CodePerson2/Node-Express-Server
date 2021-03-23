const group = require("./account");
const login = require("./login");

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
    group.getChats(info.userID, info.token).then((resp) => {
      res.send(resp);
    });
  });

  app.post("/getSearch/", (req, res) => {
    var info = req.body;
    var srch = new Promise((res, rej) => {
      search.getSearch(
        info.userID,
        info.token,
        info.search,
        res
      );
    });
    srch.then((val) => {
      res.send(val);
    });
  });
}

exports.recieve = recieve;

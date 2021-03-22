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
}

exports.recieve = recieve;

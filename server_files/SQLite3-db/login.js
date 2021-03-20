const AppDAO = require("./dao");
const passHash = require("password-hash");
const crypto = require("crypto");

function createAccount(username, password) {
  const dao = new AppDAO("./database.sqlite3");

  dao
    .run(`insert into login (userName, password) VALUES (?, ?)`, [
      username,
      passHash.generate(password),
    ])
    .then((val) => {
      console.log(val);
    });
}

function loginAccount(username, password) {
  const dao = new AppDAO("./database.sqlite3");

  dao.get(`select * from login where userName = ?`, [username]).then((val) => {
    if (val === undefined) console.log("no user found");
    else if (passHash.verify(password, val.password)) {
      refreshToken(dao, val.userID);
    }
  });
}

function refreshTokenDate(dao, id) {
  dao.run(`UPDATE login SET tokenTime = CURRENT_TIMESTAMP WHERE userID = ?`, [
    id,
  ]);
}

function refreshToken(dao, id) {
  let randomStr = crypto.randomBytes(20).toString("hex");
  dao.run(
    `UPDATE login SET tokenTime = CURRENT_TIMESTAMP, token = ? WHERE userID = ?`,
    [randomStr, id]
  );
}

exports.loginAccount = loginAccount;
exports.createAccount = createAccount;
exports.refreshTokenDate = refreshTokenDate;
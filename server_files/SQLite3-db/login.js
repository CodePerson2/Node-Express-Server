const AppDAO = require("./dao");
const passHash = require("password-hash");
const crypto = require("crypto");
const Promise = require("bluebird");

const passLength = 6;

function createAccount(username, password1, password2) {
  const dao = new AppDAO("./database.sqlite3");
  return new Promise((res, rej) => {
    if (password1 !== password2) {
      //tell user passwords dont match
      res({ success: 0, response: "Passwords do not match" });
      console.log("pass dont match");
    } else if (password1.length < passLength) {
      //tell user password is too short
      res({
        success: 0,
        response: "Password is too short. Must be longer than 5 characters",
      });
      console.log("pass too short");
    }
    dao
      .run(`insert into login (userName, password) VALUES (?, ?)`, [
        username,
        passHash.generate(password1),
      ])
      .catch((err) => {
        if (err.errno == 19) {
          //tell user username is already taken
          res({ success: 0, response: "Username already Taken" });
        }
      })
      .then(() => {
        res({ success: 1, response: "Account Created" });
      });
  });
}

function loginAccount(username, password) {
  const dao = new AppDAO("./database.sqlite3");

  return new Promise((res, rej) => {
    dao
      .get(`select * from login where userName = ?`, [username])
      .then((val) => {
        if (val === undefined) {
          //no user found
          res({ success: 0, response: "No User Found" });
        } else if (passHash.verify(password, val.password)) {
          refreshToken(dao, val.userID).then((tok) => {
            res({
              success: 1,
              token: tok,
              userID: val.userID,
              username: val.userName,
            });
          });
        } else {
          res({ success: 0, response: "Wrong Password or UserName" });
        }
      });
  });
}

function refreshTokenDate(dao, id) {
  dao.run(`UPDATE login SET tokenTime = CURRENT_TIMESTAMP WHERE userID = ?`, [
    id,
  ]);
}

function refreshToken(dao, id) {
  return new Promise((res, rej) => {
    let randomStr = crypto.randomBytes(20).toString("hex");
    dao
      .run(
        `UPDATE login SET tokenTime = CURRENT_TIMESTAMP, token = ? WHERE userID = ?`,
        [randomStr, id]
      )
      .catch((err) => {
        console.log(err.errno);
        rej(false);
      });
    res(randomStr);
  });
}

exports.loginAccount = loginAccount;
exports.createAccount = createAccount;
exports.refreshTokenDate = refreshTokenDate;

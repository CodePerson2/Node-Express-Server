const AppDAO = require("./dao");

function createGroup(usernames) {
  const dao = new AppDAO("./database.sqlite3");

  dao.run(`INSERT INTO chatGroup (name) VALUES (?)`, []).then((val) => {
    dao.get("SELECT last_insert_rowid()").then((val) => {
      usernames.forEach((element) => {
        dao.run("INSERT INTO userChat (groupID, userID) VALUES (?, ?) ", [
          val["last_insert_rowid()"],
          element,
        ]);
      });
    });
  });
}

function sendMessage(token, userid, groupid, message) {
  const dao = new AppDAO("./database.sqlite3");

  checkToken(token, userid, dao);
}

function checkToken(token, userid, dao) {
  dao
    .get(
      "select tokenTime, CURRENT_TIMESTAMP from login where userID = ? and token = ?",
      [userid, token]
    )
    .then((val) => {
      console.log(val);
    });
}

exports.createGroup = createGroup;
exports.sendMessage = sendMessage;

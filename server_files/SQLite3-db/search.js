const AppDAO = require("./dao");
const Promise = require("bluebird");

const tokenR = require("./account");
const database = "./database.sqlite3";

function getSearch(userid, token, search, resp) {
  const dao = new AppDAO(database);
  var tok = tokenR.checkToken(token, userid, dao);

  tok.catch((val) => {
    resp(val);
  });

  tok.then((val) => {
    var ans = dao.all(
      `SELECT userID, username FROM login
       WHERE username LIKE (? || '%')
       AND userID != ?`,
      [search, userid]
    );
    ans.catch(() => {
      resp({ success: 0, error: 1, response: "Error Occurred" });
    });
    ans.then((val) => {
      if (val.length === 0) {
        resp({ success: 0, error: 0, response: "No Usernames found" });
      } else {
        resp({ success: 1, users: val });
      }
    });
  });
}

exports.getSearch = getSearch;

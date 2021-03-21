const AppDAO = require("./dao");
const login = require("./login");
const Promise = require("bluebird");

const tokenMax = 20;
const database = "./database.sqlite3";

function createGroup(usernames) {
  const dao = new AppDAO(database);

  dao.run(`INSERT INTO chatGroup (name) VALUES (?)`, ['1']).then((val) => {
    dao.get(`SELECT last_insert_rowid()`).then((val) => {
      usernames.forEach((element) => {
        dao.run(`INSERT INTO userChat (groupID, userID) VALUES (?, ?) `, [
          val[`last_insert_rowid()`],
          element,
        ]);
      });
    });
  });
}

function sendMessage(token, userid, groupid, message) {
  const dao = new AppDAO(database);
  checkToken(token, userid, dao).then((tok) => {
    if (tok) {
      checkUserInGroup(dao, userid, groupid).then((val) => {
        if (val) {
          dao.run(
            `INSERT INTO message (userid, groupid, message) VALUES (?, ?, ?)`,
            [userid, groupid, message]
          );
        }
      });
    }
  });
}

function getMessages(groupid, userid, token) {
  const dao = new AppDAO(database);
  checkToken(token, userid, dao).then((tok) => {
    if (tok) {
      checkUserInGroup(dao, userid, groupid).then((val) => {
        if (val) {
          dao
            .all(
              `SELECT message.message, message.create_at, login.userName 
              FROM message 
              INNER JOIN login ON login.userID = message.userID 
              where groupID = ? 
              ORDER BY message.create_at 
              DESC LIMIT 12`,
              [groupid]
            )
            .then((row) => {
              console.log(row);
            });
        }
      });
    }
  });
}

function getChats(userid, token) {
  const dao = new AppDAO(database);
  checkToken(token, userid, dao).then((tok) => {
    if (tok) {
      dao
        .all(
          `SELECT login.userName, message.message
          FROM login 
          INNER JOIN userChat ON login.userID = userChat.userID 
          INNER JOIN chatGroup on chatGroup.groupID = userChat.groupID
          INNER JOIN message on message.groupID = chatGroup.groupID
          INNER JOIN userChat as chat2 on chat2.groupID = chatGroup.groupID
          INNER JOIN login as log2 on log2.userID = chat2.userID
          where login.userID = ? AND log2.userID != ?
          group by login.userName
          ORDER BY message.message DESC 
          `,
          [userid, userid]
        )
        .then((row) => {
          console.log(row);
        });
    }
  });
}

function checkUserInGroup(dao, userid, groupid) {
  return new Promise((res, rej) => {
    dao
      .get(`SELECT userID FROM userChat WHERE userID = ? AND groupID = ?`, [
        userid,
        groupid,
      ])
      .then((row) => {
        if (row === undefined) {
          console.log(`User Not In group`);
          //tell user they are not in group discussed
          rej(false);
        } else {
          console.log(`user and group found`);
          res(true);
        }
      });
  });
}

function checkToken(token, userid, dao) {
  return new Promise((res, rej) => {
    dao
      .get(
        `select strftime('%s','now') - strftime('%s', tokenTime) as time 
        from login 
        where userID = ? and token = ?`,
        [userid, token]
      )
      .then((val) => {
        if (val === undefined) {
          //tell user token is corrupt login again
        } else if (val.time / 60 > tokenMax) {
          //Tell user to login again
          rej(false);
        } else {
          login.refreshTokenDate(dao, userid);
          res(true);
        }
      });
  });
}

exports.createGroup = createGroup;
exports.sendMessage = sendMessage;
exports.getMessages = getMessages;
exports.getChats = getChats;
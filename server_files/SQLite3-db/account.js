const AppDAO = require("./dao");
const login = require("./login");
const Promise = require("bluebird");

const tokenMax = 20;
const database = "./database.sqlite3";

function createGroup(userid, token, usernames, resp) {
  const dao = new AppDAO(database);

  var tok = checkToken(token, userid, dao);
  tok.then(() => {
    dao.run(`INSERT INTO chatGroup (name) VALUES (?)`, []).then((val) => {
      dao.get(`SELECT last_insert_rowid()`).then((val) => {
        var items = 0;
        usernames.forEach((element) => {
          items++;
          dao.run(`INSERT INTO userChat (groupID, userID) VALUES (?, ?) `, [
            val[`last_insert_rowid()`],
            element,
          ]);
          if (items === usernames.length)
            resp({ success: 1, response: "Group Created Successfully" });
        });
      });
    });
  });
  tok.catch((val) => {
    resp(val);
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

function getMessages(groupid, userid, token, lastDate = "2031-03-22 16:31:32") {
  const dao = new AppDAO(database);
  return new Promise((res, rej) => {
    checkToken(token, userid, dao).then((tok) => {
      if (tok) {
        checkUserInGroup(dao, userid, groupid).then((val) => {
          if (val) {
            dao
              .all(
                `SELECT message.message, message.create_at as time, login.userName
                FROM message 
                INNER JOIN login ON login.userID = message.userID 
                where groupID = ? AND message.create_at < ?
                ORDER BY message.create_at 
                DESC LIMIT 12`,
                [groupid, lastDate]
              )
              .then((row) => {
                res(row);
              });
          }
        });
      }
    });
  });
}

function getChats(userid, token) {
  const dao = new AppDAO(database);

  return new Promise((res, rej) => {
    var tokenRes = checkToken(token, userid, dao, res);
    tokenRes.then((tok) => {
      if (tok) {
        dao
          .all(
            `SELECT grp.groupID, grp.groupName, mess.message, grp.userName, mess.messDate, mess.userName as sender
            FROM (SELECT chat.groupID as groupID, chat.groupName as groupName, log.userName as userName
            FROM userChat
            INNER JOIN 
              (SELECT userChat.groupID as groupID, chatGroup.name as groupName
                FROM login 
                INNER JOIN userChat ON userChat.userID = login.userID
                INNER JOIN chatGroup ON chatGroup.groupID = userChat.groupID
                where login.userID = ?
              ) 
              AS chat
              ON chat.groupID = userChat.groupID
              INNER JOIN login as log ON log.userID = userChat.userID
              where log.userID != ?
              GROUP BY log.userID, chat.groupID) AS grp

              LEFT JOIN

              (SELECT x.message, x.groupID, x.messDate, x.userName FROM 
              (SELECT grp.groupID as groupID, message.message as message,
               lgn.userName as userName, message.create_at as messDate
              FROM message

              INNER JOIN 
                (SELECT userChat.groupID AS groupID
                FROM login 
                INNER JOIN userChat ON userChat.userID = login.userID
                where login.userID = ?
                GROUP BY login.userID, userChat.groupID) 
              AS grp
              ON grp.groupID = message.groupID

              INNER JOIN 
                (SELECT userName, userID 
                FROM login)
              AS lgn
              ON lgn.userID = message.userID

              ORDER BY message.create_at DESC) 
            as x
            GROUP BY x.groupID) AS mess
            ON mess.groupID = grp.groupID
            ORDER BY mess.messDate DESC
            `,
            [userid, userid, userid]
          )
          .then((row) => {
            if (row.length === 0) res({ success: 0, rows: 0, res: "No Chats" });
            res(row);
          });
      }
    });
    tokenRes.catch((val) => {
      res(val);
    });
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
          rej({ success: 0, res: "Token is Corrupt" });
        } else if (val.time / 60 > tokenMax) {
          //Tell user to login again
          rej({ success: 0, res: "Token is Out of Date" });
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
exports.checkToken = checkToken;

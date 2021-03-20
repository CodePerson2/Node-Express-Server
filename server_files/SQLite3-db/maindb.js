const AppDAO = require("./dao");
const group = require("./account");
const login = require("./login");

function main() {
  const dao = new AppDAO("./database.sqlite3");
  //dao.all(`select * from login`).then((r) => {console.log(r)})
  //group.createGroup(['fred', 'billy'])

  //login.loginAccount('fred', 'ajasnjdnas')
  //dao.all('select * from login').then((r) => {console.log(r)})
  group.sendMessage("7c517deff4aa7f3eaf4f9c155dbea86a6ca33824", 1, 1, "hello");
}
main();

// CREATE TABLE IF NOT EXISTS login (
//   userID INTEGER PRIMARY KEY,
//   password VARCHAR(100) NOT NULL,
//   userName VARCHAR(30) UNIQUE NOT NULL,
//   token VARCHAR(50),
//   tokenTime DATETIME,
//   create_At DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
// )

// CREATE TABLE IF NOT EXISTS userChat(
//   groupID INTEGER NOT NULL,
//   userID INTEGER NOT NULL,
//   create_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
//   FOREIGN KEY (userID) REFERENCES login(userID) ON DELETE CASCADE,
//   FOREIGN KEY (groupID) REFERENCES chatGroup(groupID) ON DELETE CASCADE
// )

// CREATE TABLE IF NOT EXISTS chatGroup(
//   groupID INTEGER PRIMARY KEY,
//   name VARCHAR(30) NOT NULL,
//   create_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
// )

// CREATE TABLE IF NOT EXISTS message(
//   messageID INTEGER PRIMARY KEY,
//   userID INTEGER NOT NULL,
//   groupID INTEGER NOT NULL,
//   message VARCHAR(256),
//   create_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
//   FOREIGN KEY (userID) REFERENCES login(userID) ON DELETE CASCADE,
//   FOREIGN KEY (groupID) REFERENCES chatGroup(groupID) ON DELETE CASCADE
// )

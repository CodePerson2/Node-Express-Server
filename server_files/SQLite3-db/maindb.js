const AppDAO = require("./dao");
const group = require("./account");
const login = require("./login");

function main() {
  const dao = new AppDAO("./database.sqlite3");
  //dao.all(`select * from login`).then((r) => {console.log(r)})
  //group.createGroup([1, 2])
  //login.createAccount('bill', 'billww', 'billww')

  //login.loginAccount('fred', 'ajasnjdnas')
  group.getChats(1, 'e8896cf23044d2bf26ba0fbfef0dda6f2a1adc5f')
  //group.sendMessage('0e2e3becc76ede17510e69216932a4ec8e9171b4', 1, 1 , 'Hello bobby guy what be good with uu')
  //dao.all('select * from userChat').then((r) => {console.log(r)})
  //group.sendMessage("7c517deff4aa7f3eaf4f9c155dbea86a6ca33824", 1, 1, "hello");
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
//   name VARCHAR(30),
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

const AppDAO = require("./dao");
const group = require("./account");
const login = require("./login");

function main() {
  const dao = new AppDAO("./database.sqlite3");
  //dao.all(`select * from login`).then((r) => {console.log(r)})
  //login.createAccount('bill', 'bill', 'bill')
  //login.createAccount('bob', 'bill', 'bill')
  //login.createAccount('fred', 'bill', 'bill')

  //login.loginAccount('bill', 'bill')
  //login.loginAccount('bob', 'bill')

  //group.createGroup([3, 4])
  //group.sendMessage('d08ccc61e240b8a7f6215798632aed45b566628c', 3, 1 , 'hey guy')
  //group.sendMessage('d08ccc61e240b8a7f6215798632aed45b566628c', 3, 3 , 'hey gu3432y')
  group.getChats(2, '54e321e516bd29c8bef753d8fc8f4ae9bafb3eb2')
  //group.getMessages(3, 3, 'd08ccc61e240b8a7f6215798632aed45b566628c')
  //group.sendMessage('5a15621f668c44066f9b45729876a42d0b168088', 2, 12 , 'hey guy')
  //dao.run(`DELETE FROM login where userID = 1`, []).then((r) => {console.log(r)})
  //dao.all(`SELECT * FROM login`, []).then((r) => {console.log(r)})
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
// );

// CREATE TABLE IF NOT EXISTS chatGroup(
//   groupID INTEGER PRIMARY KEY,
//   name VARCHAR(30),
//   create_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
// );

// CREATE TABLE IF NOT EXISTS userChat(
//   groupID INTEGER NOT NULL,
//   userID INTEGER NOT NULL,
//   create_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
//   FOREIGN KEY (userID) REFERENCES login(userID) ON DELETE CASCADE,
//   FOREIGN KEY (groupID) REFERENCES chatGroup(groupID) ON DELETE CASCADE
// );


// CREATE TABLE IF NOT EXISTS message(
//   messageID INTEGER PRIMARY KEY,
//   userID INTEGER NOT NULL,
//   groupID INTEGER NOT NULL,
//   message VARCHAR(256),
//   create_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
//   FOREIGN KEY (userID) REFERENCES login(userID) ON DELETE CASCADE,
//   FOREIGN KEY (groupID) REFERENCES chatGroup(groupID) ON DELETE CASCADE
// )

const AppDAO = require("./dao");
const group = require("./account");
const login = require("./login");
const search = require("./search");

const Promise = require("bluebird");

function main() {
  const dao = new AppDAO("./database.sqlite3");
  //dao.all(`select * from login`).then((r) => {console.log(r)})
  //login.createAccount('bill', 'bill', 'bill')
  //login.createAccount('bob', 'bill', 'bill')
  //login.createAccount('fred', 'bill', 'bill')

  //login.loginAccount('bill', 'bill')
  //login.loginAccount("bob1", "111111");

  // var p = new Promise((res, rej) => {
  //   search.getSearch(2, "493f4edaa8b8301eb3b2bb6ec383cc4e5529a52a", "bob", res);
  // });
  // p.then((val) => {
  //   console.log(val);
  // })

  //group.createGroup([3, 2])
  // for(var x = 0; x < 15; x++){
  //   group.sendMessage('c1d697353d5f09424b3a280f79afec88ce6e790c', 2, 2 , x + ' message')
  // }
  //group.sendMessage('493f4edaa8b8301eb3b2bb6ec383cc4e5529a52a', 2, 2 , 'hey guy')
  //group.sendMessage('d08ccc61e240b8a7f6215798632aed45b566628c', 3, 3 , 'hey gu3432y')
  //group.getChats(2, 'c1d697353d5f09424b3a280f79afec88ce6e790c')
  group.getMessages(2, 2, 'c1d697353d5f09424b3a280f79afec88ce6e790c', 12)
  //group.sendMessage('5a15621f668c44066f9b45729876a42d0b168088', 2, 12 , 'hey guy')
  //dao.run(``, []).then((r) => {console.log(r)})
  // dao.all(`SELECT * FROM login`, []).then((r) => {
  //   console.log(r);
  // });
  //group.sendMessage("7c517deff4aa7f3eaf4f9c155dbea86a6ca33824", 1, 1, "hello");
}
main();


const sqlite3 = require("sqlite3");
const Promise = require("bluebird");

class AppDAO {
  constructor(dbFilePath) {
    this.db = new sqlite3.Database(dbFilePath, (err) => {
      if (err) {
        console.log("Error connecting to database", err);
      } else {
        //console.log("Connected to database");
      }
    });
  }
  run(sql, params = []) {
    return new Promise((res, rej) => {
      this.db.run(sql, params, (err, result) => {
        if (err) {
          console.log("Error!, ", err);
          console.log(sql);
          rej(err);
        } else {
          res(result);
        }
      });
    });
  }
  all(sql, params = []) {
    return new Promise((res, rej) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) {
          console.log("Error!, ", err);
          console.log(sql);
          rej(err);
        } else {
          res(rows);
        }
      });
    });
  }
  get(sql, params = []) {
    return new Promise((res, rej) => {
      this.db.get(sql, params, (err, rows) => {
        if (err) {
          console.log("Error!, ", err);
          console.log(sql);
          rej(err);
        } else {
          res(rows);
        }
      });
    });
  }
}

module.exports = AppDAO;

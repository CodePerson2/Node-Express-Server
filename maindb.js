const Promise = require('bluebird')
const AppDAO = require('./dao')


function main(){
    const dao = new AppDAO('./database.sqlite3')
}
main()
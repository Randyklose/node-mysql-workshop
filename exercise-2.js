/*## Exercise 2: Getting back our data
1. Write a program that fetches the first 5 accounts in the addressbook database
2. For each account, `console.log` a line with the account's ID and email,
like this: **`#1:`**`email@domain.com`
3. Use the `colors` NPM module with the `.bold` option to achieve this effect*/

var mysql = require('promise-mysql');
var color = require('colors');
var Table = require('cli-table');


var connection = mysql.createPool({
    host: 'localhost',
    user: 'randyk',
    password: '',
    database: 'addressbook',
    connectionLimit: 10
});

function getAccounts() {

    return connection.query("SELECT Account.id, Account.email FROM Account limit 5")
        .then(function(rows) {
               return rows;
        });
}

getAccounts()
    .then(function(res) {
        res.forEach(function(row){
        console.log('#' + color.bold(row.id) + ': ' + row.email);
        });
        connection.end();
})
.catch(function(err) {
    console.log("There was an error: ", err);
});

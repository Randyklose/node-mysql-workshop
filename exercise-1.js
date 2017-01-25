/*## Exercise 1: Getting started!
1. Write a program that fetches all the databases in MySQL and 
prints them nicely on the screen.
2. Don't hesitate to use `colors` or `cli-table` or any other module
of your choice to make the output nicer.*/

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

function getDatabases() {

    return connection.query("SHOW DATABASES")
        .then(function(rows) {
            return rows.map(function(row) {
                
                return row.Database;
            });
        })
            .then(function(rows){
            
            var table = new Table({
                head: [ color.rainbow("Database #1"), color.rainbow("Database#2"), color.rainbow("Database#3"), color.rainbow("Database#4"), color.rainbow("Database#5"), color.rainbow("Database#6")],
                colWidths: [15, 15, 15, 15, 15, 15]
            });
            table.push(rows);
            return table;
        });
    // connection.end()
}

getDatabases()
    .then(function(res) {
        console.log(res.toString());
        connection.end();
})
.catch(function(err) {
    console.log("There was an error: ", err);
});

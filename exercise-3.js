/*## Exercise 3: Joining up the data, part 1
1. Write a program that fetches all the accounts and their addressbooks.
2. Output one line for each account as in Exercise 2, followed by a listing
of all the address book names for that account, one per line
3. Make the output look nice in any way you like
4. Here is an example:
```
#1: john@smith.com
  business contacts
  friends
#2: jane@smith.com
  ...
```
*/

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

function getAccountsAndAddressbook() {

    return connection.query("SELECT Account.id, Account.email, AddressBook.name FROM Account JOIN AddressBook ON Account.id = AddressBook.accountId")
        .then(function(rows) {
               return rows;
        })
        .then(function(rows) {
           return rows.reduce(function(acc,row) {
                if(row.email != acc) {
                    console.log(color.bold('#') + color.bold(row.id) + ': ' + row.email + "\n" + row.name );
                    acc= row.email;
                }
                else {
                    console.log(row.name);
                }
                return acc;
            },"");
        });

}

getAccountsAndAddressbook()
    .then(function(res) {
        connection.end();
})
.catch(function(err) {
    console.log("There was an error: ", err);
});
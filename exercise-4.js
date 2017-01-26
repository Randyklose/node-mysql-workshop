/*## Exercise 4: More about joins...
1. Notice that for the previous exercise, Account #5 did not appear
in the listing. Don't come back here until you have re-checked the 
previous exercise and noticed for yourself that Account #5 is missing.
2. The reason for this is because Account #5 does not have any
AddressBook, so doing the JOIN left it out.
3. [Read and **understand** this article on SQL JOINs]
(http://blog.codinghorror.com/a-visual-explanation-of-sql-joins/), 
more specifically about the `LEFT JOIN`.
4. Based on your new understanding, create a similar program to
Exercise#4.
5. The only difference, if an account does not have any address book,
print it like this:
```
#3: xxx@yyy.com
  --no address books--
```*/

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

    return connection.query("SELECT Account.id, Account.email, AddressBook.name FROM Account LEFT JOIN AddressBook ON Account.id = AddressBook.accountId")
        .then(function(rows) {
               return rows;
        })
        .then(function(rows) {
           return rows.reduce(function(acc,row) {
                if(row.email != acc && row.name != null) {
                    console.log(color.bold('#') + color.bold(row.id) + ': ' + row.email + "\n" + row.name );
                    acc= row.email;
                }
                
                else if(row.email != acc && row.name === null) {
                    console.log(color.bold('#') + color.bold(row.id) + ': ' + row.email + "\n" + "--no address books--" );
                    acc= row.email;
                }
                else {
                       console.log(row.name) ;
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
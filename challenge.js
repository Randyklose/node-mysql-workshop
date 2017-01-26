/*## CHALLENGE: Joining up the data, part 2
1. Write a program that fetches all accounts, their addressbooks, and entries.
2. Hint #1: you will have two `JOIN`s in your query.
3. Hint #2: you will need to use `AS` to give each column a unique name
4. Once you receive your results in JavaScript land, transform them into an **array** of accounts with nested relations.
5. Here is an example of the end result we are looking for. Note you will probably need to use some of these array methods we saw together in week 1. This is a good time to remind yourself of them, specifically `map` and `reduce`.
```javascript
[
  {
    id: 1,
    email: 'john@smith.com',
    addressBooks: [
      {
        id: 1,
        name: 'business contacts',
        entries: [
          {
            id: 1,
            firstName: 'John',
            lastName: 'Connor'
          },
          {
            id: 10,
            firstName: 'Sarah',
            lastName: 'Connor'
          }
        ]
      },
      {
        // another address book for account 1...
      }
    ]
  },
  {
    // another account...
  }
]
```
*/

var mysql = require('promise-mysql');
var color = require('colors');
var Table = require('cli-table');
const util = require('util')

var connection = mysql.createPool({
    host: 'localhost',
    user: 'randyk',
    password: '',
    database: 'addressbook',
    connectionLimit: 10
});

var query = `
SELECT
    Account.id AS accountId,
    Account.email AS accountEmail,
    AddressBook.id AS addressbookId,
    AddressBook.name AS addressbookName,
    Entry.id AS entryId,
    Entry.firstName AS entryFirstName,
    Entry.lastName AS entryLastName
FROM Account
JOIN AddressBook ON Account.id = AddressBook.accountId
JOIN Entry ON AddressBook.id = Entry.addressBookId`;

connection.query(query, function(err, result) {
    
/*
1. Create a new array that will hold accounts
2. Iterate over the mysql flat result set
3. For each row, there are actually 2 entities in that row: an account, and an ab
4. Look at the account ID and check in the accounts array if it exists.
  4a. if it does, add the current addressbook to it
  4b. if it doesn't, add the account to the accounts array, and add the current addressbook to it
*/
    var accounts = [];
    
    result.forEach(function(row) {
        var account = accounts.find(function(account) {
            return account.accountId === row.accountId;
        });
        
        if (!account) {
            account = {
                accountId: row.accountId,
                accountEmail: row.accountEmail,
                addressbooks: []
            };
            accounts.push(account);
        }
        
        var addressBook = account.addressbooks.find(function(addressbook) {
            return addressbook.addressbookId === row.addressbookId;
        });
        
        if (!addressBook) {
            addressBook = {
                addressbookId: row.addressbookId,
                name: row.addressbookName,
                entries: []
            };
            account.addressbooks.push(addressBook);
        }
        
        addressBook.entries.push({
            id: row.entryId,
            firstName: row.entryFirstName,
            lastName: row.entryLastName
        })
    })

    console.log(JSON.stringify(accounts, null ,4));
})

// SAME CODE WITH REDUCE

var query = `
SELECT
    Account.id AS accountId,
    Account.email AS accountEmail,
    AddressBook.id AS addressbookId,
    AddressBook.name AS addressbookName,
    Entry.id AS entryId,
    Entry.firstName AS entryFirstName,
    Entry.lastName AS entryLastName
FROM Account
JOIN AddressBook ON Account.id = AddressBook.accountId
JOIN Entry ON AddressBook.id = Entry.addressBookId`;

connection.query(query, function(err, result) {
    
/*
1. Create a new array that will hold accounts
2. Iterate over the mysql flat result set
3. For each row, there are actually 2 entities in that row: an account, and an ab
4. Look at the account ID and check in the accounts array if it exists.
  4a. if it does, add the current addressbook to it
  4b. if it doesn't, add the account to the accounts array, and add the current addressbook to it
*/
    var accounts = result.reduce(function(accounts, row) {
        var account = accounts.find(function(account) {
            return account.accountId === row.accountId;
        });
        
        if (!account) {
            account = {
                accountId: row.accountId,
                accountEmail: row.accountEmail,
                addressbooks: []
            };
            accounts.push(account);
        }
        
        var addressBook = account.addressbooks.find(function(addressbook) {
            return addressbook.addressbookId === row.addressbookId;
        });
        
        if (!addressBook) {
            addressBook = {
                addressbookId: row.addressbookId,
                name: row.addressbookName,
                entries: []
            };
            account.addressbooks.push(addressBook);
        }
        
        addressBook.entries.push({
            id: row.entryId,
            firstName: row.entryFirstName,
            lastName: row.entryLastName
        });
        
        return accounts;
    }, []);

    console.log(JSON.stringify(accounts, null ,4));
})





//RANDYS SOLUTION DO NOT USE

// function fetch() {

//     return connection.query("SELECT Account.id as Aid, Account.email as email, AddressBook.id as addressbookId,AddressBook.name as name, Entry.id as Eid,Entry.firstName as firstname, Entry.lastName as lastname FROM Account JOIN AddressBook ON Account.id = AddressBook.accountId JOIN Entry ON AddressBook.id = Entry.addressbookId limit 15")

//     .then(function(rows) {
//         return rows.reduce(function(acc, row, i, data) {
  
//             if (!acc.Aid) {
//                 acc.push({
//                     Aid: row.Aid,
//                     email: row.email,
//                     AddressBook: []
//                 })
//             }
//                     else if(acc.Aid) {
                      
//                       data.map(function(result) {
//                         console.log(result.addressbookId)
//                           acc.AddressBook.push({
//                             addressbookId: result.addressbookId,
//                             name: result.name,
//                             Entry: []
//                         })
//                      })

//                     }
            
//                     // loop.map(function(res) {
//                     //     if (res.AddressbookId === loop.AddressbookId) {
//                     //         return loop.Entry.push({
//                     //             Eid: res.Eid,
//                     //             firstname: res.firstname,
//                     //             lastname: res.lastname
//                     //         })
//                     //     }
//                     // })
                    

//           // }
//             return acc;
//         }, []);
//         })
//     }

// fetch()
//     .then(function(res) {
//         console.log(util.inspect(res, false, null))
//         connection.end();
//     })
//     .catch(function(err) {
//         console.log("There was an error: ", err);
//     });


// function fetch() {

//     return connection.query("SELECT Account.id as Aid, Account.email as email, AddressBook.id as addressbookid,AddressBook.name as name, Entry.id as Eid,Entry.firstName as firstname, Entry.lastName as lastname FROM Account JOIN AddressBook ON Account.id = AddressBook.accountId JOIN Entry ON AddressBook.id = Entry.addressbookId limit 15")

//     .then(function(rows) {
//             return rows.reduce(function(acc, row, i, array) {
                
//                         // if (acc.AddressBook.Entry.Eid){
//                         //       acc.AddressBook.Entry.map(function(res) {
//                         //                     res.AddressBook.Entry.push({
//                         //                     Eid: res.Eid,
//                         //                     firstname: res.firstname,
//                         //                     lastname: res.lastname
//                         //                 })
//                         //             })
//                         //         }
                        
//                         console.log(acc.Aid)
//                          if (acc.Aid) {
//                          return array.map(function(result) {

//                                     acc.AddressBook.push({
//                                     addressbookId: result.addressbookid,
//                                     name: result.name,
//                                     Entry: []
//                                 })
//                             })
//                          }
    
//                 else {
//                     acc.push({
//                         Aid: row.Aid,
//                         email: row.email,
//                         AddressBook: []
//                     })
//                 }
//                 return acc;
//             }, []);
//     });

// }

// fetch()
//     .then(function(res) {
//          console.log(util.inspect(res, false, null))
//         connection.end();
//     })
//     .catch(function(err) {
//         console.log("There was an error: ", err);
//         connection.end();
//     });
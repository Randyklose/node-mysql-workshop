SELECT Account.id as Aid, Account.email as email, AddressBook.id as addressbookId,
AddressBook.name as name,
    Entry.id asEid,Entry.firstName as firstname, Entry.lastName as lastname
    FROM Account 
        JOIN AddressBook
            ON Account.id = AddressBook.accountId
            JOIN Entry ON AddressBook.id = Entry.addressbookId;
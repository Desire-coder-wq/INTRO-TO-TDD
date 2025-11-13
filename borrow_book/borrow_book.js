function borrowBook(bookTitle, availableBooks) {

    if (typeof bookTitle !== "string") {
        return "Invalid input: book title must be a string.";
    }

    if (!Array.isArray(availableBooks)) {
        return "Invalid input: availableBooks must be an array.";
    }

    console.log("Checking availability for:", bookTitle);
    console.log(" Current available books:", availableBooks);

    const index = availableBooks.indexOf(bookTitle);
    console.log(" Found index:", index);

    if (index !== -1) {
        console.log(" Book found. Removing from list...");
        availableBooks.splice(index, 1);
        console.log(" Updated book list:", availableBooks);
        return `You have borrowed '${bookTitle}'.`;
    } else {
        console.log(" Book not found. No changes made to list.");
        return `Sorry, '${bookTitle}' is not available.`;
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { borrowBook };
}

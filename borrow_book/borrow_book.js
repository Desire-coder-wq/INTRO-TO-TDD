/**
  This one will allow users to  borrow a book from the library if it is available.
 
  If the book is available, it is removed from the availableBooks array.
   This function modifies the availableBooks array in place.
 
  @param {string} bookTitle - The title of the book to borrow.
  @param {string[]} availableBooks - An array of book titles currently available.
  @returns {string} A success or failure message based on availability.
 */
function borrowBook(bookTitle, availableBooks) {
    console.log("Checking availability for:", bookTitle);
    console.log(" Current available books:", availableBooks);

    // Here am finding the index of the book title in the array
    const index = availableBooks.indexOf(bookTitle);
    console.log(" Found index:", index);

    // Check if the book title is found (indexOf returns -1 if not found)
    if (index !== -1) {
        // Book is available: remove one element starting at the found index
        console.log(" Book found. Removing from list...");
        availableBooks.splice(index, 1);
        console.log(" Updated book list:", availableBooks);
        return `You have borrowed '${bookTitle}'.`;
    } else {
        // here i mean book is not available
        console.log(" Book not found. No changes made to list.");
        return `Sorry, '${bookTitle}' is not available.`;
    }
}

// Export the function for use in Node.js/CommonJS environments (like for testing)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { borrowBook };
}

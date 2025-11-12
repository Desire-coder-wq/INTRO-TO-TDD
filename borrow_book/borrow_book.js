/**
 * Allows a user to borrow a book from the library if it is available.
 *
 * If the book is available, it is removed from the availableBooks array.
 * Note: This function modifies the availableBooks array in place.
 *
 * @param {string} bookTitle - The title of the book to borrow.
 * @param {string[]} availableBooks - An array of book titles currently available.
 * @returns {string} A success or failure message based on availability.
 */
function borrowBook(bookTitle, availableBooks) {
    // Find the index of the book title in the array
    const index = availableBooks.indexOf(bookTitle);

    // Check if the book title is found (indexOf returns -1 if not found)
    if (index !== -1) {
        // Book is available: remove one element starting at the found index
        availableBooks.splice(index, 1);
        return `You have borrowed '${bookTitle}'.`;
    } else {
        // here i mean book is not available
        return `Sorry, '${bookTitle}' is not available.`;
    }
}

// Export the function for use in Node.js/CommonJS environments (like for testing)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { borrowBook };
}
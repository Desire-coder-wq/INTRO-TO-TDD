const { borrowBook } = require('./borrow_book');

// Helper function to create a fresh array for each test
const getInitialBooks = () => ["OliverTwist", "The return of mogofu", "Last night in the city"];

// We use 'describe' to group related tests
describe('borrowBook', () => {

    test('should return success message when borrowing an available book', () => {
        // Always work on a copy to ensure test isolation
        const books = getInitialBooks();
        const bookTitle = "The return of mogofu";
        const expectedMessage = "You have borrowed 'The return of mogofu'.";

        expect(borrowBook(bookTitle, books)).toBe(expectedMessage);
    });

    test('should remove the book from the list when successfully borrowed (list update check)', () => {
        const books = getInitialBooks();
        const bookTitle = "Last night in the city";

        borrowBook(bookTitle, books);

        // 1. Check the list size
        expect(books.length).toBe(2);
        // 2. Check the specific book is gone
        expect(books).not.toContain(bookTitle);
        // 3. Check other books remain
        expect(books).toContain("OliverTwist");
        expect(books).toContain("The return of mogofu");
    });

    test('should return failure message when trying to borrow an unavailable book', () => {
        const books = getInitialBooks();
        const bookTitle = "Uganda's Independence";
        const expectedMessage = "Sorry, 'Uganda's Independence' is not available.";

        expect(borrowBook(bookTitle, books)).toBe(expectedMessage);
    });

    test('should not change the list when the book is unavailable (list stability check)', () => {
        const books = getInitialBooks();
        const bookTitle = "Uganda's Independence";
        const originalLength = books.length;

        borrowBook(bookTitle, books);

        // Check list size is unchanged
        expect(books.length).toBe(originalLength);
        // Check contents are identical to the starting state
        expect(books).toEqual(getInitialBooks());
    });

    test('should fail gracefully when borrowing a book from an empty list', () => {
        const emptyList = [];
        const bookTitle = "Twist of Fate";
        const expectedMessage = "Sorry, 'Twist of Fate' is not available.";

        expect(borrowBook(bookTitle, emptyList)).toBe(expectedMessage);
        // Ensure the empty list remains empty
        expect(emptyList.length).toBe(0);
    });
});
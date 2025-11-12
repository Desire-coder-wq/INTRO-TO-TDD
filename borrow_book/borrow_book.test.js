const { borrowBook } = require('./borrow_book');

// Helper function to create a fresh array for each test
const getInitialBooks = () => ["Moby Dick", "1984", "Pride and Prejudice"];

// We use 'describe' to group related tests
describe('borrowBook', () => {

    test('should return success message when borrowing an available book', () => {
        // Always work on a copy to ensure test isolation
        const books = getInitialBooks();
        const bookTitle = "1984";
        const expectedMessage = "You have borrowed '1984'.";

        expect(borrowBook(bookTitle, books)).toBe(expectedMessage);
    });

    test('should remove the book from the list when successfully borrowed (list update check)', () => {
        const books = getInitialBooks();
        const bookTitle = "Pride and Prejudice";

        borrowBook(bookTitle, books);

        // 1. Check the list size
        expect(books.length).toBe(2);
        // 2. Check the specific book is gone
        expect(books).not.toContain(bookTitle);
        // 3. Check other books remain
        expect(books).toContain("Moby Dick");
        expect(books).toContain("1984");
    });

    test('should return failure message when trying to borrow an unavailable book', () => {
        const books = getInitialBooks();
        const bookTitle = "The Hobbit";
        const expectedMessage = "Sorry, 'The Hobbit' is not available.";

        expect(borrowBook(bookTitle, books)).toBe(expectedMessage);
    });

    test('should not change the list when the book is unavailable (list stability check)', () => {
        const books = getInitialBooks();
        const bookTitle = "The Hobbit";
        const originalLength = books.length;

        borrowBook(bookTitle, books);

        // Check list size is unchanged
        expect(books.length).toBe(originalLength);
        // Check contents are identical to the starting state
        expect(books).toEqual(getInitialBooks());
    });

    test('should fail gracefully when borrowing a book from an empty list', () => {
        const emptyList = [];
        const bookTitle = "Dune";
        const expectedMessage = "Sorry, 'Dune' is not available.";

        expect(borrowBook(bookTitle, emptyList)).toBe(expectedMessage);
        // Ensure the empty list remains empty
        expect(emptyList.length).toBe(0);
    });
});
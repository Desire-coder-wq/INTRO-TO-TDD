const { borrowBook } = require('./borrow_book');

test('returns success message when borrowing an available book', () => {
  const books = ["OliverTwist", "The return of mogofu", "Last night in the city"];
  const result = borrowBook("The return of mogofu", books);
  expect(result).toBe("You have borrowed 'The return of mogofu'.");
});

test('removes the borrowed book from the list', () => {
  const books = ["OliverTwist", "The return of mogofu", "Last night in the city"];
  borrowBook("Last night in the city", books);
  expect(books).toEqual(["OliverTwist", "The return of mogofu"]);
});

test('returns failure message when the book is not available', () => {
  const books = ["OliverTwist", "The return of mogofu", "Last night in the city"];
  const result = borrowBook("Uganda's Independence", books);
  expect(result).toBe("Sorry, 'Uganda's Independence' is not available.");
});

test('does not change the list when the book is unavailable', () => {
  const books = ["OliverTwist", "The return of mogofu", "Last night in the city"];
  borrowBook("Uganda's Independence", books);
  expect(books).toEqual(["OliverTwist", "The return of mogofu", "Last night in the city"]);
});

test('returns correct message when borrowing from an empty list', () => {
  const books = [];
  const result = borrowBook("Twist of Fate", books);
  expect(result).toBe("Sorry, 'Twist of Fate' is not available.");
  expect(books).toEqual([]);
});



test('returns error if book title is not a string', () => {
  const books = ["OliverTwist", "The return of mogofu", "Last night in the city"];
  const result = borrowBook(123, books);
  expect(result).toBe("Invalid input: book title must be a string.");
});

test('returns error if availableBooks is not an array', () => {
  const result = borrowBook("OliverTwist", "Not an array");
  expect(result).toBe("Invalid input: availableBooks must be an array.");
});

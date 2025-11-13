const utils = require("./utils");

describe("Jest Matchers Test Suite", () => {
  

  describe("1. toBe - Reference Equality", () => {
    test("PASS: sum(2, 2) returns exactly 4", () => {
      expect(utils.sum(2, 2)).toBe(4);
    });

    test("FAIL: sum(2, 2) equals 5", () => {
      expect(utils.sum(2, 2)).toBe(5);
    });
  });

  describe("2. toEqual - Deep Value Equality", () => {
    test("PASS: createUser returns correct object structure", () => {
      const user = utils.createUser("Alice", 30);
      expect(user).toEqual({
        name: "Alice",
        age: 30,
        createdAt: expect.any(Date),
      });
    });

    test("FAIL: createUser returns different object", () => {
      const user = utils.createUser("Alice", 30);
      expect(user).toEqual({
        name: "Bob",
        age: 25,
        createdAt: expect.any(Date),
      });
    });
  });


  describe("3. toStrictEqual - Strict Deep Equality", () => {
    test("PASS: objects with same properties are strictly equal", () => {
      const obj = { name: "Bob", age: 25 };
      expect(obj).toStrictEqual({ name: "Bob", age: 25 });
    });

    test("FAIL: toEqual passes but toStrictEqual fails with undefined property", () => {
      const obj1 = { name: "Alice", age: 30 };
      const obj2 = { name: "Alice", age: 30, email: undefined };
      expect(obj1).toStrictEqual(obj2);
    });
  });

  describe("4. .not - Negation Modifier", () => {
    test("PASS: sum(1, 1) is not equal to 3", () => {
      expect(utils.sum(1, 1)).not.toBe(3);
    });

    test("FAIL: sum(1, 1) is not equal to 2", () => {
      expect(utils.sum(1, 1)).not.toBe(2);
    });
  });


  describe("5. toBeNull - Null Checks", () => {
    test("PASS: null value is null", () => {
      expect(null).toBeNull();
    });

    test("FAIL: sum result is null", () => {
      expect(utils.sum(1, 2)).toBeNull();
    });
  });

  describe("6. toBeUndefined - Undefined Checks", () => {
    test("PASS: undefined is undefined", () => {
      expect(undefined).toBeUndefined();
    });

    test("FAIL: sum result is undefined", () => {
      expect(utils.sum(1, 2)).toBeUndefined();
    });
  });


  describe("7. toBeDefined - Defined Checks", () => {
    test("PASS: sum result is defined", () => {
      expect(utils.sum(1, 2)).toBeDefined();
    });

    test("FAIL: undefined is defined", () => {
      expect(undefined).toBeDefined();
    });
  });


  describe("8. toBeTruthy - Truthy Values", () => {
    test("PASS: findInArray returns truthy when value exists", () => {
      expect(utils.findInArray([1, 2, 3], 2)).toBeTruthy();
    });

    test("FAIL: findInArray returns truthy when value not found", () => {
      expect(utils.findInArray([1, 2, 3], 4)).toBeTruthy();
    });
  });

  describe("9. toBeFalsy - Falsy Values", () => {
    test("PASS: findInArray returns falsy when value not found", () => {
      expect(utils.findInArray([1, 2, 3], 4)).toBeFalsy();
    });

    test("FAIL: findInArray returns falsy when value exists", () => {
      expect(utils.findInArray([1, 2, 3], 2)).toBeFalsy();
    });
  });
});




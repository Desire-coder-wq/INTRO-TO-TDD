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

 
  describe("10. toBeGreaterThan - Greater Than", () => {
    test("PASS: sum(2, 3) is greater than 4", () => {
      expect(utils.sum(2, 3)).toBeGreaterThan(4);
    });

    test("FAIL: sum(2, 3) is greater than 5", () => {
      expect(utils.sum(2, 3)).toBeGreaterThan(5);
    });
  });


  describe("11. toBeGreaterThanOrEqual - Greater Than or Equal", () => {
    test("PASS: sum(2, 3) is greater than or equal to 5", () => {
      expect(utils.sum(2, 3)).toBeGreaterThanOrEqual(5);
    });

    test("FAIL: sum(2, 3) is greater than or equal to 6", () => {
      expect(utils.sum(2, 3)).toBeGreaterThanOrEqual(6);
    });
  });

  describe("12. toBeLessThan - Less Than", () => {
    test("PASS: sum(1, 1) is less than 3", () => {
      expect(utils.sum(1, 1)).toBeLessThan(3);
    });

    test("FAIL: sum(1, 1) is less than 1", () => {
      expect(utils.sum(1, 1)).toBeLessThan(1);
    });
  });


  describe("13. toBeLessThanOrEqual - Less Than or Equal", () => {
    test("PASS: approximateDivision(10, 2) is less than or equal to 5", () => {
      expect(utils.approximateDivision(10, 2)).toBeLessThanOrEqual(5);
    });

    test("FAIL: approximateDivision(10, 2) is less than or equal to 4", () => {
      expect(utils.approximateDivision(10, 2)).toBeLessThanOrEqual(4);
    });
  });

  describe("14. toBeCloseTo - Floating Point Precision", () => {
    test("PASS: approximateDivision(0.3, 0.1) is close to 3", () => {
      expect(utils.approximateDivision(0.3, 0.1)).toBeCloseTo(3);
    });

    test("FAIL: approximateDivision(0.3, 0.1) is close to 4", () => {
      expect(utils.approximateDivision(0.3, 0.1)).toBeCloseTo(4);
    });
  });


  describe("15. toMatch - Regex Pattern Matching", () => {
    test("PASS: user name matches uppercase start regex", () => {
      const user = utils.createUser("Alice", 30);
      expect(user.name).toMatch(/^[A-Z]/);
    });

    test("FAIL: user name matches lowercase start regex", () => {
      const user = utils.createUser("Alice", 30);
      expect(user.name).toMatch(/^[a-z]/);
    });
  });

  
  describe("16. .not.toMatch - Negated Regex Pattern", () => {
    test("PASS: string does not match goodbye pattern", () => {
      expect("hello world").not.toMatch(/^goodbye/);
    });

    test("FAIL: string does not match hello pattern", () => {
      expect("hello world").not.toMatch(/^hello/);
    });
  });

  
  describe("17. toContain - Array Values", () => {
    test("PASS: array contains value 2", () => {
      expect([1, 2, 3, 4, 5]).toContain(2);
    });

    test("FAIL: array contains value 99", () => {
      expect([1, 2, 3, 4, 5]).toContain(99);
    });
  });

  describe("18. toContain - Set Values", () => {
    test("PASS: Set contains value 3", () => {
      const numberSet = new Set([1, 2, 3, 4, 5]);
      expect(numberSet).toContain(3);
    });

    test("FAIL: Set contains value 10", () => {
      const numberSet = new Set([1, 2, 3, 4, 5]);
      expect(numberSet).toContain(10);
    });
  });


  describe("19. .not.toContain - Negated Array Values", () => {
    test("PASS: array does not contain 99", () => {
      expect([1, 2, 3, 4, 5]).not.toContain(99);
    });

    test("FAIL: array does not contain 2", () => {
      expect([1, 2, 3, 4, 5]).not.toContain(2);
    });
  });


  describe("20. toThrow - Exception Handling", () => {
    test("PASS: parseJSON throws with empty string", () => {
      expect(() => utils.parseJSON("")).toThrow("No JSON string provided");
    });

    test("FAIL: parseJSON does not throw with valid JSON", () => {
      expect(() => utils.parseJSON('{"name":"Alice"}')).toThrow();
    });
  });
});




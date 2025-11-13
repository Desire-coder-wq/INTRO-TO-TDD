const utils = require("./utils");

describe("Jest Matchers Test Suite", () => {
 
  describe("1. toBe - Reference Equality", () => {
    test(" PASS: sum(2, 2) returns exactly 4", () => {
      expect(utils.sum(2, 2)).toBe(4);
    });

    test("FAIL: sum(1, 1) does not equal 3", () => {
      expect(utils.sum(1, 1)).not.toBe(3);
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

    test("FAIL: different arrays not equal", () => {
      expect([1, 2, 3]).not.toEqual([1, 2, 4]);
    });
  });

  // 3. EXACT EQUALITY: toStrictEqual
  describe("3. toStrictEqual - Strict Deep Equality", () => {
    test(" PASS: objects with same properties are strictly equal", () => {
      const obj = { name: "Bob", age: 25 };
      expect(obj).toStrictEqual({ name: "Bob", age: 25 });
    });

    test("FAIL: toEqual passes but toStrictEqual fails with undefined", () => {
      const obj1 = { name: "Alice", age: 30 };
      const obj2 = { name: "Alice", age: 30, email: undefined };
      expect(obj1).toEqual(obj2);
      expect(obj1).not.toStrictEqual(obj2); 
    });
  });

  describe("4. .not - Negation Modifier", () => {
    test("PASS: sum(1, 1) is not 3 using .not.toBe", () => {
      expect(utils.sum(1, 1)).not.toBe(3);
    });

    test(" PASS: string does not match regex using .not.toMatch", () => {
      expect("hello world").not.toMatch(/^goodbye/);
    });

    test(" FAIL: array does not contain 99", () => {
      expect([1, 2, 3, 4, 5]).not.toContain(99);
    });
  });

  describe("5. toBeNull - Null Checks", () => {
    test("PASS: getNullValue() returns null", () => {
      expect(utils.getNullValue()).toBeNull();
    });

    test(" FAIL: sum result is not null", () => {
      expect(utils.sum(1, 2)).not.toBeNull();
    });
  });

 
  describe("6. toBeUndefined - Undefined Checks", () => {
    test(" PASS: getUndefined() returns undefined", () => {
      expect(utils.getUndefined()).toBeUndefined();
    });

    test(" FAIL: sum result is not undefined", () => {
      expect(utils.sum(1, 2)).not.toBeUndefined();
    });
  });


  describe("7. toBeDefined - Defined Checks", () => {
    test(" PASS: sum result is defined", () => {
      expect(utils.sum(1, 2)).toBeDefined();
    });

    test("FAIL: undefined is not defined", () => {
      expect(undefined).not.toBeDefined();
    });
  });


  describe("8. toBeTruthy - Truthy Values", () => {
    test(" PASS: findInArray returns truthy when value exists", () => {
      expect(utils.findInArray([1, 2, 3], 2)).toBeTruthy();
    });

    test(" FAIL: non-zero number is truthy", () => {
      expect(utils.sum(1, 1)).toBeTruthy();
    });
  });


  describe("9. toBeFalsy - Falsy Values", () => {
    test(" PASS: findInArray returns falsy when value not found", () => {
      expect(utils.findInArray([1, 2, 3], 4)).toBeFalsy();
    });

    test(" FAIL: zero is falsy", () => {
      expect(0).toBeFalsy();
    });
  });


  describe("10. toBeGreaterThan - Greater Than Comparison", () => {
    test("PASS: sum(2, 3) is greater than 4", () => {
      expect(utils.sum(2, 3)).toBeGreaterThan(4);
    });

    test("FAIL: sum(2, 3) is not greater than 5", () => {
      expect(utils.sum(2, 3)).not.toBeGreaterThan(5);
    });
  });


  describe("11. toBeGreaterThanOrEqual - Greater Than or Equal", () => {
    test(" PASS: sum(2, 3) >= 5", () => {
      expect(utils.sum(2, 3)).toBeGreaterThanOrEqual(5);
    });

    test("FAIL: approximateDivision(10, 2) is not >= 6", () => {
      expect(utils.approximateDivision(10, 2)).not.toBeGreaterThanOrEqual(6);
    });
  });


  describe("12. toBeLessThan - Less Than Comparison", () => {
    test(" PASS: sum(1, 1) is less than 3", () => {
      expect(utils.sum(1, 1)).toBeLessThan(3);
    });

    test("FAIL: sum(5, 5) is not less than 10", () => {
      expect(utils.sum(5, 5)).not.toBeLessThan(10);
    });
  });


  describe("13. toBeLessThanOrEqual - Less Than or Equal", () => {
    test(" PASS: approximateDivision(10, 2) <= 5", () => {
      expect(utils.approximateDivision(10, 2)).toBeLessThanOrEqual(5);
    });

    test("FAIL: sum(10, 10) is not <= 15", () => {
      expect(utils.sum(10, 10)).not.toBeLessThanOrEqual(15);
    });
  });


  describe("14. toBeCloseTo - Floating Point Precision", () => {
    test("✓ PASS: approximateDivision(0.3, 0.1) is close to 3", () => {
      expect(utils.approximateDivision(0.3, 0.1)).toBeCloseTo(3);
    });

    test(" FAIL: approximateDivision(10, 2) is not close to 6", () => {
      expect(utils.approximateDivision(10, 2)).not.toBeCloseTo(6);
    });
  });


  describe("15. toMatch - Regex Pattern Matching", () => {
    test("PASS: user name matches uppercase start regex", () => {
      const user = utils.createUser("Alice", 30);
      expect(user.name).toMatch(/^[A-Z]/);
    });

    test(" FAIL: string does not match wrong pattern", () => {
      expect("hello world").not.toMatch(/^goodbye/);
    });
  });


  describe("16. toContain - Array Values", () => {
    test("PASS: array contains value 2", () => {
      expect([1, 2, 3, 4, 5]).toContain(2);
    });

    test("FAIL: array does not contain 99", () => {
      expect([1, 2, 3, 4, 5]).not.toContain(99);
    });
  });


  describe("17. toContain - Set Values", () => {
    test(" PASS: Set contains value 3", () => {
      const numberSet = new Set([1, 2, 3, 4, 5]);
      expect(numberSet).toContain(3);
    });

    test(" FAIL: Set does not contain 10", () => {
      const numberSet = new Set([1, 2, 3, 4, 5]);
      expect(numberSet).not.toContain(10);
    });
  });


  describe("18. toContain - String Substrings", () => {
    test("✓ PASS: string contains substring", () => {
      expect("hello world").toContain("world");
    });

    test("✗ FAIL: string does not contain wrong substring", () => {
      expect("hello world").not.toContain("goodbye");
    });
  });

  describe("19. toThrow - Exception Handling", () => {
    test(" PASS: parseJSON throws with no argument", () => {
      expect(() => utils.parseJSON()).toThrow();
    });

    test(" PASS: parseJSON throws specific error message", () => {
      expect(() => utils.parseJSON("")).toThrow(
        "No JSON string provided"
      );
    });

    test(" FAIL: parseJSON does not throw with valid JSON", () => {
      expect(() => utils.parseJSON('{"name":"Alice"}')).not.toThrow();
    });

    test("FAIL: sum does not throw", () => {
      expect(() => utils.sum(1, 2)).not.toThrow();
    });
  });
});




const DiscountCalculator = require('../src/payment/DiscountCalculator');

describe('DiscountCalculator', () => {
  let discountCalculator;

  beforeEach(() => {
    discountCalculator = new DiscountCalculator();
  });

  describe('constructor', () => {
    it('should initialize with default discounts', () => {
      expect(discountCalculator.isValidDiscount('SUMMER20')).toBe(true);
      expect(discountCalculator.isValidDiscount('WELCOME10')).toBe(true);
    });

    it('should accept custom discounts', () => {
      const customDiscounts = {
        CUSTOM25: { type: 'percentage', value: 0.25 }
      };
      const customCalculator = new DiscountCalculator(customDiscounts);

      expect(customCalculator.isValidDiscount('CUSTOM25')).toBe(true);
      expect(customCalculator.isValidDiscount('SUMMER20')).toBe(true); // Should still have defaults
    });
  });

  describe('applyDiscount', () => {
    it('should return original amount when no discount code', () => {
      const result = discountCalculator.applyDiscount(100, null);
      expect(result).toBe(100);
    });

    it('should return original amount for unknown discount code', () => {
      const consoleSpy = jest.spyOn(console, 'log');
      const result = discountCalculator.applyDiscount(100, 'UNKNOWN');

      expect(result).toBe(100);
      expect(consoleSpy).toHaveBeenCalledWith('Unknown discount code: UNKNOWN');
    });

    it('should apply percentage discount correctly', () => {
      const result = discountCalculator.applyDiscount(100, 'SUMMER20');
      expect(result).toBe(80); // 100 * (1 - 0.2)
    });

    it('should apply fixed discount correctly', () => {
      const result = discountCalculator.applyDiscount(100, 'WELCOME10');
      expect(result).toBe(90); // 100 - 10
    });

    it('should not return negative amount for fixed discount', () => {
      const result = discountCalculator.applyDiscount(5, 'WELCOME10');
      expect(result).toBe(0); // Math.max(0, 5 - 10)
    });

    it('should handle custom percentage discount', () => {
      discountCalculator.addDiscount('HALF', 'percentage', 0.5);
      const result = discountCalculator.applyDiscount(100, 'HALF');
      expect(result).toBe(50);
    });

    it('should handle custom fixed discount', () => {
      discountCalculator.addDiscount('FIVE', 'fixed', 5);
      const result = discountCalculator.applyDiscount(100, 'FIVE');
      expect(result).toBe(95);
    });

    it('should handle unknown discount type gracefully', () => {
      discountCalculator.addDiscount('UNKNOWN_TYPE', 'invalid_type', 10);
      const consoleSpy = jest.spyOn(console, 'log');
      const result = discountCalculator.applyDiscount(100, 'UNKNOWN_TYPE');

      expect(result).toBe(100);
      expect(consoleSpy).toHaveBeenCalledWith('Unknown discount type: invalid_type');
    });
  });

  describe('isValidDiscount', () => {
    it('should return true for valid discount codes', () => {
      expect(discountCalculator.isValidDiscount('SUMMER20')).toBe(true);
      expect(discountCalculator.isValidDiscount('WELCOME10')).toBe(true);
    });

    it('should return false for invalid discount codes', () => {
      expect(discountCalculator.isValidDiscount('INVALID')).toBe(false);
    });
  });

  describe('getDiscountInfo', () => {
    it('should return discount info for valid code', () => {
      const info = discountCalculator.getDiscountInfo('SUMMER20');
      expect(info).toEqual({ type: 'percentage', value: 0.2 });
    });

    it('should return undefined for invalid code', () => {
      const info = discountCalculator.getDiscountInfo('INVALID');
      expect(info).toBeUndefined();
    });
  });

  describe('addDiscount', () => {
    it('should add new discount successfully', () => {
      discountCalculator.addDiscount('TEST25', 'percentage', 0.25);
      expect(discountCalculator.isValidDiscount('TEST25')).toBe(true);

      const result = discountCalculator.applyDiscount(100, 'TEST25');
      expect(result).toBe(75);
    });
  });
});
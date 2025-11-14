class DiscountCalculator {
  constructor(discounts = {}) {
    this.discounts = {
      SUMMER20: { type: 'percentage', value: 0.2 },
      WELCOME10: { type: 'fixed', value: 10 },
      ...discounts
    };
  }

  applyDiscount(amount, discountCode) {
    if (!discountCode) {
      return amount;
    }

    const discount = this.discounts[discountCode];
    
    if (!discount) {
      console.log(`Unknown discount code: ${discountCode}`);
      return amount;
    }

    let discountedAmount = amount;

    try {
      if (discount.type === 'percentage') {
        discountedAmount = amount * (1 - discount.value);
      } else if (discount.type === 'fixed') {
        discountedAmount = Math.max(0, amount - discount.value);
      } else {
        console.log(`Unknown discount type: ${discount.type}`);
        return amount;
      }

      console.log(`Applied discount ${discountCode}: ${amount} -> ${discountedAmount}`);
      return discountedAmount;
    } catch (error) {
      console.error(`Error applying discount ${discountCode}:`, error);
      return amount;
    }
  }

  isValidDiscount(code) {
    return !!this.discounts[code];
  }

  getDiscountInfo(code) {
    return this.discounts[code];
  }

  addDiscount(code, type, value) {
    this.discounts[code] = { type, value };
  }
}

module.exports = DiscountCalculator;
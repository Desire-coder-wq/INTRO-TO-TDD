class FraudDetectionService {
  constructor(thresholds = {}) {
    this.thresholds = {
      smallAmount: 100,
      largeAmount: 1000,
      verySmallAmount: 10,
      ...thresholds
    };
  }

  performFraudCheck(userId, amount, fraudCheckLevel) {
    if (fraudCheckLevel <= 0) {
      return; // No fraud check needed
    }

    const fraudCheckType = amount < this.thresholds.smallAmount ? 'light' : 'heavy';
    console.log(`Performing ${fraudCheckType} fraud check for user ${userId} on amount ${amount}`);

    if (fraudCheckType === 'light') {
      this.lightFraudCheck(userId, amount);
    } else {
      this.heavyFraudCheck(userId, amount);
    }
  }

  lightFraudCheck(userId, amount) {
    console.log(`Light fraud check for user ${userId} on amount ${amount}`);
    
    const riskLevel = amount < this.thresholds.verySmallAmount ? 'Very low risk' : 'Low risk';
    console.log(riskLevel);
  }

  heavyFraudCheck(userId, amount) {
    console.log(`Heavy fraud check for user ${userId} on amount ${amount}`);
    
    const riskLevel = amount < this.thresholds.largeAmount ? 'Medium risk' : 'High risk';
    console.log(riskLevel);
  }

  setThresholds(newThresholds) {
    this.thresholds = { ...this.thresholds, ...newThresholds };
  }
}

module.exports = FraudDetectionService;
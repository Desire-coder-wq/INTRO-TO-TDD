const PaymentValidator = require('./PaymentValidator');
const DiscountCalculator = require('./DiscountCalculator');
const FraudDetectionService = require('./FraudDetectionService');
const PaymentApiService = require('./PaymentApiService');

class PaymentProcessor {
  constructor(apiClient, options = {}) {
    this.apiService = new PaymentApiService(apiClient);
    this.discountCalculator = new DiscountCalculator(options.discounts);
    this.fraudDetectionService = new FraudDetectionService(options.fraudThresholds);
    
    this.currencyConversionRate = options.currencyConversionRate || 1.2;
    this.refundFeePercentage = options.refundFeePercentage || 0.05;
  }

  processPayment(paymentRequest) {
    
    PaymentValidator.validatePaymentRequest(paymentRequest);
    
    const {
      amount,
      currency,
      userId,
      paymentMethod,
      metadata,
      discountCode,
      fraudCheckLevel
    } = paymentRequest;

  
    this.fraudDetectionService.performFraudCheck(userId, amount, fraudCheckLevel);

    
    const finalAmount = this.calculateFinalAmount(amount, currency, discountCode);
    
  
    const transaction = this.createTransaction({
      userId,
      originalAmount: amount,
      finalAmount,
      currency,
      paymentMethod,
      metadata,
      discountCode,
      fraudCheckLevel
    });

    // Send to API
    this.apiService.sendPayment(paymentMethod, transaction);

    // Send notifications and analytics
    this.sendConfirmationEmail(userId, finalAmount, currency);
    this.logAnalytics({ userId, amount: finalAmount, currency, method: paymentMethod });

    return transaction;
  }

  calculateFinalAmount(amount, currency, discountCode) {
    let finalAmount = this.discountCalculator.applyDiscount(amount, discountCode);

    
    if (currency !== 'USD') {
      finalAmount = finalAmount * this.currencyConversionRate;
    }

    return finalAmount;
  }

  createTransaction(transactionData) {
    return {
      ...transactionData,
      timestamp: new Date().toISOString()
    };
  }

  refundPayment(refundRequest) {
    PaymentValidator.validateRefundRequest(refundRequest);
    
    const {
      transactionId,
      userId,
      reason,
      amount,
      currency,
      metadata
    } = refundRequest;

    const refundFee = amount * this.refundFeePercentage;
    const netAmount = amount - refundFee;

    const refund = {
      transactionId,
      userId,
      reason,
      amount,
      currency,
      metadata,
      netAmount,
      refundFee,
      date: new Date()
    };

    this.apiService.sendRefund(refund);
    console.log('Refund processed:', refund);
    
    return refund;
  }

  sendConfirmationEmail(userId, amount, currency) {
    console.log(
      `Sending email to user ${userId}: Your payment of ${amount} ${currency} was successful.`
    );
  }

  logAnalytics(data) {
    console.log('Analytics event:', data);
  }


  setCurrencyConversionRate(rate) {
    this.currencyConversionRate = rate;
  }

  setRefundFeePercentage(percentage) {
    this.refundFeePercentage = percentage;
  }
}

module.exports = PaymentProcessor;
const OriginalPaymentProcessor = require('../src/payment/PaymentProcessor');
const RefactoredPaymentProcessor = require('../src/payment/UpdatedPaymentProcessor');

describe('PaymentProcessor Comparison', () => {
  let originalProcessor;
  let refactoredProcessor;
  let mockApiClient;

  beforeEach(() => {
    mockApiClient = {
      post: jest.fn().mockResolvedValue({ success: true })
    };
    
    originalProcessor = new OriginalPaymentProcessor(mockApiClient);
    refactoredProcessor = new RefactoredPaymentProcessor(mockApiClient);
    
    console.log = jest.fn();
    console.error = jest.fn();
  });

  const testScenarios = [
    {
      name: 'credit card payment without discount',
      params: [100, 'USD', 'user123', 'credit_card', { cardNumber: '4111111111111111', expiry: '12/25' }, null, 1]
    },
    {
      name: 'credit card payment with SUMMER20 discount',
      params: [100, 'USD', 'user123', 'credit_card', { cardNumber: '4111111111111111', expiry: '12/25' }, 'SUMMER20', 1]
    },
    {
      name: 'credit card payment with WELCOME10 discount',
      params: [100, 'USD', 'user123', 'credit_card', { cardNumber: '4111111111111111', expiry: '12/25' }, 'WELCOME10', 1]
    },
    {
      name: 'EUR payment without discount',
      params: [100, 'EUR', 'user123', 'credit_card', { cardNumber: '4111111111111111', expiry: '12/25' }, null, 1]
    },
    {
      name: 'PayPal payment',
      params: [100, 'USD', 'user123', 'paypal', { paypalAccount: 'user@example.com' }, null, 1]
    }
  ];

  testScenarios.forEach(scenario => {
    it(`should produce same results for ${scenario.name}`, () => {
      // Test processPayment
      const originalResult = originalProcessor.processPayment(...scenario.params);
      
      const refactoredRequest = {
        amount: scenario.params[0],
        currency: scenario.params[1],
        userId: scenario.params[2],
        paymentMethod: scenario.params[3],
        metadata: scenario.params[4],
        discountCode: scenario.params[5],
        fraudCheckLevel: scenario.params[6]
      };
      const refactoredResult = refactoredProcessor.processPayment(refactoredRequest);

      // Compare key properties
      expect(refactoredResult.finalAmount).toBeCloseTo(originalResult.finalAmount);
      expect(refactoredResult.currency).toBe(originalResult.currency);
      expect(refactoredResult.paymentMethod).toBe(originalResult.paymentMethod);
      expect(refactoredResult.userId).toBe(originalResult.userId);
    });
  });

  it('should handle refunds with same calculation', () => {
    const refundParams = ['txn123', 'user123', 'defective', 100, 'USD', { note: 'test' }];
    
    const originalRefund = originalProcessor.refundPayment(...refundParams);
    
    const refactoredRefundRequest = {
      transactionId: refundParams[0],
      userId: refundParams[1],
      reason: refundParams[2],
      amount: refundParams[3],
      currency: refundParams[4],
      metadata: refundParams[5]
    };
    const refactoredRefund = refactoredProcessor.refundPayment(refactoredRefundRequest);

    expect(refactoredRefund.netAmount).toBeCloseTo(originalRefund.netAmount);
    expect(refactoredRefund.amount).toBe(originalRefund.amount);
  });
});
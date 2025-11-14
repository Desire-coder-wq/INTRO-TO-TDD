const RefactoredPaymentProcessor = require('../src/payment/UpdatedPaymentProcessor');

describe('Refactored PaymentProcessor', () => {
  let processor;
  let mockApiClient;

  beforeEach(() => {
    mockApiClient = {
      post: jest.fn().mockResolvedValue({ success: true })
    };
    
    processor = new RefactoredPaymentProcessor(mockApiClient);
    console.log = jest.fn();
    console.error = jest.fn();
  });

  describe('constructor', () => {
    it('should initialize with default configuration', () => {
      expect(processor.currencyConversionRate).toBe(1.2);
      expect(processor.refundFeePercentage).toBe(0.05);
    });

    it('should accept custom configuration', () => {
      const customProcessor = new RefactoredPaymentProcessor(mockApiClient, {
        currencyConversionRate: 1.5,
        refundFeePercentage: 0.1,
        discounts: {
          SPECIAL30: { type: 'percentage', value: 0.3 }
        },
        fraudThresholds: {
          smallAmount: 50
        }
      });

      expect(customProcessor.currencyConversionRate).toBe(1.5);
      expect(customProcessor.refundFeePercentage).toBe(0.1);
    });
  });

  describe('processPayment', () => {
    const validPaymentRequest = {
      amount: 100,
      currency: 'USD',
      userId: 'user123',
      paymentMethod: 'credit_card',
      metadata: { cardNumber: '4111111111111111', expiry: '12/25' },
      discountCode: null,
      fraudCheckLevel: 1
    };

    it('should process valid payment successfully', () => {
      const result = processor.processPayment(validPaymentRequest);

      expect(result.userId).toBe('user123');
      expect(result.originalAmount).toBe(100);
      expect(result.finalAmount).toBe(100);
      expect(result.paymentMethod).toBe('credit_card');
      expect(result.timestamp).toBeDefined();
    });

    it('should throw error for missing required fields', () => {
      const invalidRequest = { ...validPaymentRequest };
      delete invalidRequest.amount;

      expect(() => {
        processor.processPayment(invalidRequest);
      }).toThrow('Missing required fields: amount');
    });

    it('should throw error for invalid amount', () => {
      const invalidRequest = { ...validPaymentRequest, amount: -10 };

      expect(() => {
        processor.processPayment(invalidRequest);
      }).toThrow('Amount must be positive');
    });

    it('should apply currency conversion for non-USD', () => {
      const request = { ...validPaymentRequest, currency: 'EUR' };
      const result = processor.processPayment(request);

      expect(result.finalAmount).toBe(120); // 100 * 1.2
    });

    it('should apply discount before currency conversion', () => {
      const request = {
        ...validPaymentRequest,
        currency: 'EUR',
        discountCode: 'SUMMER20'
      };
      const result = processor.processPayment(request);

      // 100 * 0.8 (discount) * 1.2 (conversion) = 96
      expect(result.finalAmount).toBe(96);
    });

    it('should perform fraud check when level > 0', () => {
      processor.processPayment(validPaymentRequest);

      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('fraud check')
      );
    });

    it('should skip fraud check when level is 0', () => {
      const request = { ...validPaymentRequest, fraudCheckLevel: 0 };
      
      processor.processPayment(request);

      const fraudLogs = console.log.mock.calls.filter(call => 
        call[0].includes('fraud check')
      );
      expect(fraudLogs.length).toBe(0);
    });

    it('should send confirmation email', () => {
      processor.processPayment(validPaymentRequest);

      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('Sending email to user')
      );
    });

    it('should log analytics', () => {
      processor.processPayment(validPaymentRequest);

      expect(console.log).toHaveBeenCalledWith(
        'Analytics event:',
        expect.any(Object)
      );
    });
  });

  describe('refundPayment', () => {
    const validRefundRequest = {
      transactionId: 'txn_123',
      userId: 'user123',
      reason: 'defective product',
      amount: 100,
      currency: 'USD',
      metadata: { note: 'test' }
    };

    it('should process valid refund successfully', () => {
      const result = processor.refundPayment(validRefundRequest);

      expect(result.transactionId).toBe('txn_123');
      expect(result.amount).toBe(100);
      expect(result.netAmount).toBe(95); // 100 - (100 * 0.05)
      expect(result.refundFee).toBe(5);
      expect(result.date).toBeDefined();
    });

    it('should calculate refund fee correctly', () => {
      const result = processor.refundPayment(validRefundRequest);
      expect(result.netAmount).toBe(95);
    });

    it('should use custom refund fee percentage', () => {
      processor.setRefundFeePercentage(0.1);
      const result = processor.refundPayment(validRefundRequest);
      
      expect(result.netAmount).toBe(90); // 100 - (100 * 0.1)
    });

    it('should throw error for missing refund fields', () => {
      const invalidRequest = { ...validRefundRequest };
      delete invalidRequest.transactionId;

      expect(() => {
        processor.refundPayment(invalidRequest);
      }).toThrow('Missing required refund fields: transactionId');
    });
  });

  describe('calculateFinalAmount', () => {
    it('should calculate amount with discount only', () => {
      const result = processor.calculateFinalAmount(100, 'USD', 'SUMMER20');
      expect(result).toBe(80);
    });

    it('should calculate amount with currency conversion only', () => {
      const result = processor.calculateFinalAmount(100, 'EUR', null);
      expect(result).toBe(120);
    });

    it('should calculate amount with both discount and conversion', () => {
      const result = processor.calculateFinalAmount(100, 'EUR', 'WELCOME10');
      // (100 - 10) * 1.2 = 108
      expect(result).toBe(108);
    });
  });

  describe('configuration methods', () => {
    it('should update currency conversion rate', () => {
      processor.setCurrencyConversionRate(1.5);
      expect(processor.currencyConversionRate).toBe(1.5);
    });

    it('should update refund fee percentage', () => {
      processor.setRefundFeePercentage(0.08);
      expect(processor.refundFeePercentage).toBe(0.08);
    });
  });
});
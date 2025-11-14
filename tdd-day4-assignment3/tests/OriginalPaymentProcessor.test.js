const PaymentProcessor = require('../src/payment/PaymentProcessor');

describe('Original PaymentProcessor', () => {
  let processor;
  let mockApiClient;

  beforeEach(() => {
    mockApiClient = {
      post: jest.fn()
    };
    // FIX: Use PaymentProcessor (the imported name) not OriginalPaymentProcessor
    processor = new PaymentProcessor(mockApiClient);
    console.log = jest.fn();
    console.error = jest.fn();
  });

  describe('constructor', () => {
    it('should initialize with apiClient and default conversion rate', () => {
      expect(processor.apiClient).toBe(mockApiClient);
      expect(processor.currencyConversionRate).toBe(1.2);
    });
  });

  describe('processPayment', () => {
    it('should process credit card payment with valid metadata', () => {
      expect(() => {
        processor.processPayment(
          100,
          'USD',
          'user123',
          'credit_card',
          { cardNumber: '4111111111111111', expiry: '12/25' },
          null,
          1
        );
      }).not.toThrow();
    });

    it('should throw error for credit card with missing card number', () => {
      expect(() => {
        processor.processPayment(
          100,
          'USD',
          'user123',
          'credit_card',
          { expiry: '12/25' }, // missing cardNumber
          null,
          1
        );
      }).toThrow('Invalid card metadata');
    });

    it('should process PayPal payment with valid metadata', () => {
      expect(() => {
        processor.processPayment(
          100,
          'USD',
          'user123',
          'paypal',
          { paypalAccount: 'user@example.com' },
          null,
          1
        );
      }).not.toThrow();
    });

    it('should throw error for PayPal with missing account', () => {
      expect(() => {
        processor.processPayment(
          100,
          'USD',
          'user123',
          'paypal',
          {}, // missing paypalAccount
          null,
          1
        );
      }).toThrow('Invalid PayPal metadata');
    });

    it('should throw error for unsupported payment method', () => {
      expect(() => {
        processor.processPayment(
          100,
          'USD',
          'user123',
          'bitcoin',
          {},
          null,
          1
        );
      }).toThrow('Unsupported payment method');
    });

    it('should perform light fraud check for small amounts', () => {
      processor.processPayment(
        50, 
        'USD',
        'user123',
        'credit_card',
        { cardNumber: '4111111111111111', expiry: '12/25' },
        null,
        1
      );
      
      expect(console.log).toHaveBeenCalledWith(
        'Performing light fraud check for small payment'
      );
    });

    it('should perform heavy fraud check for large amounts', () => {
      processor.processPayment(
        200, 
        'USD',
        'user123',
        'credit_card',
        { cardNumber: '4111111111111111', expiry: '12/25' },
        null,
        1
      );
      
      expect(console.log).toHaveBeenCalledWith(
        'Performing heavy fraud check for large payment'
      );
    });

    it('should skip fraud check when level is 0', () => {
      processor.processPayment(
        100,
        'USD',
        'user123',
        'credit_card',
        { cardNumber: '4111111111111111', expiry: '12/25' },
        null,
        0
      );
      
      expect(console.log).not.toHaveBeenCalledWith(
        expect.stringContaining('fraud check')
      );
    });

    it('should apply SUMMER20 discount correctly', () => {
      const result = processor.processPayment(
        100,
        'USD',
        'user123',
        'credit_card',
        { cardNumber: '4111111111111111', expiry: '12/25' },
        'SUMMER20',
        1
      );
      
      expect(result.finalAmount).toBe(80); // 100 * 0.8
    });

    it('should apply WELCOME10 discount correctly', () => {
      const result = processor.processPayment(
        100,
        'USD',
        'user123',
        'credit_card',
        { cardNumber: '4111111111111111', expiry: '12/25' },
        'WELCOME10',
        1
      );
      
      expect(result.finalAmount).toBe(90); // 100 - 10
    });

    it('should ignore unknown discount codes', () => {
      const result = processor.processPayment(
        100,
        'USD',
        'user123',
        'credit_card',
        { cardNumber: '4111111111111111', expiry: '12/25' },
        'UNKNOWN',
        1
      );
      
      expect(result.finalAmount).toBe(100);
      expect(console.log).toHaveBeenCalledWith('Unknown discount code');
    });

    it('should convert EUR to USD using conversion rate', () => {
      const result = processor.processPayment(
        100,
        'EUR',
        'user123',
        'credit_card',
        { cardNumber: '4111111111111111', expiry: '12/25' },
        null,
        1
      );
      
      expect(result.finalAmount).toBe(120); // 100 * 1.2
    });

    it('should not convert USD amounts', () => {
      const result = processor.processPayment(
        100,
        'USD',
        'user123',
        'credit_card',
        { cardNumber: '4111111111111111', expiry: '12/25' },
        null,
        1
      );
      
      expect(result.finalAmount).toBe(100);
    });

    it('should send credit card payments to correct endpoint', () => {
      processor.processPayment(
        100,
        'USD',
        'user123',
        'credit_card',
        { cardNumber: '4111111111111111', expiry: '12/25' },
        null,
        1
      );
      
      expect(mockApiClient.post).toHaveBeenCalledWith(
        '/payments/credit',
        expect.any(Object)
      );
    });

    it('should send PayPal payments to correct endpoint', () => {
      processor.processPayment(
        100,
        'USD',
        'user123',
        'paypal',
        { paypalAccount: 'user@example.com' },
        null,
        1
      );
      
      expect(mockApiClient.post).toHaveBeenCalledWith(
        '/payments/paypal',
        expect.any(Object)
      );
    });

    it('should handle API errors gracefully', () => {
      mockApiClient.post.mockImplementation(() => {
        throw new Error('API Error');
      });

      expect(() => {
        processor.processPayment(
          100,
          'USD',
          'user123',
          'credit_card',
          { cardNumber: '4111111111111111', expiry: '12/25' },
          null,
          1
        );
      }).toThrow('API Error');
      
      expect(console.error).toHaveBeenCalledWith(
        'Failed to send payment:',
        expect.any(Error)
      );
    });

    it('should create complete transaction object', () => {
      const result = processor.processPayment(
        100,
        'USD',
        'user123',
        'credit_card',
        { cardNumber: '4111111111111111', expiry: '12/25' },
        'SUMMER20',
        1
      );

      expect(result.userId).toBe('user123');
      expect(result.originalAmount).toBe(100);
      expect(result.finalAmount).toBe(80);
      expect(result.currency).toBe('USD');
      expect(result.paymentMethod).toBe('credit_card');
      expect(result.discountCode).toBe('SUMMER20');
      expect(result.fraudChecked).toBe(1);
      expect(result.timestamp).toBeDefined();
    });

    it('should send confirmation email', () => {
      processor.processPayment(
        100,
        'USD',
        'user123',
        'credit_card',
        { cardNumber: '4111111111111111', expiry: '12/25' },
        null,
        1
      );
      
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('Sending email to user user123')
      );
    });

    it('should log analytics', () => {
      processor.processPayment(
        100,
        'USD',
        'user123',
        'credit_card',
        { cardNumber: '4111111111111111', expiry: '12/25' },
        null,
        1
      );
      
      expect(console.log).toHaveBeenCalledWith(
        'Analytics event:',
        expect.any(Object)
      );
    });
  });

  describe('refundPayment', () => {
    it('should process refund with correct fee calculation', () => {
      const result = processor.refundPayment(
        'txn123',
        'user123',
        'defective product',
        100,
        'USD',
        { note: 'test' }
      );

      expect(result.netAmount).toBe(95); // 100 - (100 * 0.05)
      expect(mockApiClient.post).toHaveBeenCalledWith(
        '/payments/refund',
        expect.any(Object)
      );
    });

    it('should include all refund details', () => {
      const result = processor.refundPayment(
        'txn123',
        'user123',
        'defective product',
        100,
        'USD',
        { note: 'test' }
      );

      expect(result.transactionId).toBe('txn123');
      expect(result.userId).toBe('user123');
      expect(result.reason).toBe('defective product');
      expect(result.amount).toBe(100);
      expect(result.currency).toBe('USD');
      expect(result.metadata).toEqual({ note: 'test' });
      expect(result.date).toBeDefined();
    });
  });

  describe('private methods', () => {
    it('should perform light fraud check correctly', () => {
      processor._lightFraudCheck('user123', 5);
      
      expect(console.log).toHaveBeenCalledWith('Very low risk');
    });

    it('should perform heavy fraud check correctly', () => {
      processor._heavyFraudCheck('user123', 1500);
      
      expect(console.log).toHaveBeenCalledWith('High risk');
    });

    it('should send confirmation email', () => {
      processor._sendConfirmationEmail('user123', 100, 'USD');
      
      expect(console.log).toHaveBeenCalledWith(
        'Sending email to user user123: Your payment of 100 USD was successful.'
      );
    });

    it('should log analytics', () => {
      const analyticsData = { userId: 'user123', amount: 100 };
      
      processor._logAnalytics(analyticsData);
      
      expect(console.log).toHaveBeenCalledWith('Analytics event:', analyticsData);
    });
  });
});
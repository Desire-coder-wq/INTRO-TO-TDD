const PaymentValidator = require('../src/payment/PaymentValidator');

describe('PaymentValidator', () => {
  describe('validatePaymentRequest', () => {
    const validPaymentRequest = {
      amount: 100,
      currency: 'USD',
      userId: 'user123',
      paymentMethod: 'credit_card',
      metadata: { cardNumber: '4111111111111111', expiry: '12/25' },
      fraudCheckLevel: 1
    };

    it('should validate correct payment request', () => {
      expect(() => {
        PaymentValidator.validatePaymentRequest(validPaymentRequest);
      }).not.toThrow();
    });

    it('should throw error for missing required fields', () => {
      const invalidRequest = { ...validPaymentRequest };
      delete invalidRequest.amount;

      expect(() => {
        PaymentValidator.validatePaymentRequest(invalidRequest);
      }).toThrow('Missing required fields: amount');
    });

    it('should throw error for multiple missing fields', () => {
      const invalidRequest = { ...validPaymentRequest };
      delete invalidRequest.amount;
      delete invalidRequest.userId;

      expect(() => {
        PaymentValidator.validatePaymentRequest(invalidRequest);
      }).toThrow('Missing required fields: amount, userId');
    });

    it('should throw error for empty string fields', () => {
      const invalidRequest = { 
        ...validPaymentRequest,
        userId: '',
        currency: ''
      };

      expect(() => {
        PaymentValidator.validatePaymentRequest(invalidRequest);
      }).toThrow('Missing required fields: userId, currency');
    });

    it('should throw error for null fields', () => {
      const invalidRequest = { 
        ...validPaymentRequest,
        amount: null
      };

      expect(() => {
        PaymentValidator.validatePaymentRequest(invalidRequest);
      }).toThrow('Missing required fields: amount');
    });

    it('should throw error for zero amount', () => {
      const invalidRequest = { ...validPaymentRequest, amount: 0 };

      expect(() => {
        PaymentValidator.validatePaymentRequest(invalidRequest);
      }).toThrow('Amount must be positive');
    });

    it('should throw error for negative amount', () => {
      const invalidRequest = { ...validPaymentRequest, amount: -50 };

      expect(() => {
        PaymentValidator.validatePaymentRequest(invalidRequest);
      }).toThrow('Amount must be positive');
    });
  });

  describe('validatePaymentMethod', () => {
    it('should validate credit card with proper metadata', () => {
      expect(() => {
        PaymentValidator.validatePaymentMethod('credit_card', {
          cardNumber: '4111111111111111',
          expiry: '12/25'
        });
      }).not.toThrow();
    });

    it('should throw error for credit card missing cardNumber', () => {
      expect(() => {
        PaymentValidator.validatePaymentMethod('credit_card', {
          expiry: '12/25'
        });
      }).toThrow('Invalid card metadata: cardNumber and expiry are required');
    });

    it('should throw error for credit card missing expiry', () => {
      expect(() => {
        PaymentValidator.validatePaymentMethod('credit_card', {
          cardNumber: '4111111111111111'
        });
      }).toThrow('Invalid card metadata: cardNumber and expiry are required');
    });

    it('should throw error for credit card with empty cardNumber', () => {
      expect(() => {
        PaymentValidator.validatePaymentMethod('credit_card', {
          cardNumber: '',
          expiry: '12/25'
        });
      }).toThrow('Invalid card metadata: cardNumber and expiry are required');
    });

    it('should validate PayPal with proper metadata', () => {
      expect(() => {
        PaymentValidator.validatePaymentMethod('paypal', {
          paypalAccount: 'user@example.com'
        });
      }).not.toThrow();
    });

    it('should throw error for PayPal missing account', () => {
      expect(() => {
        PaymentValidator.validatePaymentMethod('paypal', {});
      }).toThrow('Invalid PayPal metadata: paypalAccount is required');
    });

    it('should throw error for PayPal with empty account', () => {
      expect(() => {
        PaymentValidator.validatePaymentMethod('paypal', {
          paypalAccount: ''
        });
      }).toThrow('Invalid PayPal metadata: paypalAccount is required');
    });

    it('should throw error for unsupported payment method', () => {
      expect(() => {
        PaymentValidator.validatePaymentMethod('bitcoin', {});
      }).toThrow('Unsupported payment method: bitcoin');
    });
  });

  describe('validateRefundRequest', () => {
    const validRefundRequest = {
      transactionId: 'txn_123',
      userId: 'user123',
      reason: 'defective product',
      amount: 100,
      currency: 'USD'
    };

    it('should validate correct refund request', () => {
      expect(() => {
        PaymentValidator.validateRefundRequest(validRefundRequest);
      }).not.toThrow();
    });

    it('should throw error for missing transactionId', () => {
      const invalidRequest = { ...validRefundRequest };
      delete invalidRequest.transactionId;

      expect(() => {
        PaymentValidator.validateRefundRequest(invalidRequest);
      }).toThrow('Missing required refund fields: transactionId');
    });

    it('should throw error for empty string fields', () => {
      const invalidRequest = { 
        ...validRefundRequest,
        transactionId: '',
        reason: ''
      };

      expect(() => {
        PaymentValidator.validateRefundRequest(invalidRequest);
      }).toThrow('Missing required refund fields: transactionId, reason');
    });

    it('should throw error for null fields', () => {
      const invalidRequest = { 
        ...validRefundRequest,
        amount: null
      };

      expect(() => {
        PaymentValidator.validateRefundRequest(invalidRequest);
      }).toThrow('Missing required refund fields: amount');
    });

    it('should throw error for zero refund amount', () => {
      const invalidRequest = { ...validRefundRequest, amount: 0 };

      expect(() => {
        PaymentValidator.validateRefundRequest(invalidRequest);
      }).toThrow('Refund amount must be positive');
    });

    it('should throw error for negative refund amount', () => {
      const invalidRequest = { ...validRefundRequest, amount: -50 };

      expect(() => {
        PaymentValidator.validateRefundRequest(invalidRequest);
      }).toThrow('Refund amount must be positive');
    })

    
    it('should treat amount 0 as provided but invalid (not missing)', () => {
      const requestWithZeroAmount = { ...validRefundRequest, amount: 0 };
      
      expect(() => {
        PaymentValidator.validateRefundRequest(requestWithZeroAmount);
      }).toThrow('Refund amount must be positive'); // Should NOT say "missing amount"
    });
  });
});
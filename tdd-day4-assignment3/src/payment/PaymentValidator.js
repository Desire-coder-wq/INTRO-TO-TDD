class PaymentValidator {
  static validatePaymentRequest(request) {
    const required = ['amount', 'currency', 'userId', 'paymentMethod', 'metadata', 'fraudCheckLevel'];
    const missing = required.filter(field => 
      request[field] === undefined || request[field] === null || request[field] === ''
    );
    
    if (missing.length > 0) {
      throw new Error(`Missing required fields: ${missing.join(', ')}`);
    }

    if (request.amount <= 0) {
      throw new Error('Amount must be positive');
    }

    this.validatePaymentMethod(request.paymentMethod, request.metadata);
  }

  static validatePaymentMethod(paymentMethod, metadata) {
    const validators = {
      credit_card: () => {
        if (!metadata.cardNumber || !metadata.expiry) {
          throw new Error('Invalid card metadata: cardNumber and expiry are required');
        }
      },
      paypal: () => {
        if (!metadata.paypalAccount) {
          throw new Error('Invalid PayPal metadata: paypalAccount is required');
        }
      }
    };

    const validator = validators[paymentMethod];
    if (!validator) {
      throw new Error(`Unsupported payment method: ${paymentMethod}`);
    }

    validator();
  }

  static validateRefundRequest(request) {
    const required = ['transactionId', 'userId', 'reason', 'amount', 'currency'];
    const missing = required.filter(field => 
      request[field] === undefined || request[field] === null || request[field] === ''
    );
    
    if (missing.length > 0) {
      throw new Error(`Missing required refund fields: ${missing.join(', ')}`);
    }

    if (request.amount <= 0) {
      throw new Error('Refund amount must be positive');
    }
  }
}

module.exports = PaymentValidator;
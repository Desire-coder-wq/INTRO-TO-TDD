const PaymentApiService = require('../src/payment/PaymentApiService');

describe('PaymentApiService', () => {
  let apiService;
  let mockApiClient;

  beforeEach(() => {
    mockApiClient = {
      post: jest.fn().mockResolvedValue({ success: true })
    };
    apiService = new PaymentApiService(mockApiClient);
    console.log = jest.fn();
    console.error = jest.fn();
  });

  describe('constructor', () => {
    it('should initialize with default endpoints', () => {
      expect(apiService.endpoints.credit_card).toBe('/payments/credit');
      expect(apiService.endpoints.paypal).toBe('/payments/paypal');
      expect(apiService.endpoints.refund).toBe('/payments/refund');
    });

    it('should set api client', () => {
      expect(apiService.apiClient).toBe(mockApiClient);
    });
  });

  describe('sendPayment', () => {
    const transaction = {
      userId: 'user123',
      amount: 100,
      currency: 'USD'
    };

    it('should send credit card payment to correct endpoint', async () => {
      await apiService.sendPayment('credit_card', transaction);

      expect(mockApiClient.post).toHaveBeenCalledWith(
        '/payments/credit',
        transaction
      );
      expect(console.log).toHaveBeenCalledWith(
        'Payment sent to API:',
        transaction
      );
    });

    it('should send PayPal payment to correct endpoint', async () => {
      await apiService.sendPayment('paypal', transaction);

      expect(mockApiClient.post).toHaveBeenCalledWith(
        '/payments/paypal',
        transaction
      );
    });

    it('should throw error for unsupported payment method', async () => {
      await expect(
        apiService.sendPayment('bitcoin', transaction)
      ).rejects.toThrow('No API endpoint for payment method: bitcoin');
    });

    it('should handle API errors gracefully', async () => {
      const apiError = new Error('Network error');
      mockApiClient.post.mockRejectedValue(apiError);

      await expect(
        apiService.sendPayment('credit_card', transaction)
      ).rejects.toThrow('Network error');

      expect(console.error).toHaveBeenCalledWith(
        'Failed to send payment:',
        apiError
      );
    });
  });

  describe('sendRefund', () => {
    const refund = {
      transactionId: 'txn_123',
      amount: 100,
      currency: 'USD'
    };

    it('should send refund to correct endpoint', async () => {
      await apiService.sendRefund(refund);

      expect(mockApiClient.post).toHaveBeenCalledWith(
        '/payments/refund',
        refund
      );
      expect(console.log).toHaveBeenCalledWith(
        'Refund sent to API:',
        refund
      );
    });

    it('should handle refund API errors', async () => {
      const apiError = new Error('Refund failed');
      mockApiClient.post.mockRejectedValue(apiError);

      await expect(apiService.sendRefund(refund)).rejects.toThrow('Refund failed');
      expect(console.error).toHaveBeenCalledWith(
        'Failed to send refund:',
        apiError
      );
    });
  });

  describe('endpoint management', () => {
    it('should set custom endpoint', () => {
      apiService.setEndpoint('bitcoin', '/payments/bitcoin');
      expect(apiService.getEndpoint('bitcoin')).toBe('/payments/bitcoin');
    });

    it('should get existing endpoint', () => {
      expect(apiService.getEndpoint('credit_card')).toBe('/payments/credit');
    });

    it('should return undefined for unknown endpoint', () => {
      expect(apiService.getEndpoint('unknown')).toBeUndefined();
    });
  });
});
class PaymentApiService {
  constructor(apiClient) {
    this.apiClient = apiClient;
    this.endpoints = {
      credit_card: '/payments/credit',
      paypal: '/payments/paypal',
      refund: '/payments/refund'
    };
  }

  async sendPayment(paymentMethod, transaction) {
    const endpoint = this.endpoints[paymentMethod];
    
    if (!endpoint) {
      throw new Error(`No API endpoint for payment method: ${paymentMethod}`);
    }

    try {
      await this.apiClient.post(endpoint, transaction);
      console.log('Payment sent to API:', transaction);
      return true;
    } catch (error) {
      console.error('Failed to send payment:', error);
      throw error;
    }
  }

  async sendRefund(refund) {
    try {
      await this.apiClient.post(this.endpoints.refund, refund);
      console.log('Refund sent to API:', refund);
      return true;
    } catch (error) {
      console.error('Failed to send refund:', error);
      throw error;
    }
  }

  setEndpoint(paymentMethod, endpoint) {
    this.endpoints[paymentMethod] = endpoint;
  }

  getEndpoint(paymentMethod) {
    return this.endpoints[paymentMethod];
  }
}

module.exports = PaymentApiService;
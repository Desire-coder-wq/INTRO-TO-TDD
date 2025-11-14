const FraudDetectionService = require('../src/payment/FraudDetectionService');

describe('FraudDetectionService', () => {
  let fraudService;
  let consoleSpy;

  beforeEach(() => {
    fraudService = new FraudDetectionService();
    consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  describe('constructor', () => {
    it('should initialize with default thresholds', () => {
      expect(fraudService.thresholds.smallAmount).toBe(100);
      expect(fraudService.thresholds.largeAmount).toBe(1000);
      expect(fraudService.thresholds.verySmallAmount).toBe(10);
    });

    it('should accept custom thresholds', () => {
      const customService = new FraudDetectionService({
        smallAmount: 50,
        largeAmount: 500
      });

      expect(customService.thresholds.smallAmount).toBe(50);
      expect(customService.thresholds.largeAmount).toBe(500);
    });
  });

  describe('performFraudCheck', () => {
    it('should skip fraud check when level is 0', () => {
      fraudService.performFraudCheck('user123', 50, 0);

      expect(consoleSpy).not.toHaveBeenCalledWith(
        expect.stringContaining('fraud check')
      );
    });

    it('should perform light fraud check for small amounts', () => {
      fraudService.performFraudCheck('user123', 50, 1);

      expect(consoleSpy).toHaveBeenCalledWith(
        'Performing light fraud check for user user123 on amount 50'
      );
    });

    it('should perform heavy fraud check for large amounts', () => {
      fraudService.performFraudCheck('user123', 200, 1);

      expect(consoleSpy).toHaveBeenCalledWith(
        'Performing heavy fraud check for user user123 on amount 200'
      );
    });

    it('should use custom thresholds for fraud detection', () => {
      const customService = new FraudDetectionService({
        smallAmount: 50,
        largeAmount: 500
      });
      jest.spyOn(console, 'log').mockImplementation(() => {});

      customService.performFraudCheck('user123', 100, 1);

      expect(console.log).toHaveBeenCalledWith(
        'Performing heavy fraud check for user user123 on amount 100'
      );
    });
  });

  describe('lightFraudCheck', () => {
    it('should log very low risk for very small amounts', () => {
      fraudService.lightFraudCheck('user123', 5);

      expect(consoleSpy).toHaveBeenCalledWith('Very low risk');
    });

    it('should log low risk for small amounts above threshold', () => {
      fraudService.lightFraudCheck('user123', 50);

      expect(consoleSpy).toHaveBeenCalledWith('Low risk');
    });

    it('should use custom very small amount threshold', () => {
      const customService = new FraudDetectionService({ verySmallAmount: 5 });
      jest.spyOn(console, 'log').mockImplementation(() => {});

      customService.lightFraudCheck('user123', 10);

      expect(console.log).toHaveBeenCalledWith('Low risk');
    });
  });

  describe('heavyFraudCheck', () => {
    it('should log medium risk for amounts below large threshold', () => {
      fraudService.heavyFraudCheck('user123', 500);

      expect(consoleSpy).toHaveBeenCalledWith('Medium risk');
    });

    it('should log high risk for amounts above large threshold', () => {
      fraudService.heavyFraudCheck('user123', 1500);

      expect(consoleSpy).toHaveBeenCalledWith('High risk');
    });

    it('should use custom large amount threshold', () => {
      const customService = new FraudDetectionService({ largeAmount: 500 });
      jest.spyOn(console, 'log').mockImplementation(() => {});

      customService.heavyFraudCheck('user123', 600);

      expect(console.log).toHaveBeenCalledWith('High risk');
    });
  });

  describe('setThresholds', () => {
    it('should update thresholds correctly', () => {
      fraudService.setThresholds({
        smallAmount: 200,
        largeAmount: 2000
      });

      expect(fraudService.thresholds.smallAmount).toBe(200);
      expect(fraudService.thresholds.largeAmount).toBe(2000);
      expect(fraudService.thresholds.verySmallAmount).toBe(10); // Should preserve existing
    });
  });
});
const { StorageChargeCalculator } = require('../../domain/StorageChargeCalculator');

const MS_PER_DAY = 24 * 60 * 60 * 1000;

function daysAgo(n) {
  return new Date(Date.now() - n * MS_PER_DAY).toISOString();
}

describe('StorageChargeCalculator', () => {
  let calculator;

  beforeEach(() => {
    calculator = new StorageChargeCalculator();
  });

  describe('zero charge', () => {
    it('returns 0 for same-timestamp retrieval', () => {
      const now = new Date().toISOString();
      expect(calculator.calculate(now, now).charge).toBe(0);
    });

    it('returns 0 when retrieved before stored (invalid state)', () => {
      const future = new Date(Date.now() + MS_PER_DAY).toISOString();
      expect(calculator.calculate(future).charge).toBe(0);
    });
  });

  describe('Tier 1 — days 1 to 5 (1× base rate = 5 units/day)', () => {
    it('charges 5 units for exactly 1 day', () => {
      expect(calculator.calculate(daysAgo(1)).charge).toBe(5);
    });

    it('charges 25 units for exactly 5 days', () => {
      expect(calculator.calculate(daysAgo(5)).charge).toBe(25);
    });
  });

  describe('Tier 2 — days 6 to 10 (2× base rate = 10 units/day)', () => {
    it('charges 35 units for 6 days (25 + 10)', () => {
      expect(calculator.calculate(daysAgo(6)).charge).toBe(35);
    });

    it('charges 75 units for exactly 10 days (25 + 50)', () => {
      expect(calculator.calculate(daysAgo(10)).charge).toBe(75);
    });
  });

  describe('Tier 3 — days 11+ (3× base rate = 15 units/day)', () => {
    it('charges 90 units for 11 days (25 + 50 + 15)', () => {
      expect(calculator.calculate(daysAgo(11)).charge).toBe(90);
    });

    it('charges 120 units for 13 days (25 + 50 + 45)', () => {
      expect(calculator.calculate(daysAgo(13)).charge).toBe(120);
    });
  });

  describe('breakdown structure', () => {
    it('includes one tier entry for 3-day storage', () => {
      const result = calculator.calculate(daysAgo(3));
      expect(result.breakdown).toHaveLength(1);
      expect(result.breakdown[0].days).toBe(3);
      expect(result.breakdown[0].multiplier).toBe(1);
    });

    it('includes two tier entries for 8-day storage', () => {
      const result = calculator.calculate(daysAgo(8));
      expect(result.breakdown).toHaveLength(2);
      expect(result.breakdown[0].days).toBe(5);
      expect(result.breakdown[1].days).toBe(3);
    });

    it('includes three tier entries for 12-day storage', () => {
      const result = calculator.calculate(daysAgo(12));
      expect(result.breakdown).toHaveLength(3);
      expect(result.breakdown[2].multiplier).toBe(3);
    });

    it('exposes totalDays and baseRate', () => {
      const result = calculator.calculate(daysAgo(3));
      expect(result.totalDays).toBe(3);
      expect(result.baseRate).toBe(5);
      expect(result.currency).toBe('units');
    });
  });

  describe('custom tiers', () => {
    it('accepts custom tiers and base rate via constructor', () => {
      const custom = new StorageChargeCalculator(
        [{ upToDay: Infinity, multiplier: 1 }],
        10
      );
      expect(custom.calculate(daysAgo(3)).charge).toBe(30);
    });
  });
});

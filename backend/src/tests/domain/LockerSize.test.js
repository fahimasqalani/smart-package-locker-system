const { LockerSize } = require('../../domain/LockerSize');

describe('LockerSize', () => {
  describe('fromString', () => {
    it('returns correct instance for valid sizes', () => {
      expect(LockerSize.fromString('SMALL')).toBe(LockerSize.SMALL);
      expect(LockerSize.fromString('MEDIUM')).toBe(LockerSize.MEDIUM);
      expect(LockerSize.fromString('LARGE')).toBe(LockerSize.LARGE);
    });

    it('is case-insensitive', () => {
      expect(LockerSize.fromString('small')).toBe(LockerSize.SMALL);
      expect(LockerSize.fromString('Medium')).toBe(LockerSize.MEDIUM);
    });

    it('throws for invalid size', () => {
      try { LockerSize.fromString('XLARGE'); throw new Error('no throw'); } catch(e) { expect(e.message.includes('Invalid')).toBe(true); }
      try { LockerSize.fromString(null); throw new Error('no throw'); } catch(e) { expect(e.message.includes('Invalid')).toBe(true); }
      try { LockerSize.fromString(''); throw new Error('no throw'); } catch(e) { expect(e.message.includes('Invalid')).toBe(true); }
    });
  });

  describe('priority ordering', () => {
    it('SMALL has lower priority than MEDIUM', () => {
      expect(LockerSize.SMALL.priority).toBeLessThan(LockerSize.MEDIUM.priority);
    });

    it('MEDIUM has lower priority than LARGE', () => {
      expect(LockerSize.MEDIUM.priority).toBeLessThan(LockerSize.LARGE.priority);
    });
  });

  describe('canFit', () => {
    it('SMALL locker fits SMALL packages only', () => {
      expect(LockerSize.SMALL.canFit(LockerSize.SMALL)).toBe(true);
      expect(LockerSize.SMALL.canFit(LockerSize.MEDIUM)).toBe(false);
      expect(LockerSize.SMALL.canFit(LockerSize.LARGE)).toBe(false);
    });

    it('MEDIUM locker fits SMALL and MEDIUM packages', () => {
      expect(LockerSize.MEDIUM.canFit(LockerSize.SMALL)).toBe(true);
      expect(LockerSize.MEDIUM.canFit(LockerSize.MEDIUM)).toBe(true);
      expect(LockerSize.MEDIUM.canFit(LockerSize.LARGE)).toBe(false);
    });

    it('LARGE locker fits all package sizes', () => {
      expect(LockerSize.LARGE.canFit(LockerSize.SMALL)).toBe(true);
      expect(LockerSize.LARGE.canFit(LockerSize.MEDIUM)).toBe(true);
      expect(LockerSize.LARGE.canFit(LockerSize.LARGE)).toBe(true);
    });
  });

  describe('equals', () => {
    it('returns true for same size', () => {
      expect(LockerSize.SMALL.equals(LockerSize.SMALL)).toBe(true);
    });

    it('returns false for different sizes', () => {
      expect(LockerSize.SMALL.equals(LockerSize.LARGE)).toBe(false);
    });
  });

  describe('serialisation', () => {
    it('toJSON returns the string value', () => {
      expect(LockerSize.SMALL.toJSON()).toBe('SMALL');
    });

    it('toString returns the string value', () => {
      expect(LockerSize.MEDIUM.toString()).toBe('MEDIUM');
    });
  });
});

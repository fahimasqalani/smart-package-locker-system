const { Locker } = require('../../domain/Locker');
const { LockerSize } = require('../../domain/LockerSize');

function makeLocker(overrides = {}) {
  return new Locker({ id: 'locker-1', size: LockerSize.MEDIUM, ...overrides });
}

describe('Locker', () => {
  describe('initial state', () => {
    it('is available when created', () => {
      expect(makeLocker().isAvailable).toBe(true);
    });

    it('has no assigned package when created', () => {
      expect(makeLocker().assignedPackageId).toBeNull();
    });

    it('accepts LockerSize instance', () => {
      const locker = makeLocker({ size: LockerSize.LARGE });
      expect(locker.size).toBe(LockerSize.LARGE);
    });

    it('accepts string size and converts to LockerSize', () => {
      const locker = makeLocker({ size: 'SMALL' });
      expect(locker.size).toBe(LockerSize.SMALL);
    });
  });

  describe('canFit', () => {
    it('returns true when package fits', () => {
      const locker = makeLocker({ size: LockerSize.MEDIUM });
      expect(locker.canFit(LockerSize.SMALL)).toBe(true);
      expect(locker.canFit(LockerSize.MEDIUM)).toBe(true);
    });

    it('returns false when package is too large', () => {
      const locker = makeLocker({ size: LockerSize.SMALL });
      expect(locker.canFit(LockerSize.MEDIUM)).toBe(false);
      expect(locker.canFit(LockerSize.LARGE)).toBe(false);
    });
  });

  describe('assign', () => {
    it('assigns a package and marks locker as occupied', () => {
      const locker = makeLocker();
      locker.assign('pkg-1');
      expect(locker.isAvailable).toBe(false);
      expect(locker.assignedPackageId).toBe('pkg-1');
    });

    it('throws when assigning to an already occupied locker', () => {
      const locker = makeLocker();
      locker.assign('pkg-1');
      try { locker.assign('pkg-2'); throw new Error('no throw'); } catch(e) { expect(e.message.includes('occupied')).toBe(true); }
    });
  });

  describe('release', () => {
    it('releases the locker and makes it available', () => {
      const locker = makeLocker();
      locker.assign('pkg-1');
      locker.release();
      expect(locker.isAvailable).toBe(true);
      expect(locker.assignedPackageId).toBeNull();
    });

    it('throws when releasing an already empty locker', () => {
      const locker = makeLocker();
      try { locker.release(); throw new Error('no throw'); } catch(e) { expect(e.message.includes('empty')).toBe(true); }
    });
  });

  describe('toJSON', () => {
    it('serialises all fields correctly', () => {
      const locker = makeLocker({ id: 'l-1', size: LockerSize.LARGE });
      const json   = locker.toJSON();
      expect(json.id).toBe('l-1');
      expect(json.size).toBe('LARGE');
      expect(json.isAvailable).toBe(true);
      expect(json.assignedPackageId).toBeNull();
    });
  });
});

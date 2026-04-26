const { Package, PackageStatus } = require('../../domain/Package');
const { LockerSize } = require('../../domain/LockerSize');

function makePackage(overrides = {}) {
  return new Package({
    id:         'pkg-1',
    size:       LockerSize.SMALL,
    customerId: 'CUST-001',
    pickupCode: 'ABC123',
    lockerId:   'locker-1',
    ...overrides,
  });
}

describe('Package', () => {
  describe('initial state', () => {
    it('is stored when created', () => {
      expect(makePackage().isStored).toBe(true);
      expect(makePackage().status).toBe(PackageStatus.STORED);
    });

    it('has no retrievedAt when created', () => {
      expect(makePackage().retrievedAt).toBeNull();
    });
  });

  describe('matchesPickupCode', () => {
    it('returns true for correct code', () => {
      expect(makePackage().matchesPickupCode('ABC123')).toBe(true);
    });

    it('is case-insensitive', () => {
      expect(makePackage().matchesPickupCode('abc123')).toBe(true);
    });

    it('returns false for wrong code', () => {
      expect(makePackage().matchesPickupCode('WRONG1')).toBe(false);
    });

    it('returns false for null or undefined', () => {
      expect(makePackage().matchesPickupCode(null)).toBe(false);
      expect(makePackage().matchesPickupCode(undefined)).toBe(false);
    });
  });

  describe('markRetrieved', () => {
    it('sets status to RETRIEVED and records retrievedAt', () => {
      const pkg = makePackage();
      pkg.markRetrieved();
      expect(pkg.status).toBe(PackageStatus.RETRIEVED);
      expect(pkg.isStored).toBe(false);
      expect(pkg.retrievedAt).not.toBeNull();
    });

    it('throws if already retrieved', () => {
      const pkg = makePackage();
      pkg.markRetrieved();
      try { pkg.markRetrieved(); throw new Error('no throw'); } catch(e) { expect(e.message.includes('already')).toBe(true); }
    });
  });

  describe('toJSON', () => {
    it('serialises all fields', () => {
      const pkg  = makePackage();
      const json = pkg.toJSON();
      expect(json.id).toBe('pkg-1');
      expect(json.size).toBe('SMALL');
      expect(json.customerId).toBe('CUST-001');
      expect(json.pickupCode).toBe('ABC123');
      expect(json.status).toBe(PackageStatus.STORED);
    });
  });
});

const { PackageRetrievalService } = require('../../services/PackageRetrievalService');
const { Locker } = require('../../domain/Locker');
const { Package } = require('../../domain/Package');
const { LockerSize } = require('../../domain/LockerSize');
const { NotFoundError, InvalidPickupCodeError } = require('../../errors');
const { StorageChargeCalculator } = require('../../domain/StorageChargeCalculator');

function makeOccupiedLocker(packageId = 'pkg-1') {
  const locker = new Locker({ id: 'locker-1', size: LockerSize.MEDIUM });
  locker.assign(packageId);
  return locker;
}

function makeStoredPackage(overrides = {}) {
  return new Package({
    id: 'pkg-1', size: LockerSize.MEDIUM, customerId: 'CUST-001',
    pickupCode: 'ABC123', lockerId: 'locker-1', ...overrides,
  });
}

function makeLockerRepo(locker) {
  const saved = [];
  return {
    findById: async (id) => (locker && locker.id === id ? locker : null),
    save: async (l) => { saved.push(l); return l; },
    _saved: saved,
  };
}

function makePackageRepo(pkg) {
  const saved = [];
  return {
    findById: async (id) => (pkg && pkg.id === id ? pkg : null),
    save: async (p) => { saved.push(p); return p; },
    _saved: saved,
  };
}

describe('PackageRetrievalService', () => {
  const chargeCalculator = new StorageChargeCalculator();

  describe('retrieve — success', () => {
    it('returns result with storageCharge and retrievedAt', async () => {
      const locker  = makeOccupiedLocker();
      const pkg     = makeStoredPackage();
      const service = new PackageRetrievalService(makeLockerRepo(locker), makePackageRepo(pkg), chargeCalculator);
      const result  = await service.retrieve('locker-1', 'ABC123');
      expect(result.success).toBe(true);
      const hasRetrievedAt = typeof result.retrievedAt === 'string';
      expect(hasRetrievedAt).toBe(true);
      const hasCharge = typeof result.storageCharge === 'object';
      expect(hasCharge).toBe(true);
    });

    it('frees the locker after retrieval', async () => {
      const locker     = makeOccupiedLocker();
      const pkg        = makeStoredPackage();
      const lockerRepo = makeLockerRepo(locker);
      const service    = new PackageRetrievalService(lockerRepo, makePackageRepo(pkg), chargeCalculator);
      await service.retrieve('locker-1', 'ABC123');
      expect(locker.isAvailable).toBe(true);
      expect(lockerRepo._saved.includes(locker)).toBe(true);
    });

    it('marks the package as retrieved', async () => {
      const locker      = makeOccupiedLocker();
      const pkg         = makeStoredPackage();
      const packageRepo = makePackageRepo(pkg);
      const service     = new PackageRetrievalService(makeLockerRepo(locker), packageRepo, chargeCalculator);
      await service.retrieve('locker-1', 'ABC123');
      expect(pkg.isStored).toBe(false);
      expect(packageRepo._saved.includes(pkg)).toBe(true);
    });

    it('is case-insensitive for pickup code', async () => {
      const locker  = makeOccupiedLocker();
      const pkg     = makeStoredPackage({ pickupCode: 'ABC123' });
      const service = new PackageRetrievalService(makeLockerRepo(locker), makePackageRepo(pkg), chargeCalculator);
      const result  = await service.retrieve('locker-1', 'abc123');
      expect(result.success).toBe(true);
    });
  });

  describe('retrieve — error cases', () => {
    it('throws NotFoundError when locker does not exist', async () => {
      const service = new PackageRetrievalService(makeLockerRepo(null), makePackageRepo(null), chargeCalculator);
      try {
        await service.retrieve('bad-id', 'ABC123');
        throw new Error('should have thrown');
      } catch(e) {
        expect(e instanceof NotFoundError).toBe(true);
      }
    });

    it('throws NotFoundError when locker is empty', async () => {
      const emptyLocker = new Locker({ id: 'locker-1', size: LockerSize.MEDIUM });
      const service     = new PackageRetrievalService(makeLockerRepo(emptyLocker), makePackageRepo(null), chargeCalculator);
      try {
        await service.retrieve('locker-1', 'ABC123');
        throw new Error('should have thrown');
      } catch(e) {
        expect(e instanceof NotFoundError).toBe(true);
      }
    });

    it('throws InvalidPickupCodeError for wrong code', async () => {
      const locker  = makeOccupiedLocker();
      const pkg     = makeStoredPackage({ pickupCode: 'ABC123' });
      const service = new PackageRetrievalService(makeLockerRepo(locker), makePackageRepo(pkg), chargeCalculator);
      try {
        await service.retrieve('locker-1', 'WRONG1');
        throw new Error('should have thrown');
      } catch(e) {
        expect(e instanceof InvalidPickupCodeError).toBe(true);
      }
    });
  });
});

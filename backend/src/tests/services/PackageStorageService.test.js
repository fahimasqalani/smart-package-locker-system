const { PackageStorageService } = require('../../services/PackageStorageService');
const { Locker } = require('../../domain/Locker');
const { LockerSize } = require('../../domain/LockerSize');
const { NoLockerAvailableError, ValidationError } = require('../../errors');

function makeAvailableLocker(size = LockerSize.MEDIUM) {
  return new Locker({ id: 'locker-1', size });
}

function makeLockerRepo(lockers = []) {
  const saved = [];
  return {
    findAvailableForSize: async () => lockers,
    save: async (l) => { saved.push(l); return l; },
    _saved: saved,
  };
}

function makePackageRepo() {
  const saved = [];
  return {
    pickupCodeExists: async () => false,
    save: async (p) => { saved.push(p); return p; },
    withLock: (fn) => fn(),
    _saved: saved,
  };
}

function makeCodeGenerator(code = 'ABC123') {
  return { generate: () => code };
}

describe('PackageStorageService', () => {
  describe('store — success', () => {
    it('returns result with lockerId, pickupCode, and storedAt', async () => {
      const locker  = makeAvailableLocker();
      const service = new PackageStorageService(makeLockerRepo([locker]), makePackageRepo(), makeCodeGenerator('XYZ999'));
      const result  = await service.store('MEDIUM', 'CUST-001');
      expect(result.success).toBe(true);
      expect(result.lockerId).toBe('locker-1');
      expect(result.pickupCode).toBe('XYZ999');
      const hasStoedAt = typeof result.storedAt === 'string';
      expect(hasStoedAt).toBe(true);
    });

    it('assigns package to locker and saves it', async () => {
      const locker     = makeAvailableLocker();
      const lockerRepo = makeLockerRepo([locker]);
      const service    = new PackageStorageService(lockerRepo, makePackageRepo(), makeCodeGenerator());
      await service.store('MEDIUM', 'CUST-001');
      expect(locker.isAvailable).toBe(false);
      const lockerWasSaved = lockerRepo._saved.includes(locker);
      expect(lockerWasSaved).toBe(true);
    });

    it('persists the package to the package repository', async () => {
      const packageRepo = makePackageRepo();
      const service     = new PackageStorageService(makeLockerRepo([makeAvailableLocker()]), packageRepo, makeCodeGenerator());
      await service.store('SMALL', 'CUST-002');
      expect(packageRepo._saved.length).toBe(1);
    });

    it('trims whitespace from customerId', async () => {
      const service = new PackageStorageService(makeLockerRepo([makeAvailableLocker()]), makePackageRepo(), makeCodeGenerator());
      const result  = await service.store('SMALL', '  CUST-003  ');
      expect(result.success).toBe(true);
    });
  });

  describe('store — validation errors', () => {
    it('throws ValidationError for empty customerId', async () => {
      const service = new PackageStorageService(makeLockerRepo(), makePackageRepo(), makeCodeGenerator());
      try {
        await service.store('SMALL', '');
        throw new Error('should have thrown');
      } catch (e) {
        expect(e instanceof ValidationError).toBe(true);
      }
    });

    it('throws ValidationError for whitespace-only customerId', async () => {
      const service = new PackageStorageService(makeLockerRepo(), makePackageRepo(), makeCodeGenerator());
      try {
        await service.store('SMALL', '   ');
        throw new Error('should have thrown');
      } catch (e) {
        expect(e instanceof ValidationError).toBe(true);
      }
    });

    it('throws for invalid package size', async () => {
      const service = new PackageStorageService(makeLockerRepo(), makePackageRepo(), makeCodeGenerator());
      try {
        await service.store('GIGANTIC', 'CUST-001');
        throw new Error('should have thrown');
      } catch (e) {
        const hasInvalid = e.message.includes('Invalid');
        expect(hasInvalid).toBe(true);
      }
    });
  });

  describe('store — no locker available', () => {
    it('throws NoLockerAvailableError when no lockers fit', async () => {
      const service = new PackageStorageService(makeLockerRepo([]), makePackageRepo(), makeCodeGenerator());
      try {
        await service.store('LARGE', 'CUST-001');
        throw new Error('should have thrown');
      } catch (e) {
        expect(e instanceof NoLockerAvailableError).toBe(true);
      }
    });
  });
});

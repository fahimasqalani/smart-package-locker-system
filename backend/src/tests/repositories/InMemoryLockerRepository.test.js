const { InMemoryLockerRepository } = require('../../repositories/InMemoryLockerRepository');
const { Locker } = require('../../domain/Locker');
const { LockerSize } = require('../../domain/LockerSize');

function makeLocker(id, size = LockerSize.MEDIUM) {
  return new Locker({ id, size });
}

describe('InMemoryLockerRepository', () => {
  let repo;
  beforeEach(() => { repo = new InMemoryLockerRepository(); });

  describe('save and findById', () => {
    it('saves and retrieves a locker by id', async () => {
      const locker = makeLocker('l-1');
      await repo.save(locker);
      const found = await repo.findById('l-1');
      expect(found.id).toBe('l-1');
    });
    it('returns null for unknown id', async () => {
      const found = await repo.findById('unknown');
      expect(found).toBeNull();
    });
  });

  describe('findAll', () => {
    it('returns empty array when no lockers', async () => {
      const all = await repo.findAll();
      expect(all.length).toBe(0);
    });
    it('returns all saved lockers', async () => {
      await repo.save(makeLocker('l-1'));
      await repo.save(makeLocker('l-2'));
      const all = await repo.findAll();
      expect(all.length).toBe(2);
    });
  });

  describe('findAvailableForSize', () => {
    it('returns only lockers that fit the package', async () => {
      await repo.save(makeLocker('small-1', LockerSize.SMALL));
      await repo.save(makeLocker('medium-1', LockerSize.MEDIUM));
      await repo.save(makeLocker('large-1', LockerSize.LARGE));
      const results = await repo.findAvailableForSize(LockerSize.MEDIUM);
      const ids = results.map(l => l.id);
      expect(ids.includes('medium-1')).toBe(true);
      expect(ids.includes('large-1')).toBe(true);
      expect(ids.includes('small-1')).toBe(false);
    });
    it('excludes occupied lockers', async () => {
      const locker = makeLocker('medium-1', LockerSize.MEDIUM);
      locker.assign('some-pkg');
      await repo.save(locker);
      // add an available one too to check filtering
      const available = makeLocker('medium-2', LockerSize.MEDIUM);
      await repo.save(available);
      const results = await repo.findAvailableForSize(LockerSize.MEDIUM);
      expect(results.length).toBe(1);
      expect(results[0].id).toBe('medium-2');
    });
    it('returns lockers sorted smallest-first', async () => {
      await repo.save(makeLocker('large-1', LockerSize.LARGE));
      await repo.save(makeLocker('medium-1', LockerSize.MEDIUM));
      const results = await repo.findAvailableForSize(LockerSize.SMALL);
      expect(results[0].size.value).toBe('MEDIUM');
      expect(results[1].size.value).toBe('LARGE');
    });
    it('returns empty array when none available', async () => {
      const results = await repo.findAvailableForSize(LockerSize.LARGE);
      expect(results.length).toBe(0);
    });
  });
});

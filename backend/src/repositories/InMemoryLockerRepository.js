const { ILockerRepository } = require('./ILockerRepository');

/**
 * InMemoryLockerRepository
 * Stores lockers in a Map. Swap this for PostgresLockerRepository etc.
 * without touching any service code.
 */
class InMemoryLockerRepository extends ILockerRepository {
  #store = new Map();

  async save(locker) {
    this.#store.set(locker.id, locker);
    return locker;
  }

  async findById(id) {
    return this.#store.get(id) ?? null;
  }

  async findAll() {
    return [...this.#store.values()];
  }

  /**
   * Returns available lockers that can physically fit the given package size,
   * sorted smallest-first (implements the "prefer smallest locker" requirement).
   */
  async findAvailableForSize(packageSize) {
    return [...this.#store.values()]
      .filter(l => l.isAvailable && l.canFit(packageSize))
      .sort((a, b) => a.size.priority - b.size.priority);
  }
}

module.exports = { InMemoryLockerRepository };

const { IPackageRepository } = require('./IPackageRepository');

/**
 * InMemoryPackageRepository
 * Stores packages in a Map with a serialized async write lock
 * to handle Level 4 concurrent requests safely.
 */
class InMemoryPackageRepository extends IPackageRepository {
  #store   = new Map();
  #lock    = Promise.resolve();

  async save(pkg) {
    this.#store.set(pkg.id, pkg);
    return pkg;
  }

  async findById(id) {
    return this.#store.get(id) ?? null;
  }

  async findAll() {
    return [...this.#store.values()];
  }

  async pickupCodeExists(code) {
    return [...this.#store.values()].some(
      p => p.pickupCode === code && p.isStored
    );
  }

  /**
   * Serializes a critical section to prevent concurrent locker assignment conflicts.
   * Level 4: ensures two agents cannot get the same locker simultaneously.
   */
  withLock(fn) {
    const result    = this.#lock.then(() => fn());
    this.#lock      = result.catch(() => {});
    return result;
  }
}

module.exports = { InMemoryPackageRepository };

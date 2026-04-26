/**
 * ILockerRepository — defines the contract any locker storage adapter must fulfill.
 *
 * Concrete implementations (InMemoryLockerRepository, PostgresLockerRepository, etc.)
 * extend this class. Services depend on this abstraction, never on a concrete class
 * (Dependency Inversion Principle).
 */
class ILockerRepository {
  async save(locker) { throw new Error('Not implemented: save'); }

  async findById(id) { throw new Error('Not implemented: findById'); }

  async findAll() { throw new Error('Not implemented: findAll'); }

  async findAvailableForSize(lockerSize) { throw new Error('Not implemented: findAvailableForSize'); }
}

module.exports = { ILockerRepository };

const { Locker } = require('../domain/Locker');
const { LockerSize } = require('../domain/LockerSize');
const { NotFoundError, ValidationError } = require('../errors');
const { v4: uuidv4 } = require('uuid');

/**
 * LockerService
 * Single Responsibility: manage locker creation and retrieval.
 * Depends on ILockerRepository abstraction — not a concrete class (DIP).
 */
class LockerService {
  #lockerRepository;

  constructor(lockerRepository) {
    this.#lockerRepository = lockerRepository;
  }

  async createLocker(sizeValue) {
    const size   = LockerSize.fromString(sizeValue); // throws ValidationError-style if invalid
    const locker = new Locker({ id: uuidv4(), size });
    return this.#lockerRepository.save(locker);
  }

  async getAllLockers() {
    return this.#lockerRepository.findAll();
  }

  async getLockerById(id) {
    const locker = await this.#lockerRepository.findById(id);
    if (!locker) throw new NotFoundError(`Locker "${id}" not found.`);
    return locker;
  }
}

module.exports = { LockerService };

const { Package } = require('../domain/Package');
const { LockerSize } = require('../domain/LockerSize');
const { NoLockerAvailableError, ValidationError } = require('../errors');
const { v4: uuidv4 } = require('uuid');

/**
 * PackageStorageService
 * Single Responsibility: store a package in the best available locker.
 *
 * Depends on abstractions (ILockerRepository, IPackageRepository, PickupCodeGenerator)
 * injected via constructor — fully testable with mocks (DIP).
 */
class PackageStorageService {
  #lockerRepository;
  #packageRepository;
  #pickupCodeGenerator;

  constructor(lockerRepository, packageRepository, pickupCodeGenerator) {
    this.#lockerRepository    = lockerRepository;
    this.#packageRepository   = packageRepository;
    this.#pickupCodeGenerator = pickupCodeGenerator;
  }

  /**
   * Stores a package.
   * Level 4: entire operation runs inside a lock to prevent race conditions.
   */
  async store(packageSizeValue, customerId) {
    if (!customerId?.trim()) {
      throw new ValidationError('customerId is required.');
    }

    const packageSize = LockerSize.fromString(packageSizeValue);

    return this.#packageRepository.withLock(async () => {
      // 1. Find best locker (smallest-fit, repository handles the sort)
      const available = await this.#lockerRepository.findAvailableForSize(packageSize);
      if (available.length === 0) {
        throw new NoLockerAvailableError(packageSize.value);
      }
      const locker = available[0];

      // 2. Generate unique pickup code
      const pickupCode = this.#pickupCodeGenerator.generate(
        async (code) => !(await this.#packageRepository.pickupCodeExists(code))
      );

      // 3. Create package and assign to locker
      const pkg = new Package({
        id:         uuidv4(),
        size:       packageSize,
        customerId: customerId.trim(),
        pickupCode,
        lockerId:   locker.id,
      });

      locker.assign(pkg.id);

      // 4. Persist both
      await this.#lockerRepository.save(locker);
      await this.#packageRepository.save(pkg);

      return {
        success:     true,
        message:     'Package stored successfully.',
        packageId:   pkg.id,
        lockerId:    locker.id,
        lockerSize:  locker.size.value,
        pickupCode:  pkg.pickupCode,
        storedAt:    pkg.storedAt,
        note:        'Pickup code sent to customer via external notification (SMS/email).',
      };
    });
  }
}

module.exports = { PackageStorageService };

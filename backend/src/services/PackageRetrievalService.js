const { NotFoundError, InvalidPickupCodeError } = require('../errors');
const { StorageChargeCalculator } = require('../domain/StorageChargeCalculator');

/**
 * PackageRetrievalService
 * Single Responsibility: validate and process a package pickup.
 * Level 3: calculates storage charge at retrieval time.
 */
class PackageRetrievalService {
  #lockerRepository;
  #packageRepository;
  #chargeCalculator;

  constructor(lockerRepository, packageRepository, chargeCalculator = new StorageChargeCalculator()) {
    this.#lockerRepository  = lockerRepository;
    this.#packageRepository = packageRepository;
    this.#chargeCalculator  = chargeCalculator;
  }

  async retrieve(lockerId, pickupCode) {
    // 1. Validate locker exists and is occupied
    const locker = await this.#lockerRepository.findById(lockerId);
    if (!locker) throw new NotFoundError(`Locker "${lockerId}" not found.`);
    if (locker.isAvailable) throw new NotFoundError(`Locker "${lockerId}" is empty — no package to retrieve.`);

    // 2. Validate package and pickup code
    const pkg = await this.#packageRepository.findById(locker.assignedPackageId);
    if (!pkg || !pkg.isStored) throw new NotFoundError('No active package found in this locker.');
    if (!pkg.matchesPickupCode(pickupCode)) throw new InvalidPickupCodeError();

    // 3. Calculate charge before marking retrieved
    const retrievedAt   = new Date().toISOString();
    const storageCharge = this.#chargeCalculator.calculate(pkg.storedAt, retrievedAt);

    // 4. Update domain objects
    pkg.markRetrieved();
    locker.release();

    // 5. Persist
    await this.#packageRepository.save(pkg);
    await this.#lockerRepository.save(locker);

    return {
      success:       true,
      message:       'Package retrieved successfully. Locker is now available.',
      packageId:     pkg.id,
      lockerId:      locker.id,
      customerId:    pkg.customerId,
      storedAt:      pkg.storedAt,
      retrievedAt:   pkg.retrievedAt,
      storageCharge,
    };
  }
}

module.exports = { PackageRetrievalService };

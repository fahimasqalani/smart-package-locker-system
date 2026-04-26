const { LockerSize } = require('./LockerSize');

const PackageStatus = Object.freeze({
  STORED:    'STORED',
  RETRIEVED: 'RETRIEVED',
});

/**
 * Package — rich domain entity.
 * Tracks its own lifecycle from storage to retrieval.
 */
class Package {
  #id;
  #size;
  #customerId;
  #pickupCode;
  #lockerId;
  #storedAt;
  #retrievedAt;
  #status;

  constructor({ id, size, customerId, pickupCode, lockerId, storedAt = new Date().toISOString(), retrievedAt = null, status = PackageStatus.STORED }) {
    this.#id          = id;
    this.#size        = size instanceof LockerSize ? size : LockerSize.fromString(size);
    this.#customerId  = customerId;
    this.#pickupCode  = pickupCode;
    this.#lockerId    = lockerId;
    this.#storedAt    = storedAt;
    this.#retrievedAt = retrievedAt;
    this.#status      = status;
  }

  // ── Queries ────────────────────────────────────────────────────────

  get id()          { return this.#id; }
  get size()        { return this.#size; }
  get customerId()  { return this.#customerId; }
  get pickupCode()  { return this.#pickupCode; }
  get lockerId()    { return this.#lockerId; }
  get storedAt()    { return this.#storedAt; }
  get retrievedAt() { return this.#retrievedAt; }
  get status()      { return this.#status; }
  get isStored()    { return this.#status === PackageStatus.STORED; }

  /** Validates the provided code matches this package's pickup code */
  matchesPickupCode(code) {
    return this.#pickupCode === code?.toUpperCase();
  }

  // ── Commands ───────────────────────────────────────────────────────

  /** Marks the package as retrieved */
  markRetrieved() {
    if (!this.isStored) {
      throw new Error(`Package ${this.#id} has already been retrieved.`);
    }
    this.#retrievedAt = new Date().toISOString();
    this.#status      = PackageStatus.RETRIEVED;
  }

  // ── Serialisation ─────────────────────────────────────────────────

  toJSON() {
    return {
      id:          this.#id,
      size:        this.#size.toJSON(),
      customerId:  this.#customerId,
      pickupCode:  this.#pickupCode,
      lockerId:    this.#lockerId,
      storedAt:    this.#storedAt,
      retrievedAt: this.#retrievedAt,
      status:      this.#status,
    };
  }
}

module.exports = { Package, PackageStatus };

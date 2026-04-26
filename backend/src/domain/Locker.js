const { LockerSize } = require('./LockerSize');

/**
 * Locker — rich domain entity.
 * Owns its own state transitions and enforces its own invariants.
 */
class Locker {
  #id;
  #size;
  #assignedPackageId;
  #createdAt;

  constructor({ id, size, assignedPackageId = null, createdAt = new Date().toISOString() }) {
    this.#id               = id;
    this.#size             = size instanceof LockerSize ? size : LockerSize.fromString(size);
    this.#assignedPackageId = assignedPackageId;
    this.#createdAt        = createdAt;
  }

  // ── Queries ────────────────────────────────────────────────────────

  get id()          { return this.#id; }
  get size()        { return this.#size; }
  get isAvailable() { return this.#assignedPackageId === null; }
  get assignedPackageId() { return this.#assignedPackageId; }
  get createdAt()   { return this.#createdAt; }

  /** True if this locker can physically accept the given package size */
  canFit(packageSize) {
    return this.#size.canFit(packageSize);
  }

  // ── Commands (state transitions) ───────────────────────────────────

  /**
   * Assigns a package to this locker.
   * @throws if locker is already occupied
   */
  assign(packageId) {
    if (!this.isAvailable) {
      throw new Error(`Locker ${this.#id} is already occupied.`);
    }
    this.#assignedPackageId = packageId;
  }

  /**
   * Releases the locker, making it available again.
   * @throws if locker is already empty
   */
  release() {
    if (this.isAvailable) {
      throw new Error(`Locker ${this.#id} is already empty.`);
    }
    this.#assignedPackageId = null;
  }

  // ── Serialisation ─────────────────────────────────────────────────

  toJSON() {
    return {
      id:               this.#id,
      size:             this.#size.toJSON(),
      isAvailable:      this.isAvailable,
      assignedPackageId: this.#assignedPackageId,
      createdAt:        this.#createdAt,
    };
  }
}

module.exports = { Locker };

/**
 * LockerSize — immutable value object representing a locker or package size.
 * Encapsulates compatibility and ordering logic.
 */
class LockerSize {
  static SMALL  = new LockerSize('SMALL',  1);
  static MEDIUM = new LockerSize('MEDIUM', 2);
  static LARGE  = new LockerSize('LARGE',  3);

  static #registry = new Map([
    ['SMALL',  LockerSize.SMALL],
    ['MEDIUM', LockerSize.MEDIUM],
    ['LARGE',  LockerSize.LARGE],
  ]);

  // Compatibility: a package of size X fits in lockers of size >= X
  static #compatibility = new Map([
    ['SMALL',  ['SMALL', 'MEDIUM', 'LARGE']],
    ['MEDIUM', ['MEDIUM', 'LARGE']],
    ['LARGE',  ['LARGE']],
  ]);

  #value;
  #priority;

  constructor(value, priority) {
    this.#value    = value;
    this.#priority = priority;
    Object.freeze(this);
  }

  static fromString(value) {
    const size = LockerSize.#registry.get(value?.toUpperCase());
    if (!size) {
      throw new Error(
        `Invalid size "${value}". Valid values: ${[...LockerSize.#registry.keys()].join(', ')}`
      );
    }
    return size;
  }

  static values() {
    return [...LockerSize.#registry.values()];
  }

  /** Returns locker sizes that can physically hold a package of this size */
  compatibleLockerSizes() {
    return LockerSize.#compatibility
      .get(this.#value)
      .map(v => LockerSize.fromString(v));
  }

  /** True if this locker size can hold a package of the given size */
  canFit(packageSize) {
    return packageSize.compatibleLockerSizes()
      .some(s => s.equals(this));
  }

  /** Lower priority = smaller locker (used for smallest-fit sort) */
  get priority() { return this.#priority; }

  get value() { return this.#value; }

  equals(other) {
    return other instanceof LockerSize && this.#value === other.#value;
  }

  toString() { return this.#value; }
  toJSON()   { return this.#value; }
}

module.exports = { LockerSize };

/**
 * StorageChargeCalculator
 *
 * Calculates tiered storage fees using the Strategy pattern.
 * Tiers are injected so they can be changed without touching calculation logic
 * (Open/Closed Principle).
 *
 * Default tiers (per 24-hour day):
 *   Days  1–5:  1× base rate
 *   Days  6–10: 2× base rate
 *   Days 11+:   3× base rate
 */
class StorageChargeCalculator {
  static #MS_PER_DAY = 24 * 60 * 60 * 1000;

  static #DEFAULT_TIERS = [
    { upToDay: 5,        multiplier: 1 },
    { upToDay: 10,       multiplier: 2 },
    { upToDay: Infinity, multiplier: 3 },
  ];

  static #DEFAULT_BASE_RATE = 5; // units per day

  #tiers;
  #baseRate;

  constructor(tiers = StorageChargeCalculator.#DEFAULT_TIERS, baseRate = StorageChargeCalculator.#DEFAULT_BASE_RATE) {
    this.#tiers    = tiers;
    this.#baseRate = baseRate;
  }

  /**
   * Calculates the storage charge for a package.
   * @param {string} storedAt   - ISO timestamp when package was stored
   * @param {string} retrievedAt - ISO timestamp of retrieval (defaults to now)
   * @returns {{ totalDays, charge, breakdown, currency, baseRate }}
   */
  calculate(storedAt, retrievedAt = new Date().toISOString()) {
    const durationMs = new Date(retrievedAt) - new Date(storedAt);
    const totalDays  = Math.ceil(durationMs / StorageChargeCalculator.#MS_PER_DAY);

    if (totalDays <= 0) {
      return this.#zeroCharge();
    }

    const breakdown = this.#buildBreakdown(totalDays);
    const charge    = breakdown.reduce((sum, tier) => sum + tier.charge, 0);

    return {
      totalDays,
      charge,
      breakdown,
      currency: 'units',
      baseRate: this.#baseRate,
    };
  }

  #buildBreakdown(totalDays) {
    const breakdown = [];
    let daysCounted = 0;

    for (const tier of this.#tiers) {
      if (daysCounted >= totalDays) break;

      const tierEnd  = Math.min(tier.upToDay, totalDays);
      const tierDays = tierEnd - daysCounted;

      if (tierDays > 0) {
        breakdown.push({
          days:       tierDays,
          multiplier: tier.multiplier,
          charge:     tierDays * this.#baseRate * tier.multiplier,
        });
        daysCounted += tierDays;
      }
    }

    return breakdown;
  }

  #zeroCharge() {
    return { totalDays: 0, charge: 0, breakdown: [], currency: 'units', baseRate: this.#baseRate };
  }
}

module.exports = { StorageChargeCalculator };

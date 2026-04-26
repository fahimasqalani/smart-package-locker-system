/**
 * PickupCodeGenerator
 * Single responsibility: generate unique 6-char alphanumeric pickup codes.
 * Accepts an isUnique predicate so uniqueness checking stays outside this class.
 */
class PickupCodeGenerator {
  static #CHARSET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // omit ambiguous chars 0/O, 1/I
  static #CODE_LENGTH = 6;
  static #MAX_ATTEMPTS = 100;

  /**
   * Generates a unique pickup code.
   * @param {(code: string) => boolean} isUnique - returns true if code is not yet taken
   * @returns {string} a unique 6-character code
   */
  generate(isUnique) {
    for (let attempt = 0; attempt < PickupCodeGenerator.#MAX_ATTEMPTS; attempt++) {
      const code = this.#randomCode();
      if (isUnique(code)) return code;
    }
    throw new Error('Failed to generate a unique pickup code after maximum attempts.');
  }

  #randomCode() {
    return Array.from({ length: PickupCodeGenerator.#CODE_LENGTH }, () =>
      PickupCodeGenerator.#CHARSET[Math.floor(Math.random() * PickupCodeGenerator.#CHARSET.length)]
    ).join('');
  }
}

module.exports = { PickupCodeGenerator };

/**
 * PackageQueryService
 * Single Responsibility: read-only package queries (history, lookup).
 * Separated from mutation services to follow CQS (Command/Query Separation).
 */
class PackageQueryService {
  #packageRepository;

  constructor(packageRepository) {
    this.#packageRepository = packageRepository;
  }

  async getAllPackages() {
    return this.#packageRepository.findAll();
  }
}

module.exports = { PackageQueryService };

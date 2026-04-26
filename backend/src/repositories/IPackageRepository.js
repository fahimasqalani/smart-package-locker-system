/**
 * IPackageRepository — contract for package persistence.
 */
class IPackageRepository {
  async save(pkg) { throw new Error('Not implemented: save'); }

  async findById(id) { throw new Error('Not implemented: findById'); }

  async findAll() { throw new Error('Not implemented: findAll'); }

  async pickupCodeExists(code) { throw new Error('Not implemented: pickupCodeExists'); }
}

module.exports = { IPackageRepository };

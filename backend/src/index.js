const { createApp } = require('./app');
const { InMemoryLockerRepository }  = require('./repositories/InMemoryLockerRepository');
const { InMemoryPackageRepository } = require('./repositories/InMemoryPackageRepository');
const { LockerService }             = require('./services/LockerService');
const { PackageStorageService }     = require('./services/PackageStorageService');
const { PackageRetrievalService }   = require('./services/PackageRetrievalService');
const { PackageQueryService }       = require('./services/PackageQueryService');
const { StorageChargeCalculator }   = require('./domain/StorageChargeCalculator');
const { PickupCodeGenerator }       = require('./domain/PickupCodeGenerator');

const PORT = process.env.PORT || 3000;

// ── Composition Root: wire all dependencies here ──────────────────────────────
const lockerRepository  = new InMemoryLockerRepository();
const packageRepository = new InMemoryPackageRepository();
const chargeCalculator  = new StorageChargeCalculator();
const codeGenerator     = new PickupCodeGenerator();

const lockerService    = new LockerService(lockerRepository);
const storageService   = new PackageStorageService(lockerRepository, packageRepository, codeGenerator);
const retrievalService = new PackageRetrievalService(lockerRepository, packageRepository, chargeCalculator);
const queryService     = new PackageQueryService(packageRepository);

const app = createApp(lockerService, storageService, retrievalService, queryService);

// ── Seed ──────────────────────────────────────────────────────────────────────
async function seed() {
  const sizes = ['SMALL', 'SMALL', 'SMALL', 'MEDIUM', 'MEDIUM', 'LARGE', 'LARGE'];
  for (const size of sizes) await lockerService.createLocker(size);
  console.log(`✅ Seeded ${sizes.length} lockers (3 Small, 2 Medium, 2 Large)`);
}

// ── Start ─────────────────────────────────────────────────────────────────────
app.listen(PORT, async () => {
  console.log(`\n🚀 Smart Locker API → http://localhost:${PORT}`);
  await seed();
});

const express = require('express');

/**
 * Package routes — thin HTTP layer.
 */
function createPackageRouter(storageService, retrievalService, queryService) {
  const router = express.Router();

  router.get('/', async (_req, res, next) => {
    try {
      const packages = await queryService.getAllPackages();
      res.json({ success: true, data: packages, total: packages.length });
    } catch (err) { next(err); }
  });

  router.post('/store', async (req, res, next) => {
    try {
      const { packageSize, customerId } = req.body;
      if (!packageSize || !customerId) {
        return res.status(400).json({ success: false, error: 'packageSize and customerId are required.' });
      }
      const result = await storageService.store(packageSize, customerId);
      res.status(201).json(result);
    } catch (err) { next(err); }
  });

  router.post('/retrieve', async (req, res, next) => {
    try {
      const { lockerId, pickupCode } = req.body;
      if (!lockerId || !pickupCode) {
        return res.status(400).json({ success: false, error: 'lockerId and pickupCode are required.' });
      }
      const result = await retrievalService.retrieve(lockerId, pickupCode);
      res.json(result);
    } catch (err) { next(err); }
  });

  return router;
}

module.exports = { createPackageRouter };

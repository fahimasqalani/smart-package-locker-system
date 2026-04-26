const express = require('express');

/**
 * Locker routes — thin HTTP layer.
 * No business logic here; delegates entirely to LockerService.
 */
function createLockerRouter(lockerService) {
  const router = express.Router();

  router.get('/', async (_req, res, next) => {
    try {
      const lockers = await lockerService.getAllLockers();
      res.json({ success: true, data: lockers, total: lockers.length });
    } catch (err) { next(err); }
  });

  router.get('/:id', async (req, res, next) => {
    try {
      const locker = await lockerService.getLockerById(req.params.id);
      res.json({ success: true, data: locker });
    } catch (err) { next(err); }
  });

  router.post('/', async (req, res, next) => {
    try {
      const { size } = req.body;
      if (!size) return res.status(400).json({ success: false, error: 'size is required.' });
      const locker = await lockerService.createLocker(size);
      res.status(201).json({ success: true, data: locker });
    } catch (err) { next(err); }
  });

  return router;
}

module.exports = { createLockerRouter };

const express = require('express');
const cors    = require('cors');
const { AppError } = require('./errors');
const { createLockerRouter }  = require('./routes/lockers');
const { createPackageRouter } = require('./routes/packages');

/**
 * createApp — factory function that wires up Express with injected services.
 * Keeping app creation separate from server startup makes integration testing easy.
 */
function createApp(lockerService, storageService, retrievalService, queryService) {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.use((req, _res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
  });

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  app.use('/api/lockers',  createLockerRouter(lockerService));
  app.use('/api/packages', createPackageRouter(storageService, retrievalService, queryService));

  // 404
  app.use((_req, res) => {
    res.status(404).json({ success: false, error: 'Route not found.' });
  });

  // Global error handler — maps domain errors to HTTP responses
  app.use((err, _req, res, _next) => {
    if (err instanceof AppError) {
      return res.status(err.statusCode).json({ success: false, error: err.message });
    }
    console.error(err);
    res.status(500).json({ success: false, error: 'Internal server error.' });
  });

  return app;
}

module.exports = { createApp };

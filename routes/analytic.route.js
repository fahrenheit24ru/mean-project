const express = require('express');
const controller = require('../controllers/analytic.controller');
const router = express.Router();

// localhost:5000/api/overview
router.get('/overview', controller.overview);
// localhost:5000/api/analytic
router.get('/analytic', controller.analytic);

module.exports = router;
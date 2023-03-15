const express = require('express');
// const userRoutes = require('./user.route');
// const authRoutes = require('./auth.route');
const accountsRoutes = require('./accounts.route');
const userRoutes = require('./users.route');

const router = express.Router();
const { checkUserAccess } = require('../services/auth.service');

/**
 * GET v1/docs
 */
// router.use('/docs', express.static('docs'));
// router.use('/users', userRoutes);
router.use('/accounts', checkUserAccess, accountsRoutes);
router.use('/', userRoutes);

module.exports = router;

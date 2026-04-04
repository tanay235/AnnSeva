const express = require('express');
const { getProfile, updateProfile } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

const userRoutes = express.Router();

// Protected routes - require authentication
userRoutes.get('/profile', protect, getProfile);
userRoutes.put('/profile', protect, updateProfile);

module.exports = userRoutes;

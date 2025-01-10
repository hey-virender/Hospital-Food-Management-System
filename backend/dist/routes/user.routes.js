"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
// Login route
router.post('/signup', user_controller_1.signup);
router.post('/login', user_controller_1.login);
// Update user details route
router.put('/update', authMiddleware_1.authMiddleware, user_controller_1.updateUser);
// Get user details route
router.get('/me', authMiddleware_1.authMiddleware, user_controller_1.getUserDetails);
router.get('/logout', user_controller_1.logout);
exports.default = router;

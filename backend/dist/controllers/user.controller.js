"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.getUserDetails = exports.updateUser = exports.login = exports.signup = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const token_utils_1 = require("../utils/token.utils");
const hash_utils_1 = require("../utils/hash.utils");
// Sign up a new user
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, email, password, role } = req.body;
        // Check if the user already exists
        const existingUser = yield user_model_1.default.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const hashedPassword = yield (0, hash_utils_1.hashPassword)(password);
        // Create a new user
        const newUser = new user_model_1.default({ username, email,
            password: hashedPassword, role });
        yield newUser.save();
        // Create a token with the user data (excluding password)
        const token = (0, token_utils_1.generateToken)(newUser._id.toString(), newUser.role);
        // Send the token in a cookie
        res.cookie('auth_token', token, { httpOnly: true, secure: true, sameSite: 'strict' });
        // Send user details excluding the password
        const _a = newUser.toObject(), { password: _ } = _a, userDetails = __rest(_a, ["password"]); // Exclude password
        return res.status(201).json(userDetails);
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
exports.signup = signup;
// Login a user
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        // Find the user by email
        const user = yield user_model_1.default.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        // Compare the provided password with the stored hashed password
        const isMatch = yield (0, hash_utils_1.comparePassword)(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        // Create a token with the user data (excluding password)
        const token = (0, token_utils_1.generateToken)(user._id.toString(), user.role);
        // Send the token in a cookie
        res.cookie('auth_token', token, { httpOnly: true, secure: true, sameSite: 'strict' });
        // Send user details excluding the password
        const _a = user.toObject(), { password: _ } = _a, userDetails = __rest(_a, ["password"]); // Exclude password
        return res.status(200).json(userDetails);
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
exports.login = login;
// Update user details (excluding password)
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user._id; // Assuming you are extracting this from the JWT token
        const updates = req.body;
        // Only allow 'password', 'username', and 'contact' to be updated
        const allowedUpdates = ['password', 'username', 'contact'];
        const invalidUpdates = Object.keys(updates).filter((update) => !allowedUpdates.includes(update));
        // Reject if any invalid field is being updated
        if (invalidUpdates.length > 0) {
            return res.status(400).json({ message: `You can only update the following fields: ${allowedUpdates.join(', ')}` });
        }
        // If user tries to update password
        if (updates.password) {
            // Check if password is provided (additional validation can be added here if needed)
            if (updates.password.length < 6) {
                return res.status(400).json({ message: 'Password must be at least 6 characters long' });
            }
        }
        const updatedUser = yield user_model_1.default.findByIdAndUpdate(userId, updates, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Send updated user details (excluding password)
        const _a = updatedUser.toObject(), { password: _ } = _a, userDetails = __rest(_a, ["password"]);
        return res.status(200).json(userDetails);
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
exports.updateUser = updateUser;
// Get user details (assuming the user is authenticated)
const getUserDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a._id; // Assuming you are extracting this from the JWT token
        const user = yield user_model_1.default.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Send user details excluding password
        const _b = user.toObject(), { password: _ } = _b, userDetails = __rest(_b, ["password"]);
        return res.status(200).json(userDetails);
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
exports.getUserDetails = getUserDetails;
// Logout a user
const logout = (_, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Clear the auth token cookie
        res.clearCookie('auth_token', { httpOnly: true, secure: true, sameSite: 'strict' });
        return res.status(200).json({ message: 'Logged out successfully' });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
exports.logout = logout;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRATION = '1h'; // Token expiration time
// Function to generate a JWT token
const generateToken = (id, role) => {
    return jsonwebtoken_1.default.sign({ id, role }, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
};
exports.generateToken = generateToken;
// Function to verify a JWT token
const verifyToken = (token) => {
    try {
        return jsonwebtoken_1.default.verify(token, JWT_SECRET);
    }
    catch (error) {
        throw new Error('Invalid token');
    }
};
exports.verifyToken = verifyToken;

import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const JWT_EXPIRATION = '1h'; // Token expiration time

// Function to generate a JWT token
export const generateToken = (id: string, role: string): string => {
  return jwt.sign(
    { id, role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRATION }
  );
};

// Function to verify a JWT token
export const verifyToken = (token: string): any => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid token');
  }
};

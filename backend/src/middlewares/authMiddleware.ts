import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/token.utils';



export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  try {
    // Extract token from headers or cookies
    const token = req.cookies.auth_token || req.headers.authorization?.split(' ')[1];
    if (!token) {
      res.status(401).json({ message: 'Authentication token is missing' });
      return; // Ensure function ends execution
    }

    // Verify token
    const decoded = verifyToken(token)

    // Attach user details to req
    req.user = {
      _id: decoded.id,
      role: decoded.role,
    };

    next(); // Continue to the next middleware or route handler
  } catch (error) {
    
    res.status(403).json({ message: 'Invalid or expired token' });
  }
};

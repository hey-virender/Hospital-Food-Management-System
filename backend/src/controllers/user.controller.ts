import { Request, Response } from 'express';
import UserModel from '../models/user.model';
import { User } from '../models/user.model';
import { generateToken } from '../utils/token.utils';
import { hashPassword,comparePassword } from '../utils/hash.utils';
// Sign up a new user
export const signup = async (req: Request, res: Response): Promise<any> => {
  try {
    const { username,email, password, role } = req.body;

    // Check if the user already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });

    }

    const hashedPassword = await hashPassword(password)

    // Create a new user
    const newUser = new UserModel({ username,email, 
    password : hashedPassword, role });
    await newUser.save();

    // Create a token with the user data (excluding password)
    const token = generateToken(newUser._id.toString(), newUser.role);

    // Send the token in a cookie
    res.cookie('auth_token', token, { httpOnly: true, secure: true, sameSite: 'strict' });

    // Send user details excluding the password
    const { password: _, ...userDetails } = newUser.toObject(); // Exclude password
    return res.status(201).json(userDetails);
  } catch (error) {
    return res.status(500).json({ message: (error as Error).message });
  }
};
// Login a user
export const login = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user : User | null = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Create a token with the user data (excluding password)
    const token = generateToken(user._id.toString(), user.role);

    // Send the token in a cookie
    res.cookie('auth_token', token, { httpOnly: true, secure: true, sameSite: 'strict' });

    // Send user details excluding the password
    const { password: _, ...userDetails } = user.toObject(); // Exclude password
    return res.status(200).json(userDetails);
  } catch (error) {
    return res.status(500).json({ message: (error as Error).message });
  }
};

// Update user details (excluding password)
export const updateUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const userId = (req as any).user._id; // Assuming you are extracting this from the JWT token
    const updates = req.body;

    // Only allow 'password', 'username', and 'contact' to be updated
    const allowedUpdates: string[] = ['password', 'username', 'contact'];
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

    const updatedUser = await UserModel.findByIdAndUpdate(userId, updates, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Send updated user details (excluding password)
    const { password: _, ...userDetails } = updatedUser.toObject();
    return res.status(200).json(userDetails);
  } catch (error) {
    return res.status(500).json({ message: (error as Error).message });
  }
};

// Get user details (assuming the user is authenticated)
export const getUserDetails = async (req: Request, res: Response): Promise<any> => {
  try {
 
    const userId = req?.user?._id; // Assuming you are extracting this from the JWT token

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Send user details excluding password
    const { password: _, ...userDetails } = user.toObject();
    return res.status(200).json(userDetails);
  } catch (error) {
    return res.status(500).json({ message: (error as Error).message });
  }
};

// Logout a user
export const logout = async (_: Request, res: Response): Promise<any> => {
  try {
    // Clear the auth token cookie
    res.clearCookie('auth_token', { httpOnly: true, secure: true, sameSite: 'strict' });
    return res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    return res.status(500).json({ message: (error as Error).message });
  }
};

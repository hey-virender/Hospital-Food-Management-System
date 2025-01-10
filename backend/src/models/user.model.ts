import mongoose, { Document, Schema, Types } from 'mongoose';

export interface User extends Document {
  _id: Types.ObjectId;
  username: string;
  password: string;
  email:string;
  role: 'Admin' | 'PantryStaff' | 'DeliveryPersonnel'; // Different roles for different permissions
  staffName?: string; // Only needed for PantryStaff and DeliveryPersonnel
  contact:string,
}

const UserSchema: Schema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    email:{type: String,required:true,unique:true},
    password: { type: String, required: true },
    role: { type: String, enum: ['Admin', 'PantryStaff', 'DeliveryPersonnel'], required: true },
    contactInfo: { type: String },
    
  },
  { timestamps: true }
);

const UserModel = mongoose.model<User>('User', UserSchema);
export default UserModel;

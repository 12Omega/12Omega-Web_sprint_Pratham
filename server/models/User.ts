import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  username: string;
  email: string; // Added email
  password: string;
  createdAt?: Date; // Added for timestamps
  updatedAt?: Date; // Added for timestamps
}

const UserSchema: Schema<IUser> = new Schema({
  username: { type: String, required: true, unique: true }, // Added unique: true
  email:    { type: String, required: true, unique: true }, // Added email field
  password: { type: String, required: true },
}, { timestamps: true }); // Added timestamps option

export const User = mongoose.model<IUser>('User', UserSchema);

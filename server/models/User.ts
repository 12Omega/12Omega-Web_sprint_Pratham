import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcrypt";

// Define user document properties
export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: "admin" | "user" | "moderator";
  status: "active" | "inactive" | "suspended";
  avatar: string;
  phone?: string;
  lastLogin?: Date;
  comparePassword(candidatePassword: string): Promise<boolean>; // Add this
}

const userSchema = new Schema<IUser>(
  {
    firstName: String,
    lastName: String,
    email: { type: String, required: true, unique: true },
    password: String,
    role: { type: String, enum: ["admin", "user", "moderator"] },
    status: { type: String, enum: ["active", "inactive", "suspended"] },
    avatar: String,
    phone: String,
    lastLogin: Date,
  },
  { timestamps: true }
);

userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

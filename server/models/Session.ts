import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ISession extends Document {
  userId: Types.ObjectId;
  active: boolean;
  createdAt: Date;
  // other session fields should be added here if any
}

const SessionSchema: Schema<ISession> = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // Added ref: 'User' and required: true
  active: { type: Boolean, default: true }, // Added default: true
  createdAt: { type: Date, default: Date.now },
  // other session fields
});

export const Session = mongoose.model<ISession>('Session', SessionSchema);

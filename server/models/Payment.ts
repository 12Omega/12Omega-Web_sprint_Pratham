import mongoose, { Document, Schema } from 'mongoose';

export interface IPayment extends Document {
  user: mongoose.Types.ObjectId;
  booking: mongoose.Types.ObjectId;
  amount: number;
  method: 'khalti' | 'credit_card' | 'debit_card' | 'paypal' | 'cash';
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  transactionId: string;
  paymentDetails?: any;
  createdAt: Date;
  updatedAt: Date;
}

const paymentSchema = new Schema<IPayment>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  },
  booking: {
    type: Schema.Types.ObjectId,
    ref: 'Booking',
    required: [true, 'Booking is required']
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0, 'Amount cannot be negative']
  },
  method: {
    type: String,
    enum: ['khalti', 'credit_card', 'debit_card', 'paypal', 'cash'],
    required: [true, 'Payment method is required']
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending',
    required: true
  },
  transactionId: {
    type: String,
    required: [true, 'Transaction ID is required']
  },
  paymentDetails: {
    type: Schema.Types.Mixed
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      delete ret.__v;
      return ret;
    }
  }
});

// Indexes for performance
paymentSchema.index({ user: 1 });
paymentSchema.index({ booking: 1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ createdAt: -1 });
paymentSchema.index({ transactionId: 1 });

// Compound indexes for common queries
paymentSchema.index({ user: 1, status: 1 });
paymentSchema.index({ booking: 1, status: 1 });

export default mongoose.models.Payment || mongoose.model<IPayment>('Payment', paymentSchema);
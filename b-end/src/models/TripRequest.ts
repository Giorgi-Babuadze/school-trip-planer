import mongoose, { Document, Schema } from 'mongoose';

export interface ITripRequest extends Document {
  userId: mongoose.Types.ObjectId;
  destination: string;
  date: Date;
  duration: number;
  participants: number;
  budget: 'budget' | 'medium' | 'premium';
  notes: string;
  status: 'pending' | 'approved' | 'rejected';
  estimatedCost?: number;
  createdAt: Date;
  updatedAt: Date;
}

const tripRequestSchema = new Schema<ITripRequest>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    destination: {
      type: String,
      required: true,
      enum: ['mtsveti', 'sighnaghi', 'kvareli', 'batumi', 'sarah-jvari'],
    },
    date: {
      type: Date,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
      min: 1,
      max: 30,
    },
    participants: {
      type: Number,
      required: true,
      min: 1,
      max: 500,
    },
    budget: {
      type: String,
      enum: ['budget', 'medium', 'premium'],
      default: 'medium',
    },
    notes: {
      type: String,
      maxlength: 500,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    estimatedCost: {
      type: Number,
    },
  },
  { timestamps: true }
);

export default mongoose.model<ITripRequest>('TripRequest', tripRequestSchema);

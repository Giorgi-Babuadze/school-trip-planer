import mongoose, { Schema, Document } from 'mongoose';

export interface ITour extends Document {
  title: string;
  description: string;
  destination: string;
  price: number;
  duration: number; // in days
  maxParticipants: number;
  currentParticipants: number;
  startDate: Date;
  endDate: Date;
  image: string;
  itinerary: string[];
  includes: string[];
  createdAt: Date;
  updatedAt: Date;
}

const TourSchema = new Schema<ITour>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    destination: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    maxParticipants: {
      type: Number,
      required: true,
    },
    currentParticipants: {
      type: Number,
      default: 0,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    image: {
      type: String,
      default: '',
    },
    itinerary: [String],
    includes: [String],
  },
  { timestamps: true }
);

export default mongoose.model<ITour>('Tour', TourSchema);

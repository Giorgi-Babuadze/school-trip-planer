import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ITrainingData extends Document {
  category: string;
  title: string;
  content: string;
  createdBy?: mongoose.Types.ObjectId;
  createdAt: Date;
}

const TrainingDataSchema = new Schema({
  category:  { type: String, required: true, default: 'general' },
  title:     { type: String, required: true },
  content:   { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
});

const TrainingData =
  (mongoose.models.TrainingData as Model<ITrainingData>) ||
  mongoose.model<ITrainingData>('TrainingData', TrainingDataSchema);

export default TrainingData;

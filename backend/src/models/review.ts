import mongoose, { Schema, Document } from 'mongoose';

export interface IReview extends Document {
  author: mongoose.Types.ObjectId;
  target: mongoose.Types.ObjectId;
  text: string;
  created_at: Date;
  likes: number;
}

const reviewSchema: Schema = new Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  target: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true, maxlength: 5000 },
  created_at: { type: Date, default: Date.now },
  likes: { type: Number, default: 0 }
});

const Review = mongoose.model<IReview>('Review', reviewSchema);
export default Review;

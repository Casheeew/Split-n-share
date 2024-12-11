import mongoose, { Schema, Document } from "mongoose";
import validator from 'validator';

export interface IProduct extends Document {
  title: string;
  desc?: string;
  joint_purchase_information?: string;
  image: string[];
  quantity: number;
  end: Date;
  cobuyers: mongoose.Types.ObjectId[];
  cobuyers_queue: mongoose.Types.ObjectId[];
  creator: mongoose.Types.ObjectId;
  price: number;
  price_old: number;
  category?: string;
  created_at: Date;
  pickup_location?: string;
}

const productSchema: Schema = new Schema({
  title: { type: String, required: true, maxlength: 255 },
  desc: { type: String, default: '' },
  joint_purchase_information: { type: String, default: '' },
  image: {
    type: [String],
    default: [],
    // validate: {
    //   validator: function (v: string) {
    //     return /^https?:\/\/.+\.(jpg|jpeg|png|gif)$/.test(v);
    //   },
    //   message: 'Invalid URL format for product image.',
    // },
  },
  quantity: { type: Number, default: 1, min: 1 },
  end: { type: Date, required: true },
  cobuyers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
  cobuyers_queue: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  price: { type: Number, required: true, min: 0 },
  price_old: { type: Number, reqired: true, min: 0 },
  category: { type: String, default: '', index: true },
  created_at: { type: Date, default: Date.now },
  pick_up_location: { type: String, default: '' },
});

const Product = mongoose.model<IProduct>('Product', productSchema);
export default Product;

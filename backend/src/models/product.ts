import mongoose, { Schema, Document } from "mongoose";
import validator from 'validator';

export interface IProduct extends Document {
  title: string;
  desc?: string;
  joint_purchase_information: string;
  image: string[];
  end: Date;
  cobuyers: mongoose.Types.ObjectId[];
  creator: mongoose.Types.ObjectId;
  price: number;
  category?: string;
  created_at: Date;
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
  end: { type: Date, required: true },
  cobuyers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  price: { type: Number, required: true, min: 0 },
  category: { type: String, default: '', index: true },
  created_at: { type: Date, default: Date.now },
});

const Product = mongoose.model<IProduct>('Product', productSchema);
export default Product;

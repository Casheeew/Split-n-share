import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  desc?: string;
  dorm?: string;
  department?: string;
  profile_picture?: string;
  given_reviews: mongoose.Types.ObjectId[];
  received_reviews: mongoose.Types.ObjectId[];
  join_date: Date;
}

const userSchema: Schema = new Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /.+\@kaist\.ac\.kr$/,
  },
  password: { type: String, required: true },
  desc: { type: String, default: '' },
  dorm: { type: String, default: '' },
  department: { type: String, default: '' },
  phone: { type: String, default: '' },
  profile_picture: {
    type: String,
    default: 'https://www.gravatar.com/avatar/3b3be63a4c2a439b013787725dfce802?d=identicon',
    // validate: {
    //   validator: function (v: string) {
    //     return /^https?:\/\/.+\.(jpg|jpeg|png|gif)$/.test(v);
    //   },
    //   message: 'Invalid URL format for profile picture.',
    // },
  },
  given_reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
  received_reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
  join_date: { type: Date, default: Date.now },
});

// Mongoose -> Document Middleware
userSchema.pre("save", async function(next) {
  // check the password if it is modified
  if (!this.isModified("password")) {
    return next();
  }

  next();
});

// // This is Instance Method that is gonna be available on all documents in a certain collection
// userSchema.methods.correctPassword = async function(
//   typedPassword,
//   originalPassword,
// ) {
//   return await bcrypt.compare(typedPassword, originalPassword);
// };

userSchema.methods.correctPassword = async (typedPassword: string, originalPassword: string) => (
  typedPassword === originalPassword
)

const User = mongoose.model<IUser>('User', userSchema);
export default User;
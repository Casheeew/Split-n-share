import mongoose from "mongoose";
import validator from 'validator';

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, "Please fill your name"],
  },
  email: {
    type: String,
    required: [true, "Please fill your email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, " Please provide a valid email"],
  },
  password: {
    type: String,
    required: [true, "Please fill your password"],
    minLength: 6,
    select: false,
  },
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

const User = mongoose.model("User", userSchema);
export default User;
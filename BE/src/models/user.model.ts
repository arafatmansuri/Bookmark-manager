import mongoose, { Schema } from "mongoose";

interface IUser {
  userId: Date;
  username: string;
  password: string;
  refreshToken?: string;
}

const UserSchema = new Schema<IUser>({
  userId: {
    type: Date,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  refreshToken: {
    type: String,
  },
});

UserSchema.pre("save", (next) => {
  if (!this.isModified("password")) {
    next();
  }
});

const UserModel = mongoose.model<IUser>("User", UserSchema);

export default UserModel;

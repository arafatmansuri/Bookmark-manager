import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose, { Schema } from "mongoose";
interface IUser {
  userId: Date;
  username: string;
  password: string;
  email: string;
  refreshToken?: string;
}
interface IUserDocument extends IUser {
  comparePassword: (inputPassword: string) => boolean;
  generateAccessAndRereshToken: () => {
    accessToken: string;
    refreshToken: string;
  };
}
const UserSchema: Schema<IUserDocument> = new Schema<IUserDocument>({
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
  email: { type: String, required: [true, "email is required"] },
  refreshToken: {
    type: String,
  },
});

UserSchema.pre("save", async function (next): Promise<void> {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

UserSchema.methods.comparePassword = function (inputPassword: string): boolean {
  return bcrypt.compareSync(inputPassword, this.password);
};
UserSchema.methods.generateAccessAndRereshToken = function (): {
  accessToken: string;
  refreshToken: string;
} {
  const accessToken: string = jwt.sign(
    { username: this.username, _id: this._id },
    <string>process.env.JWT_SECRET,
    {
      expiresIn: "15m",
    }
  );
  const refreshToken: string = jwt.sign(
    { username: this.username, _id: this._id },
    <string>process.env.JWT_REFSECRET,
    {
      expiresIn: "1d",
    }
  );
  return { accessToken, refreshToken };
};
const UserModel = mongoose.model<IUserDocument>("User", UserSchema);

export default UserModel;

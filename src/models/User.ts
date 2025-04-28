import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

type User = {
  name: string;
  phone: string;
  email: string;
  password: string;
  role: "user" | "admin";
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
  createdAt: Date;
};
type UserMethods = {
  getSignedJwtToken(): string;
  matchPassword(enteredPassword: string): Promise<boolean>;
};
type UserModel = mongoose.Model<User, {}, UserMethods>;

const UserSchema = new mongoose.Schema<User, UserModel, UserMethods>(
  {
    name: { type: String, required: [true, "Please add a name"], minlength: 4, maxlength: 50 },
    phone: { type: String, required: [true, "Please add phone number"], minlength: 10, maxlength: 12 },
    email: {
      type: String,
      required: [true, "Please add an email"],
      unique: true,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please add a valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "Please add a password"],
      minlength: 6,
      maxlength: 32,
      select: false,
    },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    createdAt: { type: Date, default: Date.now },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

UserSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this.id }, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_EXPIRE as `${number}D`,
  });
};

UserSchema.methods.matchPassword = async function (enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const model = mongoose.model("User", UserSchema);
export type UserType = InstanceType<typeof model>;

export default model;

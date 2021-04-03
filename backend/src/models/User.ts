import { model, Schema } from "mongoose";
import { IUserModel, IUser } from "@src/types/user.type";
import mongoosePaginate from 'mongoose-paginate';
import crypto from "crypto";

export enum PermissionEnum {
  SystemUser = 'USER_SYSTEM',
  StaffUser = 'USER_STAFF',
  CustomerUser = 'ROLE_USER'
}

/**
 * A Validation function for local strategy properties
 */
const validateLocalStrategyProperty = function (property: any) {
  return (this.provider !== "local" && !this.updated) || property.length;
};

/**
 * A Validation function for local strategy password
 */
const validateLocalStrategyPassword = function (password: any) {
  return this.provider !== "local" || (password && password.length > 6);
};

const userSchema: Schema = new Schema({
  firstName: {
    type: String,
    trim: true,
    default: "",
  },
  lastName: {
    type: String,
    trim: true,
    default: "",
  },
  avatar: {
    type: String,
    trim: true,
    default: null
  },
  cover: {
    type: String,
    trim: true,
    default: null
  },
	role: {
    type: String,
    default: PermissionEnum.CustomerUser
  },
  username: {
    type: String,
    trim: true,
    default: null
  },
  nick: {
    type: String,
    trim: true,
    default: null
  },
  phone: {
    type: String,
    trim: true,
    default: null
  },
  needUpdatePassword: {
    type: Boolean,
    default: true
  },
  email: {
    type: String,
    trim: true,
    default: "",
    validate: [validateLocalStrategyProperty, "Please fill in your email"],
    match: [/.+@.+\..+/, "Please fill a valid email address"],
    unique: true,
  },
  password: {
    type: String,
    default: "",
    validate: [validateLocalStrategyPassword, "Password should be longer"],
  },
  salt: {
    type: String,
  },
  provider: {
    type: String,
    default: "local",
    required: "Provider is required",
  },
  providerData: {},
  additionalProvidersData: {},
  facebookProvider: {},
  /* For reset password */
  resetPasswordToken: {
    type: String,
  },
  resetPasswordExpires: {
    type: Date,
  },
  gender: {
    type: String,
    enum: ["M", "F"],
  },
  birthday: {
    day: Number,
    month: Number,
    year: Number,
  },
  address: {
    type: String
  },
  isActivate: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastLogin: {
    type: Date,
    default: Date.now
  },
  state: {
    type: String,
    enum: ["pending", "confirmed"],
    default: "confirmed",
  },
});

/**
 * Hook a pre save method to hash the password
 */
userSchema.pre("save", function (this: IUserModel, next) {
  if (this.password && this.isModified("password")) {
    this.salt = new Buffer(crypto.randomBytes(16).toString("base64"), "base64");
    this.password = this.hashPassword(this.password);
  }
  if (this.email) {
    this.email = this.email.toLowerCase();
  }

  next();
});

/**
 * Create instance method for hashing a password
 */
userSchema.methods.hashPassword = function (password: string) {
  if (this.salt && password) {
    return crypto
      .pbkdf2Sync(
        Buffer.from(password, "binary"),
        Buffer.from(this.salt, "binary"),
        10000,
        64,
        "sha1"
      )
      .toString("base64");
  } else {
    return password;
  }
};

/**
 * Create instance method for authenticating user
 */
userSchema.methods.authenticate = function (password: any) {
  return this.password === this.hashPassword(password);
};

userSchema.plugin(mongoosePaginate);

const User: IUser<IUserModel> = model<IUserModel>("User", userSchema);

export default User;

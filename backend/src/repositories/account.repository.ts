import crypto from "crypto";
import * as mongoose from "mongoose";
import { Types } from "mongoose";
import { getSocialConfig, getContacts } from "@config/Env";
import { IUserModel, IUser } from "@src/types/user.type";
import { PermissionEnum } from "@src/models/User";
import { Email, TEMPLATES } from "@src/infrastructure/email";
import { IAccountModel } from "@src/types/account.type";
import { IProviderConfig } from "@src/types/account/provider-config.type";
import { TransformData } from "@src/utils/transform-data";

const LegacyUser = <IUser<IUserModel>>mongoose.model("User");

const RESET_TOKEN_LENGTH = 20;
const RESET_TOKEN_EXPIRY = 3600000; // 1 HOUR

export class AccountRepository {
  public static async associateOauthProvider(
    userId: string,
    provider: IProviderConfig
  ): Promise<IAccountModel> {
    const user: IUserModel = await LegacyUser.findById(userId).exec();

    if (
      user.additionalProvidersData &&
      user.additionalProvidersData[provider.provider]
    ) {
      throw new Error(
        `User already has a linked ${provider.provider} account.`
      );
    }

    user.additionalProvidersData = Object.assign(
      user.additionalProvidersData || {},
      {
        [provider.provider]: provider.providerData,
      }
    );

    await user.save();

    return TransformData.transformLegacyUser(user);
  }

  public static async authenticate(
    email: string,
    password: string
  ): Promise<IAccountModel | boolean> {
    const user = await LegacyUser.findOne({
      email: {
        $regex: new RegExp(`^${email}$`, "i"),
      },
    }).exec();

    if (user && user.authenticate(password)) {
      return TransformData.transformLegacyUser(user);
    }

    return false;
  }

  public static async changePassword(
    userId: string,
    oldPassword: string,
    newPassword: string
  ): Promise<boolean> {
    const user = await LegacyUser.findById(userId).exec();

    if (user.authenticate(oldPassword)) {
      user.password = newPassword;

      await user.save();

      return true;
    }

    return false;
  }

  private static generatePassword(
    letters: number,
    numbers: number,
    either: number
  ) {
    const chars = [
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz", // letters
      "0123456789", // numbers
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", // either
    ];

    return [letters, numbers, either]
      .map((len, i) => {
        return Array(len)
          .fill(chars[i])
          .map((x) => x[Math.floor(Math.random() * x.length)])
          .join("");
      })
      .concat()
      .join("")
      .split("")
      .sort(() => 0.5 - Math.random())
      .join("");
  }

  public static async createLocalAccount(
    detail: IAccountModel
  ): Promise<IAccountModel> {
    const { firstName, lastName, email, phone, password } = detail;

    const user = await LegacyUser.create({
      provider: "local",
      firstName,
      lastName,
      email,
      phone,
      password,
    });

    return TransformData.transformLegacyUser(user);
  }

  public static async createGuestAccount(
    email: string,
    firstName: string,
    lastName: string,
    nick: string,
    phone: string
  ): Promise<IAccountModel> {
    const user: IUserModel = await LegacyUser.create({
      email,
      firstName,
      lastName,
      nick,
      phone,
      provider: "local",
      password: this.generatePassword(3, 3, 4),
      state: "confirmed",
    });

    return TransformData.transformLegacyUser(user);
  }

  public static async createPasswordForGuest(
    userId: string,
    password: string
  ): Promise<IAccountModel> {
    const user: IUserModel = await LegacyUser.findById(userId).exec();
    user.password = password;
    user.state = "confirmed";
    await user.save();

    return TransformData.transformLegacyUser(user);
  }

  public static buildPasswordResetLink(customer: IUserModel): string {
    const links = getSocialConfig();
    return customer.resetPasswordToken
      ? links.website + "/auth/reset-password/" + customer.resetPasswordToken
      : "";
  }

  public static async doPasswordResetByEmail(email: string): Promise<boolean> {
    const token = await generateToken(RESET_TOKEN_LENGTH);

    const exists = await this.emailExisted(email);
    if (!exists) {
      return false;
    }

    const state = exists.state === "pending" ? "confirmed" : exists.state;
    const updated = await LegacyUser.findOneAndUpdate(
      {
        email: {
          $regex: new RegExp(`^${email}$`, "i"),
        },
      },
      {
        state,
        resetPasswordToken: token,
        resetPasswordExpires: Date.now() + RESET_TOKEN_EXPIRY,
      },
      { new: true }
    ).exec();

    if (!updated) {
      return false;
    }
    updated.passwordResetLink = this.buildPasswordResetLink(updated);

    const resetEmail = new Email({
      template: TEMPLATES.RESET_PASSWORD,
      country: "VN",
      language: "vi",
      recipient: {
        firstName: updated.firstName,
        lastName: updated.lastName,
        email: updated.email,
      },
    });
    await resetEmail.send({
      customer: updated,
      contact: getContacts(),
      links: getSocialConfig(),
    });
    return true;
  }

  public static async emailExisted(
    emailString: string
  ): Promise<IAccountModel> {
    console.log(emailString);
    const user = await LegacyUser.findOne({
      email: new RegExp(`^${emailString}$`, "i"),
    }).exec();
    if (user) {
      return TransformData.transformLegacyUser(user);
    }
    return null;
  }

  public static async findOrCreateOauthAccount(
    accountData: IAccountModel
  ): Promise<IAccountModel> {
    let query;

    if (accountData.facebookProvider) {
      query = {
        "facebookProvider.id": accountData.facebookProvider.id,
      };
    }

    let user;

    user = await LegacyUser.findOne(query).exec();

    if (!user) {
      // find user by email
      user = await LegacyUser.findOne({
        email: new RegExp(`^${accountData.email}$`, "i"),
      }).exec();

      if (user) {
        if (accountData.facebookProvider) {
          user.facebookProvider = accountData.facebookProvider;
          await user.save();
        } else {
          return null;
        }
      } else {
        user = await LegacyUser.create(Object.assign(accountData));
      }
    }

    return TransformData.transformLegacyUser(user);
  }

  public static async loadUser(userId: string): Promise<IAccountModel> {
    const user = await LegacyUser.findOne({
      _id: userId,
      role: PermissionEnum.SystemUser
    }).exec();
    if (!user) {
      return null;
    }
    return TransformData.transformLegacyUser(user);
  }

  public static async resetPassword(
    token: string,
    newPassword: string
  ): Promise<{ isChanged?: boolean; message?: string }> {
    if (newPassword.length < 7) {
      return { message: "RESET_INVALID_PASSWORD" };
    }

    const user = await LegacyUser.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gte: new Date().toISOString() },
    }).exec();

    if (!user) {
      return { message: "COULD_NOT_CHANGE_PASSWORD_TOKEN_EXPIRED" };
    }

    if (user.provider === "facebook") {
      return { message: "COULD_NOT_RESET_OF_FACEBOOK_ACCOUNT" };
    }

    user.password = newPassword;

    await user.save();
    return { isChanged: true };
  }

  public static async updateAccountInfo(
    userId: string,
    data: IUserModel
  ): Promise<IAccountModel> {
    const foundUser: IUserModel = await LegacyUser.findById(userId).exec();

    if (!foundUser) {
      return null;
    }

    const { firstName, lastName, phone, address } = data;
    foundUser.firstName = firstName;
    foundUser.lastName = lastName;
    foundUser.phone = phone;
    foundUser.address = address;

    await foundUser.save();

    return TransformData.transformLegacyUser(foundUser);
  }

  public static isValidEmail(email: string): boolean {
    if (!email) {
      return false;
    }
    const chrbeforAt = email.substr(0, email.indexOf("@"));
    if (!(email.length > 127)) {
      if (chrbeforAt.length >= 2) {
        const regex = /^(([^<>()[\]{}'^?\\.,!|//#%*-+=&;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
        return regex.test(email);
      }
    }
    return false;
  }

  public static async getNewUsers(userId: string, limit = 5) {
    const userResult = await LegacyUser.find({})
      .sort("-createdAt")
      .limit(limit)
      .exec();

    const lastResults = userResult.map((record: any) => {
      record._doc = TransformData.transformLegacyUser(record);
      return record;
    });

    if (userId) {
      return Object.assign(
        {},
        {
          records: lastResults,
        }
      );
    }

    return {
      records: lastResults,
    };
  }

  public static async getUsers(page = 1) {
    const perPage = 12,
      paginateOptions = {
        sort: { createdAt: -1 }, // TODO: Lost last item when sorting
        offset: (page - 1) * perPage,
        limit: perPage,
      };
    const userResult = await LegacyUser.paginate({}, paginateOptions);
    const lastResults = userResult.docs.map((record: any) => {
      record._doc = TransformData.transformLegacyUser(record);
      return record;
    });

    return {
      totalItems: userResult.total,
      pages: Math.ceil(userResult.total / perPage),
      page: page,
      itemPerPage: perPage,
      records: lastResults,
    };
  }

  public static async addOrderToAccount(
    userId: Types.ObjectId,
    orderId: Types.ObjectId
  ): Promise<boolean> {
    const affectedNum = await LegacyUser.update(
      { _id: userId },
      { $push: { orders: orderId } }
    ).exec();

    return affectedNum > 0;
  }

  public static async uploadUserLastLogin(userId: Types.ObjectId): Promise<void> {
    await LegacyUser.findByIdAndUpdate(userId, { lastLogin: Date.now() }).exec();
  }
}

const generateToken = async (length: number) => {
  return new Promise((resolve, reject) =>
    crypto.randomBytes(length, function (err, buffer) {
      if (err) {
        reject(err);
      }

      resolve(buffer.toString("hex"));
    })
  );
};

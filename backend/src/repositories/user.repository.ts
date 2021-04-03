import * as mongoose from "mongoose";
import { unlinkSync } from "fs";
import { Types } from "mongoose";
import { IUserModel, IUser } from "@src/types/user.type";
import { IAccountModel } from "@src/types/account.type";
import { TransformData } from "@src/utils/transform-data";

const LegacyUser = <IUser<IUserModel>>mongoose.model("User");
const API_URL = process.env.API_URL + '/api/admin/v1';

export class UserRepository {
  public static async createLocalAccount(
    detail: IAccountModel
  ): Promise<IAccountModel> {
    const { firstName, lastName, email, phone, password, gender, role } = detail;

    const user = await LegacyUser.create({
      provider: "local",
      firstName,
      lastName,
      email,
      phone,
      password,
      gender,
      role,
      needUpdatePassword: false
    });

    return TransformData.transformLegacyUser(user);
  }

  public static async getUser(userId: string): Promise<IAccountModel> {
    const user = await LegacyUser.findById(userId).exec();
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

  public static async updateUser(
    userId: Types.ObjectId,
    data: IUserModel
  ): Promise<IAccountModel> {
    const foundUser: IUserModel = await LegacyUser.findById(userId).exec();

    if (!foundUser) {
      return null;
    }

    const { firstName, lastName, nick, phone, gender, email, address, isActivate, role } = data;
    foundUser.firstName = firstName;
    foundUser.lastName = lastName;
    foundUser.nick = nick;
    foundUser.phone = phone;
    foundUser.gender = gender;
    foundUser.email = email;
    foundUser.address = address;
    foundUser.isActivate = isActivate;

    if (role) {
      foundUser.role = role;
    }

    await foundUser.save();

    return TransformData.transformLegacyUser(foundUser);
  }

  public static async changePassword(
    userId: string,
    password: string
  ): Promise<boolean> {
    const user = await LegacyUser.findById(userId).exec();
    user.password = password;

    await user.save();

    return true;
  }

  public static isValidEmail(email: string) {
    if (!email) {
      return false;
    }
    const chrbeforAt = email.substr(0, email.indexOf("@"));
    if (!(email.length > 127)) {
      if (chrbeforAt.length >= 2) {
        const regex = /^(([^<>()[\]{}'^?\\.,!|//#%*-+=&;:\s@]+(\.[^<>()[\]\\.,;:\s@]+)*)|(.+))@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
        return regex.test(email);
      }
    }
    return false;
  }

  public static async saveUploadAvatar(userId: string, file: any) {
    const user = await LegacyUser.findOne({
      _id: Types.ObjectId(userId),
    }).exec();

    if (!user) {
      return null;
    }

    const photoUrl = `${API_URL}/assets/user-avatars/${userId}/${file.filename}`;

    const result = await LegacyUser.findOneAndUpdate(
      { _id: Types.ObjectId(userId) },
      { $set: { avatar: photoUrl } },
      { new: true }
    ).exec();

    return TransformData.transformLegacyUser(result);
  }

  public static async removeUserAvatar(userId: string) {
    const user = await LegacyUser.findOne({
      _id: Types.ObjectId(userId),
    }).exec();

    if (!user) {
      return null;
    }


    const result = await LegacyUser.findOneAndUpdate(
      { _id: Types.ObjectId(userId) },
      { $set: { avatar: null } },
      { new: true }
    ).exec();

    return TransformData.transformLegacyUser(result);
  }

  public static async removeFilesOfUpload(filePath: string) {
    return unlinkSync(filePath);
  }

  public static async getUsers(pageIndex = 1, pageSize = 10, roles: string[], keyword: string) {
    const paginateOptions = {
      sort: { createdAt: -1 },
      offset: (pageIndex - 1) * pageSize,
      limit: pageSize,
    };

    const conditions: {
      role: any;
      $or?: any;
    } = { role: {
      '$in': roles
    }};

    if (keyword) {
      const regex = new RegExp(keyword.trim(), 'i');
      conditions.$or = [
        { firstName: regex }, 
        { lastName: regex }, 
        { email: { $regex: `.*${keyword.trim()}.*`, $options: 'i' } }, 
        { phone: regex }]
        ;
    }

    const userResult = await LegacyUser.paginate(conditions, paginateOptions);
    const lastResults = userResult.docs.map((record: any) => {
      record._doc = TransformData.transformLegacyUser(record);
      return record;
    });

    return {
      totalItems: userResult.total,
      pages: Math.ceil(userResult.total / pageSize),
      page: pageIndex,
      itemPerPage: pageSize,
      records: lastResults,
    };
  }

  public static async removeUser(userId: Types.ObjectId) {
    return LegacyUser.find({ _id: userId }).remove().exec();
  }
}

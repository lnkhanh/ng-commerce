import { IUserModel } from "@src/types/user.type";
import { IAccountModel } from "@src/types/account.type";
import { Functions } from "./functions";
import { ICompanyModel } from "@src/types/company.type";
import { IStoreModel } from "@src/types/store.type";
import { IProductModel } from "@src/types/product.type";
import { CartItemType, ICartItemModel } from "@src/types/cart-item.type";
import { ICategoryModel } from '@src/types/category.type';
import { IDBBackupModel } from '@src/types/common.type';
import { IOptionSetModel } from '@src/types/option-set.type';

export class TransformData {
  public static transformLegacyUser(user: IUserModel): IAccountModel {
    if (!user) {
      return null;
    }

    return {
      id: user._id.toString(),
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email ? user.email.toLowerCase() : '',
      provider: user.provider,
      state: user.state,
      gender: user.gender,
      phone: user.phone,
      nick: user.nick,
      role: user.role,
      address: user.address,
      companyId: user.companyId ? user.companyId.toString() : null,
      storeId: user.storeId ? user.storeId.toString() : null,
      isActivate: user.isActivate,
      createdAt: user.createdAt,
      lastLogin: user.lastLogin,
      lastVisitedStoreId: user.lastVisitedStoreId
        ? user.lastVisitedStoreId.toString()
        : null,
      avatar: user.avatar
    };
  }

  public static transformLegacyCompany(company: ICompanyModel) {
    const { _id, name, createdBy, modifiedAt, createdAt } = company;

    return {
      id: _id,
      name,
      createdBy,
      modifiedAt,
      createdAt,
    };
  }

  public static transformLegacyStore(store: IStoreModel) {
    const {
      _id,
      name,
      address,
      companyId,
      createdBy,
      modifiedAt,
      createdAt,
    } = store;

    return {
      id: _id,
      name,
      address,
      companyId,
      createdBy,
      modifiedAt,
      createdAt,
    };
  }

  public static transformLegacyCategory(category: ICategoryModel) {
    const {
      _id,
      name,
      slug,
      modifiedAt,
      createdAt,
    } = category;

    return {
      id: _id,
      name,
      slug,
      modifiedAt,
      createdAt,
    };
  }

  public static transformLegacyProduct(product: IProductModel) {
    const { _id, name, description, salePrice, retailPrice, images, store, category, optionSets, dimension } = product;

    return {
      id: _id,
      name,
      slug: Functions.getProductSlug({ id: _id.toString(), title: name }),
      description,
      salePrice,
      retailPrice,
      images,
      optionSets: optionSets ? JSON.parse(optionSets) : [],
      dimension: dimension ? JSON.parse(dimension) : {},
      storeId: store,
      categoryId: category,
    };
  }

  public static transformCartItem(cartItem: ICartItemModel) {
    return {
      id: cartItem._id,
      productId: cartItem.product,
      title: cartItem.title,
      image: cartItem.image,
      quantity: cartItem.quantity,
      availableQuantity: cartItem.quantity,
      retailPrice: cartItem.retailPrice,
      salePrice: cartItem.salePrice,
      slug: Functions.getProductSlug({ id: cartItem.product, title: cartItem.title }),
      categoryId: cartItem.categoryId,
      categoryName: cartItem.categoryName,
      note: cartItem.note
    } as CartItemType;
  }

  public static transformBackupItem(backup: IDBBackupModel) {
    const { _id, fileName, status, canRemove, createdAt } = backup;
    return {
      id: _id,
      fileName,
      canRemove,
      status,
      createdAt,
    };
  }

  public static transformOptionSet(optionSet: IOptionSetModel) {
    const {
      _id,
      name,
      displayName,
      displayOrder,
      displayControlType,
      options
    } = optionSet;
    console.log(options);
    return {
      id: _id,
      name,
      displayName,
      displayOrder: displayOrder || 0,
      displayControlType,
      options: JSON.parse(options || '[]')
    };
  }
}

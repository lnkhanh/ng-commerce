import * as mongoose from "mongoose";
import { Types, Model } from "mongoose";
import { every } from "lodash";
import { TransformData } from "@src/utils/transform-data";
import { CartItemType, ICartItemModel } from "@src/types/cart-item.type";
import { IProductModel } from "@src/types/product.type";
import { Functions } from "@src/utils/functions";
import { ValidationException } from "@src/infrastructure/exception/validation";

const MAX_UNIQUE_PRODUCTS = 8;
const MAX_QUANTITY = 5;
const LegacyCartItem = <Model<ICartItemModel>>mongoose.model("CartItem");
const LegacyProduct = <Model<IProductModel>>mongoose.model("Product");

export class CartRepository {
  public static cartSummary(cartItems: Array<CartItemType>) {
    return {
      ...Functions.calculateCartSummary(cartItems),
      items: cartItems,
    };
  }

  public static async addItemToCart(
    userId: string,
    productId: string,
    quantity = 1,
    note: string
  ): Promise<CartItemType> {
    const items = await CartRepository.getCart(userId);

    if (
      items.length > MAX_UNIQUE_PRODUCTS ||
      items.length === MAX_UNIQUE_PRODUCTS
    ) {
      throw new Error("CART_EXCEEDS_THE_MAXIMUM_SIZE");
    }

    const product = await LegacyProduct.findOne({
      _id: Types.ObjectId(productId),
    }).exec();

    if (!product) {
      throw new Error("COULD_NOT_RESOLVE_PRODUCT");
    }

    const imageUrl =
      product.images && product.images[0] ? product.images[0] : "";

    const newItem = await LegacyCartItem.create({
      user: userId,
      product: product._id,
      title: product.name,
      quantity: quantity < MAX_QUANTITY ? quantity : MAX_QUANTITY,
      image: imageUrl,
      retailPrice: product.retailPrice,
      salePrice: product.salePrice || 0,
      categoryId: product.category,
      note: note
    });

    return TransformData.transformCartItem(newItem);
  }

  public static async destroyCart(userId: string) {
    try {
      await LegacyCartItem.remove({ user: userId.toString() }).exec();
    } catch (e) {
      return false;
    }

    return true;
  }

  /**
   * Retrieves a cart for a user, filtered by country.  The repo is optionally injected/
   * @param visitorId
   * @param _location
   * @param CartItemModel
   */
  public static async getCart(visitorId: string): Promise<Array<CartItemType>> {
    const items: Array<ICartItemModel> = await LegacyCartItem.find({
      user: visitorId,
    }).exec();
    const cartItems = await Promise.all(
      items.map(async (item: ICartItemModel) => {
        return TransformData.transformCartItem(item);
      })
    );
    return cartItems.filter((item: CartItemType) => item.id);
  }

  public static async removeItemFromCart(itemId: string): Promise<boolean> {
    await LegacyCartItem.find({
      _id: itemId,
    })
      .remove()
      .exec();

    return true;
  }

  public static async removeItemsFromCart(
    itemIds: Array<string>
  ): Promise<boolean> {
    await LegacyCartItem.find({
      _id: { $in: itemIds },
    })
      .remove()
      .exec();
    return true;
  }

  /**
   * @param itemId
   * @param quantity
   */
  public static async updateCartItem(
    itemId: string,
    quantity: number,
    note: string
  ): Promise<CartItemType> {
    if (quantity > MAX_QUANTITY) {
      throw new Error("ALREADY_REACHED_MAX_QUANTITY");
    }

    const item: ICartItemModel = await LegacyCartItem.findOne({
      _id: itemId
    }).exec();

    if (!item) {
      throw new Error("CART_ITEM_NOT_FOUND");
    }

    item.quantity = quantity;
    item.note = note;
    const result = TransformData.transformCartItem(item);

    await item.save();
    return result;
  }

  /**
   * Validate cart items && Update the cart automatically
   * @param carts
   */
  public static async validateAvailability(
    carts: Array<CartItemType>
  ): Promise<{ carts: Array<CartItemType> }> {
    const { errs, products } = await carts.reduce(
      async (previousResult, item: CartItemType, index) => {
        const result = await previousResult;
        const product = await LegacyProduct.findOne({
          _id: Types.ObjectId(item.productId),
        }).exec();

        if (!product) {
          await CartRepository.removeItemFromCart(item.id);
          carts.splice(index, 1);
          result.errs.push({
            message: `CART_MISMATCH_CANT_FIND_PRODUCT`,
            values: {
              id: item.id,
              title: item.title,
            },
          });
          return result;
        }

        // if an item has quantity available, but less than what the user added in the cart, decrease the quantity for that item to reach the maximum quantity purchasable
        if (item.quantity > MAX_QUANTITY) {
          CartRepository.updateCartItem(item.id, MAX_QUANTITY, item.note);
          carts.splice(index, 1, {
            ...carts[index],
            quantity: MAX_QUANTITY,
          });
          result.errs.push({
            message: `ONLY_LIMITED_UNITS_IN_STOCK`,
            values: {
              id: item.id,
              quantity: MAX_QUANTITY,
              title: item.title,
            },
          });
          return result;
        }
        result.products.push(product);
        return result;
      },
      Promise.resolve({ errs: [], products: [] })
    );

    if (errs.length) {
      throw new ValidationException(errs[0].message, {
        cart: carts,
      });
    }

    // In case there is no item in the cart left, redirect user to home page
    if (!products.length) {
      throw new ValidationException("PRODUCTS_NOT_FOUND", {
        cart: carts,
      });
    }

    return {
      carts,
    };
  }

  public static validateCartItems(
    clientCarts: Array<CartItemType>,
    serverCarts: Array<CartItemType>
  ): Array<CartItemType> {
    if (serverCarts.length !== clientCarts.length) {
      throw new ValidationException("CART_MISMATCH", {
        cart: serverCarts,
      });
    }

    // Validate all order items are unique
    const uniqueItems = serverCarts.reduce((result, item) => {
      if (
        every(
          result,
          (selectedItem) => selectedItem.productId !== item.productId
        )
      ) {
        result.push(item);
      }
      return result;
		}, []);
		
    if (uniqueItems.length > serverCarts.length) {
      throw new ValidationException("CART_DUPLICATE_PRODUCTS", {
        cart: serverCarts,
      });
    }

    if (serverCarts.length > MAX_UNIQUE_PRODUCTS) {
      throw new ValidationException("CART_EXCEEDS_THE_MAXIMUM_SIZE", {
        quantity: MAX_UNIQUE_PRODUCTS,
      });
    }

    serverCarts.forEach((item) => {
      const clientItem = clientCarts.find(
        (ci) => ci.id.toString() === item.id.toString()
      );
      if (!clientItem) {
        throw new ValidationException("CART_MISMATCH_CANT_FIND_PRODUCT", {
          title: item.title,
          id: item.id,
        });
      }
      // Validate prices
      if (
        item.retailPrice === 0 ||
        item.retailPrice < 0 ||
        item.retailPrice !== clientItem.retailPrice
      ) {
        throw new ValidationException("PRICE_MISMATCH", {
          title: item.title,
          id: item.id,
        });
      }

      // Validate quantity
      if (item.quantity < 0 || item.quantity !== clientItem.quantity) {
        throw new ValidationException(
          "QUANTITY_SUBMITTED_NOT_MATCH_IN_THE_CART",
          {
            title: item.title,
            id: item.id,
          }
        );
      }
    });

    return serverCarts;
  }
}

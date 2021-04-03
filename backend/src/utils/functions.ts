import { CartItemType } from '@src/types/cart-item.type';
import slug from "slug";

export class Functions {
  public static save(doc: Promise<any>) {
    return new Promise((resolve, reject) => {
      doc.then(
        (rs) => {
          resolve(rs);
        },
        (err) => {
          if (err) {
            reject(err);
          }
        }
      );
    });
  }

  public static getSlug(title: string) {
    slug.defaults.modes["rfc3986"] = {
      replacement: "-", // replace spaces with replacement
      remove: null, // (optional) regex to remove characters
      lower: true, // result in lower case
      charmap: slug.charmap, // replace special characters
      multicharmap: slug.multicharmap, // replace multi-characters
    };
    return `${slug(title)}`;
  }

  public static getProductSlug(product: { title: string; id: string }) {
    slug.defaults.modes["rfc3986"] = {
      replacement: "-", // replace spaces with replacement
      remove: null, // (optional) regex to remove characters
      lower: true, // result in lower case
      charmap: slug.charmap, // replace special characters
      multicharmap: slug.multicharmap, // replace multi-characters
    };
    return `${slug(product.title)}-${product.id}`;
  }

  public static calculateCartSummary(cartItems: Array<CartItemType>) {
    return cartItems.reduce((obj, item) => {
      obj.total += item.retailPrice * item.quantity;
      obj.qty += item.quantity;
      return obj;
    }, { total: 0, qty: 0 });
  }
}

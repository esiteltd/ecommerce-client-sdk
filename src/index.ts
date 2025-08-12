import { SDKConfig } from "./client/base-client";
import { Auth } from "./resources/auth";
import { Cart } from "./resources/cart";
import { Category } from "./resources/category";
import { Customer } from "./resources/customer";
import { Order } from "./resources/order";
import { Product } from "./resources/product";
import { TGS } from "./resources/tgs";

export class EcommerceSDK {
	public readonly tgs: TGS;
	public readonly auth: Auth;
	public readonly product: Product;
	public readonly category: Category;
	public readonly cart: Cart;
	public readonly order: Order;
	public readonly customer: Customer;

	constructor(config: SDKConfig) {
		// Initialize all resources with the same config
		this.tgs = new TGS(config);
		this.auth = new Auth(config);
		this.product = new Product(config);
		this.category = new Category(config);
		this.cart = new Cart(config);
		this.order = new Order(config);
		this.customer = new Customer(config);
	}
}

// Export everything that consumers might need
export { SDKConfig, SDKError } from "./client/base-client";
export * from "./schema";

// Export types
export type {
	Product,
	ProductListItem,
	Order,
	Customer,
	CategoryListItem,
	UpsertCart,
} from "./schema";

// Default export
export default EcommerceSDK;

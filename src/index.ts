import { SDKConfig } from "./client/base-client";
import { Auth } from "./resources/auth";
import { Branch } from "./resources/branch";
import { Cart } from "./resources/cart";
import { Category } from "./resources/category";
import { Customer } from "./resources/customer";
import { Order } from "./resources/order";
import { Product } from "./resources/product";
import { Tenant } from "./resources/tenant";
import { TGS } from "./resources/tgs";

export class EcommerceSDK {
	public readonly tgs: TGS;
	public readonly auth: Auth;
	public readonly product: Product;
	public readonly category: Category;
	public readonly cart: Cart;
	public readonly order: Order;
	public readonly customer: Customer;
	public readonly tenant: Tenant;
	public readonly branch: Branch;

	constructor(config: SDKConfig) {
		// Initialize all resources with the same config
		this.tgs = new TGS(config);
		this.auth = new Auth(config);
		this.product = new Product(config);
		this.category = new Category(config);
		this.cart = new Cart(config);
		this.order = new Order(config);
		this.customer = new Customer(config);
		this.tenant = new Tenant(config);
		this.branch = new Branch(config);
	}
}

// Export everything that consumers might need
export { type SDKConfig, SDKError } from "./client/base-client";
export * from "./schema";

// Export types
export type * from "./schema";

// Default export
export default EcommerceSDK;

import { SDKConfig } from "./client/base-client";
import { Auth } from "./resources/auth";
import { Branch } from "./resources/branch";
import { Brand } from "./resources/brand";
import { Cart } from "./resources/cart";
import { Category } from "./resources/category";
import { ContactUs } from "./resources/contact-us";
import { Coupon } from "./resources/coupon";
import { Customer } from "./resources/customer";
import { Media } from "./resources/media";
import { Menu } from "./resources/menu";
import { Offer } from "./resources/offer";
import { Order } from "./resources/order";
import { Placeholder } from "./resources/placeholder";
import { Post } from "./resources/post";
import { PostCategory } from "./resources/post-category";
import { PostComment } from "./resources/post-comment";
import { PostTag } from "./resources/post-tag";
import { Product } from "./resources/product";
import { StaticData } from "./resources/static-data";
import { Supplier } from "./resources/supplier";
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
	public readonly brand: Brand;
	public readonly supplier: Supplier;
	public readonly menu: Menu;
	public readonly staticData: StaticData;
	public readonly contactUs: ContactUs;
	public readonly post: Post;
	public readonly postTag: PostTag;
	public readonly postCategory: PostCategory;
	public readonly postComment: PostComment;
	public readonly offer: Offer;
	public readonly media: Media;
	public readonly coupon: Coupon;
	public readonly placeholder: Placeholder;

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
		this.brand = new Brand(config);
		this.supplier = new Supplier(config);
		this.menu = new Menu(config);
		this.staticData = new StaticData(config);
		this.contactUs = new ContactUs(config);
		this.post = new Post(config);
		this.postTag = new PostTag(config);
		this.postCategory = new PostCategory(config);
		this.postComment = new PostComment(config);
		this.offer = new Offer(config);
		this.media = new Media(config);
		this.coupon = new Coupon(config);
		this.placeholder = new Placeholder(config);
	}
}

// Export everything that consumers might need
export { type SDKConfig, SDKError } from "./client/base-client";
export * from "./schema";

// Export types
export type * from "./schema";

// Default export
export default EcommerceSDK;

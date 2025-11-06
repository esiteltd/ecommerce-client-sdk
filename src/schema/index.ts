import { z } from "zod";

// Phone validation schema
export const phoneSchema = z
	.string()
	.min(1, "Phone number is required")
	.regex(/^\+[1-9]\d{1,14}$/, "Please enter a valid phone number");

// Base schemas
export const categorySchema = z.object({
	id: z.string(),
	title: z.string(),
});

export const brandSchema = z.object({
	id: z.string(),
	title: z.string(),
});

export const mediaSchema = z.object({
	id: z.string(),
	content_type: z.string(),
	file_id: z.string(),
	alt: z.string(),
});

// Type definitions
export type AuthHeaders = {
	authorization: string;
};

// Authentication schemas
export const authUserSchema = z.object({
	id: z.string(),
	name: z.string(),
	username: z.string(),
	firstName: z.string(),
	lastName: z.string(),
	email: z.string(),
	createAt: z.string(),
	enabled: z.boolean(),
	tenant: z.string(),
	tenantLanguages: z.array(z.string()),
	attributes: z.object({
		permissionId: z.array(z.string()).default([]),
		jobTitle: z.array(z.string()).default([]),
		local: z.array(z.string()).default([]),
	}),
});

export const loginResponseSchema = z.object({
	access_token: z.string(),
	refresh_token: z.string(),
	access_token_expiration: z.number(),
	refresh_token_expiration: z.number(),
	user: authUserSchema,
	customer: z.lazy(() => customerSchema),
	address: z.lazy(() => addressSchema).nullish(),
});

// Address schemas
export const addressFormSchema = z.object({
	title: z.string().min(1, "Required"),
	country: z.string().min(1, "Required"),
	state: z.string().min(1, "Required"),
	city: z.string().min(1, "Required"),
	address1: z.string().min(1, "Required"),
	address2: z.string().optional(),
	phonenumber: phoneSchema,
	is_default: z.boolean().optional(),
	postal_code: z.string().optional(),
});

export const addressSchema = z.object({
	id: z.string(),
	title: z.string(),
	country: z.string(),
	state: z.string(),
	city: z.string(),
	address1: z.string(),
	address2: z.string(),
	phonenumber: phoneSchema,
	is_default: z.boolean(),
	postal_code: z.string(),
});

export const createAddressSchema = z.object({
	title: z.string(),
	country: z.string(),
	state: z.string(),
	city: z.string(),
	address1: z.string(),
	address2: z.string(),
	phonenumber: phoneSchema,
	is_default: z.boolean(),
	postal_code: z.string(),
});

export const updateAddressSchema = z.object({
	title: z.string(),
	country: z.string(),
	state: z.string(),
	city: z.string(),
	address1: z.string(),
	address2: z.string(),
	phonenumber: phoneSchema,
	postal_code: z.string(),
	is_default: z.boolean(),
});

// Customer schemas
export const customerSchema = z.object({
	id: z.string(),
	external_user_id: z.string(),
	firstname: z.string(),
	lastname: z.string(),
	language: z.string(),
	// TODO: Remove this once the API is updated
	phonenumber: z.union([phoneSchema, z.literal("")]),
	email: z.string(),
	gender: z.number(),
	date_of_birth: z.string().nullable(),
	addresses: z.array(addressSchema).nullish().default([]),
});

export const customerListSchema = z.object({
	items: z.array(customerSchema),
	page: z.number(),
	size: z.number(),
	total: z.number(),
});

export const createCustomerSchema = z.object({
	external_user_id: z.string(),
	firstname: z.string(),
	lastname: z.string(),
	language: z.string(),
	phonenumber: z.string(),
	email: z.string(),
	gender: z.number(),
	date_of_birth: z.string(),
});

export const updateCustomerSchema = createCustomerSchema;

// Product schemas
export const productSchema = z.object({
	id: z.string(),
	title: z.string(),
	description: z.preprocess(
		(val) => {
			if (typeof val === "string") {
				try {
					return JSON.parse(val);
				} catch {
					return val;
				}
			}
			return val;
		},
		z.array(
			z.object({
				title: z.string(),
				index: z.number(),
				description: z.string(),
			}),
		),
	),
	short_description: z.string(),
	price: z.number(),
	rating: z.number(),
	sku: z.string(),
	slug: z.string(),
	currency: z.string().transform(() => "CAD"),
	unit: z.string(),
	weight: z.number().optional(),
	disable: z.boolean(),
	out_of_stock: z.boolean(),
	attributes: z.array(
		z.object({
			id: z.string(),
			product_id: z.string(),
			parent_id: z.string().nullable(),
			media_id: z.string().nullable(),
			type: z.string(),
			extra: z.string(),
			children: z.array(
				z.object({
					id: z.string(),
					product_id: z.string(),
					parent_id: z.string(),
					media_id: z.string().nullable(),
					type: z.string(),
					extra: z.string(),
					price: z.number(),
					sku: z.string(),
					children: z.array(z.unknown()),
				}),
			),
		}),
	),
	media: z.array(mediaSchema).nullish().default([]),
	categories: z.array(categorySchema).nullish().default([]),
	brands: z.array(brandSchema).nullish().default([]),
});

export const productListItemSchema = z.object({
	id: z.string(),
	title: z.string(),
	price: z.number(),
	sku: z.string(),
	slug: z.string().nullable(),
	currency: z.string().transform(() => "CAD"),
	unit: z.string(),
	weight: z.number().optional(),
	out_of_stock: z.boolean(),
	media_id: z.string().nullable(),
	media_content_type: z.string().nullable(),
	media_file_id: z.string().nullable(),
	cover_media_file_id: z.string().nullable(),
	category_id: z.string().nullable(),
	category_title: z.string().nullable(),
	brand_id: z.string().nullable(),
	brand_title: z.string().nullable(),
});

export const productListSchema = z.object({
	items: z.array(productListItemSchema),
	page: z.number(),
	size: z.number(),
	total: z.number(),
});

export const categoryListItemSchema = z.object({
	id: z.string(),
	parent_id: z.string().nullable(),
	media_id: z.string().nullable(),
	title: z.string(),
	products: z.number(),
	children: z.array(
		z.object({
			id: z.string(),
			parent_id: z.string(),
			media_id: z.string().nullable(),
			title: z.string(),
			children: z.array(z.unknown()),
		}),
	),
});
// Category schemas
export const categoryListSchema = z.object({
	items: z.array(categoryListItemSchema).nullable().default([]),
	page: z.number(),
	size: z.number(),
	total: z.number(),
});

export const cartListItemSchema = z.object({
	id: z.string(),
	product_id: z.string(),
	product_attribute_id: z.string().optional(),
	quantity: z.number(),
	device_token: z.string(),
	notes: z.string(),
	created_at: z.string(),
	total_price: z.number(),
	product: z.object({
		id: z.string(),
		title: z.string(),
		description: z.string(),
		short_description: z.string(),
		price: z.number().nullish(),
		is_taxable: z.boolean().nullish().default(false),
		sku: z.string(),
		slug: z.string(),
		currency: z.string(),
		unit: z.string(),
		disable: z.boolean(),
		out_of_stock: z.boolean(),
		reviews_count: z.number(),
		cover_media_file_id: z.string().nullable(),
		rating: z.number(),
		attributes: z.array(
			z.object({
				id: z.string(),
				product_id: z.string(),
				parent_id: z.string().nullable(),
				media_id: z.string().nullable(),
				type: z.string(),
				extra: z.string(),
				price: z.number().nullish(),
				children: z.array(z.unknown()),
			}),
		),
		media: z
			.array(
				z.object({
					id: z.string(),
					content_type: z.string(),
					file_id: z.string(),
					alt: z.string(),
				}),
			)
			.nullable()
			.default([]),
		categories: z
			.array(
				z.object({
					id: z.string(),
					title: z.string(),
				}),
			)
			.nullable()
			.default([]),
		brands: z
			.array(
				z.object({
					id: z.string(),
					title: z.string(),
				}),
			)
			.nullable()
			.default([]),
	}),
});
// Cart schemas
export const queryCartSchema = z.object({
	items: z.array(cartListItemSchema),
	total_price: z.number().optional().default(0),
});

export const upsertCartSchema = z.object({
	product_id: z.string(),
	customer_id: z.string().optional(),
	product_attribute_id: z.string().nullish(),
	quantity: z.number(),
	notes: z.string(),
});

// Order schemas
export const orderItemSchema = z.object({
	id: z.string(),
	order_id: z.string(),
	cart_id: z.string().nullable(),
	product_id: z.string(),
	product_attribute_id: z.string().nullable(),
	price: z.number(),
	price_updated_at: z.string(),
	quantity: z.number(),
	notes: z.string(),
	created_at: z.string(),
});

export const getOrderItemSchema = z.object({
	id: z.string(),
	order_id: z.string(),
	cart_id: z.string().nullable(),
	product_id: z.string(),
	product_attribute_id: z.string().nullable(),
	price: z.number(),
	price_updated_at: z.string(),
	quantity: z.number(),
	notes: z.string(),
	created_at: z.string(),
});

export const orderPaymentSchema = z.object({
	id: z.string(),
	order_id: z.string(),
	status: z.number(),
	provider: z.string(),
	amount: z.number(),
	created_at: z.string(),
	provider_extra_information: z.object({
		id: z.string(),
		payment_id: z.string(),
		url: z.string(),
		payment_status: z.string(),
		session_status: z.string(),
		session_expires_at: z.number(),
		session_created_at: z.number(),
	}),
});

export const orderSchema = z.object({
	order: z.object({
		id: z.string(),
		customer_id: z.string(),
		address_id: z.string(),
		currency: z.string(),
		total_price: z.number(),
		total_paid: z.number(),
		created_at: z.string(),
		payment_id: z.string(),
		payment_provider: z.string(),
		payment_status: z.string(),
		payment_created_at: z.string(),
		items: z.array(orderItemSchema),
	}),
	payment: orderPaymentSchema,
});

export const orderListSchema = z.object({
	items: z.array(
		z.object({
			id: z.string(),
			number: z.string(),
			customer_id: z.string(),
			currency: z.string(),
			total_price: z.number(),
			total_paid: z.number(),
			created_at: z.string(),
			payment_id: z.string(),
			payment_provider: z.string(),
			payment_status: z.string(),
			payment_created_at: z.string(),
			items_count: z.number().optional(),
			current_step: z.object({
				id: z.string(),
				order_id: z.string(),
				kind: z.string(),
				extra: z.string(),
				created_at: z.string(),
			}),
			items: z
				.array(
					z.object({
						id: z.string(),
						order_id: z.string(),
						cart_id: z.string(),
						product_id: z.string(),
						product_attribute_id: z.string().nullable(),
						price: z.number(),
						price_updated_at: z.string(),
						quantity: z.number(),
						notes: z.string(),
						created_at: z.string(),
						product: productSchema.optional(),
					}),
				)
				.optional(),
		}),
	),
	page: z.number(),
	size: z.number(),
	total: z.number(),
});

export const getOrderSchema = z.object({
	id: z.string().uuid(),
	number: z.string(),
	customer_id: z.string().uuid(),
	address_id: z.string().uuid(),
	currency: z.string(),
	total_price: z.number(),
	total_paid: z.number(),
	shipment_service_code: z.string(),
	shipment_price: z.number(),
	created_at: z.string().datetime({ offset: true }),
	payment_id: z.string().uuid(),
	payment_provider: z.string(),
	payment_status: z.string(),
	payment_created_at: z.string().datetime({ offset: true }),
	items_count: z.number().int(),
	current_step: z.object({
		id: z.string().uuid(),
		order_id: z.string().uuid(),
		kind: z.string(),
		extra: z.string(), // Again, can be parsed to JSON if needed
		created_at: z.string().datetime({ offset: true }),
	}),
	logs: z.array(
		z.object({
			id: z.string().uuid(),
			order_id: z.string().uuid(),
			kind: z.string(),
			extra: z.string(), // Consider parsing as JSON if needed
			created_at: z.string().datetime({ offset: true }),
		}),
	),
	items: z.array(
		z.object({
			id: z.string().uuid(),
			order_id: z.string().uuid(),
			cart_id: z.string().uuid(),
			product_id: z.string().uuid(),
			product_attribute_id: z.string().uuid().nullable(),
			price: z.number(),
			price_updated_at: z.string().datetime({ offset: true }),
			quantity: z.number().int(),
			notes: z.string(),
			created_at: z.string().datetime({ offset: true }),
		}),
	),
});

export const createOrderSchema = z.object({
	locale: z.string(),
	address_id: z.string().nullable(),
	payment: z.object({ provider: z.string() }),
	items: z.array(z.object({ cart_id: z.string() })),
	shipment: z.object({
		service_code: z.string(),
		provider: z.literal("canada-post"),
	}),
});

export const createOrderGuestSchema = z.object({
	api_key: z.string().min(1),
	branch_id: z.string().uuid(),
	locale: z.string().min(1),
	address_id: z.string().uuid().optional(),
	payment: z
		.object({
			provider: z.enum(["stripe", "zaincash", "switchpayment", "pos"]),
			payment_transaction_id: z.string().optional(),
		})
		.refine(
			(data) => {
				// payment_transaction_id is required only for 'pos' provider
				if (data.provider === "pos") {
					return data.payment_transaction_id !== undefined;
				}
				return true;
			},
			{
				message:
					"payment_transaction_id is required when provider is 'pos'",
				path: ["payment_transaction_id"],
			},
		)
		.optional(),
	shipment: z
		.object({
			service_code: z.string(),
		})
		.optional(),
	items: z
		.array(
			z.object({
				cart_id: z.string().uuid(),
			}),
		)
		.min(1, "At least one item is required"),
	customer: z.object({
		firstname: z.string().min(1),
		lastname: z.string().optional(),
		language: z.string().min(1),
		phonenumber: phoneSchema,
		email: z.string().email().optional(),
		gender: z
			.union([z.literal(1), z.literal(2), z.enum(["MALE", "FEMALE"])])
			.optional(),
		date_of_birth: z.string().datetime().optional(),
	}),
	customer_address: z.object({
		title: z.string().optional(),
		country: z.string().optional(),
		state: z.string().optional(),
		city: z.string().optional(),
		address1: z.string().optional(),
		address2: z.string().optional(),
		postal_code: z.string().optional(),
		phonenumber: phoneSchema,
		longitude: z.number(),
		latitude: z.number(),
	}),
});

export const createOrderGuestResponseSchema = z.object({
	branch_order: z
		.object({
			id: z.string(),
			branch_id: z.string(),
			order_id: z.string(),
			approved: z.boolean(),
			driver_id: z.null(),
			created_at: z.string(),
		})
		.optional(),
	order: z.object({
		id: z.string(),
		number: z.string(),
		customer_id: z.string(),
		address_id: z.string(),
		currency: z.string(),
		total_price: z.number(),
		total_paid: z.number(),
		shipment_price: z.number(),
		federal_tax: z.number(),
		province_tax: z.number(),
		created_at: z.string(),
		items_count: z.number(),
		current_step: z.object({
			id: z.string(),
			order_id: z.string(),
			kind: z.string(),
			extra: z.string(),
			created_at: z.string(),
		}),
		logs: z.array(
			z.object({
				id: z.string(),
				order_id: z.string(),
				kind: z.string(),
				extra: z.string(),
				created_at: z.string(),
			}),
		),
		items: z.array(
			z.object({
				id: z.string(),
				order_id: z.string(),
				cart_id: z.string(),
				product_id: z.string(),
				product_attribute_id: z.null(),
				price: z.number(),
				price_updated_at: z.string(),
				quantity: z.number(),
				notes: z.string(),
				created_at: z.string(),
			}),
		),
	}),
	payment: z.null(),
});

export const updateOrderSchema = z.object({
	status: z.number(),
	tax: z.number(),
	discount: z.number(),
	delivery_amount: z.number(),
	final_amount: z.number(),
	payment_method_id: z.string(),
	address_id: z.string().optional(),
	driver_id: z.string().optional(),
});

// Review schemas
export const reviewSchema = z.object({
	product_attribute_id: z.string().nullish(),
	customer_id: z.string(),
	rating: z.number(),
	comment: z.string(),
});

export const queryReviewSchema = z.object({
	items: z.array(
		z.object({
			id: z.string(),
			product_id: z.string(),
			product_attribute_id: z.string().nullable(),
			customer_id: z.string(),
			customer_firstname: z.string().optional(),
			customer_lastname: z.string().optional(),
			is_verified: z.boolean().optional(),
			rating: z.number(),
			comment: z.string(),
			created_at: z.string(),
		}),
	),
	page: z.number(),
	size: z.number(),
	total: z.number(),
});

// Favorites schemas
export const addToFavoritesSchema = z.object({
	product_attribute_id: z.string().nullable(),
});

export const queryFavoritesSchema = z.object({
	items: z.array(
		z.object({
			id: z.string().uuid(),
			title: z.string(),
			customer_id: z.string().uuid(),
			product_id: z.string().uuid(),
			product_attribute_id: z.string().uuid().nullable(),
			product_cover_media_id: z.string().uuid(),
			cover_media_file_id: z.string().uuid(),
			price: z.number(),
			sku: z.string(),
			slug: z.string(),
			out_of_stock: z.boolean(),
			media_id: z.string().uuid(),
			media_content_type: z.literal("image"),
			media_file_id: z.string().uuid(),
			created_at: z.string().datetime({ offset: true }),
		}),
	),
	page: z.number(),
	size: z.number(),
	total: z.number(),
});

// Shipping schemas
export const shippingRatesSchema = z.array(
	z.object({
		name: z.string(),
		code: z.string(),
		delivery: z.object({
			guaranteed_delivery: z.boolean(),
			expected_transit_time: z.number(),
			expected_delivery_date: z.string(),
		}),
		pricing_details: z.object({
			base: z.number(),
			taxes: z.object({
				gst: z.number(),
				pst: z.number(),
				hst: z.number(),
			}),
			due: z.number(),
		}),
	}),
);

export const tenantSchema = z.object({
	address_city: z.string(),
	address_line1: z.string(),
	address_postal_zip_code: z.string(),
	address_prov_state: z.string(),
	company: z.string(),
	contact_phone: z.string(),
	currency: z.string(),
	federal_tax: z.number(),
	mode: z.string(),
	province_tax: z.number(),
	tenant_id: z.string(),
});

export const branchListItemSchema = z.object({
	id: z.string(),
	tenant_id: z.string(),
	name: z.string(),
	created_at: z.string(),
	products: z.any(),
	orders: z.any(),
	drivers: z.any(),
	geozones: z.array(
		z.object({
			id: z.string(),
			branch_id: z.string(),
			name: z.string(),
			polygon: z.array(
				z.object({ latitude: z.number(), longitude: z.number() }),
			),
			delivery_cost: z.string(),
			created_at: z.string(),
		}),
	),
});

export const branchListSchema = z.object({
	items: z.array(branchListItemSchema),
	page: z.number(),
	size: z.number(),
	total: z.number(),
});

export const menuListItemSchema = z.object({
	id: z.string(),
	title: z.string(),
	parent_id: z.string().nullable(),
	image_media_id: z.string().nullable(),
	url: z.string(),
	vorder: z.number().nullable(),
	target: z.string(),
});

export const menuListSchema = z.object({
	items: z.array(menuListItemSchema),
	page: z.number(),
	size: z.number(),
	total: z.number(),
});

// TGS schema
export const tgsGenerateSchema = z.object({ token: z.string() });

// Type exports
export type AddressFormData = z.infer<typeof addressFormSchema>;
export type Address = z.infer<typeof addressSchema>;
export type Product = z.infer<typeof productSchema>;
export type Order = z.infer<typeof getOrderSchema>;
export type Customer = z.infer<typeof customerSchema>;
export type User = z.infer<typeof authUserSchema>;

export type CategoryListItem = z.infer<typeof categoryListItemSchema>;

export type ProductListItem = z.infer<typeof productListItemSchema>;

export type QueryCart = z.infer<typeof queryCartSchema>;
export type UpsertCart = z.infer<typeof upsertCartSchema>;
export type CartListItem = z.infer<typeof cartListItemSchema>;

export type BranchListItem = z.infer<typeof branchListItemSchema>;
export type BranchList = z.infer<typeof branchListSchema>;

export type CreateOrderGuest = z.infer<typeof createOrderGuestSchema>;

export type MenuListItem = z.infer<typeof menuListItemSchema>;
export type MenuList = z.infer<typeof menuListSchema>;

export type Review = z.infer<typeof reviewSchema>;
export type ReviewList = z.infer<typeof queryReviewSchema>;

export type Media = z.infer<typeof mediaSchema>;

export type LoginResponse = z.infer<typeof loginResponseSchema>;

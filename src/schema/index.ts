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

export const brandImageSchema = z
	.union([
		z.string(),
		mediaSchema.extend({
			tenant_id: z.string().optional(),
			created_at: z.string().optional(),
			updated_at: z.string().optional(),
		}),
	])
	.nullable()
	.optional();

const productSupplierLocaleSchema = z.object({
	id: z.string().optional(),
	supplier_id: z.string().optional(),
	lang: z.string().optional(),
	locale: z.string().optional(),
	title: z.string().optional(),
	type: z.string().optional(),
	value: z.string().optional(),
});

const productSupplierSchema = z.union([
	z.string(),
	z.object({
		id: z.string(),
		name: z.string().nullable().optional(),
		title: z.union([z.string(), z.record(z.string(), z.string())]).optional(),
		locales: z.array(productSupplierLocaleSchema).optional().default([]),
	}),
]);

// Type definitions
export type AuthHeaders = {
	authorization: string;
};

// Authentication schemas
export const authUserSchema = z.object({
	id: z.string(),
	name: z.string(),
	username: z.string(),
	firstName: z.string().nullable().default(""),
	lastName: z.string().nullable().default(""),
	email: z.string(),
	createAt: z.string().nullable().optional(),
	enabled: z.boolean(),
	tenant: z.string(),
	tenantLanguages: z.array(z.string()).default([]),
	roles: z.array(z.string()).optional(),
	attributes: z.object({
		permissionId: z.array(z.string()).default([]),
		jobTitle: z.array(z.string()).default([]),
		local: z.array(z.string()).default([]),
		locale: z.array(z.string()).default([]),
		profilePic: z.array(z.string()).default([]),
	}).default({ permissionId: [], jobTitle: [], local: [], locale: [], profilePic: [] }),
});

export const loginResponseSchema = z.object({
	access_token: z.string(),
	refresh_token: z.string(),
	access_token_expiration: z.number(),
	refresh_token_expiration: z.number(),
	user: authUserSchema,
	customer: z.lazy(() => customerSchema).nullish().default(null),
	address: z.lazy(() => addressSchema).nullish(),
});

// Address schemas
export const addressFormSchema = z.object({
	title: z.string().min(1, "Required"),
	country: z.string().optional(),
	state: z.string().min(1, "Required"),
	city: z.string().min(1, "Required"),
	address1: z.string().min(1, "Required"),
	address2: z.string().optional(),
	phonenumber: phoneSchema,
	is_default: z.boolean().optional(),
	postal_code: z.string().optional(),
	longitude: z.number().nullable().optional(),
	latitude: z.number().nullable().optional(),
});

export const addressSchema = z.object({
	id: z.string(),
	title: z.string(),
	country: z.string().optional(),
	state: z.string(),
	city: z.string(),
	address1: z.string(),
	address2: z.string().optional(),
	phonenumber: phoneSchema,
	is_default: z.boolean(),
	postal_code: z.string().optional(),
	longitude: z.number().nullable().optional(),
	latitude: z.number().nullable().optional(),
});

export const createAddressSchema = z.object({
	title: z.string(),
	country: z.string().optional(),
	state: z.string(),
	city: z.string(),
	address1: z.string(),
	address2: z.string().optional(),
	phonenumber: phoneSchema,
	is_default: z.boolean(),
	postal_code: z.string().optional(),
	longitude: z.number().nullable().optional(),
	latitude: z.number().nullable().optional(),
});

export const updateAddressSchema = z.object({
	title: z.string(),
	country: z.string().optional(),
	state: z.string(),
	city: z.string(),
	address1: z.string(),
	address2: z.string().optional(),
	phonenumber: phoneSchema,
	postal_code: z.string().optional(),
	is_default: z.boolean(),
	longitude: z.number().nullable().optional(),
	latitude: z.number().nullable().optional(),
});

// Customer schemas
const nullableLooseStringSchema = z
	.union([z.string(), z.null(), z.undefined()])
	.transform((value) => value ?? "");

const localizedTextValueSchema = z.union([
	z.string(),
	z.record(z.string(), z.string()),
	z.null(),
]);

const boolishValueSchema = z.union([z.boolean(), z.number(), z.string(), z.null()]).optional();

export const customerSchema = z.object({
	id: z.string(),
	external_user_id: nullableLooseStringSchema,
	firstname: nullableLooseStringSchema,
	lastname: nullableLooseStringSchema,
	language: nullableLooseStringSchema,
	phonenumber: nullableLooseStringSchema,
	email: nullableLooseStringSchema,
	gender: z.number().nullish().transform((value) => value ?? 0),
	date_of_birth: z.string().nullable().optional().default(null),
	verified: z.boolean().nullish().transform((value) => value ?? false),
	deleted_at: z.string().nullable().optional(),
	created_at: z.string().optional(),
	tenant_id: z.string().nullable().optional(),
	addresses: z.array(addressSchema).nullish().default([]),
});

export const customerListSchema = z.object({
	items: z.array(customerSchema),
	page: z.number(),
	size: z.number(),
	total: z.number(),
});

export const createCustomerSchema = z.object({
	tenant_id: z.string().optional(),
	external_user_id: z.string(),
	firstname: z.string(),
	lastname: z.string(),
	language: z.string(),
	phonenumber: z.string(),
	email: z.string(),
	gender: z.number(),
	date_of_birth: z.string().datetime().optional(),
});

export const updateCustomerSchema = createCustomerSchema
	.omit({ tenant_id: true })
	.partial();

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
	supplier_id: z.string().nullable().optional(),
	suppliers: z.array(productSupplierSchema).optional().default([]),
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
	supplier_id: z.string().nullable().optional(),
	suppliers: z.array(productSupplierSchema).optional().default([]),
	attributes: z.array(
		z.object({
			id: z.string().optional(),
			product_id: z.string().optional(),
			parent_id: z.string().nullable().optional(),
			media_id: z.string().nullable().optional(),
			type: z.string(),
			extra: z.string().optional(),
			price: z.number().optional(),
			sku: z.string().optional(),
			children: z.array(z.unknown()).optional(),
		}),
	).optional().default([]),
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
	// Provider-agnostic schema - different providers return different fields
	provider_extra_information: z.object({
		id: z.string().optional(),
		payment_id: z.string().optional(),
		url: z.string().optional(),
		// Stripe-specific fields (optional)
		payment_status: z.string().optional(),
		session_status: z.string().optional(),
		session_expires_at: z.number().optional(),
		session_created_at: z.number().optional(),
		// ZainCash-specific fields (optional)
		transaction_status: z.string().optional(),
		created_at: z.string().optional(),
		// SwitchPayment-specific fields (optional)
		result_url: z.string().optional(),
		integrity: z.string().optional(),
		checkout_status: z.string().optional(),
		timestamp: z.string().optional(),
	}).nullable().optional(),
});

export const orderSchema = z.object({
	branch_order: z
		.object({
			id: z.string(),
			branch_id: z.string(),
			order_id: z.string(),
			approved: z.boolean(),
			driver_id: z.string().nullable(),
			created_at: z.string(),
		})
		.optional()
		.nullable(),
	order: z.object({
		id: z.string(),
		number: z.string().optional(),
		customer_id: z.string(),
		address_id: z.string(),
		currency: z.string(),
		total_price: z.number(),
		total_paid: z.number(),
		shipment_price: z.number().optional().default(0),
		federal_tax: z.number().optional().default(0),
		province_tax: z.number().optional().default(0),
		canceled: z.boolean().optional(),
		created_at: z.string(),
		payment_id: z.string().nullable().optional(),
		payment_provider: z.string().nullable().optional(),
		payment_status: z.string().nullable().optional(),
		payment_created_at: z.string().nullable().optional(),
		items_count: z.number().optional(),
		current_step: z.object({
			id: z.string(),
			order_id: z.string(),
			kind: z.string(),
			extra: z.string(),
			created_at: z.string(),
		}).optional(),
		logs: z.array(
			z.object({
				id: z.string(),
				order_id: z.string(),
				kind: z.string(),
				extra: z.string(),
				created_at: z.string(),
			}),
		).optional().default([]),
		items: z.array(orderItemSchema),
	}),
	payment: orderPaymentSchema.nullable().optional(),
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
			payment_id: z.string().nullable().optional(),
			payment_provider: z.string().nullable().optional(),
			payment_status: z.string().nullable().optional(),
			payment_created_at: z.string().nullable().optional(),
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
						cart_id: z.string().nullable(),
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
	shipment_service_code: z.string().nullable().optional(),
	shipment_price: z.number(),
	shipment_status: z.string().nullable().optional(),
	federal_tax: z.number().optional().default(0),
	province_tax: z.number().optional().default(0),
	created_at: z.string().datetime({ offset: true }),
	payment_id: z.string().uuid().nullable().optional(),
	payment_provider: z.string().nullable().optional(),
	payment_status: z.string().nullable().optional(),
	payment_created_at: z.string().datetime({ offset: true }).nullable().optional(),
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
			order_id: z.string(),
			cart_id: z.string().nullable(),
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
	address_id: z.string(),
	payment: z.object({ provider: z.string() }).optional(),
	items: z.array(z.object({ cart_id: z.string() })),
	shipment: z.object({
		service_code: z.string(),
		provider: z.string(),
	}).optional(),
});

// Payment schema for non-POS providers
const nonPosPaymentSchema = z.object({
	provider: z.enum(["stripe", "zaincash", "switchpayment"]),
	payment_transaction_id: z.string().optional(),
});

// Payment schema for POS provider (requires transaction_id)
const posPaymentSchema = z.object({
	provider: z.literal("pos"),
	payment_transaction_id: z.string(),
});

// Union of payment schemas
const guestOrderPaymentSchema = z.union([nonPosPaymentSchema, posPaymentSchema]);

export const createOrderGuestSchema = z.object({
	api_key: z.string().min(1).optional(),
	branch_id: z.string().uuid().optional(), // Optional per Postman API spec
	locale: z.string().min(1),
	address_id: z.string().uuid().optional(),
	payment: guestOrderPaymentSchema.optional(),
	shipment: z
		.object({
			provider: z.string().min(1).optional(),
			service_code: z.string().optional(),
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
		is_default: z.boolean().optional(),
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
			driver_id: z.string().nullable(),
			created_at: z.string(),
		})
		.optional()
		.nullable(),
	order: z.object({
		id: z.string(),
		number: z.string(),
		customer_id: z.string(),
		address_id: z.string(),
		currency: z.string(),
		total_price: z.number(),
		total_paid: z.number(),
		shipment_price: z.number().optional().default(0),
		federal_tax: z.number().optional().default(0),
		province_tax: z.number().optional().default(0),
		created_at: z.string(),
		items_count: z.number().optional(),
		current_step: z.object({
			id: z.string(),
			order_id: z.string(),
			kind: z.string(),
			extra: z.string(),
			created_at: z.string(),
		}).optional(),
		logs: z.array(
			z.object({
				id: z.string(),
				order_id: z.string(),
				kind: z.string(),
				extra: z.string(),
				created_at: z.string(),
			}),
		).optional().default([]),
		items: z.array(
			z.object({
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
			}),
		).optional().default([]),
	}),
	// Payment can be null (COD) or an object with payment details
	payment: z.union([
		z.null(),
		z.object({
			id: z.string(),
			order_id: z.string(),
			status: z.number(),
			provider: z.string(),
			amount: z.number(),
			created_at: z.string(),
			provider_extra_information: z.object({
				id: z.string().optional(),
				payment_id: z.string().optional(),
				url: z.string().optional(),
				result_url: z.string().optional(),
				payment_status: z.string().optional(),
				session_status: z.string().optional(),
				session_expires_at: z.number().optional(),
				session_created_at: z.number().optional(),
				transaction_status: z.string().optional(),
				created_at: z.string().optional(),
				integrity: z.string().optional(),
				checkout_status: z.string().optional(),
				timestamp: z.string().optional(),
			}).nullable().optional(),
		}),
	]).nullable().optional(),
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
	).nullable(),
});

export const branchListSchema = z.object({
	items: z.array(branchListItemSchema),
	page: z.number(),
	size: z.number(),
	total: z.number(),
});

export const brandListItemSchema = z.object({
	id: z.string(),
	tenant_id: z.string().nullable().optional(),
	media_id: z.string().nullable().optional(),
	image: brandImageSchema,
	title: z.string(),
	description: z.string().nullable().optional(),
	deleted: z.boolean().optional(),
	updated_at: z.string().optional(),
	created_at: z.string().optional(),
});

export const brandListSchema = z.object({
	items: z.array(brandListItemSchema),
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

export const loginRequestSchema = z.object({
	email: z.string().email(),
	password: z.string(),
});

export const registerRequestSchema = z.object({
	email: z.string().email(),
	password: z.string(),
	username: z.string(),
	firstName: z.string(),
	lastName: z.string(),
});

// Register now returns the same shape as login (tokens + user + customer)
export const registerResponseSchema = loginResponseSchema;

export type LoginRequest = z.infer<typeof loginRequestSchema>;
export type RegisterRequest = z.infer<typeof registerRequestSchema>;
export type RegisterResponse = z.infer<typeof registerResponseSchema>;

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

export type BrandListItem = z.infer<typeof brandListItemSchema>;
export type BrandList = z.infer<typeof brandListSchema>;

// Supplier schemas
export const supplierLocaleSchema = z.object({
	id: z.string().optional(),
	supplier_id: z.string().optional(),
	lang: z.string().optional(),
	locale: z.string().optional(),
	title: z.string().optional(),
	description: z.string().optional(),
	type: z.string().optional(),
	value: z.string().optional(),
});

export const supplierListItemSchema = z.object({
	id: z.string(),
	tenant_id: z.string().optional(),
	name: z.string().nullable().optional(),
	metadata: z.string().nullable().optional(),
	image: z.string().nullable().optional(),
	deleted_at: z.string().nullable().optional(),
	updated_at: z.string().optional(),
	created_at: z.string().optional(),
	locales: z.array(supplierLocaleSchema).optional().default([]),
});

export const supplierListSchema = z.object({
	items: z.array(supplierListItemSchema),
	page: z.number(),
	size: z.number(),
	total: z.number(),
});

export type SupplierLocale = z.infer<typeof supplierLocaleSchema>;
export type SupplierListItem = z.infer<typeof supplierListItemSchema>;
export type SupplierList = z.infer<typeof supplierListSchema>;

// Testimonial schemas
export const testimonialItemSchema = z.object({
	id: z.string(),
	tenant_id: z.string(),
	name: localizedTextValueSchema.optional(),
	position: localizedTextValueSchema.optional(),
	business_logo_media_id: z.string().nullable().optional(),
	testimonial: localizedTextValueSchema.optional(),
	enabled: boolishValueSchema,
	deleted_at: z.string().nullable().optional(),
	updated_at: z.string().optional(),
	created_at: z.string().optional(),
});

export const testimonialListSchema = z.object({
	items: z.array(testimonialItemSchema),
	page: z.number(),
	size: z.number(),
	total: z.number(),
});

export type TestimonialItem = z.infer<typeof testimonialItemSchema>;
export type TestimonialList = z.infer<typeof testimonialListSchema>;

// Static Data schemas
export const staticDataItemSchema = z.object({
	id: z.string(),
	tenant_id: z.string(),
	title: z.string().nullable(),
	image: z.string().nullable().optional(),
	localized_url: z.string().nullable().optional(),
	enabled: z.boolean(),
	deleted_at: z.string().nullable().optional(),
	updated_at: z.string().optional(),
	created_at: z.string().optional(),
});

export const staticDataListSchema = z.object({
	items: z.array(staticDataItemSchema),
	page: z.number(),
	size: z.number(),
	total: z.number(),
});

export type StaticDataItem = z.infer<typeof staticDataItemSchema>;
export type StaticDataList = z.infer<typeof staticDataListSchema>;

// Contact Us schemas
export const contactUsItemSchema = z.object({
	id: z.string(),
	tenant_id: z.string(),
	message: z.string(),
	name: z.string(),
	phone: z.string(),
	email: z.string(),
	external_user_id: z.string().nullable().optional(),
	latest_visited_pages: z.array(z.string()).nullable().optional(),
	deleted_at: z.string().nullable().optional(),
	updated_at: z.string().optional(),
	created_at: z.string().optional(),
});

export const contactUsListSchema = z.object({
	items: z.array(contactUsItemSchema),
	page: z.number(),
	size: z.number(),
	total: z.number(),
});

export const createContactUsSchema = z.object({
	message: z.string(),
	name: z.string(),
	phone: z.string(),
	email: z.string(),
	latest_visited_pages: z.array(z.string()).optional(),
});

export type ContactUsItem = z.infer<typeof contactUsItemSchema>;
export type ContactUsList = z.infer<typeof contactUsListSchema>;
export type CreateContactUs = z.infer<typeof createContactUsSchema>;

// Post Comment schemas (defined before Post since Post references comments)
export const postCommentItemSchema: z.ZodType = z.lazy(() =>
	z.object({
		id: z.string(),
		tenant_id: z.string(),
		message: z.string(),
		post_id: z.string(),
		replied_to: z.string().nullable(),
		replies: z.array(postCommentItemSchema).nullable().optional(),
		language: z.string().nullable().optional(),
		external_user_id: z.string().nullable().optional(),
		deleted_at: z.string().nullable().optional(),
		updated_at: z.string().optional(),
		created_at: z.string().optional(),
	}),
);

export const postCommentListSchema = z.object({
	items: z.array(
		z.object({
			id: z.string(),
			tenant_id: z.string(),
			message: z.string(),
			post_id: z.string(),
			replied_to: z.string().nullable(),
			replies: z.unknown().nullable().optional(),
			language: z.string().nullable().optional(),
			external_user_id: z.string().nullable().optional(),
			deleted_at: z.string().nullable().optional(),
			updated_at: z.string().optional(),
			created_at: z.string().optional(),
		}),
	),
	page: z.number(),
	size: z.number(),
	total: z.number(),
});

export const createPostCommentSchema = z.object({
	post_id: z.string(),
	replied_to: z.string().nullable().optional(),
	language: z.string(),
	message: z.string(),
});

export type PostCommentItem = z.infer<typeof postCommentItemSchema>;
export type PostCommentList = z.infer<typeof postCommentListSchema>;
export type CreatePostComment = z.infer<typeof createPostCommentSchema>;

// Post Tag schemas
export const postTagItemSchema = z.object({
	id: z.string(),
	tenant_id: z.string(),
	title: z.string().nullable(),
	enabled: z.boolean(),
	external_user_id: z.string().nullable().optional(),
	deleted_at: z.string().nullable().optional(),
	updated_at: z.string().optional(),
	created_at: z.string().optional(),
	posts: z
		.array(
			z.object({
				id: z.string(),
				tenant_id: z.string(),
				image: z.string().nullable().optional(),
				title: z.string().nullable(),
				description: z.string().nullable().optional(),
				enabled: z.boolean(),
				external_user_id: z.string().nullable().optional(),
				deleted_at: z.string().nullable().optional(),
				updated_at: z.string().optional(),
				created_at: z.string().optional(),
				comments: z.unknown().nullable().optional(),
				tags: z.unknown().nullable().optional(),
				categories: z.unknown().nullable().optional(),
			}),
		)
		.nullable()
		.optional(),
});

export const postTagListSchema = z.object({
	items: z.array(
		z.object({
			id: z.string(),
			tenant_id: z.string(),
			title: z.string().nullable(),
			enabled: z.boolean(),
			external_user_id: z.string().nullable().optional(),
			deleted_at: z.string().nullable().optional(),
			updated_at: z.string().optional(),
			created_at: z.string().optional(),
			posts: z.unknown().nullable().optional(),
		}),
	),
	page: z.number(),
	size: z.number(),
	total: z.number(),
});

export type PostTagItem = z.infer<typeof postTagItemSchema>;
export type PostTagList = z.infer<typeof postTagListSchema>;

// Post Category schemas
export const postCategoryItemSchema = z.object({
	id: z.string(),
	tenant_id: z.string(),
	image: z.string().nullable().optional(),
	title: localizedTextValueSchema.optional(),
	enabled: boolishValueSchema,
	external_user_id: z.string().nullable().optional(),
	deleted_at: z.string().nullable().optional(),
	updated_at: z.string().optional(),
	created_at: z.string().optional(),
	posts: z
		.array(
			z.object({
				id: z.string(),
				tenant_id: z.string(),
				image: z.string().nullable().optional(),
				title: localizedTextValueSchema.optional(),
				description: localizedTextValueSchema.optional(),
				enabled: boolishValueSchema,
				external_user_id: z.string().nullable().optional(),
				deleted_at: z.string().nullable().optional(),
				updated_at: z.string().optional(),
				created_at: z.string().optional(),
				comments: z.unknown().nullable().optional(),
				tags: z.unknown().nullable().optional(),
				categories: z.unknown().nullable().optional(),
			}),
		)
		.nullable()
		.optional(),
});

export const postCategoryListSchema = z.object({
	items: z.array(
		z.object({
			id: z.string(),
			tenant_id: z.string(),
			image: z.string().nullable().optional(),
			title: localizedTextValueSchema.optional(),
			enabled: boolishValueSchema,
			external_user_id: z.string().nullable().optional(),
			deleted_at: z.string().nullable().optional(),
			updated_at: z.string().optional(),
			created_at: z.string().optional(),
			posts: z.unknown().nullable().optional(),
		}),
	),
	page: z.number(),
	size: z.number(),
	total: z.number(),
});

export type PostCategoryItem = z.infer<typeof postCategoryItemSchema>;
export type PostCategoryList = z.infer<typeof postCategoryListSchema>;

// Post schemas
export const postItemSchema = z.object({
	id: z.string(),
	tenant_id: z.string(),
	image: z.string().nullable().optional(),
	title: localizedTextValueSchema.optional(),
	description: localizedTextValueSchema.optional(),
	enabled: boolishValueSchema,
	external_user_id: z.string().nullable().optional(),
	deleted_at: z.string().nullable().optional(),
	updated_at: z.string().optional(),
	created_at: z.string().optional(),
	comments: z
		.array(
			z.object({
				id: z.string(),
				tenant_id: z.string(),
				message: z.string(),
				post_id: z.string(),
				replied_to: z.string().nullable(),
				replies: z
					.array(
						z.object({
							id: z.string(),
							tenant_id: z.string(),
							message: z.string(),
							post_id: z.string(),
							replied_to: z.string().nullable(),
							replies: z.unknown().nullable().optional(),
							language: z.string().nullable().optional(),
							external_user_id: z.string().nullable().optional(),
							deleted_at: z.string().nullable().optional(),
							updated_at: z.string().optional(),
							created_at: z.string().optional(),
						}),
					)
					.nullable()
					.optional(),
				language: z.string().nullable().optional(),
				external_user_id: z.string().nullable().optional(),
				deleted_at: z.string().nullable().optional(),
				updated_at: z.string().optional(),
				created_at: z.string().optional(),
			}),
		)
		.nullable()
		.optional(),
	tags: z
		.array(
			z.object({
				id: z.string(),
				tenant_id: z.string(),
				title: localizedTextValueSchema.optional(),
				enabled: boolishValueSchema,
				external_user_id: z.string().nullable().optional(),
				deleted_at: z.string().nullable().optional(),
				updated_at: z.string().optional(),
				created_at: z.string().optional(),
				posts: z.unknown().nullable().optional(),
			}),
		)
		.nullable()
		.optional(),
	categories: z
		.array(
			z.object({
				id: z.string(),
				tenant_id: z.string(),
				image: z.string().nullable().optional(),
				title: localizedTextValueSchema.optional(),
				enabled: boolishValueSchema,
				external_user_id: z.string().nullable().optional(),
				deleted_at: z.string().nullable().optional(),
				updated_at: z.string().optional(),
				created_at: z.string().optional(),
				posts: z.unknown().nullable().optional(),
			}),
		)
		.nullable()
		.optional(),
});

export const postListSchema = z.object({
	items: z.array(
		z.object({
			id: z.string(),
			tenant_id: z.string(),
			image: z.string().nullable().optional(),
			title: localizedTextValueSchema.optional(),
			description: localizedTextValueSchema.optional(),
			enabled: boolishValueSchema,
			external_user_id: z.string().nullable().optional(),
			deleted_at: z.string().nullable().optional(),
			updated_at: z.string().optional(),
			created_at: z.string().optional(),
			comments: z.unknown().nullable().optional(),
			tags: z.unknown().nullable().optional(),
			categories: z.unknown().nullable().optional(),
		}),
	),
	page: z.number(),
	size: z.number(),
	total: z.number(),
});

export type PostItem = z.infer<typeof postItemSchema>;
export type PostList = z.infer<typeof postListSchema>;

// Offer schemas
export const offerItemSchema = z.object({
	id: z.string(),
	tenant_id: z.string(),
	vendor_id: z.string().nullable().optional(),
	status: z.string(),
	unique_name: z.string().nullable().optional(),
	name: z.string().nullable().optional(),
	description: z.string().nullable().optional(),
	conditions: z.unknown().nullable().optional(),
	actions: z.unknown().nullable().optional(),
	is_stackable: z.boolean(),
	created_by_id: z.string().nullable().optional(),
	started_at: z.string().nullable().optional(),
	ended_at: z.string().nullable().optional(),
	deleted_at: z.string().nullable().optional(),
	updated_at: z.string().optional(),
	created_at: z.string().optional(),
});

export const offerListSchema = z.object({
	items: z.array(offerItemSchema),
	page: z.number(),
	size: z.number(),
	total: z.number(),
});

export const offerActionArgumentSchema = z.object({
	name: z.string(),
	required: z.boolean(),
	type: z.string(),
});

export const offerActionSchema = z.object({
	unique_name: z.string(),
	arguments: z.array(offerActionArgumentSchema),
});

export const offerActionsSchema = z.array(offerActionSchema);

export const offerConditionArgumentSchema = z.object({
	name: z.string(),
	required: z.boolean(),
	type: z.string(),
});

export const offerConditionSchema = z.object({
	unique_name: z.string(),
	arguments: z.array(offerConditionArgumentSchema),
});

export const offerConditionsSchema = z.array(offerConditionSchema);

export type OfferItem = z.infer<typeof offerItemSchema>;
export type OfferList = z.infer<typeof offerListSchema>;
export type OfferAction = z.infer<typeof offerActionSchema>;
export type OfferCondition = z.infer<typeof offerConditionSchema>;

// ─── Offer Admin schemas ──────────────────────────────────────────────────────
const offerTextMutationFieldSchema = z.preprocess((value) => {
	if (typeof value === "string") {
		const trimmed = value.trim();
		return trimmed.length > 0 ? trimmed : undefined;
	}

	if (value && typeof value === "object" && !Array.isArray(value)) {
		const firstValue = Object.values(value as Record<string, unknown>).find(
			(entry) => typeof entry === "string" && entry.trim().length > 0,
		);
		return typeof firstValue === "string" ? firstValue.trim() : undefined;
	}

	return value;
}, z.string().optional());

const offerRulesMutationFieldSchema = z.preprocess((value) => {
	if (typeof value === "string") {
		const trimmed = value.trim();
		return trimmed.length > 0 ? trimmed : undefined;
	}

	if (Array.isArray(value)) {
		return value.length > 0 ? JSON.stringify(value) : undefined;
	}

	return value;
}, z.string().optional());

export const createOfferSchema = z.object({
	title: z.union([z.string(), z.record(z.string(), z.string())]).optional(),
	description: offerTextMutationFieldSchema,
	conditions: offerRulesMutationFieldSchema,
	actions: offerRulesMutationFieldSchema,
	status: z.string().optional(),
	start_at: z.string().optional(),
	end_at: z.string().optional(),
	// Postman fields
	vendor_id: z.string().optional(),
	unique_name: z.string().optional(),
	name: z.string().optional(),
	is_stackable: z.boolean().optional(),
	started_at: z.string().optional(),
	ended_at: z.string().optional(),
});

export const updateOfferSchema = createOfferSchema.partial();

export type CreateOffer = z.infer<typeof createOfferSchema>;
export type UpdateOffer = z.infer<typeof updateOfferSchema>;

// ─── Order Admin schemas ──────────────────────────────────────────────────────
export const adminUpdateOrderSchema = z.object({
	customer_id: z.string().optional(),
	address_id: z.string().optional(),
	shipment_service_code: z.string().optional(),
	shipment_status: z.string().optional(),
	shipment_price: z.number().optional(),
	shipment_id: z.string().optional(),
	shipment_tracking_code: z.string().optional(),
	federal_tax: z.number().optional(),
	province_tax: z.number().optional(),
});

export const adminOrderListSchema = z.object({
	items: z.array(
		z.object({
			id: z.string(),
			number: z.string().optional(),
			customer_id: z.string(),
			currency: z.string(),
			total_price: z.number(),
			total_paid: z.number(),
			canceled: z.boolean().optional(),
			created_at: z.string(),
			payment_id: z.string().nullable().optional(),
			payment_provider: z.string().nullable().optional(),
			payment_status: z.string().nullable().optional(),
			payment_created_at: z.string().nullable().optional(),
			items_count: z.number().optional(),
			shipment_status: z.string().nullable().optional(),
			customer: z.object({
				id: z.string(),
				firstname: z.string().optional(),
				lastname: z.string().optional(),
				email: z.string().optional(),
			}).nullable().optional(),
			address: z.object({
				id: z.string(),
				city: z.string().optional(),
				country: z.string().optional(),
			}).passthrough().nullable().optional(),
			current_step: z.object({
				id: z.string(),
				order_id: z.string(),
				kind: z.string(),
				extra: z.string(),
				created_at: z.string(),
			}).optional(),
		}),
	),
	page: z.number(),
	size: z.number(),
	total: z.number(),
});

export const orderItemUpdateSchema = z.object({
	price: z.number().optional(),
	quantity: z.number().optional(),
	notes: z.string().optional(),
});

export const orderMetricsSchema = z.object({
	series: z.array(
		z.object({
			date: z.string(),
			value: z.number(),
		}),
	).optional().default([]),
});

export const orderStatisticsSchema = z.object({
	total_orders: z.number().optional(),
	total_revenue: z.number().optional(),
	average_order_value: z.number().optional(),
}).passthrough();

export type AdminUpdateOrder = z.infer<typeof adminUpdateOrderSchema>;
export type AdminOrderList = z.infer<typeof adminOrderListSchema>;
export type OrderItemUpdate = z.infer<typeof orderItemUpdateSchema>;

// ─── Product Admin schemas ────────────────────────────────────────────────────
export const createProductSchema = z.object({
	cover_media_id: z.string().optional(),
	title: z.record(z.string(), z.string()),
	description: z.record(z.string(), z.string()).optional(),
	short_description: z.record(z.string(), z.string()).optional(),
	price: z.number(),
	sku: z.string(),
	slug: z.string().optional(),
	currency: z.string().optional(),
	unit: z.string().optional(),
	weight: z.number().optional(),
	is_taxable: z.boolean().optional(),
	attributes: z.array(z.unknown()).optional(),
	media: z.array(z.string()).optional(),
	brands: z.array(z.string()).optional(),
	categories: z.array(z.string()).optional(),
	supplier_id: z.string().nullable().optional(),
	supplier_ids: z.array(z.string()).optional(),
	suppliers: z.array(z.string()).optional(),
});

export const updateProductSchema = createProductSchema.partial();

export const productMetricsSchema = z.object({
	series: z.array(
		z.object({
			date: z.string(),
			value: z.number(),
		}),
	).optional().default([]),
});

export type CreateProduct = z.infer<typeof createProductSchema>;
export type UpdateProduct = z.infer<typeof updateProductSchema>;

// ─── Branch Admin schemas ─────────────────────────────────────────────────────
export const polygonPointSchema = z.object({
	latitude: z.number(),
	longitude: z.number(),
});

const geoZoneDeliveryCostSchema = z
	.union([z.string(), z.number()])
	.transform((value) =>
		typeof value === "number" ? String(value) : value.trim(),
	)
	.refine((value) => value.length > 0, {
		message: "Delivery cost is required",
	});

export const geoZoneInputSchema = z.object({
	name: z.string(),
	delivery_cost: geoZoneDeliveryCostSchema,
	polygon: z.array(polygonPointSchema),
});

export const driverInputSchema = z.object({
	name: z.string(),
});

export const createBranchSchema = z.object({
	name: z.string(),
	geozones: z.array(geoZoneInputSchema).optional(),
	drivers: z.array(driverInputSchema).optional(),
});

export const updateBranchSchema = z.object({
	name: z.string().optional(),
});

export const branchItemSchema = branchListItemSchema;

export const branchOrderListSchema = z.object({
	items: z.array(z.unknown()),
	page: z.number(),
	size: z.number(),
	total: z.number(),
});

export type PolygonPoint = z.infer<typeof polygonPointSchema>;
export type GeoZoneInput = z.input<typeof geoZoneInputSchema>;
export type DriverInput = z.infer<typeof driverInputSchema>;
export type CreateBranch = z.input<typeof createBranchSchema>;
export type UpdateBranch = z.infer<typeof updateBranchSchema>;

// ─── Brand Admin schemas ──────────────────────────────────────────────────────
export const createBrandSchema = z.object({
	name: z.string(),
	image: z.string().optional(),
	media_id: z.string().optional(),
	title: z.record(z.string(), z.string()).optional(),
	description: z.record(z.string(), z.string()).optional(),
});

export const updateBrandSchema = z.object({
	name: z.string().optional(),
	image: z.string().optional(),
	title: z.record(z.string(), z.string()).optional(),
	description: z.record(z.string(), z.string()).optional(),
	media_id: z.string().optional(),
	deleted: z.boolean().optional(),
});

export type CreateBrand = z.infer<typeof createBrandSchema>;
export type UpdateBrand = z.infer<typeof updateBrandSchema>;

// ─── Category Admin schemas ───────────────────────────────────────────────────
export const createCategorySchema = z.object({
	parent_id: z.string().optional(),
	media_id: z.string().optional(),
	title: z.record(z.string(), z.string()),
});

export const updateCategorySchema = z.object({
	parent_id: z.string().optional(),
	media_id: z.string().optional(),
	deleted: z.boolean().optional(),
	title: z.record(z.string(), z.string()).optional(),
});

export type CreateCategory = z.infer<typeof createCategorySchema>;
export type UpdateCategory = z.infer<typeof updateCategorySchema>;

export const adminCategoryItemSchema = z.object({
	id: z.string(),
	parent_id: z.string().nullable().optional(),
	media_id: z.string().nullable().optional(),
	title: z.record(z.string(), z.string()),
	products: z.number().optional(),
	children: z.array(z.unknown()).optional(),
});

export type AdminCategoryItem = z.infer<typeof adminCategoryItemSchema>;

// ─── Supplier Admin schemas ───────────────────────────────────────────────────
export const createSupplierSchema = z.object({
	name: z.string(),
	metadata: z.string().optional(),
	image: z.string().optional(),
});

export const updateSupplierSchema = z.object({
	metadata: z.string().optional(),
	image: z.string().optional(),
	name: z.string().optional(),
});

export const supplierItemSchema = supplierListItemSchema;

export const createSupplierLocaleSchema = z.object({
	supplier_id: z.string(),
	locale: z.string(),
	type: z.string(),
	value: z.string(),
});

export const updateSupplierLocaleSchema = z.object({
	locale: z.string().optional(),
	type: z.string().optional(),
	value: z.string().optional(),
});

export const supplierLocaleItemSchema = z.object({
	id: z.string(),
	supplier_id: z.string().optional(),
	locale: z.string().optional(),
	type: z.string().optional(),
	value: z.string().optional(),
	created_at: z.string().optional(),
	updated_at: z.string().optional(),
});

export const supplierLocaleListSchema = z.object({
	items: z.array(supplierLocaleItemSchema),
	page: z.number(),
	size: z.number(),
	total: z.number(),
});

export type CreateSupplier = z.infer<typeof createSupplierSchema>;
export type UpdateSupplier = z.infer<typeof updateSupplierSchema>;
export type CreateSupplierLocale = z.infer<typeof createSupplierLocaleSchema>;
export type UpdateSupplierLocale = z.infer<typeof updateSupplierLocaleSchema>;
export type SupplierLocaleItem = z.infer<typeof supplierLocaleItemSchema>;

// ─── Menu Admin schemas ───────────────────────────────────────────────────────
export const createMenuSchema = z.object({
	title: z.record(z.string(), z.string()),
	parent_id: z.string().optional(),
	image_media_id: z.string().optional(),
	url: z.string().optional(),
	target: z.string().optional(),
	vorder: z.number().optional(),
});

export const updateMenuSchema = z.object({
	parent_id: z.string().optional(),
	image_media_id: z.string().optional(),
	url: z.string().optional(),
	target: z.string().optional(),
	title: z.record(z.string(), z.string()).optional(),
});

export const menuItemSchema = menuListItemSchema;

export type CreateMenu = z.infer<typeof createMenuSchema>;
export type UpdateMenu = z.infer<typeof updateMenuSchema>;

// ─── Post Admin schemas ───────────────────────────────────────────────────────
export const createPostSchema = z.object({
	title: z.record(z.string(), z.string()),
	description: z.record(z.string(), z.string()).optional(),
	content: z.record(z.string(), z.string()).optional(),
	tag_ids: z.array(z.string()).optional(),
	category_ids: z.array(z.string()).optional(),
	media_id: z.string().optional(),
	enabled: z.boolean().optional(),
	status: z.string().optional(),
	published_at: z.string().optional(),
});

export const updatePostSchema = createPostSchema.partial();

export type CreatePost = z.infer<typeof createPostSchema>;
export type UpdatePost = z.infer<typeof updatePostSchema>;

// ─── Post Tag Admin schemas ───────────────────────────────────────────────────
export const createPostTagSchema = z.object({
	name: z.record(z.string(), z.string()),
	title: z.string().optional(),
	enabled: z.boolean().optional(),
});

export const updatePostTagSchema = createPostTagSchema.partial();

export type CreatePostTag = z.infer<typeof createPostTagSchema>;
export type UpdatePostTag = z.infer<typeof updatePostTagSchema>;

// ─── Post Category Admin schemas ──────────────────────────────────────────────
export const createPostCategorySchema = z.object({
	title: z.record(z.string(), z.string()),
	image: z.string().optional(),
	enabled: z.boolean().optional(),
});

export const updatePostCategorySchema = createPostCategorySchema.partial();

export type CreatePostCategory = z.infer<typeof createPostCategorySchema>;
export type UpdatePostCategory = z.infer<typeof updatePostCategorySchema>;

// ─── Post Comment Admin schemas ───────────────────────────────────────────────
export const updatePostCommentSchema = z.object({
	message: z.string().optional(),
	post_id: z.string().optional(),
	replied_to: z.string().optional(),
});

export type UpdatePostComment = z.infer<typeof updatePostCommentSchema>;

// ─── Static Data Admin schemas ────────────────────────────────────────────────
export const createStaticDataSchema = z.object({
	title: z.string().optional(),
	image: z.string().optional(),
	localized_url: z.string().optional(),
	enabled: z.boolean().optional(),
});

export const updateStaticDataSchema = createStaticDataSchema.partial();

export type CreateStaticData = z.infer<typeof createStaticDataSchema>;
export type UpdateStaticData = z.infer<typeof updateStaticDataSchema>;

// ─── Testimonial Admin schemas ────────────────────────────────────────────────
export const createTestimonialSchema = z.object({
	name: z.record(z.string(), z.string()),
	position: z.record(z.string(), z.string()),
	business_logo_media_id: z.string().min(1),
	testimonial: z.record(z.string(), z.string()),
	enabled: z.boolean().optional(),
});

export const updateTestimonialSchema = createTestimonialSchema.partial();

export type CreateTestimonial = z.infer<typeof createTestimonialSchema>;
export type UpdateTestimonial = z.infer<typeof updateTestimonialSchema>;

// ─── Contact Us Admin schemas ─────────────────────────────────────────────────
export const updateContactUsSchema = z.object({
	message: z.string().optional(),
	name: z.string().optional(),
	phone: z.string().optional(),
	email: z.string().optional(),
});

export type UpdateContactUs = z.infer<typeof updateContactUsSchema>;

// ─── Tenant Admin schemas ─────────────────────────────────────────────────────
export const updateFrontendMetadataSchema = z.object({
	frontend_metadata_template: z.unknown(),
});

export type UpdateFrontendMetadata = z.infer<typeof updateFrontendMetadataSchema>;

// ─── Media schemas ────────────────────────────────────────────────────────────
export const mediaItemSchema = z.object({
	id: z.string(),
	content_type: z.string(),
	file_id: z.string(),
	alt: z.string(),
	tenant_id: z.string().optional(),
	created_at: z.string().optional(),
	updated_at: z.string().optional(),
});

export const mediaListSchema = z.object({
	items: z.array(mediaItemSchema),
	page: z.number(),
	size: z.number(),
	total: z.number(),
});

export const createMediaSchema = z.object({
	content_type: z.string(),
	file_id: z.string(),
	alt: z.string(),
});

export const updateMediaSchema = z.object({
	alt: z.string().optional(),
	file_id: z.string().optional(),
});

export const batchDeleteMediaSchema = z.object({
	id: z.array(z.string()),
});

export type MediaItem = z.infer<typeof mediaItemSchema>;
export type MediaList = z.infer<typeof mediaListSchema>;
export type CreateMedia = z.infer<typeof createMediaSchema>;
export type UpdateMedia = z.infer<typeof updateMediaSchema>;

// Multi-language admin product schema (GET /admin/product/:id)
export const adminProductSchema = z.object({
	id: z.string(),
	cover_media_id: z.string().optional(),
	title: z.record(z.string(), z.string()),
	description: z.record(z.string(), z.string()).optional(),
	short_description: z.record(z.string(), z.string()).optional(),
	price: z.number(),
	sku: z.string(),
	slug: z.string().optional(),
	is_taxable: z.boolean().nullable().optional(),
	currency: z.string(),
	weight: z.number().optional(),
	unit: z.string().optional(),
	disable: z.boolean().optional(),
	out_of_stock: z.boolean(),
	reviews_count: z.number().optional(),
	rating: z.number().optional(),
	attributes: z.array(
		z.object({
			id: z.string().optional(),
			type: z.string(),
			extra: z.string().optional(),
			price: z.number().optional(),
			sku: z.string().optional(),
			children: z.array(z.unknown()).optional(),
		}),
	).optional().default([]),
	media: z.array(mediaItemSchema).nullish().default([]),
	brands: z.array(
		z.object({
			id: z.string(),
			title: z.record(z.string(), z.string()).optional(),
			description: z.record(z.string(), z.string()).optional(),
		}),
	).optional().default([]),
	categories: z.array(
		z.object({
			id: z.string(),
			parent_id: z.string().nullable().optional(),
			media_id: z.string().nullable().optional(),
			title: z.record(z.string(), z.string()).optional(),
			products: z.number().optional(),
			children: z.array(z.unknown()).optional(),
		}),
	).optional().default([]),
	supplier_id: z.string().nullable().optional(),
	suppliers: z.array(productSupplierSchema).optional().default([]),
});

export type AdminProduct = z.infer<typeof adminProductSchema>;

// ─── Coupon schemas ───────────────────────────────────────────────────────────
export const couponItemSchema = z.object({
	id: z.string(),
	code: z.string(),
	vendor_id: z.string().nullable().optional(),
	name: z.string().nullable().optional(),
	description: z.string().nullable().optional(),
	discount_type: z.string().nullable().optional(),
	discount_value: z.number().nullable().optional(),
	target_type: z.string().nullable().optional(),
	target_ids: z.union([z.array(z.string()), z.string(), z.null()]).optional(),
	conditions: z.unknown().nullable().optional(),
	max_discount_amount: z.number().nullable().optional(),
	min_order_value: z.number().nullable().optional(),
	start_at: z.string().nullable().optional(),
	end_at: z.string().nullable().optional(),
	usage_limit_per_customer: z.number().nullable().optional(),
	usage_limit_global: z.number().nullable().optional(),
	is_stackable: z.boolean().optional(),
	status: z.string().nullable().optional(),
	tenant_id: z.string().optional(),
	deleted_at: z.string().nullable().optional(),
	created_at: z.string().optional(),
	updated_at: z.string().optional(),
});

export const couponListSchema = z.object({
	items: z.array(couponItemSchema),
	page: z.number(),
	size: z.number(),
	total: z.number(),
});

export const createCouponSchema = z.object({
	code: z.string(),
	vendor_id: z.string().optional(),
	name: z.string().optional(),
	description: z.string().optional(),
	discount_type: z.string().optional(),
	discount_value: z.number().optional(),
	target_type: z.string().optional(),
	target_ids: z.array(z.string()).optional(),
	conditions: z.unknown().optional(),
	max_discount_amount: z.number().optional(),
	min_order_value: z.number().optional(),
	start_at: z.string().optional(),
	end_at: z.string().optional(),
	usage_limit_per_customer: z.number().optional(),
	usage_limit_global: z.number().optional(),
	is_stackable: z.boolean().optional(),
	status: z.string().optional(),
});

export const updateCouponSchema = createCouponSchema.partial();

export type CouponItem = z.infer<typeof couponItemSchema>;
export type CouponList = z.infer<typeof couponListSchema>;
export type CreateCoupon = z.infer<typeof createCouponSchema>;
export type UpdateCoupon = z.infer<typeof updateCouponSchema>;

// ─── Placeholder schemas ──────────────────────────────────────────────────────
export const placeholderItemSchema = z.object({
	id: z.string(),
	parent_id: z.string().nullable().optional(),
	media_id: z.string().nullable().optional(),
	title: z.string().nullable().optional(),
	description: z.string().nullable().optional(),
	tenant_id: z.string().optional(),
	deleted_at: z.string().nullable().optional(),
	created_at: z.string().optional(),
	updated_at: z.string().optional(),
});

export const adminPlaceholderItemSchema = z.object({
	id: z.string(),
	parent_id: z.string().nullable().optional(),
	media_id: z.string().nullable().optional(),
	title: z.record(z.string(), z.string()).optional().default({}),
	description: z.record(z.string(), z.string()).optional().default({}),
	tenant_id: z.string().optional(),
	deleted_at: z.string().nullable().optional(),
	created_at: z.string().optional(),
	updated_at: z.string().optional(),
});

export const placeholderListSchema = z.object({
	items: z.array(placeholderItemSchema),
	page: z.number(),
	size: z.number(),
	total: z.number(),
});

export const createPlaceholderSchema = z.object({
	parent_id: z.string().optional(),
	media_id: z.string().optional(),
	title: z.record(z.string(), z.string()).optional(),
	description: z.record(z.string(), z.string()).optional(),
});

export const updatePlaceholderSchema = createPlaceholderSchema.partial();

export type PlaceholderItem = z.infer<typeof placeholderItemSchema>;
export type AdminPlaceholderItem = z.infer<typeof adminPlaceholderItemSchema>;
export type PlaceholderList = z.infer<typeof placeholderListSchema>;
export type CreatePlaceholder = z.infer<typeof createPlaceholderSchema>;
export type UpdatePlaceholder = z.infer<typeof updatePlaceholderSchema>;

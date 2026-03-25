import { z } from "zod";
import {
	adminOrderListSchema,
	adminUpdateOrderSchema,
	createOrderGuestResponseSchema,
	createOrderGuestSchema,
	createOrderSchema,
	getOrderSchema,
	orderItemUpdateSchema,
	orderListSchema,
	orderMetricsSchema,
	orderSchema,
	orderStatisticsSchema,
	shippingRatesSchema,
	updateOrderSchema,
} from "../schema";
import { BaseClient } from "../client/base-client";
import { objectToURLSearchParams } from "../utils";

type AdminOrderShipmentStatus = "pending" | "shipped" | "delivered" | "returned" | "failed";
type AdminOrderPaymentStatus = -1 | 0 | 1 | 2 | 3 | 4;
type AdminOrderCurrentStepKind =
	| "order.accepted"
	| "order.canceled"
	| "payment.failed"
	| "payment.pending"
	| "payment.partial_paid"
	| "payment.paid"
	| "payment.overpaid"
	| "shipment.created"
	| "shipment.failed"
	| "branch.approved";

type OrderSortDirection = "asc" | "desc";

type OrderListQuery = {
	status?: number;
	payment_status?: number;
	page?: number;
	size?: number;
	locale?: string;
	sort_by?: string;
	order_by?: OrderSortDirection;
};

type AdminOrderQuery = {
	status?: AdminOrderPaymentStatus;
	payment_status?: AdminOrderPaymentStatus;
	page?: number;
	size?: number;
	number?: string;
	customer_id?: string;
	address_id?: string;
	total_price?: number;
	created_at?: string;
	start?: string;
	end?: string;
	shipment_status?: AdminOrderShipmentStatus;
	payment_id?: string;
	payment_provider?: string;
	payment_created_at?: string;
	canceled?: boolean;
	current_step_kind?: AdminOrderCurrentStepKind;
	kind?: AdminOrderCurrentStepKind;
	sort_by?: string;
	order_by?: OrderSortDirection;
};

export class Order extends BaseClient {
	private withTenantQuery(
		endpoint: string,
		query: Record<string, string | number | boolean | null | undefined> = {},
	) {
		const params = objectToURLSearchParams({
			tenant: this.tenant || undefined,
			...query,
		});
		return params ? `${endpoint}?${params}` : endpoint;
	}

	async getShippingRates({
		body,
	}: {
		body: {
			postal_code: string;
			country_code: string;
		};
	}) {
		const url = "/shipping/canada-post/rs/ship/price";
		// Checkout reaches shipping-rate selection after the shopper is authenticated.
		const result = await this.request(url, {
			method: "POST",
			body: {
				destination: {
					...body,
				},
				dimensions_cm: {
					// optional
					length: 1.1,
					width: 1.1,
					height: 1.1,
				},
				weight_kg: 1.1,
			},
		}).then((r) => r.json());

		if (result.error) {
			throw new Error(result.error);
		}
		const parsed = shippingRatesSchema.safeParse(result);
		if (!parsed.success) {
			console.error(parsed.error);
			throw new Error(parsed.error.message);
		}

		return parsed.data;
	}

	async get({ orderId, locale }: { orderId: string; locale?: string }) {
		const url = this.withTenantQuery(`/order/${orderId}`, {
			...(locale ? { locale } : {}),
		});
		const result = await this.unauthenticatedRequest(url, {
			method: "GET",
		}).then((r) => r.json());

		if (result.error) {
			throw new Error(result.error);
		}
		const parsed = getOrderSchema.safeParse(result);
		if (!parsed.success) {
			console.error(parsed.error);
			throw new Error(parsed.error.message);
		}

		return parsed.data;
	}

	async adminGet({ orderId, locale }: { orderId: string; locale?: string }) {
		const url = this.withTenantQuery(`/admin/order/${orderId}`, {
			...(locale ? { locale } : {}),
		});
		const result = await this.request(url, {
			method: "GET",
		}).then((r) => r.json());

		if (result.error) {
			throw new Error(result.error);
		}
		const parsed = getOrderSchema.safeParse(result);
		if (!parsed.success) {
			console.error(parsed.error);
			throw new Error(parsed.error.message);
		}

		return parsed.data;
	}

	async create({ body }: { body: z.infer<typeof createOrderSchema> }) {
		const validatedBody = createOrderSchema.parse(body);
		const result = await this.request("/order", {
			method: "POST",
			body: validatedBody,
		}).then((r) => r.json());

		return orderSchema.parse(result);
	}

	async createGuest({
		body,
		turnstileToken,
	}: {
		body: z.infer<typeof createOrderGuestSchema>;
		turnstileToken?: string;
	}) {
		const validatedBody = createOrderGuestSchema.parse(body);
		const headers: Record<string, string> = {};
		if (turnstileToken) {
			headers["x-turnstile-token"] = turnstileToken;
		}
		const response = await this.unauthenticatedRequest("/public/order", {
			method: "POST",
			body: validatedBody,
			headers,
		});
		
		const result = await response.json();

		const parsed = createOrderGuestResponseSchema.safeParse(result);
		if (!parsed.success) {
			console.error("Response parsing failed:", parsed.error);
			console.error("Raw response:", result);
			throw new Error(parsed.error.message);
		}

		return parsed.data;
	}

	async update({
		orderId,
		body,
	}: {
		orderId: string;
		body: z.infer<typeof updateOrderSchema>;
	}) {
		const validatedBody = updateOrderSchema.parse(body);
		const url = `/order/${orderId}`;
		const result = await this.request(url, {
			method: "PUT",
			body: validatedBody,
		}).then((r) => r.json());

		return orderSchema.parse(result);
	}

	async query({
		query,
	}: {
		query: OrderListQuery;
	}) {
		const paymentStatus = query.payment_status ?? query.status;
		const queryParams: Record<string, string> = {
			page: (query.page || 1).toString(),
			size: (query.size || 10).toString(),
			include_products: "true",
			sort_by: query.sort_by ?? "created_at",
			order_by: query.order_by ?? "desc",
		};

		if (query.locale) {
			queryParams.locale = query.locale;
		}

		if (paymentStatus !== undefined) {
			queryParams.status = paymentStatus.toString();
			queryParams.payment_status = paymentStatus.toString();
		}

		const url = this.withTenantQuery("/order", queryParams);
		const result = await this.request(url, {
			method: "GET",
		}).then((r) => r.json());

		const parsed = orderListSchema.safeParse(result);
		if (!parsed.success) {
			console.error(parsed.error);
			throw new Error(parsed.error.message);
		}

		return parsed.data;
	}

	async delete({ orderId }: { orderId: string }) {
		const url = `/order/${orderId}`;
		await this.request(url, {
			method: "DELETE",
		}).then((r) => r.json());

		return;
	}

	async adminQuery({
		query,
	}: {
		query: AdminOrderQuery;
	}) {
		const paymentStatus = query.payment_status ?? query.status;
		const currentStepKind = query.current_step_kind ?? query.kind;
		const url = this.withTenantQuery("/admin/order", {
			page: query.page ?? 1,
			size: query.size ?? 10,
			sort_by: query.sort_by ?? "created_at",
			order_by: query.order_by ?? "desc",
			...(paymentStatus !== undefined
				? { status: paymentStatus, payment_status: paymentStatus }
				: {}),
			...(query.number ? { number: query.number } : {}),
			...(query.customer_id ? { customer_id: query.customer_id } : {}),
			...(query.address_id ? { address_id: query.address_id } : {}),
			...(query.total_price !== undefined ? { total_price: query.total_price } : {}),
			...(query.created_at ? { created_at: query.created_at } : {}),
			...(query.start ? { start: query.start } : {}),
			...(query.end ? { end: query.end } : {}),
			...(query.shipment_status ? { shipment_status: query.shipment_status } : {}),
			...(query.payment_id ? { payment_id: query.payment_id } : {}),
			...(query.payment_provider ? { payment_provider: query.payment_provider } : {}),
			...(query.payment_created_at ? { payment_created_at: query.payment_created_at } : {}),
			...(query.canceled !== undefined ? { canceled: query.canceled } : {}),
			...(currentStepKind
				? { current_step_kind: currentStepKind, kind: currentStepKind }
				: {}),
		});
		const result = await this.request(url, {
			method: "GET",
		}).then((r) => r.json());

		const parsed = adminOrderListSchema.safeParse(result);
		if (!parsed.success) {
			console.error(parsed.error);
			throw new Error(parsed.error.message);
		}
		return parsed.data;
	}

	async adminUpdate({
		orderId,
		body,
	}: {
		orderId: string;
		body: z.infer<typeof adminUpdateOrderSchema>;
	}) {
		const validatedBody = adminUpdateOrderSchema.parse(body);
		const url = `/admin/order/${orderId}`;
		const result = await this.request(url, {
			method: "PUT",
			body: validatedBody,
		}).then((r) => r.json());
		return result;
	}

	async cancel({ orderId }: { orderId: string }) {
		const url = `/order/${orderId}/cancel`;
		const result = await this.request(url, {
			method: "POST",
		}).then((r) => r.json());
		return result;
	}

	async updateItem({
		orderId,
		itemId,
		body,
	}: {
		orderId: string;
		itemId: string;
		body: z.infer<typeof orderItemUpdateSchema>;
	}) {
		const validatedBody = orderItemUpdateSchema.parse(body);
		const url = `/order/${orderId}/item/${itemId}`;
		const result = await this.request(url, {
			method: "PUT",
			body: validatedBody,
		}).then((r) => r.json());
		return result;
	}

	async deleteItem({
		orderId,
		itemId,
	}: {
		orderId: string;
		itemId: string;
	}) {
		const url = `/order/${orderId}/item/${itemId}`;
		await this.request(url, {
			method: "DELETE",
		}).then((r) => r.json());
		return;
	}

	async getSubmittedMetrics({
		query,
	}: {
		query: {
			granularity?: string;
			start?: string;
			end?: string;
			timezone?: string;
		};
	}) {
		const url = "/order/metrics/submitted/series?" + objectToURLSearchParams(query);
		const result = await this.request(url, {
			method: "GET",
		}).then((r) => r.json());
		const parsed = orderMetricsSchema.safeParse(result);
		if (!parsed.success) {
			console.error(parsed.error);
			return { series: [] };
		}
		return parsed.data;
	}

	async getStatistics({
		query,
	}: {
		query: {
			start?: string;
			end?: string;
		};
	}) {
		const url = "/order/statistics?" + objectToURLSearchParams(query);
		const result = await this.request(url, {
			method: "GET",
		}).then((r) => r.json());
		const parsed = orderStatisticsSchema.safeParse(result);
		if (!parsed.success) {
			console.error(parsed.error);
			return result;
		}
		return parsed.data;
	}

	async notifyShipment({ orderId }: { orderId: string }) {
		const url = `/admin/order/${orderId}/notify-shipment`;
		const result = await this.request(url, {
			method: "POST",
		}).then((r) => r.json());
		return result;
	}
}

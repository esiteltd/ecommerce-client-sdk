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

export class Order extends BaseClient {
	async getShippingRates({
		body,
	}: {
		body: {
			postal_code: string;
			country_code: string;
		};
	}) {
		const url = "/shipping/canada-post/rs/ship/price";
		// Use unauthenticated request since this is called during guest checkout
		const result = await this.unauthenticatedRequest(url, {
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

	async get({ orderId }: { orderId: string }) {
		const url = `/order/${orderId}`;
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

	async adminGet({ orderId }: { orderId: string }) {
		const url = `/admin/order/${orderId}`;
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
		query: {
			status?: number;
			page?: number;
			size?: number;
			locale: string;
		};
	}) {
		const queryParams: Record<string, string> = {
			page: (query.page || 1).toString(),
			size: (query.size || 10).toString(),
			include_products: "true",
			locale: query.locale,
		};

		if (query.status !== undefined) {
			queryParams.status = query.status.toString();
		}

		const url = "/order?" + new URLSearchParams(queryParams);
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
		query: {
			status?: number;
			page?: number;
			size?: number;
			customer_id?: string;
			start?: string;
			end?: string;
			sort_by?: string;
			order_by?: 'asc' | 'desc';
		};
	}) {
		const url = "/admin/order?" + objectToURLSearchParams({
			page: query.page ?? 1,
			size: query.size ?? 10,
			...(query.status !== undefined ? { status: query.status } : {}),
			...(query.customer_id ? { customer_id: query.customer_id } : {}),
			...(query.start ? { start: query.start } : {}),
			...(query.end ? { end: query.end } : {}),
			...(query.sort_by ? { sort_by: query.sort_by } : {}),
			...(query.order_by ? { order_by: query.order_by } : {}),
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

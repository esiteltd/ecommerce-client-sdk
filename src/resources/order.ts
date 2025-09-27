import { z } from "zod";
import {
	createOrderGuestResponseSchema,
	createOrderGuestSchema,
	createOrderSchema,
	getOrderSchema,
	orderListSchema,
	orderSchema,
	shippingRatesSchema,
	updateOrderSchema,
} from "../schema";
import { BaseClient } from "../client/base-client";

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
		const result = await this.request(url, {
			method: "POST",
			body: JSON.stringify({
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
			}),
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
			body: JSON.stringify(validatedBody),
		}).then((r) => r.json());

		return orderSchema.parse(result);
	}

	async createGuest({
		body,
		turnstileToken,
	}: {
		body: z.infer<typeof createOrderGuestSchema>;
		turnstileToken: string;
	}) {
		const validatedBody = createOrderGuestSchema.parse(body);
		const result = await this.unauthenticatedRequest("/public/order", {
			method: "POST",
			body: validatedBody,
			headers: { "x-turnstile-token": turnstileToken },
		}).then((r) => r.json());

		const parsed = createOrderGuestResponseSchema.safeParse(result);
		if (!parsed.success) {
			console.error(parsed.error);
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
			body: JSON.stringify(validatedBody),
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
}

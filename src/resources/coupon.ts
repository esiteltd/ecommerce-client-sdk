import { z } from "zod";
import { BaseClient } from "../client/base-client";
import {
	couponItemSchema,
	couponListSchema,
	createCouponSchema,
	updateCouponSchema,
} from "../schema";
import { objectToURLSearchParams } from "../utils";

export class Coupon extends BaseClient {
	async query({
		page = 1,
		size = 10,
		sort_by = "asc",
		order_by = "created_at",
	}: {
		page?: number;
		size?: number;
		sort_by?: string;
		order_by?: string;
	} = {}) {
		const result = await this.unauthenticatedRequest(
			`/public/coupons?${objectToURLSearchParams({ page, size, sort_by, order_by })}`,
			{ method: "GET" },
		).then((r) => r.json());
		return couponListSchema.parse(result);
	}

	async getById({ id, lang }: { id: string; lang?: string }) {
		const params = lang ? `?${objectToURLSearchParams({ lang })}` : "";
		const result = await this.unauthenticatedRequest(
			`/public/coupons/${id}${params}`,
			{ method: "GET" },
		).then((r) => r.json());
		return couponItemSchema.parse(result);
	}

	async create({ body }: { body: z.infer<typeof createCouponSchema> }) {
		const validatedBody = createCouponSchema.parse(body);
		const result = await this.request("/coupons", {
			method: "POST",
			body: validatedBody,
		}).then((r) => r.json());
		return result;
	}

	async update({
		id,
		body,
	}: {
		id: string;
		body: z.infer<typeof updateCouponSchema>;
	}) {
		const validatedBody = updateCouponSchema.parse(body);
		const result = await this.request(`/coupons/${id}`, {
			method: "PUT",
			body: validatedBody,
		}).then((r) => r.json());
		return result;
	}

	async delete({ id }: { id: string }) {
		await this.request(`/coupons/${id}`, {
			method: "DELETE",
		}).then((r) => r.json());
		return;
	}
}

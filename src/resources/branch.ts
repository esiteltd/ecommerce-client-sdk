import { z } from "zod";
import { BaseClient } from "../client/base-client";
import {
	branchItemSchema,
	branchListSchema,
	branchOrderListSchema,
	createBranchSchema,
	updateBranchSchema,
} from "../schema";
import { objectToURLSearchParams } from "../utils";

export class Branch extends BaseClient {
	async get({ page, size }: { page: number; size: number }) {
		const result = await this.unauthenticatedRequest(
			`/public/branch?${objectToURLSearchParams({ page, size })}`,
			{
				method: "GET",
			},
		).then((r) => r.json());
		return branchListSchema.parse(result);
	}

	async getById({ id }: { id: string }) {
		const result = await this.unauthenticatedRequest(
			`/public/branch/${id}`,
			{ method: "GET" },
		).then((r) => r.json());
		return branchItemSchema.parse(result);
	}

	async create({ body }: { body: z.input<typeof createBranchSchema> }) {
		const validatedBody = createBranchSchema.parse(body);
		const result = await this.request("/branch", {
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
		body: z.infer<typeof updateBranchSchema>;
	}) {
		const validatedBody = updateBranchSchema.parse(body);
		const result = await this.request(`/branch/${id}`, {
			method: "PUT",
			body: validatedBody,
		}).then((r) => r.json());
		return result;
	}

	async delete({ id }: { id: string }) {
		await this.request(`/branch/${id}`, {
			method: "DELETE",
		}).then((r) => r.json());
		return;
	}

	async addProduct({
		branchId,
		productId,
	}: {
		branchId: string;
		productId: string;
	}) {
		const result = await this.request(`/branch/${branchId}/product`, {
			method: "POST",
			body: { product_id: productId },
		}).then((r) => r.json());
		return result;
	}

	async removeProduct({
		branchId,
		productId,
	}: {
		branchId: string;
		productId: string;
	}) {
		await this.request(`/branch/${branchId}/product/${productId}`, {
			method: "DELETE",
		}).then((r) => r.json());
		return;
	}

	async getOrders({
		branchId,
		query,
	}: {
		branchId: string;
		query?: {
			sort_by?: string;
			order_by?: string;
			page?: number;
			size?: number;
		};
	}) {
		const params = objectToURLSearchParams({
			page: query?.page ?? 1,
			size: query?.size ?? 10,
			...(query?.sort_by ? { sort_by: query.sort_by } : {}),
			...(query?.order_by ? { order_by: query.order_by } : {}),
		});
		const result = await this.request(
			`/branch/${branchId}/order?${params}`,
			{ method: "GET" },
		).then((r) => r.json());
		const parsed = branchOrderListSchema.safeParse(result);
		if (!parsed.success) {
			console.error(parsed.error);
			return { items: [], page: 1, size: 10, total: 0 };
		}
		return parsed.data;
	}

	async approveOrder({
		branchId,
		orderId,
		driverId,
	}: {
		branchId: string;
		orderId: string;
		driverId?: string;
	}) {
		const body: Record<string, string> = {};
		if (driverId) body.driver_id = driverId;
		const result = await this.request(
			`/branch/${branchId}/order/${orderId}/approve`,
			{
				method: "POST",
				body,
			},
		).then((r) => r.json());
		return result;
	}
}

import { z } from "zod";
import { BaseClient } from "../client/base-client";
import {
	batchDeleteMediaSchema,
	createMediaSchema,
	mediaItemSchema,
	mediaListSchema,
	updateMediaSchema,
} from "../schema";
import { objectToURLSearchParams } from "../utils";

export class Media extends BaseClient {
	async query({
		page = 1,
		size = 10,
		sort_by = "asc",
		order_by = "created_at",
		alt,
	}: {
		page?: number;
		size?: number;
		sort_by?: string;
		order_by?: string;
		alt?: string;
	} = {}) {
		const params: Record<string, string | number> = { page, size, sort_by, order_by };
		if (alt) params.alt = alt;
		const result = await this.unauthenticatedRequest(
			`/public/media?${objectToURLSearchParams(params)}`,
			{ method: "GET" },
		).then((r) => r.json());
		return mediaListSchema.parse(result);
	}

	async getById({ id }: { id: string }) {
		const result = await this.unauthenticatedRequest(`/public/media/${id}`, {
			method: "GET",
		}).then((r) => r.json());
		return mediaItemSchema.parse(result);
	}

	async create({ body }: { body: z.infer<typeof createMediaSchema> }) {
		const validatedBody = createMediaSchema.parse(body);
		const result = await this.request("/media", {
			method: "POST",
			body: validatedBody,
		}).then((r) => r.json());
		return mediaItemSchema.parse(result);
	}

	async update({
		id,
		body,
	}: {
		id: string;
		body: z.infer<typeof updateMediaSchema>;
	}) {
		const validatedBody = updateMediaSchema.parse(body);
		const result = await this.request(`/media/${id}`, {
			method: "PUT",
			body: validatedBody,
		}).then((r) => r.json());
		return result;
	}

	async delete({ id }: { id: string }) {
		await this.request(`/media/${id}`, {
			method: "DELETE",
		}).then((r) => r.json());
		return;
	}

	async batchDelete({ body }: { body: z.infer<typeof batchDeleteMediaSchema> }) {
		const validatedBody = batchDeleteMediaSchema.parse(body);
		await this.request("/media", {
			method: "DELETE",
			body: validatedBody,
		}).then((r) => r.json());
		return;
	}
}

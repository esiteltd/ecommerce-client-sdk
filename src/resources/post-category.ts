import { z } from "zod";
import { BaseClient } from "../client/base-client";
import {
	createPostCategorySchema,
	postCategoryItemSchema,
	postCategoryListSchema,
	updatePostCategorySchema,
} from "../schema";
import { objectToURLSearchParams } from "../utils";

export class PostCategory extends BaseClient {
	async get({
		id,
		lang = "en",
	}: {
		id: string;
		lang?: string;
	}) {
		const result = await this.unauthenticatedRequest(
			`/public/post-categories/${id}?${objectToURLSearchParams({ lang })}`,
			{
				method: "GET",
			},
		).then((r) => r.json());
		return postCategoryItemSchema.parse(result);
	}

	async query({
		page = 1,
		size = 10,
		lang = "en",
		sort_by = "desc",
		order_by = "created_at",
	}: {
		page?: number;
		size?: number;
		lang?: string;
		sort_by?: "asc" | "desc";
		order_by?: string;
	} = {}) {
		const result = await this.unauthenticatedRequest(
			`/public/post-categories?${objectToURLSearchParams({
				page,
				size,
				lang,
				sort_by,
				order_by,
			})}`,
			{
				method: "GET",
			},
		).then((r) => r.json());
		return postCategoryListSchema.parse(result);
	}

	async create({ body }: { body: z.infer<typeof createPostCategorySchema> }) {
		const validatedBody = createPostCategorySchema.parse(body);
		const result = await this.request("/post-categories", {
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
		body: z.infer<typeof updatePostCategorySchema>;
	}) {
		const validatedBody = updatePostCategorySchema.parse(body);
		const result = await this.request(`/post-categories/${id}`, {
			method: "PUT",
			body: validatedBody,
		}).then((r) => r.json());
		return result;
	}

	async delete({ id }: { id: string }) {
		await this.request(`/post-categories/${id}`, {
			method: "DELETE",
		}).then((r) => r.json());
		return;
	}
}

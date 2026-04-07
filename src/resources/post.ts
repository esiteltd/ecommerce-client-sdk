import { z } from "zod";
import { BaseClient } from "../client/base-client";
import { createPostSchema, postItemSchema, postListSchema, updatePostSchema } from "../schema";
import { objectToURLSearchParams } from "../utils";

const PUBLIC_POST_QUERY_TIMEOUT_MS = 30000;

export class Post extends BaseClient {
	async get({
		id,
		lang = "en",
	}: {
		id: string;
		lang?: string;
	}) {
		const result = await this.unauthenticatedRequest(
			`/public/posts/${id}?${objectToURLSearchParams({ lang })}`,
			{
				method: "GET",
			},
		).then((r) => r.json());
		return postItemSchema.parse(result);
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
			`/public/posts?${objectToURLSearchParams({
				page,
				size,
				lang,
				sort_by,
				order_by,
			})}`,
			{
				method: "GET",
				timeout: PUBLIC_POST_QUERY_TIMEOUT_MS,
			},
		).then((r) => this.parseJsonResponse(r));

		if (result == null) {
			return {
				items: [],
				page,
				size,
				total: 0,
			};
		}

		return postListSchema.parse(result);
	}

	async create({ body }: { body: z.infer<typeof createPostSchema> }) {
		const validatedBody = createPostSchema.parse(body);
		const result = await this.request("/posts", {
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
		body: z.infer<typeof updatePostSchema>;
	}) {
		const validatedBody = updatePostSchema.parse(body);
		const result = await this.request(`/posts/${id}`, {
			method: "PUT",
			body: validatedBody,
		}).then((r) => r.json());
		return result;
	}

	async delete({ id }: { id: string }) {
		await this.request(`/posts/${id}`, {
			method: "DELETE",
		}).then((r) => r.json());
		return;
	}
}

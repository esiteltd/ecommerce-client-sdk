import { z } from "zod";
import { BaseClient } from "../client/base-client";
import {
	createPostTagSchema,
	postTagItemSchema,
	postTagListSchema,
	updatePostTagSchema,
} from "../schema";
import { objectToURLSearchParams } from "../utils";

export class PostTag extends BaseClient {
	async get({
		id,
		lang = "en",
	}: {
		id: string;
		lang?: string;
	}) {
		const result = await this.unauthenticatedRequest(
			`/public/tags/${id}?${objectToURLSearchParams({ lang })}`,
			{
				method: "GET",
			},
		).then((r) => r.json());
		return postTagItemSchema.parse(result);
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
			`/public/tags?${objectToURLSearchParams({
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
		return postTagListSchema.parse(result);
	}

	async create({ body }: { body: z.infer<typeof createPostTagSchema> }) {
		const validatedBody = createPostTagSchema.parse(body);
		const result = await this.request("/tags", {
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
		body: z.infer<typeof updatePostTagSchema>;
	}) {
		const validatedBody = updatePostTagSchema.parse(body);
		const result = await this.request(`/tags/${id}`, {
			method: "PUT",
			body: validatedBody,
		}).then((r) => r.json());
		return result;
	}

	async delete({ id }: { id: string }) {
		await this.request(`/tags/${id}`, {
			method: "DELETE",
		}).then((r) => r.json());
		return;
	}
}

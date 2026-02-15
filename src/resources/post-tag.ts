import { BaseClient } from "../client/base-client";
import { postTagItemSchema, postTagListSchema } from "../schema";
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
}

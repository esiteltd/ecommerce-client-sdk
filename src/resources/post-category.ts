import { BaseClient } from "../client/base-client";
import { postCategoryItemSchema, postCategoryListSchema } from "../schema";
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
}

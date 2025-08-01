import { objectToURLSearchParams } from "../utils";
import { categoryListSchema } from "../schema";
import { BaseClient } from "../client/base-client";

export class Category extends BaseClient {
	async query({
		query,
	}: {
		query: { lang: string; page: number; size: number };
	}) {
		const url = `/public/category?` + objectToURLSearchParams(query);

		const result = await this.request(url, {
			method: "GET",
		}).then((r) => r.json());

		try {
			return categoryListSchema.parse(result);
		} catch (error) {
			console.error("Failed to parse category response:", error);
			throw error;
		}
	}
}

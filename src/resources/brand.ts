import { BaseClient } from "../client/base-client";
import { brandListSchema } from "../schema";
import { objectToURLSearchParams } from "../utils";

export class Brand extends BaseClient {
	async query({
		query,
	}: {
		query: { locale: string; page: number; size: number };
	}) {
		const result = await this.unauthenticatedRequest(
			`/public/brand?${objectToURLSearchParams({
				page: query.page,
				size: query.size,
				lang: query.locale,
			})}`,
			{
				method: "GET",
			},
		).then((r) => r.json());
		return brandListSchema.parse(result);
	}

	async get({ page, size, lang }: { page: number; size: number; lang?: string }) {
		const result = await this.unauthenticatedRequest(
			`/public/brand?${objectToURLSearchParams({ page, size, lang: lang || "en" })}`,
			{
				method: "GET",
			},
		).then((r) => r.json());
		return brandListSchema.parse(result);
	}
}

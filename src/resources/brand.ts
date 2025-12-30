import { BaseClient } from "../client/base-client";
import { brandListSchema } from "../schema";
import { objectToURLSearchParams } from "../utils";

export class Brand extends BaseClient {
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

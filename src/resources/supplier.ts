import { BaseClient } from "../client/base-client";
import { supplierListSchema } from "../schema";
import { objectToURLSearchParams } from "../utils";

export class Supplier extends BaseClient {
	async get({
		page,
		size,
		lang = "en",
		sort_by = "asc",
		order_by = "created_at",
	}: {
		page: number;
		size: number;
		lang?: string;
		sort_by?: "asc" | "desc";
		order_by?: "created_at" | "updated_at";
	}) {
		const result = await this.unauthenticatedRequest(
			`/public/suppliers?${objectToURLSearchParams({
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
		return supplierListSchema.parse(result);
	}
}

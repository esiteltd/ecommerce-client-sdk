import { menuListSchema } from "../schema";
import { BaseClient } from "../client/base-client";
import { objectToURLSearchParams } from "../utils";

export class Menu extends BaseClient {
	async query({
		query,
	}: {
		query: { lang: string; page: number; size: number };
	}) {
		const url = `/public/menu?` + objectToURLSearchParams(query);
		const result = await this.unauthenticatedRequest(url).then((r) => r.json());
		return menuListSchema.parse(result);
	}
}

import { BaseClient } from "../client/base-client";
import { branchListSchema } from "../schema";
import { objectToURLSearchParams } from "../utils";

export class Branch extends BaseClient {
	async get({ page, size }: { page: number; size: number }) {
		const result = await this.unauthenticatedRequest(
			`/public/branch?${objectToURLSearchParams({ page, size })}`,
			{
				method: "GET",
			},
		).then((r) => r.json());
		return branchListSchema.parse(result);
	}
}

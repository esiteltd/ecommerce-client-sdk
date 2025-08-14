import { BaseClient } from "../client/base-client";
import { tenantSchema } from "../schema";

export class Tenant extends BaseClient {
	async get() {
		const result = await this.unauthenticatedRequest("/public/tenant", {
			method: "GET",
		}).then((r) => r.json());
		return tenantSchema.parse(result);
	}
}

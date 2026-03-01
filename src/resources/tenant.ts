import { z } from "zod";
import { BaseClient } from "../client/base-client";
import { tenantSchema, updateFrontendMetadataSchema } from "../schema";

export class Tenant extends BaseClient {
	async get() {
		const result = await this.unauthenticatedRequest("/public/tenant", {
			method: "GET",
		}).then((r) => r.json());
		return tenantSchema.parse(result);
	}

	async updateFrontendMetadata({
		body,
	}: {
		body: z.infer<typeof updateFrontendMetadataSchema>;
	}) {
		const validatedBody = updateFrontendMetadataSchema.parse(body);
		const result = await this.request("/tenant/frontend-metadata-template", {
			method: "PUT",
			body: validatedBody,
		}).then((r) => r.json());
		return result;
	}
}

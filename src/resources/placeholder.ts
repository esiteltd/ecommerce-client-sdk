import { z } from "zod";
import { BaseClient } from "../client/base-client";
import {
	createPlaceholderSchema,
	placeholderItemSchema,
	placeholderListSchema,
	updatePlaceholderSchema,
} from "../schema";
import { objectToURLSearchParams } from "../utils";

export class Placeholder extends BaseClient {
	async query({
		page = 1,
		size = 10,
		lang = "en",
	}: {
		page?: number;
		size?: number;
		lang?: string;
	} = {}) {
		const result = await this.unauthenticatedRequest(
			`/public/placeholder?${objectToURLSearchParams({ page, size, lang })}`,
			{ method: "GET" },
		).then((r) => r.json());
		return placeholderListSchema.parse(result);
	}

	async getById({ id, lang }: { id: string; lang?: string }) {
		const params = lang ? `?${objectToURLSearchParams({ lang })}` : "";
		const result = await this.unauthenticatedRequest(
			`/public/placeholder/${id}${params}`,
			{ method: "GET" },
		).then((r) => r.json());
		return placeholderItemSchema.parse(result);
	}

	async create({ body }: { body: z.infer<typeof createPlaceholderSchema> }) {
		const validatedBody = createPlaceholderSchema.parse(body);
		const result = await this.request("/placeholder", {
			method: "POST",
			body: validatedBody,
		}).then((r) => r.json());
		return result;
	}

	async update({
		id,
		body,
	}: {
		id: string;
		body: z.infer<typeof updatePlaceholderSchema>;
	}) {
		const validatedBody = updatePlaceholderSchema.parse(body);
		const result = await this.request(`/placeholder/${id}`, {
			method: "PUT",
			body: validatedBody,
		}).then((r) => r.json());
		return result;
	}

	async delete({ id }: { id: string }) {
		await this.request(`/placeholder/${id}`, {
			method: "DELETE",
		}).then((r) => r.json());
		return;
	}
}

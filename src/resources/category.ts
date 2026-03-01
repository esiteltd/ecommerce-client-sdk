import { z } from "zod";
import { objectToURLSearchParams } from "../utils";
import {
	adminCategoryItemSchema,
	categoryListItemSchema,
	categoryListSchema,
	createCategorySchema,
	updateCategorySchema,
} from "../schema";
import { BaseClient } from "../client/base-client";

export class Category extends BaseClient {
	async query({
		query,
	}: {
		query: { lang: string; page: number; size: number };
	}) {
		const url = `/public/category?` + objectToURLSearchParams(query);

		const result = await this.unauthenticatedRequest(url, {
			method: "GET",
		}).then((r) => r.json());

		try {
			return categoryListSchema.parse(result);
		} catch (error) {
			console.error("Failed to parse category response:", error);
			throw error;
		}
	}

	async getById({ id, lang }: { id: string; lang?: string }) {
		const params = lang ? `?${objectToURLSearchParams({ lang })}` : "";
		const result = await this.unauthenticatedRequest(
			`/public/category/${id}${params}`,
			{ method: "GET" },
		).then((r) => r.json());
		return categoryListItemSchema.parse(result);
	}

	async adminGetById({ id }: { id: string }) {
		const result = await this.request(
			`/category/${id}`,
			{ method: "GET" },
		).then((r) => r.json());
		return adminCategoryItemSchema.parse(result);
	}

	async create({ body }: { body: z.infer<typeof createCategorySchema> }) {
		const validatedBody = createCategorySchema.parse(body);
		const result = await this.request("/category", {
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
		body: z.infer<typeof updateCategorySchema>;
	}) {
		const validatedBody = updateCategorySchema.parse(body);
		const result = await this.request(`/category/${id}`, {
			method: "PUT",
			body: validatedBody,
		}).then((r) => r.json());
		return result;
	}

	async delete({ id }: { id: string }) {
		await this.request(`/category/${id}`, {
			method: "DELETE",
		}).then((r) => r.json());
		return;
	}
}

import { z } from "zod";
import { BaseClient } from "../client/base-client";
import { brandListItemSchema, brandListSchema, createBrandSchema, updateBrandSchema } from "../schema";
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

	async getById({ id, lang }: { id: string; lang?: string }) {
		const params = lang ? `?${objectToURLSearchParams({ lang })}` : "";
		const result = await this.unauthenticatedRequest(
			`/public/brand/${id}${params}`,
			{ method: "GET" },
		).then((r) => r.json());
		return brandListItemSchema.parse(result);
	}

	async create({ body }: { body: z.infer<typeof createBrandSchema> }) {
		const validatedBody = createBrandSchema.parse(body);
		const result = await this.request("/brand", {
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
		body: z.infer<typeof updateBrandSchema>;
	}) {
		const validatedBody = updateBrandSchema.parse(body);
		const result = await this.request(`/brand/${id}`, {
			method: "PUT",
			body: validatedBody,
		}).then((r) => r.json());
		return result;
	}

	async delete({ id }: { id: string }) {
		await this.request(`/brand/${id}`, {
			method: "DELETE",
		}).then((r) => r.json());
		return;
	}

	async deleteLocale({ id, locale }: { id: string; locale: string }) {
		await this.request(`/brand/${id}/locale/${locale}`, {
			method: "DELETE",
		}).then((r) => r.json());
		return;
	}
}

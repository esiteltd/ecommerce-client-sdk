import { z } from "zod";
import { BaseClient } from "../client/base-client";
import { brandListItemSchema, brandListSchema, createBrandSchema, updateBrandSchema } from "../schema";
import { objectToURLSearchParams } from "../utils";

export class Brand extends BaseClient {
	private buildPublicBrandQuery(params: {
		lang: string;
		page: number;
		size: number;
		title?: string;
		description?: string;
		sort_by?: string;
		order_by?: string;
	}) {
		return objectToURLSearchParams({
			title: params.title,
			description: params.description,
			lang: params.lang,
			sort_by: params.sort_by,
			order_by: params.order_by,
			page: params.page,
			size: params.size,
		});
	}

	async query({
		query,
	}: {
		query: {
			locale: string;
			page: number;
			size: number;
			title?: string;
			description?: string;
			sort_by?: string;
			order_by?: string;
		};
	}) {
		const result = await this.unauthenticatedRequest(
			`/public/brand?${this.buildPublicBrandQuery({
				title: query.title,
				description: query.description,
				lang: query.locale,
				sort_by: query.sort_by,
				order_by: query.order_by,
				page: query.page,
				size: query.size,
			})}`,
			{
				method: "GET",
			},
		).then((r) => r.json());
		return brandListSchema.parse(result);
	}

	async get({
		page,
		size,
		lang,
		title,
		description,
		sort_by,
		order_by,
	}: {
		page: number;
		size: number;
		lang?: string;
		title?: string;
		description?: string;
		sort_by?: string;
		order_by?: string;
	}) {
		const result = await this.unauthenticatedRequest(
			`/public/brand?${this.buildPublicBrandQuery({
				title,
				description,
				lang: lang || "en",
				sort_by,
				order_by,
				page,
				size,
			})}`,
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
		}).then((r) => this.parseJsonResponse(r));
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
		}).then((r) => this.parseJsonResponse(r));
		return result;
	}

	async delete({ id }: { id: string }) {
		await this.request(`/brand/${id}`, {
			method: "DELETE",
		}).then((r) => this.parseJsonResponse(r));
		return;
	}

	async deleteLocale({ id, locale }: { id: string; locale: string }) {
		await this.request(`/brand/${id}/locale/${locale}`, {
			method: "DELETE",
		}).then((r) => this.parseJsonResponse(r));
		return;
	}
}

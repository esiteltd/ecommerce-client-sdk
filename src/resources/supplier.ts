import { z } from "zod";
import { BaseClient } from "../client/base-client";
import {
	createSupplierLocaleSchema,
	createSupplierSchema,
	supplierItemSchema,
	supplierListSchema,
	supplierLocaleItemSchema,
	supplierLocaleListSchema,
	updateSupplierLocaleSchema,
	updateSupplierSchema,
} from "../schema";
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
		).then((r) => this.parseJsonResponse(r));

		if (result == null) {
			return supplierListSchema.parse({
				items: [],
				page,
				size,
				total: 0,
			});
		}

		return supplierListSchema.parse(result);
	}

	async getById({ id, lang }: { id: string; lang?: string }) {
		const params = lang ? `?${objectToURLSearchParams({ lang })}` : "";
		const result = await this.unauthenticatedRequest(
			`/public/suppliers/${id}${params}`,
			{ method: "GET" },
		).then((r) => r.json());
		return supplierItemSchema.parse(result);
	}

	async create({ body }: { body: z.infer<typeof createSupplierSchema> }) {
		const validatedBody = createSupplierSchema.parse(body);
		const result = await this.request("/suppliers", {
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
		body: z.infer<typeof updateSupplierSchema>;
	}) {
		const validatedBody = updateSupplierSchema.parse(body);
		const result = await this.request(`/suppliers/${id}`, {
			method: "PUT",
			body: validatedBody,
		}).then((r) => r.json());
		return result;
	}

	async delete({ id }: { id: string }) {
		await this.request(`/suppliers/${id}`, {
			method: "DELETE",
		}).then((r) => r.json());
		return;
	}

	async createLocale({
		body,
	}: {
		body: z.infer<typeof createSupplierLocaleSchema>;
	}) {
		const validatedBody = createSupplierLocaleSchema.parse(body);
		const result = await this.request("/supplier-locales", {
			method: "POST",
			body: validatedBody,
		}).then((r) => r.json());
		return supplierLocaleItemSchema.parse(result);
	}

	async updateLocale({
		id,
		body,
	}: {
		id: string;
		body: z.infer<typeof updateSupplierLocaleSchema>;
	}) {
		const validatedBody = updateSupplierLocaleSchema.parse(body);
		const result = await this.request(`/supplier-locales/${id}`, {
			method: "PUT",
			body: validatedBody,
		}).then((r) => r.json());
		return result;
	}

	async deleteLocale({ id }: { id: string }) {
		await this.request(`/supplier-locales/${id}`, {
			method: "DELETE",
		}).then((r) => r.json());
		return;
	}

	async getLocale({ id, lang }: { id: string; lang?: string }) {
		const params = lang ? `?${objectToURLSearchParams({ lang })}` : "";
		const result = await this.unauthenticatedRequest(
			`/public/supplier-locales/${id}${params}`,
			{ method: "GET" },
		).then((r) => r.json());
		return supplierLocaleItemSchema.parse(result);
	}

	async queryLocales({
		page = 1,
		size = 10,
		lang = "en",
		sort_by = "asc",
		order_by = "created_at",
	}: {
		page?: number;
		size?: number;
		lang?: string;
		sort_by?: string;
		order_by?: string;
	} = {}) {
		const result = await this.unauthenticatedRequest(
			`/public/supplier-locales?${objectToURLSearchParams({
				page,
				size,
				lang,
				sort_by,
				order_by,
			})}`,
			{ method: "GET" },
		).then((r) => this.parseJsonResponse(r));

		if (result == null) {
			return supplierLocaleListSchema.parse({
				items: [],
				page,
				size,
				total: 0,
			});
		}

		return supplierLocaleListSchema.parse(result);
	}
}

import { z } from "zod";
import {
	createMenuSchema,
	menuItemSchema,
	menuListSchema,
	updateMenuSchema,
} from "../schema";
import { BaseClient } from "../client/base-client";
import { objectToURLSearchParams } from "../utils";

export class Menu extends BaseClient {
	async query({
		query,
	}: {
		query: {
			lang: string;
			page: number;
			size: number;
			sort_by?: string;
			order_by?: string;
		};
	}) {
		const url = `/public/menu?` + objectToURLSearchParams(query);
		const result = await this.unauthenticatedRequest(url).then((r) => r.json());
		return menuListSchema.parse(result);
	}

	async getById({ id, lang }: { id: string; lang?: string }) {
		const params = lang ? `?${objectToURLSearchParams({ lang })}` : "";
		const result = await this.unauthenticatedRequest(
			`/public/menu/${id}${params}`,
			{ method: "GET" },
		).then((r) => r.json());
		return menuItemSchema.parse(result);
	}

	async adminGet({ id }: { id: string }) {
		const result = await this.request(`/menu/${id}`, {
			method: "GET",
		}).then((r) => r.json());
		return result;
	}

	async create({ body }: { body: z.infer<typeof createMenuSchema> }) {
		const validatedBody = createMenuSchema.parse(body);
		const result = await this.request("/menu", {
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
		body: z.infer<typeof updateMenuSchema>;
	}) {
		const validatedBody = updateMenuSchema.parse(body);
		const result = await this.request(`/menu/${id}`, {
			method: "PUT",
			body: validatedBody,
		}).then((r) => r.json());
		return result;
	}

	async delete({ id }: { id: string }) {
		await this.request(`/menu/${id}`, {
			method: "DELETE",
		}).then((r) => r.json());
		return;
	}
}

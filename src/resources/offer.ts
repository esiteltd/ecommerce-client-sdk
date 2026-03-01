import { z } from "zod";
import { BaseClient } from "../client/base-client";
import {
	createOfferSchema,
	offerItemSchema,
	offerListSchema,
	offerActionsSchema,
	offerConditionsSchema,
	updateOfferSchema,
} from "../schema";
import { objectToURLSearchParams } from "../utils";

/**
 * Safely parse JSON from a Response, returning a fallback if the body is empty.
 * Some endpoints return 200 with an empty body instead of a proper JSON response.
 */
async function safeJson<T>(response: Response, fallback: T): Promise<T> {
	const text = await response.text();
	if (!text || !text.trim()) return fallback;
	return JSON.parse(text);
}

export class Offer extends BaseClient {
	async get({
		id,
		lang = "en",
	}: {
		id: string;
		lang?: string;
	}) {
		const response = await this.unauthenticatedRequest(
			`/public/offers/${id}?${objectToURLSearchParams({ lang })}`,
			{
				method: "GET",
			},
		);
		const result = await safeJson(response, null);
		return offerItemSchema.parse(result);
	}

	async query({
		page = 1,
		size = 10,
		lang = "en",
		sort_by = "asc",
		order_by = "created_at",
	}: {
		page?: number;
		size?: number;
		lang?: string;
		sort_by?: "asc" | "desc";
		order_by?: string;
	} = {}) {
		const response = await this.unauthenticatedRequest(
			`/public/offers?${objectToURLSearchParams({
				page,
				size,
				lang,
				sort_by,
				order_by,
			})}`,
			{
				method: "GET",
			},
		);
		const result = await safeJson(response, { items: [], total: 0, page, size });
		return offerListSchema.parse(result);
	}

	async getActions() {
		const response = await this.unauthenticatedRequest(
			"/public/offers/actions",
			{
				method: "GET",
			},
		);
		const result = await safeJson(response, []);
		return offerActionsSchema.parse(result);
	}

	async getConditions() {
		const response = await this.unauthenticatedRequest(
			"/public/offers/conditions",
			{
				method: "GET",
			},
		);
		const result = await safeJson(response, []);
		return offerConditionsSchema.parse(result);
	}

	async create({ body }: { body: z.infer<typeof createOfferSchema> }) {
		const validatedBody = createOfferSchema.parse(body);
		const result = await this.request("/offers", {
			method: "POST",
			body: validatedBody,
		}).then((r) => r.json());
		return offerItemSchema.parse(result);
	}

	async update({
		id,
		body,
	}: {
		id: string;
		body: z.infer<typeof updateOfferSchema>;
	}) {
		const validatedBody = updateOfferSchema.parse(body);
		const result = await this.request(`/offers/${id}`, {
			method: "PUT",
			body: validatedBody,
		}).then((r) => r.json());
		return result;
	}

	async delete({ id }: { id: string }) {
		await this.request(`/offers/${id}`, {
			method: "DELETE",
		}).then((r) => r.json());
		return;
	}
}

import { BaseClient } from "../client/base-client";
import {
	offerItemSchema,
	offerListSchema,
	offerActionsSchema,
	offerConditionsSchema,
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
}

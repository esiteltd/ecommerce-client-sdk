import { z } from "zod";
import { BaseClient } from "../client/base-client";
import {
	createTestimonialSchema,
	testimonialItemSchema,
	testimonialListSchema,
	updateTestimonialSchema,
} from "../schema";
import { objectToURLSearchParams } from "../utils";

export class Testimonial extends BaseClient {
	async get({
		id,
		lang = "en",
	}: {
		id: string;
		lang?: string;
	}) {
		const result = await this.unauthenticatedRequest(
			`/public/testimonials/${id}?${objectToURLSearchParams({ lang })}`,
			{
				method: "GET",
			},
		).then((r) => r.json());
		return testimonialItemSchema.parse(result);
	}

	async query({
		page = 1,
		size = 10,
		lang = "en",
		sort_by = "desc",
		order_by = "created_at",
		enabled,
	}: {
		page?: number;
		size?: number;
		lang?: string;
		sort_by?: "asc" | "desc";
		order_by?: string;
		enabled?: boolean;
	} = {}) {
		const response = await this.unauthenticatedRequest(
			`/public/testimonials?${objectToURLSearchParams({
				page,
				size,
				lang,
				sort_by,
				order_by,
				enabled,
			})}`,
			{
				method: "GET",
			},
		);

		if (response.status === 204) {
			return testimonialListSchema.parse({
				items: [],
				page,
				size,
				total: 0,
			});
		}

		const result = await response.json();
		return testimonialListSchema.parse(result);
	}

	async create({ body }: { body: z.infer<typeof createTestimonialSchema> }) {
		const validatedBody = createTestimonialSchema.parse(body);
		const result = await this.request("/testimonials", {
			method: "POST",
			body: validatedBody,
		}).then((r) => r.json());
		return testimonialItemSchema.parse(result);
	}

	async update({
		id,
		body,
	}: {
		id: string;
		body: z.infer<typeof updateTestimonialSchema>;
	}) {
		const validatedBody = updateTestimonialSchema.parse(body);
		const result = await this.request(`/testimonials/${id}`, {
			method: "PUT",
			body: validatedBody,
		}).then((r) => r.json());
		return testimonialItemSchema.parse(result);
	}

	async delete({ id }: { id: string }) {
		const result = await this.request(`/testimonials/${id}`, {
			method: "DELETE",
		}).then((r) => r.json());
		return testimonialItemSchema.parse(result);
	}
}

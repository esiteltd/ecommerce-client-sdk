import { z } from "zod";
import { BaseClient } from "../client/base-client";
import {
	contactUsItemSchema,
	contactUsListSchema,
	createContactUsSchema,
} from "../schema";
import { objectToURLSearchParams } from "../utils";

export class ContactUs extends BaseClient {
	async get({
		id,
		lang = "en",
	}: {
		id: string;
		lang?: string;
	}) {
		const result = await this.unauthenticatedRequest(
			`/public/contactus/${id}?${objectToURLSearchParams({ lang })}`,
			{
				method: "GET",
			},
		).then((r) => r.json());
		return contactUsItemSchema.parse(result);
	}

	async query({
		page = 1,
		size = 10,
		lang = "en",
		sort_by = "desc",
		order_by = "created_at",
	}: {
		page?: number;
		size?: number;
		lang?: string;
		sort_by?: "asc" | "desc";
		order_by?: string;
	} = {}) {
		const result = await this.unauthenticatedRequest(
			`/public/contactus?${objectToURLSearchParams({
				page,
				size,
				lang,
				sort_by,
				order_by,
			})}`,
			{
				method: "GET",
			},
		).then((r) => r.json());
		return contactUsListSchema.parse(result);
	}

	async create({
		body,
	}: {
		body: z.infer<typeof createContactUsSchema>;
	}) {
		const validatedBody = createContactUsSchema.parse(body);
		const result = await this.request("/contactus", {
			method: "POST",
			body: validatedBody,
		}).then((r) => r.json());
		return contactUsItemSchema.parse(result);
	}
}

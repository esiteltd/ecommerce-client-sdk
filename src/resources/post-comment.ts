import { z } from "zod";
import { BaseClient } from "../client/base-client";
import {
	postCommentItemSchema,
	postCommentListSchema,
	createPostCommentSchema,
} from "../schema";
import { objectToURLSearchParams } from "../utils";

export class PostComment extends BaseClient {
	async get({
		id,
		lang = "en",
	}: {
		id: string;
		lang?: string;
	}) {
		const result = await this.unauthenticatedRequest(
			`/public/post-comments/${id}?${objectToURLSearchParams({ lang })}`,
			{
				method: "GET",
			},
		).then((r) => r.json());
		return postCommentItemSchema.parse(result);
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
			`/public/post-comments?${objectToURLSearchParams({
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
		return postCommentListSchema.parse(result);
	}

	async create({
		body,
	}: {
		body: z.infer<typeof createPostCommentSchema>;
	}) {
		const validatedBody = createPostCommentSchema.parse(body);
		const result = await this.request("/post-comments", {
			method: "POST",
			body: validatedBody,
		}).then((r) => r.json());
		return postCommentItemSchema.parse(result);
	}
}

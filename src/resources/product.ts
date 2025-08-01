import { z } from "zod";
import {
	addToFavoritesSchema,
	productListSchema,
	productSchema,
	queryFavoritesSchema,
	queryReviewSchema,
	reviewSchema,
} from "../schema";
import { BaseClient } from "../client/base-client";

export class Product extends BaseClient {
	async get({
		query,
		productId,
	}: {
		query: { lang: string };
		productId: string;
	}) {
		const url = `/product/${productId}?` + new URLSearchParams(query);
		const result = await this.request(url, {
			method: "GET",
		}).then((r) => r.json());

		return productSchema.parse(result);
	}

	async query({
		query,
	}: {
		query: {
			locale: string;
			page: number;
			size: number;
			categoryId?: string;
			title?: string;
		};
	}) {
		const url =
			"/public/product?" +
			new URLSearchParams({
				...query,
				page: query.page.toString(),
				size: query.size.toString(),
				...(query.categoryId ? { category_id: query.categoryId } : {}),
				...(query.title ? { title: query.title } : {}),
			});

		const result = await this.request(url, {
			method: "GET",
		}).then((r) => r.json());

		const data = productListSchema.safeParse(result);

		if (!data.success) {
			console.error("Error parsing product list item", data.error);
			throw new Error("Error parsing product list item");
		}

		return data.data;
	}

	async review({
		body,
		params,
	}: {
		body: z.infer<typeof reviewSchema>;
		params: { id: string };
	}) {
		const url = `/product/${params.id}/rating`;
		const result = await this.request(url, {
			method: "POST",
			body: JSON.stringify(body),
		}).then((r) => r.json());

		return result;
	}

	async queryReviews({
		params,
		query,
	}: {
		params: { id: string };
		query: { page: number; size: number };
	}) {
		const url =
			`/product/${params.id}/rating?` +
			new URLSearchParams({
				page: query.page.toString(),
				size: query.size.toString(),
			});
		const result = await this.request(url, {
			method: "GET",
		}).then((r) => r.json());

		const data = queryReviewSchema.safeParse(result);
		if (!data.success) {
			console.error("Error parsing query review", data.error);
			throw new Error("Error parsing query review");
		}

		return data.data;
	}

	favorites = {
		query: async ({
			query,
		}: {
			query: { page: number; size: number; locale: string };
		}) => {
			const url =
				"/product/favorite?" +
				new URLSearchParams({
					page: query.page.toString(),
					size: query.size.toString(),
					locale: query.locale,
					sort_by: "created_at",
				});
			const result = await this.request(url, {
				method: "GET",
			}).then((r) => r.json());

			const data = queryFavoritesSchema.safeParse(result);
			if (!data.success) {
				console.error("Error parsing query favorite", data.error);
				throw new Error("Error parsing query favorite");
			}

			return data.data;
		},

		delete: async ({
			body,
			productId,
			faveId,
		}: {
			body: z.infer<typeof addToFavoritesSchema>;
			productId: string;
			faveId: string;
		}) => {
			const validatedBody = addToFavoritesSchema.parse(body);
			const url = `/product/${productId}/favorite/${faveId}`;
			await this.request(url, {
				method: "DELETE",
				body: JSON.stringify(validatedBody),
			}).then((r) => r.json());

			return;
		},

		add: async ({
			body,
			productId,
		}: {
			body: z.infer<typeof addToFavoritesSchema>;
			productId: string;
		}) => {
			const validatedBody = addToFavoritesSchema.parse(body);
			const url = `/product/${productId}/favorite`;
			await this.request(url, {
				method: "POST",
				body: JSON.stringify(validatedBody),
			}).then((r) => r.json());

			return;
		},

		get: async ({
			productId,
			locale,
		}: {
			productId: string;
			locale: string;
		}) => {
			const url = `/product/${productId}/favorite?locale=${locale}`;
			const result = await this.request(url, {
				method: "GET",
			})
				.then((r) => r.json())
				.then((d) => d.id)
				.then((id) => (typeof id === "string" ? id : null))
				.catch(() => null);

			return result;
		},
	};
}

import { z } from "zod";
import {
	addToFavoritesSchema,
	adminProductSchema,
	createProductSchema,
	productListSchema,
	productMetricsSchema,
	productSchema,
	queryFavoritesSchema,
	queryReviewSchema,
	reviewSchema,
	updateProductSchema,
} from "../schema";
import { BaseClient } from "../client/base-client";
import { objectToURLSearchParams } from "../utils";

const PUBLIC_PRODUCT_QUERY_TIMEOUT_MS = 30000;

export class Product extends BaseClient {
	async get({
		query,
		productId,
	}: {
		query: { lang: string };
		productId: string;
	}) {
		const url =
			`/public/product/${productId}?` + new URLSearchParams(query);
		const result = await this.unauthenticatedRequest(url, {
			method: "GET",
		}).then((r) => r.json());

		return productSchema.parse(result);
	}

	async getBySlug({
		query,
		slug,
	}: {
		query: { lang: string };
		slug: string;
	}) {
		const url =
			`/public/product/slug/${slug}?` + new URLSearchParams(query);
		const result = await this.unauthenticatedRequest(url, {
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
			category_id?: string;
			title?: string;
			brand_id?: string;
			price_start?: number;
			price_end?: number;
			supplier_id?: string;
			sort_by?: string;
			order_by?: "asc" | "desc";
		};
	}) {
		const url = "/public/product?" + objectToURLSearchParams(query);

		const result = await this.unauthenticatedRequest(url, {
			method: "GET",
			timeout: PUBLIC_PRODUCT_QUERY_TIMEOUT_MS,
		}).then((r) => this.parseJsonResponse(r));

		if (result == null) {
			return {
				items: [],
				page: query.page,
				size: query.size,
				total: 0,
			};
		}

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
			body: body,
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
			`/public/product/${params.id}/rating?` +
			new URLSearchParams({
				page: query.page.toString(),
				size: query.size.toString(),
			});
		const result = await this.unauthenticatedRequest(url, {
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
				body: validatedBody,
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
				body: validatedBody,
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
			try {
				const result = await this.request(url, {
					method: "GET",
				})
					.then((r) => r.json())
					.then((d) => d.id)
					.then((id) => (typeof id === "string" ? id : null))
					.catch(() => null);

				return result;
			} catch {
				return null;
			}
		},
	};

	async adminGet({ productId }: { productId: string }) {
		const url = `/product/${productId}`;
		const result = await this.request(url, {
			method: "GET",
		}).then((r) => r.json());
		const parsed = adminProductSchema.safeParse(result);
		if (!parsed.success) {
			console.error("Error parsing admin product", parsed.error);
			throw new Error("Error parsing admin product");
		}
		return parsed.data;
	}

	async create({ body }: { body: z.infer<typeof createProductSchema> }) {
		const validatedBody = createProductSchema.parse(body);
		const result = await this.request("/product", {
			method: "POST",
			body: validatedBody,
		}).then((r) => r.json());
		return productSchema.parse(result);
	}

	async update({
		productId,
		body,
	}: {
		productId: string;
		body: z.infer<typeof updateProductSchema>;
	}) {
		const validatedBody = updateProductSchema.parse(body);
		const url = `/product/${productId}`;
		const result = await this.request(url, {
			method: "PUT",
			body: validatedBody,
		}).then((r) => r.json());
		return result;
	}

	async delete({ productId }: { productId: string }) {
		const url = `/product/${productId}`;
		await this.request(url, {
			method: "DELETE",
		}).then((r) => r.json());
		return;
	}

	async importExcel({ file }: { file: File }) {
		const formData = new FormData();
		formData.append("file", file);
		const url = "/product/import/excel";
		const result = await this.request(url, {
			method: "POST",
			body: formData,
		}).then((r) => r.json());
		return result;
	}

	async getSellMetrics({
		query,
	}: {
		query: {
			granularity?: string;
			start?: string;
			end?: string;
			timezone?: string;
		};
	}) {
		const url = "/product/metrics/sell/series?" + objectToURLSearchParams(query);
		const result = await this.request(url, {
			method: "GET",
		}).then((r) => r.json());
		const parsed = productMetricsSchema.safeParse(result);
		if (!parsed.success) {
			console.error(parsed.error);
			return { series: [] };
		}
		return parsed.data;
	}

	async updateReview({
		productId,
		reviewId,
		body,
	}: {
		productId: string;
		reviewId: string;
		body: {
			product_attribute_id?: string | null;
			customer_id?: string;
			rating?: number;
			comment?: string;
		};
	}) {
		const url = `/product/${productId}/rating/${reviewId}`;
		const result = await this.request(url, {
			method: "PUT",
			body,
		}).then((r) => r.json());
		return result;
	}

	async deleteReview({
		productId,
		reviewId,
	}: {
		productId: string;
		reviewId: string;
	}) {
		const url = `/product/${productId}/rating/${reviewId}`;
		await this.request(url, {
			method: "DELETE",
		}).then((r) => r.json());
		return;
	}
}

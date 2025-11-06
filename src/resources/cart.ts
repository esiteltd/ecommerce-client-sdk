import { z } from "zod";
import { QueryCart, queryCartSchema, upsertCartSchema } from "../schema";
import { BaseClient } from "../client/base-client";
import { objectToURLSearchParams } from "../utils";

export class Cart extends BaseClient {
	async get({
		cartId,
		params,
	}: {
		cartId: string;
		params: {
			locale: string;
		};
	}) {
		const url = `/cart/${cartId}?locale=${params.locale}`;
		const result = await this.request(url, {
			method: "GET",
		}).then((r) => r.json());
		return queryCartSchema.parse(result);
	}

	async upsert({ body }: { body: z.infer<typeof upsertCartSchema> }) {
		if (typeof window === "undefined") return;

		const validatedBody = upsertCartSchema.parse(body);
		const url = "/public/cart";
		await this.unauthenticatedRequest(url, {
			method: "POST",
			body: {
				...validatedBody,
				device_token: this.deviceToken,
			},
		});
		return;
	}

	async add({ body }: { body: z.infer<typeof upsertCartSchema> }) {
		if (typeof window === "undefined") return;

		const validatedBody = upsertCartSchema.parse(body);
		const url = "/public/cart/add";
		await this.unauthenticatedRequest(url, {
			method: "POST",
			body: {
				...validatedBody,
				device_token: this.deviceToken,
			},
		});
		return;
	}

	async query({ locale }: { locale: string }): Promise<QueryCart> {
		if (typeof window === "undefined") return { items: [], total_price: 0 };

		const url =
			"/public/cart?" +
			objectToURLSearchParams({ device_token: this.deviceToken, locale });
		const result = await this.unauthenticatedRequest(url, {
			method: "GET",
		}).then((r) => r.json());

		const cleanResult = {
			...result,
			items: result.items?.filter(
				(v: any) =>
					v.product.id !== "00000000-0000-0000-0000-000000000000",
			),
		};
		const parsedResult = queryCartSchema.safeParse(cleanResult);
		if (!parsedResult.success) {
			console.error(parsedResult.error);
			throw parsedResult.error;
		}
		return parsedResult.data;
	}

	async removeItem({ cartItemId }: { cartItemId: string }) {
		const url = `/public/cart/${cartItemId}`;
		await this.unauthenticatedRequest(url, {
			method: "DELETE",
			body: {
				device_token: this.deviceToken,
			},
		}).then((r) => r.json());
		return;
	}
}

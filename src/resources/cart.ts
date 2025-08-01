import { z } from "zod";
import { cartListSchema, upsertCartSchema } from "../schema";
import { BaseClient } from "../client/base-client";
import { getDeviceToken } from "../providers/AuthStoreProvider";
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
		return cartListSchema.parse(result);
	}

	async upsert({ body }: { body: z.infer<typeof upsertCartSchema> }) {
		const validatedBody = upsertCartSchema.parse(body);
		const url = "/cart";
		await this.request(url, {
			method: "POST",
			body: JSON.stringify({
				...validatedBody,
				quantity: Math.min(validatedBody.quantity, 10),
				device_token: getDeviceToken(),
			}),
		});
		return;
	}

	async add({ body }: { body: z.infer<typeof upsertCartSchema> }) {
		const validatedBody = upsertCartSchema.parse(body);
		const url = "/cart/add";
		await this.request(url, {
			method: "POST",
			body: JSON.stringify({
				...validatedBody,
				device_token: getDeviceToken(),
			}),
		});
		return;
	}

	async query({
		query,
	}: {
		query: {
			device_token: string;
			quantity?: number;
			customer_id?: string;
			locale: string;
		};
	}) {
		const url = "/cart?" + objectToURLSearchParams(query);
		const result = await this.request(url, {
			method: "GET",
		}).then((r) => r.json());

		const cleanResult = {
			...result,
			items: result.items?.filter(
				(v: any) =>
					v.product.id !== "00000000-0000-0000-0000-000000000000",
			),
		};
		const parsedResult = cartListSchema.safeParse(cleanResult);
		if (!parsedResult.success) {
			console.error(parsedResult.error);
		}
		return parsedResult.data;
	}

	async removeItem({ cartItemId }: { cartItemId: string }) {
		const url = `/cart/${cartItemId}`;
		await this.request(url, {
			method: "DELETE",
		}).then((r) => r.json());
		return;
	}
}

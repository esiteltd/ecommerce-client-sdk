import { z } from "zod";
import {
	AuthHeaders,
	customerSchema,
	customerListSchema,
	createCustomerSchema,
	updateCustomerSchema,
	createAddressSchema,
	updateAddressSchema,
	addressSchema,
} from "../schema";
import { BaseClient } from "../client/base-client";

export class Customer extends BaseClient {
	async get() {
		const url = "/customer/info";
		const result = await this.request(url, {
			method: "GET",
		});

		if (result.status === 200) {
			return customerSchema.parse(await result.json());
		}

		return null;
	}

	async getByUserId({
		headers,
		userId,
	}: {
		headers: AuthHeaders;
		userId: string;
	}) {
		const url = `/customer/userid/${userId}`;
		const result = await this.request(url, {
			method: "GET",
			headers: {
				Authorization: "Bearer " + headers.authorization,
			},
		});

		if (result.status === 200) {
			return customerSchema.parse(await result.json());
		}

		return null;
	}

	async create({
		headers,
		body,
	}: {
		headers: AuthHeaders;
		body: z.infer<typeof createCustomerSchema>;
	}) {
		const validatedBody = createCustomerSchema.parse(body);
		const url = "/customer";
		const result = await this.request(url, {
			method: "POST",
			headers: {
				Authorization: "Bearer " + headers.authorization,
			},
			body: {
				...validatedBody,
				// TODO: Replace this with the actual value
				tenant_id: null,
			},
		}).then((r) => r.json());

		return customerSchema.parse(result);
	}

	async update({
		customerId,
		body,
	}: {
		customerId: string;
		body: z.infer<typeof updateCustomerSchema>;
	}) {
		const validatedBody = updateCustomerSchema.parse(body);
		const url = `/customer/${customerId}`;
		const result = await this.request(url, {
			method: "PUT",
			body: validatedBody,
		}).then((r) => r.json());

		return customerSchema.parse(result);
	}

	async query({
		query,
	}: {
		query: {
			page?: number;
			size?: number;
			firstname?: string;
			lastname?: string;
			language?: string;
		};
	}) {
		const queryParams = new URLSearchParams({
			...query,
			page: (query.page || 1).toString(),
			size: (query.size || 10).toString(),
		});
		const url = `/customer?${queryParams}`;
		const result = await this.request(url, {
			method: "GET",
		}).then((r) => r.json());

		return customerListSchema.parse(result);
	}

	async createAddress({
		body,
	}: {
		body: z.infer<typeof createAddressSchema>;
	}) {
		const validatedBody = createAddressSchema.parse(body);
		const url = `/customer/${this.customerId}/address`;
		const result = await this.request(url, {
			method: "POST",
			body: validatedBody,
		}).then((r) => r.json());

		return addressSchema.parse(result);
	}

	async updateAddress({
		customerId,
		addressId,
		body,
	}: {
		customerId: string;
		addressId: string;
		body: z.infer<typeof updateAddressSchema>;
	}) {
		const validatedBody = updateAddressSchema.parse(body);
		const url = `/customer/${customerId}/address/${addressId}`;
		const result = await this.request(url, {
			method: "PUT",
			body: validatedBody,
		}).then((r) => r.json());

		return addressSchema.parse(result);
	}

	async deleteAddress({
		customerId,
		addressId,
	}: {
		customerId: string;
		addressId: string;
	}) {
		const url = `/customer/${customerId}/address/${addressId}`;
		await this.request(url, {
			method: "DELETE",
		}).then((r) => r.json());

		return;
	}
}

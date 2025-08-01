import { z } from "zod";
import { createAddressSchema, loginResponseSchema } from "../schema";
import { BaseClient } from "../client/base-client";

export class Auth extends BaseClient {
	async login({
		username,
		password,
		turnstileToken,
	}: {
		username: string;
		password: string;
		turnstileToken: string;
	}) {
		const result = await this.unauthenticatedRequest("/auth/login", {
			method: "POST",
			headers: {
				"x-turnstile-token": turnstileToken,
			},
			body: JSON.stringify({
				username,
				password,
				tenant: this.tenant,
			}),
		}).then((v) => v.json());

		return loginResponseSchema.parse(result);
	}

	async logout() {
		await this.request("/logout", {
			method: "POST",
		});
	}
	async register({
		firstName,
		lastName,
		email,
		password,
		turnstileToken,
		address,
		languages,
		locale,
		permissionId,
		jobTitle,
	}: {
		firstName: string;
		lastName: string;
		email: string;
		password: string;
		turnstileToken: string;
		address?: z.infer<typeof createAddressSchema>;
		languages: string;
		locale: string;
		permissionId: string;
		jobTitle: string;
	}) {
		const url =
			`/auth/register?` +
			new URLSearchParams({
				tenant: this.tenant,
			});
		const response = await this.unauthenticatedRequest(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"x-turnstile-token": turnstileToken,
				"x-api-tenant": this.tenant,
			},
			body: JSON.stringify({
				firstName: firstName,
				lastName: lastName,
				email,
				password,
				username: email,
				languages,
				address,
				attributes: {
					permissionId,
					jobTitle,
					profilePic: [""],
					locale,
				},
			}),
		});

		if (response.status === 200) {
			return loginResponseSchema.parse(await response.json());
		}

		throw response;
	}
}

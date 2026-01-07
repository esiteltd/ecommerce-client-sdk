import { z } from "zod";
import { createAddressSchema, loginResponseSchema } from "../schema";
import { BaseClient } from "../client/base-client";

export class Auth extends BaseClient {
	async refreshToken({ refreshToken }: { refreshToken: string }) {
		const response = await this.unauthenticatedRequest(
			`${this.authUrl}/refresh`,
			{ method: "POST", body: { refresh: refreshToken } },
		);

		const { access_token, refresh_token: newRefreshToken } =
			await response.json();

		return { access_token, newRefreshToken };
	}
	async login({
		username,
		password,
		turnstileToken,
	}: {
		username: string;
		password: string;
		turnstileToken: string;
	}) {
		const result = await this.unauthenticatedRequest("/public/auth/login", {
			method: "POST",
			headers: {
				"x-turnstile-token": turnstileToken,
			},
			body: {
				username,
				password,
				tenant: this.tenant,
			},
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
		username,
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
		username: string;
		turnstileToken: string;
		address?: z.infer<typeof createAddressSchema>;
		languages: string[];
		locale: string[];
		permissionId: string[];
		jobTitle: string[];
	}) {
		const url =
			"/public/auth/register?" +
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
			body: {
				firstName: firstName,
				lastName: lastName,
				email,
				password,
				username: username,
				languages,
				address,
				attributes: {
					permissionId,
					jobTitle,
					profilePic: [""],
					locale,
				},
			},
		});

		if (response.status === 200) {
			return loginResponseSchema.parse(await response.json());
		}

		throw response;
	}
}

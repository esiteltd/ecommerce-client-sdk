import { z } from "zod";
import { createAddressSchema, loginResponseSchema, registerResponseSchema } from "../schema";
import { BaseClient, SDKError } from "../client/base-client";

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
		turnstileToken?: string;
	}) {
		const headers: Record<string, string> = {};
		const queryParams = new URLSearchParams();

		if (turnstileToken) {
			headers["x-turnstile-token"] = turnstileToken;
		} else {
			queryParams.set("no-challenge", "true");
		}

		const url = `/public/auth/login${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;

		const response = await this.unauthenticatedRequest(url, {
			method: "POST",
			headers,
			body: {
				username,
				password,
				tenant: this.tenant,
			},
		});

		// Check if response is OK before parsing
		if (!response.ok) {
			const responseText = await response.text();
			throw new SDKError(
				`HTTP ${response.status}: ${response.statusText}`,
				response.status,
				responseText,
			);
		}

		const result = await response.json();
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
		gender,
		date_of_birth,
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
		username?: string; // Optional - will use email if not provided
		turnstileToken?: string;
		gender?: number;
		date_of_birth?: string;
		address?: z.infer<typeof createAddressSchema>;
		languages: string[];
		locale: string[];
		permissionId: string[];
		jobTitle: string[];
	}) {
		const queryParams = new URLSearchParams({
			tenant: this.tenant,
		});
		if (!turnstileToken) {
			queryParams.set("no-challenge", "true");
		}

		const url = `/public/auth/register?${queryParams.toString()}`;

		const headers: Record<string, string> = {
			"Content-Type": "application/json",
			"x-api-tenant": this.tenant,
		};
		if (turnstileToken) {
			headers["x-turnstile-token"] = turnstileToken;
		}

		const response = await this.unauthenticatedRequest(url, {
			method: "POST",
			headers,
			body: {
				firstName: firstName,
				lastName: lastName,
				email,
				password,
				// Use email as username if not provided (backend expects email format)
				username: username || email,
				gender,
				date_of_birth,
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
			return registerResponseSchema.parse(await response.json());
		}

		// Throw SDKError with response details for proper error handling
		const responseText = await response.text();
		throw new SDKError(
			`HTTP ${response.status}: ${response.statusText}`,
			response.status,
			responseText,
		);
	}
}

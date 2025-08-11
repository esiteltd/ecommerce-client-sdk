export interface SDKConfig {
	baseUrl: string;
	tenant: string;
	timeout?: number;
	retries?: number;
	auth?: {
		getAccessToken: () => string | undefined;
		getCustomerId: () => string | undefined;
		getDeviceToken: () => string | undefined;
	};
}

export interface RequestOptions {
	method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
	headers?: Record<string, string>;
	body?: any;
	timeout?: number;
}

export class BaseClient {
	private config: SDKConfig;

	get tenant(): string {
		return this.config.tenant;
	}

	get customerId(): string {
		return this.config.auth?.getCustomerId() ?? "Not provided";
	}
	get deviceToken(): string {
		return this.config.auth?.getDeviceToken() ?? "Not provided";
	}

	constructor(config: SDKConfig) {
		this.config = {
			timeout: 10000,
			retries: 3,
			...config,
		};
	}

	protected async unauthenticatedRequest(
		endpoint: string,
		options: RequestOptions = {},
	): Promise<Response> {
		return this.request(endpoint, { ...options, authentication: false });
	}

	protected async request(
		endpoint: string,
		options: RequestOptions & { authentication?: boolean } = {
			authentication: true,
		},
	): Promise<Response> {
		const url = `${this.config.baseUrl}${endpoint}`;

		const headers: Record<string, string> = {
			"Content-Type": "application/json",
			"x-api-tenant": this.config.tenant,
			...options.headers,
		};

		if (this.config.auth) {
			const deviceToken = this.config.auth.getDeviceToken();
			if (deviceToken != null) {
				headers["x-device-id"] = deviceToken;
			}

			if (options.authentication) {
				headers["Authorization"] =
					`Bearer ${this.config.auth.getAccessToken()}`;
			}
		}

		const requestInit: RequestInit = {
			method: options.method || "GET",
			headers,
			signal: AbortSignal.timeout(
				options.timeout || this.config.timeout!,
			),
		};

		if (options.body && options.method !== "GET") {
			requestInit.body = JSON.stringify(options.body);
		}

		try {
			console.log("➡️", url);
			const response = await this.fetchWithRetry(url, requestInit);

			if (!response.ok) {
				throw new SDKError(
					`HTTP ${response.status}: ${response.statusText}`,
					response.status,
					await response.text(),
				);
			}

			return response;
		} catch (error) {
			if (error instanceof SDKError) {
				throw error;
			}
			throw new SDKError(
				`Request failed: ${error instanceof Error ? error.message : "Unknown error"}`,
			);
		}
	}

	private async fetchWithRetry(
		url: string,
		init: RequestInit,
		retries: number = this.config.retries!,
	): Promise<Response> {
		try {
			return await fetch(url, init);
		} catch (error) {
			if (retries > 0 && this.isRetryableError(error)) {
				await this.delay(1000 * (this.config.retries! - retries + 1));
				return this.fetchWithRetry(url, init, retries - 1);
			}
			throw error;
		}
	}

	private isRetryableError(error: any): boolean {
		return (
			error.name === "AbortError" ||
			error.code === "ECONNRESET" ||
			error.code === "ETIMEDOUT"
		);
	}

	private delay(ms: number): Promise<void> {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}
}

export class SDKError extends Error {
	constructor(
		message: string,
		public statusCode?: number,
		public response?: string,
	) {
		super(message);
		this.name = "SDKError";
	}
}

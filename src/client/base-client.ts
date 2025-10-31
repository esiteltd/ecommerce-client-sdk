import { Auth } from "../resources/auth";

export interface SDKConfig {
	baseUrl: string;
	tenant: string;
	timeout?: number;
	retries?: number;
	auth?: {
		authUrl?: string | null;
		getAccessToken: () => string | null;
		getRefreshToken: () => string | null;
		getCustomerId: () => string | null;
		getDeviceToken: () => string | null;
		setTokens?: (accessToken: string, refreshToken: string) => void;
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
	private isRefreshing = false;
	private failedQueue: {
		resolve: (token: string) => void;
		reject: (error: any) => void;
	}[] = [];

	get tenant(): string {
		return this.config.tenant;
	}

	get customerId(): string {
		return this.config.auth?.getCustomerId() ?? "Not provided";
	}

	get deviceToken(): string {
		return this.config.auth?.getDeviceToken() ?? "Not provided";
	}

	get authUrl(): string | null {
		return this.config.auth?.authUrl ?? null;
	}

	constructor(config: SDKConfig) {
		this.config = {
			timeout: 10000,
			retries: 3,
			...config,
		};
	}

	private processQueue = (error: any, token: string | null = null) => {
		this.failedQueue.forEach((prom) => {
			if (error) {
				prom.reject(error);
			} else {
				prom.resolve(token!);
			}
		});
		this.failedQueue = [];
	};

	private async refreshAccessToken(): Promise<string> {
		try {
			const refreshToken = this.config.auth?.getRefreshToken?.();

			if (!refreshToken) {
				throw new SDKError("No refresh token available", 401);
			}

			// Use Auth class to refresh token
			const auth = new Auth(this.config);
			const { access_token, newRefreshToken } = await auth.refreshToken({
				refreshToken,
			});

			// Update tokens in config
			this.config.auth?.setTokens?.(access_token, newRefreshToken);

			return access_token;
		} catch (error) {
			throw error;
		}
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
		if (options?.authentication == null) {
			options.authentication = true;
		}

		const url = endpoint.startsWith("https")
			? endpoint
			: `${this.config.baseUrl}${endpoint}`;
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
			let response = await this.fetchWithRetry(url, requestInit);

			// Handle 401 Unauthorized - attempt token refresh
			if (response.status === 401 && options.authentication) {
				// Prevent infinite loops - don't refresh if already refreshing the token
				if (endpoint.includes("/refresh")) {
					throw new SDKError("Token refresh failed", 401);
				}

				// If already refreshing, queue the request
				if (this.isRefreshing) {
					return new Promise((resolve, reject) => {
						this.failedQueue.push({
							resolve: (token: string) => {
								requestInit.headers = {
									...requestInit.headers,
									Authorization: `Bearer ${token}`,
								};
								this.fetchWithRetry(url, requestInit)
									.then(resolve)
									.catch(reject);
							},
							reject: (err: any) => {
								reject(err);
							},
						});
					});
				}

				this.isRefreshing = true;

				try {
					const newAccessToken = await this.refreshAccessToken();
					this.processQueue(null, newAccessToken);
					requestInit.headers = {
						...requestInit.headers,
						Authorization: `Bearer ${newAccessToken}`,
					};
					response = await this.fetchWithRetry(url, requestInit);
				} catch (refreshError) {
					this.processQueue(refreshError, null);
					throw refreshError;
				} finally {
					this.isRefreshing = false;
				}
			}

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

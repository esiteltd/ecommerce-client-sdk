import { beforeEach, describe, expect, it, vi } from "vitest";
import { EcommerceSDK } from "../src";

global.fetch = vi.fn();

describe("Supplier Resource", () => {
	let sdk: EcommerceSDK;

	beforeEach(() => {
		sdk = new EcommerceSDK({
			baseUrl: "https://api.example.com",
			tenant: "test-tenant",
		});
		vi.resetAllMocks();
	});

	it("should treat an empty supplier response as an empty list", async () => {
		(fetch as any).mockResolvedValueOnce({
			ok: true,
			status: 200,
			text: () => Promise.resolve(""),
			headers: {
				get: () => "application/json",
			},
		});

		const result = await sdk.supplier.get({ page: 1, size: 50, lang: "ar" });

		expect(result).toEqual({
			items: [],
			page: 1,
			size: 50,
			total: 0,
		});
		expect(fetch).toHaveBeenCalledWith(
			"https://api.example.com/public/suppliers?page=1&size=50&lang=ar&sort_by=asc&order_by=created_at",
			expect.objectContaining({
				method: "GET",
			}),
		);
	});
});

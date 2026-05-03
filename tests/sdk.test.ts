import { describe, it, expect, vi, beforeEach } from "vitest";
import { EcommerceSDK } from "../src/index";
import { createOrderGuestSchema, createOrderSchema } from "../src/schema";

// Mock fetch globally
global.fetch = vi.fn();

describe("EcommerceSDK", () => {
	let sdk: EcommerceSDK;

	beforeEach(() => {
		sdk = new EcommerceSDK({
			baseUrl: "https://api.example.com",
			tenant: "test-tenant",
		});
		vi.clearAllMocks();
	});

	describe("TGS Resource", () => {
		it("should generate TGS token", async () => {
			const mockResponse = {
				token: "test-token",
				expires_at: "2024-12-31T23:59:59Z",
				device_identifier: "test-device",
			};

			(fetch as any).mockResolvedValueOnce({
				ok: true,
				json: () => Promise.resolve(mockResponse),
			});

			const result = await sdk.tgs.generate({
				device_identifier: "test-device",
			});

			expect(result).toEqual({ token: "test-token" });
			expect(fetch).toHaveBeenCalledWith(
				"https://api.example.com/public/tgs",
				expect.objectContaining({
					method: "POST",
					headers: expect.objectContaining({
						"Content-Type": "application/json",
						"x-api-tenant": "test-tenant",
					}),
					body: JSON.stringify({ device_identifier: "test-device" }),
				}),
			);
		});
	});

	describe("Products Resource", () => {
		it("should list products", async () => {
			const mockResponse = {
				items: [
					{
						id: "1",
						title: "Test Product",
						price: 99.99,
						sku: "SKU-1",
						slug: "test-product",
						currency: "CAD",
						unit: "piece",
						out_of_stock: false,
						media_id: null,
						media_content_type: null,
						media_file_id: null,
						cover_media_file_id: null,
						category_id: "cat1",
						category_title: "Category",
						brand_id: null,
						brand_title: null,
					},
				],
				page: 1,
				size: 10,
				total: 1,
			};

			(fetch as any).mockResolvedValueOnce({
				ok: true,
				status: 200,
				headers: {
					get: (name: string) =>
						name.toLowerCase() === "content-type"
							? "application/json"
							: null,
				},
				text: () => Promise.resolve(JSON.stringify(mockResponse)),
			});

			const result = await sdk.product.query({
				query: { locale: "en", page: 1, size: 10 },
			});

			expect(result).toEqual({
				...mockResponse,
				items: [
					{
						...mockResponse.items[0],
						suppliers: [],
						attributes: [],
					},
				],
			});
			expect(fetch).toHaveBeenCalledWith(
				"https://api.example.com/public/product?locale=en&page=1&size=10",
				expect.objectContaining({
					method: "GET",
				}),
			);
		});
	});

	describe("Order Resource", () => {
		it("should accept qicard and custom shipment checkout payloads", () => {
			expect(() =>
				createOrderSchema.parse({
					locale: "ar",
					address_id: "address-1",
					branch: {
						id: "00000000-0000-0000-0000-000000000001",
					},
					payment: {
						provider: "qicard",
					},
					shipment: {
						provider: "custom",
					},
					items: [{ cart_id: "cart-1" }],
				}),
			).not.toThrow();

			expect(() =>
				createOrderGuestSchema.parse({
					locale: "ar",
					branch: {
						id: "00000000-0000-0000-0000-000000000001",
					},
					payment: {
						provider: "qicard",
					},
					shipment: {
						provider: "custom",
					},
					items: [
						{
							cart_id: "00000000-0000-0000-0000-000000000002",
						},
					],
					customer: {
						firstname: "Ahmed",
						language: "Arabic",
						phonenumber: "+9647712345678",
					},
					customer_address: {
						title: "Home",
						country: "IQ",
						state: "Baghdad",
						city: "Baghdad",
						address1: "Street 1",
						phonenumber: "+9647712345678",
						is_default: true,
						longitude: 44.3,
						latitude: 33.3,
					},
				}),
			).not.toThrow();
		});

		it("should request shipping rates with authorization when auth is configured", async () => {
			sdk = new EcommerceSDK({
				baseUrl: "https://api.example.com",
				tenant: "test-tenant",
				auth: {
					getAccessToken: () => "test-access-token",
					getRefreshToken: () => null,
					getCustomerId: () => "customer-1",
					getDeviceToken: () => "device-1",
				},
			});

			const mockResponse = [
				{
					code: "ship-code",
					name: "Shipping Service",
					has_free_shipping_discount: true,
					discount_amount: 10,
					delivery: {
						guaranteed_delivery: false,
						expected_transit_time: 3,
						expected_delivery_date: "2026-03-28",
					},
					pricing_details: {
						base: 10,
						taxes: {
							gst: 0,
							pst: 0,
							hst: 0,
						},
						due: 12.5,
					},
					original_pricing_details: {
						base: 20,
						taxes: {
							gst: 0,
							pst: 0,
							hst: 0,
						},
						due: 22.5,
					},
				},
			];

			(fetch as any).mockResolvedValueOnce({
				ok: true,
				status: 200,
				json: () => Promise.resolve(mockResponse),
			});

			const result = await sdk.order.getShippingRates({
				body: {
					postal_code: "H2B1A0",
					country_code: "CA",
					address_id: "address-1",
				},
			});

			expect(result).toEqual(mockResponse);
			expect(fetch).toHaveBeenCalledWith(
				"https://api.example.com/shipping/canada-post/rs/ship/price",
				expect.objectContaining({
					method: "POST",
					headers: expect.objectContaining({
						"Content-Type": "application/json",
						"x-api-tenant": "test-tenant",
						"x-device-id": "device-1",
						Authorization: "Bearer test-access-token",
					}),
					body: JSON.stringify({
						destination: {
							postal_code: "H2B1A0",
							country_code: "CA",
						},
						address_id: "address-1",
						dimensions_cm: {
							length: 1.1,
							width: 1.1,
							height: 1.1,
						},
						weight_kg: 1.1,
					}),
				}),
			);
		});
	});
});

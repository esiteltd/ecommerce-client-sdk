import { describe, it, expect, vi, beforeEach } from "vitest";
import { EcommerceSDK } from "../src/index";

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

      expect(result).toEqual(mockResponse);
      expect(fetch).toHaveBeenCalledWith(
        "https://api.example.com/tgs",
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
        data: [
          {
            id: "1",
            name: "Test Product",
            price: 99.99,
            category_id: "cat1",
            created_at: "2024-01-01T00:00:00Z",
            updated_at: "2024-01-01T00:00:00Z",
          },
        ],
        meta: {
          total: 1,
          page: 1,
          limit: 10,
        },
      };

      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await sdk.products.list({ page: 1, limit: 10 });

      expect(result).toEqual(mockResponse);
      expect(fetch).toHaveBeenCalledWith(
        "https://api.example.com/products?page=1&limit=10",
        expect.objectContaining({
          method: "GET",
        }),
      );
    });
  });
});

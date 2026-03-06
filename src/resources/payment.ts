import { orderMetricsSchema } from "../schema";
import { BaseClient } from "../client/base-client";
import { objectToURLSearchParams } from "../utils";

export class Payment extends BaseClient {
	async getRevenueMetrics({
		query,
	}: {
		query: {
			granularity?: string;
			start?: string;
			end?: string;
			timezone?: string;
		};
	}) {
		const url = "/payment/metrics/revenue/series?" + objectToURLSearchParams(query);
		const result = await this.request(url, {
			method: "GET",
		}).then((r) => r.json());
		const parsed = orderMetricsSchema.safeParse(result);
		if (!parsed.success) {
			console.error(parsed.error);
			return { series: [] };
		}
		return parsed.data;
	}

	async getSwitchPaymentCheckout({ checkoutId }: { checkoutId: string }) {
		const url = `/webhook/payment/switchpayment/checkout/${checkoutId}`;
		const result = await this.request(url, {
			method: "GET",
		}).then((r) => r.json());
		return result;
	}
}

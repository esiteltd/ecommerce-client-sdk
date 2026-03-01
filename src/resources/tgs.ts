import { tgsGenerateSchema } from "../schema";
import { BaseClient } from "../client/base-client";
import { objectToURLSearchParams } from "../utils";

export class TGS extends BaseClient {
	async generate({ device_identifier }: { device_identifier: string }) {
		const url = "/public/tgs";
		const result = await this.unauthenticatedRequest(url, {
			method: "POST",
			body: { device_identifier },
		}).then((r) => r.json());

		return tgsGenerateSchema.parse(result);
	}

	async verify({ token }: { token: string }) {
		const url = `/public/tgs?${objectToURLSearchParams({ token })}`;
		const result = await this.unauthenticatedRequest(url, {
			method: "GET",
		}).then((r) => r.json());
		return result;
	}
}

import { tgsGenerateSchema } from "../schema";
import { BaseClient } from "../client/base-client";

export class TGS extends BaseClient {
	async generate({ device_identifier }: { device_identifier: string }) {
		const url = "/tgs";
		const result = await this.request(url, {
			method: "POST",
			body: JSON.stringify({ device_identifier }),
		}).then((r) => r.json());

		return tgsGenerateSchema.parse(result);
	}
}

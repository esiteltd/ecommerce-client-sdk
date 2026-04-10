export function objectToURLSearchParams(params: Record<string, any>): string {
	const searchParams = new URLSearchParams();

	for (const key in params) {
		const value = params[key];
		if (value == null) {
			continue;
		}

		if (Array.isArray(value)) {
			for (const item of value) {
				if (item != null) {
					searchParams.append(key, String(item));
				}
			}
			continue;
		}

		searchParams.append(key, String(value));
	}

	return searchParams.toString();
}

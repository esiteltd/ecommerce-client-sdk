export function objectToURLSearchParams(params: Record<string, any>): string {
	const searchParams = new URLSearchParams();

	for (const key in params) {
		if (params.hasOwnProperty(key)) {
			const value = params[key];
			if (value !== undefined && value !== null) {
				searchParams.append(key, String(value));
			}
		}
	}

	return searchParams.toString();
}

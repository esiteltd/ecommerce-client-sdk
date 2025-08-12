export function objectToURLSearchParams(params: Record<string, any>): string {
	const searchParams = new URLSearchParams();

	for (const key in params) {
		const value = params[key];
		if (value != null) {
			searchParams.append(key, String(value));
		}
	}

	return searchParams.toString();
}

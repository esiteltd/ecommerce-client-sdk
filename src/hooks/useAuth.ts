import { useAuthStore } from "../providers/AuthStoreProvider";
import { useCallback } from "react";
import { z } from "zod";
import { loginResponseSchema } from "../schema";
import EcommerceSDK from "..";

export function useAuth(sdk: EcommerceSDK) {
	const accessToken = useAuthStore((state) => state.accessToken);
	const setAuthData = useAuthStore((state) => state.setAuthData);
	const setCustomerData = useAuthStore((state) => state.setCustomerData);
	const clearAuth = useAuthStore((state) => state.clearAuth);
	const deviceToken = useAuthStore((state) => state.deviceToken);
	const isTokenExpired = useAuthStore((state) => state.isTokenExpired);
	const user = useAuthStore((state) => state.user);
	const customer = useAuthStore((state) => state.customer);

	const refetchCustomer = useCallback(async () => {
		const newCustomer = await sdk.customer.get();

		setCustomerData(newCustomer!);
	}, [setCustomerData]);

	const login = useCallback(
		async (response: z.infer<typeof loginResponseSchema>) => {
			try {
				setAuthData({
					accessToken: response.access_token,
					refreshToken: response.refresh_token,
					accessTokenExpiration: response.access_token_expiration,
					refreshTokenExpiration: response.refresh_token_expiration,
					user: response.user,
					deviceToken,
					customer: response.customer
						? {
								...response.customer,
								addresses: [
									...(response.customer.addresses ?? []),
									...(response.address != null
										? [response.address]
										: []),
								],
							}
						: await sdk.customer.create({
								headers: {
									authorization: response.access_token,
								},
								body: {
									// TODO: Replace hardcoded values with the actual value
									external_user_id: response.user.id,
									firstname: response.user.firstName,
									lastname: response.user.lastName,
									email: response.user.email,
									language: "English",
									phonenumber: "+15555555555",
									gender: 0,
									date_of_birth: new Date().toISOString(),
								},
							}),
				});
			} catch (error) {
				console.error("Login failed:", error);
				throw error;
			}
		},
		[setAuthData, deviceToken],
	);

	const logout = useCallback(async () => {
		try {
			clearAuth();
			if (accessToken) {
				await sdk.auth.logout();
			}
		} catch (error) {
			console.error("Logout failed:", error);
			clearAuth();
		}
	}, [accessToken, clearAuth]);

	const getGuestToken = useCallback(async () => {
		if (accessToken && !isTokenExpired()) return accessToken;
		try {
			const { token } = await sdk.tgs.generate({
				device_identifier: deviceToken,
			});
			setAuthData({
				accessToken: token,
				refreshToken: null,
				accessTokenExpiration: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
				refreshTokenExpiration: null,
				user: null,
				deviceToken,
			});
			return token;
		} catch (error) {
			console.error("Failed to get guest token:", error);
			throw error;
		}
	}, [accessToken, deviceToken, setAuthData, isTokenExpired]);

	return {
		accessToken,
		user,
		customer,
		deviceToken,
		isAuthenticated: !!accessToken && !isTokenExpired() && !!user,
		login,
		logout,
		getGuestToken,
		refetchCustomer,
	};
}
